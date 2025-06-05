<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is logged in
        if (Auth::check()) {
            $user = Auth::user();
            
            // If this is the dashboard route, redirect based on role
            if ($request->routeIs('dashboard')) {
                // Check if user is an admin
                if ($user->is_admin) {
                    return redirect()->route('admin.dashboard');
                }
                
                // Regular user
                return redirect()->route('user.dashboard');
            }
        }
        
        // If auth guard is driver
        if (Auth::guard('driver')->check()) {
            if ($request->routeIs('dashboard')) {
                return redirect()->route('driver.dashboard');
            }
        }
        
        return $next($request);
    }
}
