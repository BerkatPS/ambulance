<?php

namespace App\Console\Commands;

use App\Http\Controllers\User\BookingController;
use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CheckPaymentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-payment-reminders {--force : Kirim pengingat terlepas dari deadline}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Memeriksa dan mengirim pengingat pembayaran untuk booking terjadwal dan darurat';

    /**
     * NotificationService instance
     * 
     * @var \App\Services\NotificationService
     */
    protected $notificationService;

    /**
     * Create a new command instance.
     *
     * @param \App\Services\NotificationService $notificationService
     * @return void
     */
    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $startTime = microtime(true);
        $this->info('Mulai memeriksa pembayaran yang perlu diingatkan pada: ' . now()->format('Y-m-d H:i:s'));
        
        try {
            $force = $this->option('force');
            
            // Pertama, periksa pengingat pembayaran terjadwal dengan metode yang sudah ada
            $controller = app(BookingController::class);
            $result = $controller->sendScheduledPaymentReminders();
            
            $data = json_decode($result->getContent(), true);
            
            if ($data['success']) {
                $this->info("✓ Berhasil mengirim pengingat pembayaran terjadwal:");
                $this->info("  - Pengingat DP: {$data['downpayment_reminders']}");
                $this->info("  - Pengingat pembayaran akhir: {$data['final_payment_reminders']}");
            } else {
                $this->error("✗ Gagal memeriksa pembayaran terjadwal: {$data['error']}");
                Log::error("Gagal memeriksa pembayaran terjadwal", [
                    'error' => $data['error'] ?? 'Unknown error'
                ]);
            }

            // Tambahan: Periksa pembayaran emergency yang tertunda
            $this->info("Memeriksa pembayaran emergency yang tertunda...");
            $pendingEmergencyPayments = $this->checkPendingEmergencyPayments($force);
            
            $this->info("✓ Selesai memeriksa pembayaran emergency: {$pendingEmergencyPayments} pengingat terkirim");
            
            // Periksa pembayaran yang sudah melewati deadline
            $this->info("Memeriksa pembayaran yang sudah melewati deadline...");
            $expiredPayments = $this->checkExpiredPayments();
            
            $this->info("✓ Pembayaran yang melewati deadline: {$expiredPayments} diproses");
            
            $endTime = microtime(true);
            $executionTime = round($endTime - $startTime, 2);
            $this->info("Command selesai dalam {$executionTime} detik");
            
        } catch (\Exception $e) {
            $this->error("✗ Terjadi kesalahan: {$e->getMessage()}");
            $this->error($e->getTraceAsString());
            Log::error("Kesalahan pada check-payment-reminders command", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
        
        return 0;
    }

    /**
     * Check for pending emergency payments and send reminders
     *
     * @param bool $force Force send reminders regardless of conditions
     * @return int Number of reminders sent
     */
    protected function checkPendingEmergencyPayments(bool $force = false)
    {
        // Cari semua booking emergency dengan status completed/arrived dan pembayaran pending
        $query = Booking::where('type', 'emergency')
            ->whereIn('status', ['arrived', 'completed'])
            ->whereHas('payment', function ($query) {
                $query->where('status', 'pending');
            });
            
        // Jika tidak force, hanya kirim untuk pembayaran yang belum diingatkan dalam 6 jam terakhir
        if (!$force) {
            $query->whereDoesntHave('notifications', function ($query) {
                $query->where('type', 'payment_reminder')
                    ->where('created_at', '>=', now()->subHours(6));
            });
        }
        
        $emergencyBookings = $query->with(['user', 'payment', 'notifications'])->get();
        
        $this->info("Ditemukan {$emergencyBookings->count()} booking emergency dengan pembayaran tertunda");
        
        $count = 0;

        foreach ($emergencyBookings as $booking) {
            try {
                // Log detail booking untuk membantu debug
                $this->info("Memproses booking emergency #{$booking->id} - Pembayaran: {$booking->payment->status}");
                
                // Gunakan metode yang lebih spesifik untuk pengingat pembayaran darurat
                $this->notificationService->sendEmergencyPaymentReminderNotification($booking);

                // Tandai waktu pengingat terakhir pada payment
                $booking->payment->last_reminder_at = now();
                $booking->payment->reminder_count = ($booking->payment->reminder_count ?? 0) + 1;
                $booking->payment->save();

                // Log informasi pengingat
                Log::info('Sent emergency payment reminder', [
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'payment_id' => $booking->payment->id,
                    'amount' => $booking->payment->amount,
                    'reminder_count' => $booking->payment->reminder_count
                ]);

                $count++;
                $this->info("✓ Berhasil mengirim pengingat pembayaran darurat untuk booking #{$booking->id}");
            } catch (\Exception $e) {
                $this->error("✗ Gagal mengirim pengingat untuk booking #{$booking->id}: {$e->getMessage()}");
                Log::error('Failed to send emergency payment reminder', [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        return $count;
    }
    
    /**
     * Check for expired payments and mark them accordingly
     *
     * @return int Number of expired payments processed
     */
    protected function checkExpiredPayments()
    {
        // Cari pembayaran yang telah melewati batas waktu
        $expiredPayments = Payment::where('status', 'pending')
            ->where('expires_at', '<', now())
            ->whereHas('booking', function ($query) {
                $query->whereNotIn('status', ['cancelled', 'completed']);
            })
            ->with('booking')
            ->get();
            
        $count = 0;
        
        foreach ($expiredPayments as $payment) {
            try {
                // Catat bahwa pembayaran sudah expired
                $payment->status = 'expired';
                $payment->save();
                
                // Kirim notifikasi bahwa pembayaran telah expired
                if ($payment->booking) {
                    $this->notificationService->sendPaymentExpiredNotification($payment->booking);
                    
                    // Jika booking darurat, tandai sebagai unpaid_emergency
                    if ($payment->booking->type === 'emergency') {
                        $payment->booking->payment_status = 'unpaid_emergency';
                        $payment->booking->save();
                    }
                    
                    $this->info("✓ Pembayaran #{$payment->id} untuk booking #{$payment->booking->id} ditandai sebagai expired");
                }
                
                $count++;
            } catch (\Exception $e) {
                $this->error("✗ Gagal memproses pembayaran expired #{$payment->id}: {$e->getMessage()}");
                Log::error('Failed to process expired payment', [
                    'payment_id' => $payment->id,
                    'booking_id' => $payment->booking_id ?? null,
                    'error' => $e->getMessage()
                ]);
            }
        }
        
        return $count;
    }
}
