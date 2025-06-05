<?php

namespace App\Jobs;

use App\Exceptions\PaymentException;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Events\PaymentCompleted;

class ProcessPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The payment instance.
     *
     * @var \App\Models\Payment
     */
    protected $payment;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 60;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Payment  $payment
     * @return void
     */
    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Skip if payment is already processed
        if ($this->payment->status !== 'pending') {
            Log::info('Payment already processed', [
                'payment_id' => $this->payment->id,
                'status' => $this->payment->status
            ]);
            return;
        }

        try {
            // Here we would typically interact with a payment gateway
            // For demonstration, we'll simulate a payment process
            $paymentSuccessful = $this->processPaymentWithGateway();
            
            if ($paymentSuccessful) {
                $this->payment->status = 'completed';
                $this->payment->processed_at = now();
                $this->payment->save();

                // Update the associated booking status
                $booking = Booking::find($this->payment->booking_id);
                if ($booking) {
                    $previousStatus = $booking->status;
                    $booking->status = 'confirmed';
                    $booking->save();

                    // Dispatch event if payment is completed
                    event(new PaymentCompleted($this->payment, $booking, $previousStatus));
                }

                Log::info('Payment processed successfully', [
                    'payment_id' => $this->payment->id,
                    'booking_id' => $this->payment->booking_id,
                    'amount' => $this->payment->amount
                ]);
            } else {
                $this->payment->status = 'failed';
                $this->payment->failure_reason = 'Payment gateway declined the transaction';
                $this->payment->save();

                // Update the associated booking status
                $booking = Booking::find($this->payment->booking_id);
                if ($booking) {
                    $booking->status = 'payment_failed';
                    $booking->save();
                }

                Log::warning('Payment processing failed', [
                    'payment_id' => $this->payment->id,
                    'booking_id' => $this->payment->booking_id
                ]);
            }
        } catch (\Exception $e) {
            $this->payment->status = 'failed';
            $this->payment->failure_reason = $e->getMessage();
            $this->payment->save();

            // Update the associated booking
            $booking = Booking::find($this->payment->booking_id);
            if ($booking) {
                $booking->status = 'payment_failed';
                $booking->save();
            }

            Log::error('Payment processing exception', [
                'payment_id' => $this->payment->id,
                'booking_id' => $this->payment->booking_id,
                'error' => $e->getMessage()
            ]);

            // Rethrow specific payment exceptions to trigger the retry mechanism
            if ($e instanceof PaymentException) {
                throw $e;
            }
        }
    }

    /**
     * Simulate processing payment with a payment gateway.
     *
     * @return bool
     */
    private function processPaymentWithGateway()
    {
        // In a real application, this would integrate with a payment gateway
        // For demonstration, we'll simulate success with 90% probability
        return rand(1, 10) <= 9;
    }

    /**
     * The job failed to process.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function failed(\Exception $exception)
    {
        Log::error('Payment job failed', [
            'payment_id' => $this->payment->id,
            'error' => $exception->getMessage()
        ]);

        // Update payment status to failed
        $this->payment->status = 'failed';
        $this->payment->failure_reason = $exception->getMessage();
        $this->payment->save();

        // Update the associated booking
        $booking = Booking::find($this->payment->booking_id);
        if ($booking) {
            $booking->status = 'payment_failed';
            $booking->save();
        }
    }
}
