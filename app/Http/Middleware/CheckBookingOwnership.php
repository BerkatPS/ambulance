<?php

namespace App\Http\Middleware;

use App\Models\Booking;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckBookingOwnership
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
        // Get the booking ID from the route parameters
        $bookingId = $request->route('booking');
        
        // If the booking ID is an actual Booking model instance, get its ID
        if ($bookingId instanceof Booking) {
            $bookingId = $bookingId->id;
        }
        
        // Find the booking
        $booking = Booking::findOrFail($bookingId);
        
        // Check if the authenticated user owns this booking
        if (Auth::id() !== $booking->user_id) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'You do not have permission to access this booking.'], 403);
            }
            
            return redirect()->route('bookings.index')
                ->with('error', 'You do not have permission to access this booking.');
        }
        
        // Add the booking to the request for easy access in the controller
        $request->merge(['booking' => $booking]);
        
        return $next($request);
    }
}
