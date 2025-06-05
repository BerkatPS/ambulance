<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;

class SafeMigrate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:safe {--fresh} {--seed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run migrations safely with a mock request for URL generation';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Create a mock request for URL generation
        app()->instance('request', Request::create('http://localhost', 'GET'));

        // Run the migrations based on options
        $command = 'migrate';
        
        if ($this->option('fresh')) {
            $command .= ':fresh';
        }
        
        $exitCode = $this->call($command);
        
        if ($exitCode !== 0) {
            return $exitCode;
        }
        
        // Run seeders if requested
        if ($this->option('seed')) {
            $this->call('db:seed');
        }
        
        return 0;
    }
}
