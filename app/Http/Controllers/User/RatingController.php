<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RatingController extends Controller
{
    /**
     * Display a listing of the user's ratings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $ratings = Rating::where('user_id', $user->id)
            ->with(['booking' => function($query) {
                $query->select('id', 'booking_code', 'type', 'scheduled_at', 'status', 'pickup_address', 'destination_address');
            }, 'driver' => function($query) {
                $query->select('id', 'name', 'phone');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);
            
        // Transform ratings data to include formatted dates and ensure no blank data
        $formattedRatings = $ratings->through(function ($rating) {
            $rating->formatted_date = $rating->created_at ? date('M d, Y', strtotime($rating->created_at)) : 'N/A';
            $rating->driver_name = $rating->driver->name ?? 'Unknown Driver';
            $rating->booking_code = $rating->booking->booking_code ?? ('Booking #' . $rating->booking_id);
            $rating->service_type = $rating->booking->type ?? 'Standard';
            $rating->trip_date = $rating->booking->scheduled_at ? date('M d, Y', strtotime($rating->booking->scheduled_at)) : 'N/A';
            
            return $rating;
        });
        
        return Inertia::render('User/Ratings/Index', [
            'ratings' => $formattedRatings,
        ]);
    }

    /**
     * Show the form for creating a new rating.
     *
     * @param  int  $id
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function create($id)
    {
        $user = request()->user();
        
        // Mencari booking berdasarkan ID
        $booking = Booking::where('id', $id)
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereNotNull('driver_id')
            ->firstOrFail();
        
        // Check if booking has already been rated
        $existingRating = Rating::where('booking_id', $booking->id)->first();
        if ($existingRating) {
            return redirect()->route('user.ratings.show', $existingRating->id)
                ->with('error', 'Anda sudah memberikan penilaian untuk pemesanan ini.');
        }
        
        $driver = Driver::find($booking->driver_id);
        
        return Inertia::render('User/Ratings/Create', [
            'booking' => $booking,
            'driver' => $driver,
        ]);
    }

    /**
     * Store a newly created rating in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'driver_id' => 'required|exists:drivers,id',
            'rating' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string|max:500',
            'punctuality' => 'nullable|integer|min:1|max:5',
            'service' => 'nullable|integer|min:1|max:5',
            'vehicle_condition' => 'nullable|integer|min:1|max:5',
        ]);
        
        $user = $request->user();
        
        // Verify that the booking belongs to the user
        $booking = Booking::where('id', $validated['booking_id'])
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->firstOrFail();
        
        // Check if booking has already been rated
        $existingRating = Rating::where('booking_id', $booking->id)->first();
        if ($existingRating) {
            return redirect()->route('user.ratings.show', $existingRating->id)
                ->with('error', 'Anda sudah memberikan penilaian untuk pemesanan ini.');
        }
        
        // Create the rating - ensuring field names match the database schema
        $rating = new Rating();
        $rating->booking_id = $validated['booking_id'];
        $rating->user_id = $user->id;
        $rating->driver_id = $validated['driver_id']; // Use driver_id column instead of rated_user_id
        $rating->rating = $validated['rating']; 
        $rating->comments = $validated['comments'];
        $rating->punctuality = $validated['punctuality'] ?? null;
        $rating->service = $validated['service'] ?? null;
        $rating->vehicle_condition = $validated['vehicle_condition'] ?? null;
        
        $rating->save();
        
        // Update driver's average rating
        $driver = Driver::find($validated['driver_id']);
        $avgRating = Rating::where('driver_id', $driver->id)->avg('rating') ?: 0;
        $driver->rating = $avgRating;
        $driver->save();
        
        return redirect()->route('user.bookings.show', $booking->id)
            ->with('success', 'Terima kasih atas penilaian Anda!');
    }

    /**
     * Display the specified rating.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = request()->user();
        
        // Fetch rating with complete related data to avoid blanks
        $rating = Rating::where('id', $id)
            ->where('user_id', $user->id)
            ->with([
                'booking' => function($query) {
                    $query->with(['ambulance', 'driver']);  // Include ambulance information
                },
                'driver',
                'user'
            ])
            ->firstOrFail();
        
        // Ensure we have necessary values for display
        $data = [
            'rating' => array_merge($rating->toArray(), [
                'formatted_date' => $rating->created_at ? date('M d, Y', strtotime($rating->created_at)) : date('M d, Y'),
                'category' => 'General', // Default category for all ratings
                'detailed_ratings' => [
                    ['name' => 'Overall', 'value' => $rating->rating ?? 0],
                    ['name' => 'Punctuality', 'value' => $rating->punctuality ?? 0],
                    ['name' => 'Service', 'value' => $rating->service ?? 0],
                    ['name' => 'Vehicle Condition', 'value' => $rating->vehicle_condition ?? 0],
                ]
            ])
        ];
        
        return Inertia::render('User/Ratings/Show', $data);
    }

    /**
     * Show the form for editing the specified rating.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $user = request()->user();
        
        $rating = Rating::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['booking', 'driver'])
            ->firstOrFail();
        
        // Only allow editing within 24 hours of the rating
        $ratingCreated = new \DateTime($rating->created_at);
        $now = new \DateTime();
        $diff = $now->diff($ratingCreated);
        
        if ($diff->days > 0) {
            return redirect()->route('user.ratings.show', $rating->id)
                ->with('error', 'Penilaian hanya dapat diedit dalam 24 jam setelah pengiriman.');
        }
        
        return Inertia::render('User/Ratings/Edit', [
            'rating' => $rating,
            'booking' => $rating->booking,
            'driver' => $rating->driver,
        ]);
    }

    /**
     * Update the specified rating in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string|max:500',
            'punctuality' => 'nullable|integer|min:1|max:5',
            'service' => 'nullable|integer|min:1|max:5',
            'vehicle_condition' => 'nullable|integer|min:1|max:5',
        ]);
        
        $user = $request->user();
        $rating = Rating::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        // Only allow editing within 24 hours of the rating
        $ratingCreated = new \DateTime($rating->created_at);
        $now = new \DateTime();
        $diff = $now->diff($ratingCreated);
        
        if ($diff->days > 0) {
            return back()->with('error', 'Penilaian hanya dapat diedit dalam 24 jam setelah pengiriman.');
        }
        
        // Update the rating
        $rating->rating = $validated['rating'];
        $rating->comments = $validated['comments'];
        $rating->punctuality = $validated['punctuality'] ?? null;
        $rating->service = $validated['service'] ?? null;
        $rating->vehicle_condition = $validated['vehicle_condition'] ?? null;
        $rating->save();
        
        // Update driver's average rating
        $driver = Driver::find($rating->driver_id);
        $avgRating = Rating::where('driver_id', $driver->id)->avg('rating') ?: 0;
        $driver->rating = $avgRating;
        $driver->save();
        
        return redirect()->route('user.ratings.show', $rating->id)
            ->with('success', 'Penilaian berhasil diperbarui!');
    }

    /**
     * Remove the specified rating from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $user = request()->user();
        $rating = Rating::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        // Only allow deletion within 24 hours of the rating
        $ratingCreated = new \DateTime($rating->created_at);
        $now = new \DateTime();
        $diff = $now->diff($ratingCreated);
        
        if ($diff->days > 0) {
            return back()->with('error', 'Penilaian hanya dapat dihapus dalam 24 jam setelah pengiriman.');
        }
        
        // Get driver before deleting rating
        $driver = Driver::find($rating->driver_id);
        
        $rating->delete();
        
        // Update driver's average rating
        if ($driver) {
            $avgRating = Rating::where('driver_id', $driver->id)->avg('rating') ?: 0;
            $driver->rating = $avgRating;
            $driver->save();
        }
        
        return redirect()->route('user.ratings.index')
            ->with('success', 'Penilaian berhasil dihapus!');
    }
}
