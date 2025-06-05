<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ApiAuthentication
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
        // Check for API token in header
        $token = $request->header('X-API-Token');
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'API token is missing'
            ], 401);
        }
        
        // Validate the token against your database or authentication service
        // For demonstration, we'll use a simple config value
        $validApiTokens = config('services.api.tokens', []);
        
        if (!in_array($token, $validApiTokens)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid API token'
            ], 401);
        }
        
        return $next($request);
    }
}
