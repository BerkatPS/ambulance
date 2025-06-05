<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiKeyAuthentication
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
        $apiKey = $request->header('X-API-KEY');
        
        // In a production app, you would store this in the .env file
        // and retrieve it using env('API_KEY')
        $validApiKey = config('services.api.key', 'ambulance-portal-webhook-key');
        
        if (!$apiKey || $apiKey !== $validApiKey) {
            Log::warning('Invalid API key attempt', [
                'ip' => $request->ip(),
                'path' => $request->path(),
                'key_provided' => $apiKey ? 'Yes' : 'No'
            ]);
            
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid API key'
            ], 401);
        }
        
        return $next($request);
    }
}
