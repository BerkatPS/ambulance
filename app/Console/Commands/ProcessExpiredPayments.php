<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Payment;
use App\Models\Booking;
use App\Exceptions\PaymentException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessExpiredPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-expired-payments {--hours=24 : Hours after which pending payments are considered expired}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process payments that have been pending for too long';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = $this->option('hours');
        $cutoffTime = Carbon::now()->subHours($hours);
        
        $this->info("Processing payments that have been pending since before {$cutoffTime}...");
        
        // Find all pending payments older than the cutoff time
        $expiredPayments = Payment::where('status', 'pending')
            ->where('created_at', '<', $cutoffTime)
            ->with(['booking', 'user'])
            ->get();
        
        if ($expiredPayments->isEmpty()) {
            $this->info('No expired payments found.');
            return Command::SUCCESS;
        }
        
        $this->info("Found {$expiredPayments->count()} expired pending payments.");
        
        $canceledCount = 0;
        $errorCount = 0;
        
        foreach ($expiredPayments as $payment) {
            try {
                $this->line("Processing expired payment ID: {$payment->id} for booking ID: {$payment->booking_id}");
                
                // Update payment status
                $payment->status = 'cancelled';
                $payment->notes = ($payment->notes ? $payment->notes . "\n" : '') . 
                    "Payment automatically cancelled after {$hours} hours of pending status on " . now();
                $payment->save();
                
                // Update associated booking if it exists
                if ($payment->booking) {
                    $booking = $payment->booking;
                    
                    // Only update booking if it's in a state that depends on payment
                    if (in_array($booking->status, ['pending_payment', 'confirmed'])) {
                        $booking->status = 'payment_failed';
                        $booking->save();
                        
                        $this->line("  Updated booking ID: {$booking->id} status to payment_failed");
                    }
                }
                
                // Send notification to user
                // In a real application, you would use something like:
                /*
                if ($payment->user && $payment->user->email) {
                    Mail::to($payment->user->email)->send(new PaymentExpiredMail($payment));
                }
                */
                
                $this->line("  Successfully processed expired payment ID: {$payment->id}");
                $canceledCount++;
                
            } catch (PaymentException $e) {
                $this->error("  Error processing payment ID: {$payment->id} - {$e->getMessage()}");
                Log::error("Payment processing error: {$e->getMessage()}", [
                    'payment_id' => $payment->id,
                    'exception' => $e,
                ]);
                $errorCount++;
            } catch (\Exception $e) {
                $this->error("  Unexpected error processing payment ID: {$payment->id} - {$e->getMessage()}");
                Log::error("Unexpected payment processing error: {$e->getMessage()}", [
                    'payment_id' => $payment->id,
                    'exception' => $e,
                ]);
                $errorCount++;
            }
        }
        
        $this->info("Completed processing expired payments:");
        $this->info("  - Successfully cancelled: {$canceledCount}");
        $this->info("  - Errors: {$errorCount}");
        
        return Command::SUCCESS;
    }
}
