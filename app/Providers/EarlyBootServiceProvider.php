<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

class EarlyBootServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind a request instance early, before any other service providers
        $this->app->singleton('request', function () {
            return Request::create('http://localhost', 'GET');
        });
    }
}
