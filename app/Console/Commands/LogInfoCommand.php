<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class LogInfoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'log:info {message?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Log an info message to the Laravel log file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $message = $this->argument('message') ?? 'Scheduler is running at: ' . now()->toDateTimeString();
        
        Log::info($message);
        
        $this->info('Logged: ' . $message);
        
        return Command::SUCCESS;
    }
}
