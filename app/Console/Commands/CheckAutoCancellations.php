<?php

namespace App\Console\Commands;

use App\Http\Controllers\User\BookingController;
use Illuminate\Console\Command;

class CheckAutoCancellations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-auto-cancellations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Membatalkan secara otomatis booking yang tenggat pembayarannya sudah terlewat';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memeriksa booking yang perlu dibatalkan otomatis...');
        
        try {
            $controller = app(BookingController::class);
            $result = $controller->processAutoCancellations();
            
            $data = json_decode($result->getContent(), true);
            
            if ($data['success']) {
                $this->info("Berhasil membatalkan {$data['cancelled_count']} booking yang melewati tenggat pembayaran");
                
                // Jika ada pembatalan yang berhasil dilakukan dan perlu membebaskan driver
                if ($data['cancelled_count'] > 0) {
                    $this->info("Driver yang terkait telah diatur kembali ke status 'available'");
                    $this->info("Ambulance yang terkait telah diatur kembali ke status 'available'");
                }
            } else {
                $this->error("Gagal: {$data['error']}");
            }
        } catch (\Exception $e) {
            $this->error("Terjadi kesalahan: {$e->getMessage()}");
            $this->error($e->getTraceAsString());
            return 1;
        }
        
        return 0;
    }
}
