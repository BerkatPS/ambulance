<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
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
        // Check if user is authenticated via admin guard
        if (!Auth::guard('admin')->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            
            return redirect()->route('admin.login')
                ->with('error', 'You must be logged in as an administrator to access this page.');
        }
        
        // Get the authenticated admin
        $admin = Auth::guard('admin')->user();
        
        // Store admin information for the view
        view()->share('admin', $admin);
        
        return $next($request);
    }
}
