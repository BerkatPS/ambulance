<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        // Check if request is for admin routes
        if ($request->is('admin*')) {
            return route('admin.login');
        }

        // Check if request is for driver routes
        if ($request->is('driver*')) {
            return route('driver.login');
        }

        return route('login');
    }
}
