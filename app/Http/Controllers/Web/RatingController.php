<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RatingController extends Controller
{
    /**
     * Display the rating form for a completed booking.
     *
     * @param  int  $bookingId
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function create($bookingId)
    {
        $booking = Booking::where('user_id', Auth::id())
            ->findOrFail($bookingId);
            
        // Check if the booking is completed
        if ($booking->status !== 'completed') {
            return redirect()->route('booking.show', $bookingId)
                ->with('error', 'You can only rate completed bookings.');
        }
        
        // Check if rating already exists
        $existingRating = Rating::where('booking_id', $bookingId)->first();
        if ($existingRating) {
            return redirect()->route('booking.show', $bookingId)
                ->with('info', 'You have already rated this booking.');
        }
        
        return Inertia::render('Rating/Create', [
            'booking' => $booking
        ]);
    }
    
    /**
     * Store a newly created rating in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $bookingId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $bookingId)
    {
        $booking = Booking::where('user_id', Auth::id())
            ->where('status', 'completed')
            ->findOrFail($bookingId);
            
        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string|max:500',
            'driver_rating' => 'required|integer|min:1|max:5',
            'ambulance_rating' => 'required|integer|min:1|max:5',
            'service_rating' => 'required|integer|min:1|max:5',
        ]);
        
        // Check if rating already exists
        if (Rating::where('booking_id', $bookingId)->exists()) {
            return redirect()->route('booking.show', $bookingId)
                ->with('error', 'You have already rated this booking.');
        }
        
        $rating = new Rating();
        $rating->booking_id = $booking->id;
        $rating->user_id = Auth::id();
        $rating->stars = $validated['stars'];
        $rating->comments = $validated['comments'];
        $rating->driver_rating = $validated['driver_rating'];
        $rating->ambulance_rating = $validated['ambulance_rating'];
        $rating->service_rating = $validated['service_rating'];
        $rating->save();
        
        return redirect()->route('booking.show', $bookingId)
            ->with('success', 'Thank you for your feedback!');
    }
    
    /**
     * Update an existing rating.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $ratingId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $ratingId)
    {
        $rating = Rating::whereHas('booking', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($ratingId);
        
        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string|max:500',
            'driver_rating' => 'required|integer|min:1|max:5',
            'ambulance_rating' => 'required|integer|min:1|max:5',
            'service_rating' => 'required|integer|min:1|max:5',
        ]);
        
        $rating->stars = $validated['stars'];
        $rating->comments = $validated['comments'];
        $rating->driver_rating = $validated['driver_rating'];
        $rating->ambulance_rating = $validated['ambulance_rating'];
        $rating->service_rating = $validated['service_rating'];
        $rating->save();
        
        return redirect()->route('booking.show', $rating->booking_id)
            ->with('success', 'Your rating has been updated.');
    }
}
