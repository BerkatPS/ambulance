<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DriverMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated via driver guard
        if (!Auth::guard('driver')->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized. Driver access required.'], 403);
            }
            
            return redirect()->route('driver.login')
                ->with('error', 'You must be logged in as a driver to access this page.');
        }
        
        // Check driver status
        $driver = Auth::guard('driver')->user();
        
        // If driver account is inactive, suspended, or blocked
        if (!in_array($driver->status, ['active', 'on_duty', 'available'])) {
            Auth::guard('driver')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Driver account is inactive or suspended.'], 403);
            }
            
            return redirect()->route('driver.login')
                ->with('error', 'Your driver account is ' . $driver->status . '. Please contact the administrator.');
        }
        
        // Store driver information for the view
        view()->share('driver', $driver);
        
        return $next($request);
    }
}
