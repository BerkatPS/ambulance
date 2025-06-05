<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Traits\WithNotifications;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\DuitkuService;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ScheduledPaymentController extends Controller
{
    use WithNotifications;

    /**
     * The notification service instance.
     *
     * @var \App\Services\NotificationService
     */
    protected $notificationService;

    /**
     * The Duitku service instance.
     *
     * @var \App\Services\DuitkuService
     */
    protected $duitkuService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Services\NotificationService $notificationService
     * @param \App\Services\DuitkuService $duitkuService
     * @return void
     */
    public function __construct(NotificationService $notificationService, DuitkuService $duitkuService)
    {
        $this->notificationService = $notificationService;
        $this->duitkuService = $duitkuService;
    }

    /**
     * Show the down payment page for a scheduled booking.
     *
     * @param int $bookingId
     * @return \Inertia\Response
     */
    public function showDownpayment($bookingId)
    {
        $user = request()->user();

        // Get the booking
        $booking = Booking::where('id', $bookingId)
            ->where('user_id', $user->id)
            ->where('type', 'scheduled')
            ->firstOrFail();

        // Check if booking is still pending (not canceled or already paid)
        if ($booking->status !== 'pending') {
            return redirect()->route('user.bookings.show', $booking->id)
                ->with('error', 'This booking cannot receive a down payment at this time.');
        }

        // Check if down payment already exists
        $existingPayment = Payment::where('booking_id', $booking->id)
            ->where('payment_type', 'downpayment')
            ->first();

        // If a payment exists and is not expired, use it; otherwise create a new one
        if ($existingPayment && Carbon::parse($existingPayment->expires_at)->isFuture()) {
            $payment = $existingPayment;
        } else {
            // Create a new payment record for down payment
            $payment = $this->createDownpayment($booking);
        }

        // Prepare available payment methods
        $paymentMethods = [
            ['id' => 'VA', 'name' => 'Virtual Account', 'methods' => [
                ['code' => 'BCA', 'name' => 'BCA Virtual Account'],
                ['code' => 'MANDIRI', 'name' => 'Mandiri Virtual Account'],
                ['code' => 'BNI', 'name' => 'BNI Virtual Account'],
                ['code' => 'BRI', 'name' => 'BRI Virtual Account'],
            ]],
            ['id' => 'QRIS', 'name' => 'QRIS', 'methods' => [
                ['code' => 'QRIS', 'name' => 'QRIS (OVO, GoPay, Dana, etc)'],
            ]],
            ['id' => 'RETAIL', 'name' => 'Retail Outlet', 'methods' => [
                ['code' => 'ALFAMART', 'name' => 'Alfamart'],
                ['code' => 'INDOMARET', 'name' => 'Indomaret'],
            ]],
        ];

        return Inertia::render('User/Payments/Downpayment', [
            'booking' => $booking,
            'payment' => $payment,
            'paymentMethods' => $paymentMethods,
            'deadlines' => [
                'downpayment' => Carbon::parse($booking->dp_payment_deadline)->format('M d, Y H:i'),
                'fullPayment' => Carbon::parse($booking->final_payment_deadline)->format('M d, Y H:i')
            ]
        ]);
    }

    /**
     * Process the down payment for a scheduled booking.
     *
     * @param Request $request
     * @param int $bookingId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processDownpayment(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);

        $user = $request->user();

        // Get the booking
        $booking = Booking::where('id', $bookingId)
            ->where('user_id', $user->id)
            ->where('type', 'scheduled')
            ->firstOrFail();

        // Check if booking is still pending
        if ($booking->status !== 'pending') {
            return redirect()->route('user.bookings.show', $booking->id)
                ->with('error', 'This booking cannot receive a down payment at this time.');
        }

        // Get existing payment or create a new one
        $payment = Payment::where('booking_id', $booking->id)
            ->where('payment_type', 'downpayment')
            ->first();

        if (!$payment || Carbon::parse($payment->expires_at)->isPast()) {
            $payment = $this->createDownpayment($booking);
        }

        // Update payment method
        $methodMapping = [
            'BCA' => 'va_bca',
            'MANDIRI' => 'va_mandiri',
            'BNI' => 'va_bni',
            'BRI' => 'va_bri',
            'QRIS' => 'qris',
            'GOPAY' => 'gopay',
            'ALFAMART' => 'va_alfamart',
            'INDOMARET' => 'va_indomaret'
        ];

        $payment->method = $methodMapping[$validated['payment_method']] ?? 'va_bca';
        $payment->save();

        // Process payment with Duitku
        try {
            // Untuk pengujian sementara, kita bisa menggunakan data mock jika ada masalah dengan API Duitku
            $useMockData = true; // Set ke false di production

            if ($useMockData) {
                // Data mock untuk simulasi pembayaran
                $paymentData = [
                    'reference' => 'REF-' . Str::random(10),
                    'paymentUrl' => 'https://example.com/pay',
                    'vaNumber' => '12345678901',
                    'qrString' => 'https://example.com/qr.png',
                    'statusCode' => '00',
                    'statusMessage' => 'Success',
                ];
            } else {
                // Gunakan Duitku API sebenarnya
                $paymentData = $this->duitkuService->createPaymentRequest(
                    $payment->transaction_id,
                    $payment->amount,
                    "Uang Muka untuk Pemesanan #{$booking->booking_code}",
                    $user->email ?? 'customer@ambulance-portal.com',
                    $user->name,
                    $user->phone,
                    $validated['payment_method'],
                    route('payments.callback')
                );
            }

            // Update payment with Duitku data
            $payment->duitku_reference = $paymentData['reference'];
            $payment->payment_url = $paymentData['paymentUrl'];
            $payment->va_number = $paymentData['vaNumber'] ?? null;
            $payment->qr_code = $paymentData['qrString'] ?? null;
            $payment->duitku_data = $paymentData;
            $payment->save();

            // Return to custom payment page instead of redirecting to Duitku
            return redirect()->route('payments.instructions', $payment->id);
        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());

            // Meskipun terjadi error, tetap simpan metode pembayaran yang dipilih
            // dan arahkan ke halaman instruksi dengan pesan error
            return redirect()->route('payments.instructions', $payment->id)
                ->with('error', 'Terjadi kesalahan dalam memproses pembayaran, tetapi Anda tetap dapat melihat instruksi pembayaran.');
        }
    }

    /**
     * Show payment instructions page.
     *
     * @param int $paymentId
     * @return \Inertia\Response
     */
    public function showInstructions($paymentId)
    {
        $user = request()->user();

        $payment = Payment::where('id', $paymentId)
            ->whereHas('booking', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('booking')
            ->firstOrFail();

        // Get payment instructions based on payment method
        $instructions = $this->getPaymentInstructions($payment);

        return Inertia::render('User/Payments/Instructions', [
            'payment' => $payment,
            'booking' => $payment->booking,
            'instructions' => $instructions,
            'expiresAt' => Carbon::parse($payment->expires_at)->format('M d, Y H:i'),
        ]);
    }

    /**
     * Show the final payment page for a scheduled booking.
     *
     * @param int $bookingId
     * @return \Inertia\Response
     */
    public function showFinalPayment($bookingId)
    {
        $user = request()->user();

        // Get the booking
        $booking = Booking::where('id', $bookingId)
            ->where('user_id', $user->id)
            ->where('type', 'scheduled')
            ->firstOrFail();

        // Check if booking has down payment paid
        if (!$booking->is_downpayment_paid) {
            return redirect()->route('user.bookings.show', $booking->id)
                ->with('error', 'Down payment must be completed first.');
        }

        // Check if booking is already fully paid
        if ($booking->is_fully_paid) {
            return redirect()->route('user.bookings.show', $booking->id)
                ->with('success', 'This booking is already fully paid.');
        }

        // Check if existing final payment
        $existingPayment = Payment::where('booking_id', $booking->id)
            ->where('payment_type', 'final')
            ->first();

        // If a payment exists and is not expired, use it; otherwise create a new one
        if ($existingPayment && Carbon::parse($existingPayment->expires_at)->isFuture()) {
            $payment = $existingPayment;
        } else {
            // Create a new payment record for final payment
            $payment = $this->createFinalPayment($booking);
        }

        // Prepare available payment methods
        $paymentMethods = [
            ['id' => 'VA', 'name' => 'Virtual Account', 'methods' => [
                ['code' => 'BCA', 'name' => 'BCA Virtual Account'],
                ['code' => 'MANDIRI', 'name' => 'Mandiri Virtual Account'],
                ['code' => 'BNI', 'name' => 'BNI Virtual Account'],
                ['code' => 'BRI', 'name' => 'BRI Virtual Account'],
                ['code' => 'PERMATA', 'name' => 'Permata Virtual Account'],
            ]],
            ['id' => 'QRIS', 'name' => 'QRIS', 'methods' => [
                ['code' => 'QRIS', 'name' => 'QRIS (OVO, GoPay, Dana, etc)'],
            ]],
            ['id' => 'RETAIL', 'name' => 'Retail Outlet', 'methods' => [
                ['code' => 'ALFAMART', 'name' => 'Alfamart'],
                ['code' => 'INDOMARET', 'name' => 'Indomaret'],
            ]],
        ];

        return Inertia::render('User/Payments/FinalPayment', [
            'booking' => $booking,
            'payment' => $payment,
            'paymentMethods' => $paymentMethods,
            'deadline' => Carbon::parse($booking->final_payment_deadline)->format('M d, Y H:i')
        ]);
    }

    /**
     * Process the final payment for a scheduled booking.
     *
     * @param Request $request
     * @param int $bookingId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processFinalPayment(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);

        $user = $request->user();

        // Get the booking
        $booking = Booking::where('id', $bookingId)
            ->where('user_id', $user->id)
            ->where('type', 'scheduled')
            ->firstOrFail();

        // Check if booking has down payment paid
        if (!$booking->is_downpayment_paid) {
            return redirect()->route('user.bookings.show', $booking->id)
                ->with('error', 'Down payment must be completed first.');
        }

        // Check if booking is already fully paid
        if ($booking->is_fully_paid) {
            return redirect()->route('user.bookings.show', $booking->id)
                ->with('success', 'This booking is already fully paid.');
        }

        // Get existing payment or create a new one
        $payment = Payment::where('booking_id', $booking->id)
            ->where('payment_type', 'final')
            ->first();

        if (!$payment || Carbon::parse($payment->expires_at)->isPast()) {
            $payment = $this->createFinalPayment($booking);
        }

        // Update payment method
        $methodMapping = [
            'BCA' => 'va_bca',
            'MANDIRI' => 'va_mandiri',
            'BNI' => 'va_bni',
            'BRI' => 'va_bri',
            'QRIS' => 'qris',
            'GOPAY' => 'gopay',
            'ALFAMART' => 'va_alfamart',
            'INDOMARET' => 'va_indomaret'
        ];

        $payment->method = $methodMapping[$validated['payment_method']] ?? 'va_bca';
        $payment->save();

        // Process payment with Duitku
        try {
            $paymentData = $this->duitkuService->createPaymentRequest(
                $payment->transaction_id,
                $payment->amount,
                "Final Payment for Booking #{$booking->booking_code}",
                $user->email ?? 'customer@ambulance-portal.com', // Gunakan email default jika user email kosong
                $user->name,
                $user->phone,
                $validated['payment_method'],
                route('payments.callback')
            );

            // Update payment with Duitku data
            $payment->duitku_reference = $paymentData['reference'];
            $payment->payment_url = $paymentData['paymentUrl'];
            $payment->va_number = $paymentData['vaNumber'] ?? null;
            $payment->qr_code = $paymentData['qrString'] ?? null;
            $payment->duitku_data = $paymentData;
            $payment->save();

            // Return to custom payment page instead of redirecting to Duitku
            return redirect()->route('payments.instructions', $payment->id);
        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to process payment. Please try again.');
        }
    }

    /**
     * Receive and process payment callback from Duitku.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function handleCallback(Request $request)
    {
        try {
            // Validate callback
            $duitkuResponse = $this->duitkuService->validateCallback($request);

            if ($duitkuResponse['status'] === 'success') {
                // Find the payment by reference
                $payment = Payment::where('duitku_reference', $duitkuResponse['reference'])->first();

                if (!$payment) {
                    Log::error('Payment not found for reference: ' . $duitkuResponse['reference']);
                    return response()->json(['message' => 'Payment not found'], 404);
                }

                // Update payment status
                $payment->status = 'paid';
                $payment->paid_at = now();
                $payment->save();

                // Update booking status based on payment type
                $booking = $payment->booking;

                if ($payment->payment_type === 'downpayment') {
                    $booking->is_downpayment_paid = true;
                    $booking->status = 'confirmed';
                    $booking->save();

                    // Send confirmation notification
                    $this->notificationService->sendBookingConfirmedNotification($booking);
                } else if ($payment->payment_type === 'final') {
                    $booking->is_fully_paid = true;
                    $booking->save();

                    // Send full payment notification
                    $this->notificationService->sendPaymentCompletedNotification($booking);
                }

                return response()->json(['message' => 'Payment processed successfully']);
            }

            return response()->json(['message' => 'Payment not successful']);
        } catch (\Exception $e) {
            Log::error('Payment callback error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing payment callback'], 500);
        }
    }

    /**
     * Check the status of a payment.
     *
     * @param Request $request
     * @param int $paymentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPaymentStatus(Request $request, $paymentId)
    {
        $user = $request->user();

        $payment = Payment::where('id', $paymentId)
            ->whereHas('booking', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();

        if (!$payment) {
            return response()->json(['error' => 'Pembayaran tidak ditemukan'], 404);
        }

        try {
            // Check status with Duitku
            // Gunakan mock data untuk pengujian jika diperlukan
            $useMockData = true; // Set ke false di production

            if ($useMockData) {
                // Simulasi response sukses
                $status = [
                    'statusCode' => '00',
                    'statusMessage' => 'Success',
                    'amount' => $payment->amount,
                    'reference' => $payment->duitku_reference,
                ];

                // Jika kita menggunakan mock data, ubah juga status pembayaran menjadi paid
                // untuk memudahkan testing
                $payment->status = 'paid';
                $payment->paid_at = now();
                $payment->save();

                // Update booking status untuk testing
                $booking = $payment->booking;
                if ($payment->payment_type === 'downpayment') {
                    $booking->is_downpayment_paid = true;
                    $booking->status = 'confirmed';
                } else if ($payment->payment_type === 'final') {
                    $booking->is_fully_paid = true;
                }
                $booking->save();
            } else {
                // Call Duitku API
                $status = $this->duitkuService->checkTransactionStatus($payment->duitku_reference);
            }

            // Cek status pembayaran
            if ($payment->status === 'paid') {
                $booking = $payment->booking;

                return response()->json([
                    'status' => 'paid',
                    'message' => 'Pembayaran berhasil',
                    'redirectUrl' => route('user.bookings.show', $booking->id)
                ]);
            }

            return response()->json([
                'status' => $payment->status,
                'message' => 'Status pembayaran: ' . $payment->status
            ]);
        } catch (\Exception $e) {
            Log::error('Payment status check error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memeriksa status pembayaran'
            ], 500);
        }
    }

    /**
     * Create a new down payment record.
     *
     * @param Booking $booking
     * @return Payment
     */
    private function createDownpayment(Booking $booking)
    {
        // Create transaction ID
        $transactionId = 'DP-' . $booking->booking_code . '-' . Str::random(8);

        // Create new payment record
        $payment = new Payment();
        $payment->booking_id = $booking->id;
        $payment->transaction_id = $transactionId;
        $payment->type = 'down_payment';
        $payment->payment_type = 'downpayment';
        $payment->amount = $booking->downpayment_amount;
        $payment->total_booking_amount = $booking->total_amount;
        $payment->downpayment_percentage = 30; // 30% down payment
        $payment->status = 'pending';
        $payment->expires_at = $booking->dp_payment_deadline;
        $payment->save();

        return $payment;
    }

    /**
     * Create a new final payment record.
     *
     * @param Booking $booking
     * @return Payment
     */
    private function createFinalPayment(Booking $booking)
    {
        // Calculate remaining amount (total minus down payment)
        $remainingAmount = $booking->total_amount - $booking->downpayment_amount;

        // Create transaction ID
        $transactionId = 'FP-' . $booking->booking_code . '-' . Str::random(8);

        // Create new payment record
        $payment = new Payment();
        $payment->booking_id = $booking->id;
        $payment->transaction_id = $transactionId;
        $payment->type = 'full_payment';
        $payment->payment_type = 'final';
        $payment->amount = $remainingAmount;
        $payment->total_booking_amount = $booking->total_amount;
        $payment->downpayment_percentage = 0; // Not applicable for final payment
        $payment->status = 'pending';
        $payment->expires_at = $booking->final_payment_deadline;
        $payment->save();

        return $payment;
    }

    /**
     * Get payment instructions based on payment method.
     *
     * @param Payment $payment
     * @return array
     */
    private function getPaymentInstructions(Payment $payment)
    {
        $instructions = [];

        if (strpos($payment->method, 'VA') !== false || in_array($payment->method, ['BCA', 'MANDIRI', 'BNI', 'BRI', 'PERMATA'])) {
            $instructions = [
                'title' => "{$payment->method} Virtual Account Payment",
                'steps' => [
                    "1. Login to your {$payment->method} mobile banking app or internet banking",
                    "2. Select 'Transfer' or 'Virtual Account' menu",
                    "3. Enter Virtual Account Number: {$payment->va_number}",
                    "4. Confirm the amount: Rp " . number_format($payment->amount, 0, ',', '.'),
                    "5. Complete the payment process according to your bank's instructions",
                    "6. Save your payment receipt"
                ]
            ];
        } else if ($payment->method === 'QRIS') {
            $instructions = [
                'title' => "QRIS Payment",
                'steps' => [
                    "1. Open your e-wallet app (OVO, GoPay, DANA, LinkAja, etc)",
                    "2. Select 'Scan QR' or 'Pay' option",
                    "3. Scan the QR code shown below",
                    "4. Confirm the amount: Rp " . number_format($payment->amount, 0, ',', '.'),
                    "5. Complete the payment process in your e-wallet app",
                    "6. Save your payment receipt"
                ],
                'qrCode' => $payment->qr_code
            ];
        } else if (in_array($payment->method, ['ALFAMART', 'INDOMARET'])) {
            $instructions = [
                'title' => "{$payment->method} Payment",
                'steps' => [
                    "1. Visit any {$payment->method} outlet",
                    "2. Tell the cashier you want to pay for Duitku payment",
                    "3. Provide the payment code: {$payment->va_number}",
                    "4. Confirm the amount: Rp " . number_format($payment->amount, 0, ',', '.'),
                    "5. Complete the payment with the cashier",
                    "6. Keep the payment receipt"
                ]
            ];
        } else {
            $instructions = [
                'title' => "Payment Instructions",
                'steps' => [
                    "1. Complete your payment of Rp " . number_format($payment->amount, 0, ',', '.'),
                    "2. Payment must be completed before: " . Carbon::parse($payment->expires_at)->format('M d, Y H:i'),
                    "3. If you experience any issues, please contact our customer support"
                ]
            ];
        }

        return $instructions;
    }
}
