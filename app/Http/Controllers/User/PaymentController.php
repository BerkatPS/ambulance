<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentController extends Controller
{
    /**
     * Display a listing of the user's payments.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with('booking');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->has('method') && $request->method) {
            $query->where('method', $request->method);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Filter by amount range
        if ($request->has('min_amount') && $request->min_amount) {
            $query->where('amount', '>=', $request->min_amount);
        }

        if ($request->has('max_amount') && $request->max_amount) {
            $query->where('amount', '<=', $request->max_amount);
        }

        $payments = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10)
            ->appends($request->all());

        // Get stats
        $totalPaid = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'paid')
            ->sum('amount');

        $totalPending = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'pending')
            ->sum('amount');

        $totalInvoices = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->count();

        return Inertia::render('User/Payments/Index', [
            'payments' => $payments,
            'filters' => [
                'status' => $request->status,
                'method' => $request->method,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'min_amount' => $request->min_amount,
                'max_amount' => $request->max_amount,
            ],
            'stats' => [
                'totalPaid' => $totalPaid,
                'totalPending' => $totalPending,
                'totalInvoices' => $totalInvoices,
            ],
        ]);
    }

    /**
     * Display the specified payment.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = request()->user();

        $payment = Payment::with([
            'booking',
            'booking.driver',
            'booking.ambulance',
            'booking.user'
        ])
        ->findOrFail($id);

        // Ensure user owns this payment
        if ($payment->booking->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('User/Payments/Show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Process payment for a pending payment.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function pay($id)
    {
        $user = request()->user();

        $payment = Payment::with('booking')
            ->findOrFail($id);

        // Ensure user owns this payment
        if ($payment->booking->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        // Ensure payment is still pending
        if ($payment->status !== 'pending') {
            return redirect()->route('payments.show', $id)
                ->with('error', 'This payment has already been processed.');
        }

        return Inertia::render('User/Payments/Pay', [
            'payment' => $payment,
        ]);
    }

    /**
     * Process payment confirmation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function process(Request $request, $id)
    {
        $request->validate([
            'method' => 'required|in:qris,va_bca,va_mandiri,va_bri,va_bni,gopay',
            'transaction_id' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $payment = Payment::with('booking')
            ->findOrFail($id);

        // Ensure user owns this payment
        if ($payment->booking->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        // Ensure payment is still pending
        if ($payment->status !== 'pending') {
            return redirect()->route('payments.show', $id)
                ->with('error', 'This payment has already been processed.');
        }

        // Update payment record
        $payment->update([
            'method' => $request->method,
            'transaction_id' => $request->transaction_id,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Update booking payment status
        $booking = $payment->booking;

        if ($payment->payment_type === 'downpayment') {
            $booking->update(['payment_status' => 'paid']);
        } else if ($payment->payment_type === 'full_payment') {
            $booking->update(['payment_status' => 'paid']);
        }

        return redirect()->route('payments.show', $id)
            ->with('success', 'Pembayaran berhasil! Terima kasih atas transaksi Anda.');
    }

    /**
     * Display payment receipt.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function receipt($id)
    {
        $user = request()->user();

        $payment = Payment::with(['booking', 'booking.user', 'booking.ambulance', 'booking.driver'])
            ->findOrFail($id);

        // Ensure user owns this payment
        if ($payment->booking->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        // Ensure payment is completed
        if ($payment->status !== 'paid') {
            return redirect()->route('payments.show', $id)
                ->with('error', 'Receipt is only available for completed payments.');
        }

        // Return Inertia view with payment data
        return Inertia::render('User/Payments/Receipt', [
            'payment' => $payment,
            'user' => $user,
        ]);
    }

    /**
     * Handle full payment page for emergency bookings.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function fullPayment($id)
    {
        $user = request()->user();

        // Find booking with payment
        $booking = Booking::with(['payment', 'ambulance', 'driver', 'user'])
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        // Ensure booking is emergency type and has a pending payment
        if ($booking->type !== 'emergency' || !$booking->payment || $booking->payment->status !== 'pending') {
            return redirect()->route('user.bookings.show', $id)
                ->with('error', 'Tidak dapat melakukan pembayaran untuk pesanan ini.');
        }

        // Mock payment methods data
        $paymentMethods = [
            [
                'id' => 1,
                'name' => 'E-Wallet',
                'code' => 'e_wallet',
                'methods' => [
                    ['id' => 101, 'name' => 'GoPay', 'code' => 'gopay', 'icon' => 'gopay-icon.png'],
                    ['id' => 102, 'name' => 'OVO', 'code' => 'ovo', 'icon' => 'ovo-icon.png'],
                    ['id' => 103, 'name' => 'DANA', 'code' => 'dana', 'icon' => 'dana-icon.png'],
                ]
            ],
            [
                'id' => 2,
                'name' => 'Virtual Account',
                'code' => 'virtual_account',
                'methods' => [
                    ['id' => 201, 'name' => 'BCA Virtual Account', 'code' => 'va_bca', 'icon' => 'bca-icon.png'],
                    ['id' => 202, 'name' => 'Mandiri Virtual Account', 'code' => 'va_mandiri', 'icon' => 'mandiri-icon.png'],
                    ['id' => 203, 'name' => 'BRI Virtual Account', 'code' => 'va_bri', 'icon' => 'bri-icon.png'],
                    ['id' => 204, 'name' => 'BNI Virtual Account', 'code' => 'va_bni', 'icon' => 'bni-icon.png'],
                ]
            ],
            [
                'id' => 3,
                'name' => 'QRIS',
                'code' => 'qris',
                'methods' => [
                    ['id' => 301, 'name' => 'QRIS', 'code' => 'qris', 'icon' => 'qris-icon.png'],
                ]
            ]
        ];

        // Calculate deadline for full payment (7 days after booking completion)
        $deadlines = [
            'fullPayment' => $booking->completed_at
                ? date('Y-m-d H:i:s', strtotime($booking->completed_at . ' +7 days'))
                : date('Y-m-d H:i:s', strtotime($booking->created_at . ' +7 days'))
        ];

        return Inertia::render('User/Payments/FullPayment', [
            'booking' => $booking,
            'payment' => $booking->payment,
            'paymentMethods' => $paymentMethods,
            'deadlines' => $deadlines
        ]);
    }

    /**
     * Process full payment for emergency bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processFullPayment(Request $request, $id)
    {
        $request->validate([
            'payment_method' => 'required|string',
        ]);

        $user = $request->user();

        // Find booking with payment
        $booking = Booking::with('payment')
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        // Ensure booking is emergency type
        if ($booking->type !== 'emergency') {
            return redirect()->route('user.bookings.show', $id)
                ->with('error', 'Fitur ini hanya untuk pemesanan darurat.');
        }

        // Check if payment exists
        if (!$booking->payment) {
            return redirect()->route('user.bookings.show', $id)
                ->with('error', 'Data pembayaran tidak ditemukan.');
        }

        // Update payment details (mock process)
        $payment = $booking->payment;
        $payment->update([
            'method' => $request->payment_method,
            'transaction_id' => 'TRX-' . strtoupper(uniqid()),
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Update booking payment status
        $booking->update([
            'payment_status' => 'paid'
        ]);

        return redirect()->route('payments.show', $payment->id)
            ->with('success', 'Pembayaran berhasil! Terima kasih atas pembayaran layanan darurat Anda.');
    }

    /**
     * Send a payment reminder for an emergency booking
     * This endpoint is called by the frontend when displaying real-time payment reminders
     */
    public function sendPaymentReminder(Request $request, $id)
    {
        // Get authenticated user
        $user = $request->user();

        // Find the booking
        $booking = Booking::with('payment')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->where('type', 'emergency')
            ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        // Check if booking has a pending payment
        if (!$booking->payment || $booking->payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada pembayaran yang menunggu untuk booking ini'
            ]);
        }

        // Check if booking is completed, as emergency payments are due after service completion
        if ($booking->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran hanya diperlukan setelah layanan selesai'
            ]);
        }

        // In a real application, here you would:
        // 1. Send an actual notification (email, SMS, push notification)
        // 2. Log the reminder in the database
        // 3. Possibly use Laravel's notification system

        // For our mock implementation, we'll just return success
        // In a real app with broadcasting, you'd dispatch a notification event here
        // Broadcast::to('user.'.$user->id)->event(new PaymentReminderNotification($booking));

        return response()->json([
            'success' => true,
            'message' => 'Pengingat pembayaran berhasil dikirim',
            'payment_url' => route('bookings.fullpayment', $booking->id),
            'booking_id' => $booking->id,
            'timestamp' => now()->format('Y-m-d H:i:s')
        ]);
    }
}
