<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ProcessPaymentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PaymentCompleted  $event
     * @return void
     */
    public function handle(PaymentCompleted $event)
    {
        $payment = $event->payment;
        $booking = $event->booking;
        
        Log::info('Processing payment notification', [
            'payment_id' => $payment->id,
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'amount' => $payment->amount,
        ]);
        
        try {
            // Get the user
            $user = $booking->user;
            
            if (!$user) {
                Log::warning('User not found for payment notification', [
                    'payment_id' => $payment->id,
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                ]);
                return;
            }
            
            // In a real application, send email and/or SMS notification
            $this->sendEmailNotification($user, $payment, $booking);
            $this->sendSmsNotification($user, $payment, $booking);
            
            // Generate receipt/invoice
            $this->generateReceipt($payment, $booking);
            
            Log::info('Payment notification processed successfully', [
                'payment_id' => $payment->id,
                'booking_id' => $booking->id,
                'user_id' => $user->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process payment notification', [
                'payment_id' => $payment->id,
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
            
            // Rethrow to retry
            throw $e;
        }
    }
    
    /**
     * Send email notification.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payment  $payment
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    private function sendEmailNotification($user, $payment, $booking): void
    {
        // In a real application, this would send an actual email
        // For demonstration, we'll just log what would be sent
        Log::info('Would send payment receipt email', [
            'to' => $user->email ?? 'No email available',
            'subject' => 'Payment Receipt for Booking #' . $booking->id,
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
            'method' => $payment->payment_method,
            'date' => $payment->processed_at->format('Y-m-d H:i:s'),
        ]);
    }
    
    /**
     * Send SMS notification.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Payment  $payment
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    private function sendSmsNotification($user, $payment, $booking): void
    {
        // Skip if no phone number available
        if (empty($user->phone)) {
            return;
        }
        
        // In a real application, this would send an actual SMS
        // For demonstration, we'll just log what would be sent
        $message = "Thank you for your payment of $" . number_format($payment->amount, 2) . 
                   " for booking #" . $booking->id . ". Receipt has been emailed.";
        
        Log::info('Would send payment SMS notification', [
            'to' => $user->phone,
            'message' => $message,
        ]);
    }
    
    /**
     * Generate receipt for the payment.
     *
     * @param  \App\Models\Payment  $payment
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    private function generateReceipt($payment, $booking): void
    {
        // In a real application, this would generate a PDF receipt
        // For demonstration, we'll just log that a receipt would be generated
        Log::info('Would generate payment receipt', [
            'payment_id' => $payment->id,
            'booking_id' => $booking->id,
            'receipt_number' => 'RCPT-' . str_pad($payment->id, 8, '0', STR_PAD_LEFT),
            'amount' => $payment->amount,
            'payment_method' => $payment->payment_method,
            'transaction_date' => $payment->processed_at->format('Y-m-d H:i:s'),
        ]);
        
        // Update payment record with receipt info
        $payment->receipt_number = 'RCPT-' . str_pad($payment->id, 8, '0', STR_PAD_LEFT);
        $payment->receipt_generated_at = now();
        $payment->save();
    }
}
