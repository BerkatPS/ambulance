<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register default broadcast authentication routes
        // Web users (standard auth guard)
        Broadcast::routes(['middleware' => ['web', 'auth']]);
        
        // Admin and driver guards need custom routes
        Broadcast::routes(['middleware' => ['web', 'auth:admin']]);
        Broadcast::routes(['middleware' => ['web', 'auth:driver']]);
        
        require base_path('routes/channels.php');
    }
}
