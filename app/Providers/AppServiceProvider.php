<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind a mock request instance for console commands
        if ($this->app->runningInConsole()) {
            $this->app->singleton('request', function () {
                return Request::create('http://localhost', 'GET');
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix for URL generation in console commands
        if ($this->app->runningInConsole()) {
            URL::forceRootUrl(config('app.url'));
        }
        
        // Force HTTPS for all URLs in production or when using ngrok
        if (str_contains(config('app.url'), 'ngrok') || $this->app->environment('production')) {
            URL::forceScheme('https');
        }
        
        Vite::prefetch(concurrency: 3);
    }
}
