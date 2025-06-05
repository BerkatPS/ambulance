<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RunSchedulerTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-scheduler';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menjalankan semua scheduled tasks untuk pengujian';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Menjalankan semua scheduled tasks untuk pengujian...');
        
        $this->info('1. Memeriksa pengingat pembayaran:');
        $this->call('app:check-payment-reminders');
        
        $this->info('2. Memeriksa pembatalan otomatis:');
        $this->call('app:check-auto-cancellations');
        
        // Jika sukses, tampilkan pesan sukses
        $this->newLine();
        $this->info('✓ Semua scheduled tasks berhasil dijalankan untuk pengujian.');
        $this->info('  Untuk menjalankan scheduler sesungguhnya, gunakan: php artisan schedule:work');
        
        return 0;
    }
}
