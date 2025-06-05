<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendPaymentReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The payment instance.
     *
     * @var \App\Models\Payment
     */
    protected $payment;

    /**
     * The reminder attempt number.
     *
     * @var int
     */
    protected $reminderAttempt;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Payment  $payment
     * @param  int  $reminderAttempt
     * @return void
     */
    public function __construct(Payment $payment, int $reminderAttempt = 1)
    {
        $this->payment = $payment;
        $this->reminderAttempt = $reminderAttempt;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Only send reminders for pending payments
        if ($this->payment->status !== 'pending') {
            Log::info('Payment no longer pending, skipping reminder', [
                'payment_id' => $this->payment->id,
                'status' => $this->payment->status
            ]);
            return;
        }

        try {
            // Get the associated booking and user
            $booking = Booking::find($this->payment->booking_id);
            
            if (!$booking) {
                Log::warning('Booking not found for payment reminder', [
                    'payment_id' => $this->payment->id,
                    'booking_id' => $this->payment->booking_id
                ]);
                return;
            }
            
            $user = User::find($booking->user_id);
            
            if (!$user) {
                Log::warning('User not found for payment reminder', [
                    'payment_id' => $this->payment->id,
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id
                ]);
                return;
            }
            
            // Determine the reminder type based on attempt number
            $reminderType = $this->getReminderType();
            
            // Send the appropriate reminder
            $this->sendReminder($user, $booking, $reminderType);
            
            // Log the reminder
            Log::info('Payment reminder sent', [
                'payment_id' => $this->payment->id,
                'booking_id' => $booking->id,
                'user_id' => $user->id,
                'reminder_attempt' => $this->reminderAttempt,
                'reminder_type' => $reminderType
            ]);
            
            // Schedule next reminder if needed
            $this->scheduleNextReminder();
            
            // Update the payment record to track reminder attempts
            $this->payment->reminder_count = $this->reminderAttempt;
            $this->payment->last_reminder_sent_at = now();
            $this->payment->save();
            
        } catch (\Exception $e) {
            Log::error('Failed to send payment reminder', [
                'payment_id' => $this->payment->id,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Get the reminder type based on the attempt number.
     *
     * @return string
     */
    private function getReminderType(): string
    {
        switch ($this->reminderAttempt) {
            case 1:
                return 'gentle';
            case 2:
                return 'moderate';
            case 3:
                return 'urgent';
            default:
                return 'final';
        }
    }
    
    /**
     * Send the appropriate reminder to the user.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Booking  $booking
     * @param  string  $reminderType
     * @return void
     */
    private function sendReminder(User $user, Booking $booking, string $reminderType): void
    {
        // In a real application, this would send an SMS, email, push notification, etc.
        // For demonstration purposes, we'll just log what would be sent
        
        $messages = [
            'gentle' => "Hi {$user->name}, just a friendly reminder about your pending payment of \${$this->payment->amount} for booking #{$booking->id}. Please complete your payment to confirm your ambulance booking.",
            
            'moderate' => "Hello {$user->name}, your payment of \${$this->payment->amount} for booking #{$booking->id} is still pending. Please complete your payment as soon as possible to avoid booking cancellation.",
            
            'urgent' => "IMPORTANT: {$user->name}, your payment of \${$this->payment->amount} for booking #{$booking->id} requires immediate attention. Your booking will be cancelled within 24 hours if payment is not received.",
            
            'final' => "FINAL NOTICE: {$user->name}, this is the final reminder for your payment of \${$this->payment->amount} for booking #{$booking->id}. Your booking will be automatically cancelled if payment is not received within 6 hours."
        ];
        
        $message = $messages[$reminderType] ?? $messages['gentle'];
        
        // Log the message that would be sent
        Log::info('Would send payment reminder message', [
            'to' => $user->phone,
            'message' => $message,
            'type' => $reminderType
        ]);
    }
    
    /**
     * Schedule the next reminder if applicable.
     *
     * @return void
     */
    private function scheduleNextReminder(): void
    {
        // Only schedule up to 4 reminders
        if ($this->reminderAttempt >= 4) {
            return;
        }
        
        // Determine the delay for the next reminder based on the current attempt
        $delayHours = [
            1 => 6,    // 6 hours after first reminder
            2 => 12,   // 12 hours after second reminder
            3 => 24,   // 24 hours after third reminder
        ][$this->reminderAttempt] ?? 24;
        
        // Schedule the next reminder
        SendPaymentReminder::dispatch($this->payment, $this->reminderAttempt + 1)
            ->delay(now()->addHours($delayHours));
            
        Log::info('Next payment reminder scheduled', [
            'payment_id' => $this->payment->id,
            'next_attempt' => $this->reminderAttempt + 1,
            'delay_hours' => $delayHours,
            'scheduled_for' => now()->addHours($delayHours)
        ]);
    }
}
