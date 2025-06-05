<?php

namespace App\Http\Middleware;

use App\Jobs\UpdateDriverLocation;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TrackLocationMiddleware
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
        $response = $next($request);
        
        // Only track location for driver users
        if (Auth::guard('driver')->check()) {
            $driver = Auth::guard('driver')->user();
            
            // If the request contains location data
            if ($request->has(['latitude', 'longitude'])) {
                // Update driver's current location in database
                $driver->current_latitude = $request->latitude;
                $driver->current_longitude = $request->longitude;
                $driver->location_updated_at = now();
                $driver->save();
                
                // Dispatch job to update any active bookings with this driver
                if ($driver->status === 'on_duty' && $driver->active_booking_id) {
                    UpdateDriverLocation::dispatch($driver, $request->latitude, $request->longitude);
                }
            }
        }
        
        return $response;
    }
}
