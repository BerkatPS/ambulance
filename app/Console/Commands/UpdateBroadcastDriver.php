<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class UpdateBroadcastDriver extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'env:update-broadcast-driver';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update BROADCAST_DRIVER value in .env file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $envFile = base_path('.env');
        
        if (!File::exists($envFile)) {
            $this->error('.env file not found');
            return 1;
        }
        
        $envContent = File::get($envFile);
        
        // Check if BROADCAST_CONNECTION exists
        if (Str::contains($envContent, 'BROADCAST_CONNECTION=')) {
            $envContent = preg_replace(
                '/BROADCAST_CONNECTION=.*/',
                'BROADCAST_DRIVER=pusher',
                $envContent
            );
            
            $this->info('BROADCAST_CONNECTION replaced with BROADCAST_DRIVER=pusher');
        } 
        // Check if BROADCAST_DRIVER exists but is not set to pusher
        elseif (Str::contains($envContent, 'BROADCAST_DRIVER=') && !Str::contains($envContent, 'BROADCAST_DRIVER=pusher')) {
            $envContent = preg_replace(
                '/BROADCAST_DRIVER=.*/',
                'BROADCAST_DRIVER=pusher',
                $envContent
            );
            
            $this->info('BROADCAST_DRIVER updated to pusher');
        }
        // If neither exists, add BROADCAST_DRIVER
        elseif (!Str::contains($envContent, 'BROADCAST_DRIVER=')) {
            $envContent .= PHP_EOL . 'BROADCAST_DRIVER=pusher' . PHP_EOL;
            
            $this->info('BROADCAST_DRIVER=pusher added to .env');
        } else {
            $this->info('BROADCAST_DRIVER already set to pusher');
            return 0;
        }
        
        File::put($envFile, $envContent);
        
        // Clear config cache
        $this->call('config:clear');
        
        $this->info('Configuration cache cleared');
        
        return 0;
    }
}
