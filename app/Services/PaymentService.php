<?php

namespace App\Services;

use App\Events\PaymentCompleted;
use App\Jobs\SendPaymentReminder;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * The Duitku service instance.
     *
     * @var \App\Services\DuitkuService
     */
    protected $duitkuService;

    /**
     * The booking service instance.
     *
     * @var \App\Services\BookingService
     */
    protected $bookingService;

    /**
     * Create a new service instance.
     *
     * @param  \App\Services\DuitkuService  $duitkuService
     * @param  \App\Services\BookingService  $bookingService
     * @return void
     */
    public function __construct(DuitkuService $duitkuService, BookingService $bookingService)
    {
        $this->duitkuService = $duitkuService;
        $this->bookingService = $bookingService;
    }

    /**
     * Process a payment for a booking.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $paymentData
     * @return \App\Models\Payment
     */
    public function processPayment(Booking $booking, array $paymentData): Payment
    {
        try {
            DB::beginTransaction();

            // Create a payment record
            $payment = $this->createPaymentRecord($booking, $paymentData);

            // Process payment with the payment gateway
            $paymentResponse = $this->processWithGateway($payment, $paymentData);

            // Update payment record with gateway response
            $payment->transaction_id = $paymentResponse['transaction_id'] ?? null;
            $payment->payment_url = $paymentResponse['payment_url'] ?? null;
            $payment->status = $paymentResponse['status'] ?? 'pending';
            $payment->gateway_response = json_encode($paymentResponse);
            $payment->save();

            // If payment is successful immediately (rare case)
            if ($payment->status === 'completed') {
                $this->handleSuccessfulPayment($payment, $booking);
            }

            DB::commit();

            return $payment;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment processing failed', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Create a failed payment record for tracking
            $failedPayment = $this->recordFailedPayment($booking, $paymentData, $e->getMessage());

            throw $e;
        }
    }

    /**
     * Handle payment gateway callback.
     *
     * @param  array  $callbackData
     * @return \App\Models\Payment|null
     */
    public function handlePaymentCallback(array $callbackData): ?Payment
    {
        try {
            // Verify callback data with gateway
            $verificationResult = $this->duitkuService->verifyCallback($callbackData);
            if (!$verificationResult['is_valid']) {
                Log::warning('Invalid payment callback received', [
                    'callback_data' => $callbackData,
                    'verification_result' => $verificationResult
                ]);
                return null;
            }

            // Find the payment by reference number
            $payment = Payment::where('reference_number', $callbackData['reference_number'] ?? '')->first();
            if (!$payment) {
                Log::warning('Payment not found for callback', [
                    'reference_number' => $callbackData['reference_number'] ?? null
                ]);
                return null;
            }

            // Get booking
            $booking = $payment->booking;
            if (!$booking) {
                Log::warning('Booking not found for payment', [
                    'payment_id' => $payment->id,
                    'booking_id' => $payment->booking_id
                ]);
                return null;
            }

            DB::beginTransaction();

            // Update payment details
            $previousStatus = $payment->status;
            $payment->status = $this->mapGatewayStatus($callbackData['status'] ?? '');
            $payment->transaction_id = $callbackData['transaction_id'] ?? $payment->transaction_id;
            $payment->processed_at = now();
            $payment->gateway_response = json_encode($callbackData);
            $payment->save();

            // Handle payment status
            if ($payment->status === 'completed') {
                $this->handleSuccessfulPayment($payment, $booking);
            } elseif ($payment->status === 'failed') {
                $this->handleFailedPayment($payment, $booking);
            }

            DB::commit();

            return $payment;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to process payment callback', [
                'callback_data' => $callbackData,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Schedule a payment reminder for a booking.
     *
     * @param  \App\Models\Booking  $booking
     * @param  int  $reminderAttempt
     * @param  int  $delayMinutes
     * @return void
     */
    public function schedulePaymentReminder(Booking $booking, int $reminderAttempt = 1, int $delayMinutes = 60): void
    {
        // Only send reminders for bookings that require payment
        if (!in_array($booking->status, ['pending', 'payment_failed'])) {
            return;
        }

        // Check if there's already a paid payment
        $hasCompletedPayment = $booking->payments()->where('status', 'completed')->exists();
        if ($hasCompletedPayment) {
            return;
        }

        // Determine reminder type based on attempt number
        $reminderType = 'standard';
        if ($reminderAttempt === 2) {
            $reminderType = 'follow_up';
        } elseif ($reminderAttempt >= 3) {
            $reminderType = 'urgent';
        }

        // Schedule the reminder job
        SendPaymentReminder::dispatch($booking, $reminderType, $reminderAttempt)
            ->delay(now()->addMinutes($delayMinutes));

        Log::info('Payment reminder scheduled', [
            'booking_id' => $booking->id,
            'attempt' => $reminderAttempt,
            'type' => $reminderType,
            'delay_minutes' => $delayMinutes
        ]);
    }

    /**
     * Create a payment record.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $paymentData
     * @return \App\Models\Payment
     */
    protected function createPaymentRecord(Booking $booking, array $paymentData): Payment
    {
        // Generate a unique reference number
        $referenceNumber = 'PMT-' . time() . '-' . $booking->id;

        // Determine amount (use booking's final or estimated price if not provided)
        $amount = $paymentData['amount'] ?? 
                 ($booking->final_price ?? 
                  $booking->estimated_price ?? 
                  $this->bookingService->calculateFinalPrice($booking));

        return Payment::create([
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'reference_number' => $referenceNumber,
            'amount' => $amount,
            'payment_method' => $paymentData['payment_method'] ?? 'unknown',
            'status' => 'pending',
            'currency' => $paymentData['currency'] ?? 'IDR',
            'description' => $paymentData['description'] ?? 'Payment for Booking #' . $booking->id,
            'customer_name' => $paymentData['customer_name'] ?? $booking->contact_name,
            'customer_email' => $paymentData['customer_email'] ?? null,
            'customer_phone' => $paymentData['customer_phone'] ?? $booking->contact_phone,
        ]);
    }

    /**
     * Process payment with the payment gateway.
     *
     * @param  \App\Models\Payment  $payment
     * @param  array  $paymentData
     * @return array
     */
    protected function processWithGateway(Payment $payment, array $paymentData): array
    {
        // Prepare data for payment gateway
        $gatewayData = [
            'merchantCode' => config('services.duitku.merchant_code'),
            'paymentAmount' => (int) $payment->amount,
            'paymentMethod' => $paymentData['payment_method'],
            'merchantOrderId' => $payment->reference_number,
            'productDetails' => $payment->description,
            'customerVaName' => $payment->customer_name,
            'email' => $payment->customer_email,
            'phoneNumber' => $payment->customer_phone,
            'callbackUrl' => route('payment.callback'),
            'returnUrl' => route('payment.return', ['reference' => $payment->reference_number]),
            'expiryPeriod' => 60, // 60 minutes expiry
        ];

        // Call the payment gateway service
        return $this->duitkuService->createPayment($gatewayData);
    }

    /**
     * Handle a successful payment.
     *
     * @param  \App\Models\Payment  $payment
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    protected function handleSuccessfulPayment(Payment $payment, Booking $booking): void
    {
        // Record previous booking status
        $previousBookingStatus = $booking->status;

        // Update booking status based on current status
        if (in_array($booking->status, ['pending', 'payment_failed'])) {
            $this->bookingService->updateStatus($booking, 'confirmed');
        }

        // Dispatch payment completed event
        event(new PaymentCompleted($payment, $booking, $previousBookingStatus));

        Log::info('Payment processed successfully', [
            'payment_id' => $payment->id,
            'booking_id' => $booking->id,
            'amount' => $payment->amount,
            'previous_status' => $previousBookingStatus,
            'new_status' => $booking->status
        ]);
    }

    /**
     * Handle a failed payment.
     *
     * @param  \App\Models\Payment  $payment
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    protected function handleFailedPayment(Payment $payment, Booking $booking): void
    {
        // Only update booking status if it's pending
        if ($booking->status === 'pending') {
            $booking->status = 'payment_failed';
            $booking->save();
        }

        // Schedule a payment reminder
        $attemptCount = $booking->payments()->where('status', 'failed')->count();
        $this->schedulePaymentReminder($booking, $attemptCount + 1);

        Log::warning('Payment failed', [
            'payment_id' => $payment->id,
            'booking_id' => $booking->id,
            'attempt' => $attemptCount + 1
        ]);
    }

    /**
     * Record a failed payment.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $paymentData
     * @param  string  $errorMessage
     * @return \App\Models\Payment
     */
    protected function recordFailedPayment(Booking $booking, array $paymentData, string $errorMessage): Payment
    {
        $referenceNumber = 'PMT-' . time() . '-' . $booking->id;
        
        $amount = $paymentData['amount'] ?? 
                 ($booking->final_price ?? 
                  $booking->estimated_price ?? 0);

        return Payment::create([
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'reference_number' => $referenceNumber,
            'amount' => $amount,
            'payment_method' => $paymentData['payment_method'] ?? 'unknown',
            'status' => 'failed',
            'currency' => $paymentData['currency'] ?? 'IDR',
            'description' => $paymentData['description'] ?? 'Payment for Booking #' . $booking->id,
            'customer_name' => $paymentData['customer_name'] ?? $booking->contact_name,
            'customer_email' => $paymentData['customer_email'] ?? null,
            'customer_phone' => $paymentData['customer_phone'] ?? $booking->contact_phone,
            'gateway_response' => json_encode(['error' => $errorMessage]),
        ]);
    }

    /**
     * Map gateway status to our internal status.
     *
     * @param  string  $gatewayStatus
     * @return string
     */
    protected function mapGatewayStatus(string $gatewayStatus): string
    {
        $statusMap = [
            'success' => 'completed',
            'paid' => 'completed',
            'settlement' => 'completed',
            'capture' => 'completed',
            'pending' => 'pending',
            'failed' => 'failed',
            'cancel' => 'cancelled',
            'expire' => 'expired'
        ];

        return $statusMap[strtolower($gatewayStatus)] ?? 'pending';
    }
}
