<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Ambulance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RatingController extends Controller
{
    /**
     * Display a listing of the ratings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Rating::with(['booking', 'user', 'booking.ambulance', 'booking.driver']);
        
        // Filter by overall rating
        if ($request->has('stars') && $request->stars) {
            $query->where('overall', $request->stars);
        }
        
        // Filter by punctuality rating
        if ($request->has('driver_rating') && $request->driver_rating) {
            $query->where('punctuality', $request->driver_rating);
        }
        
        // Filter by vehicle condition rating
        if ($request->has('ambulance_rating') && $request->ambulance_rating) {
            $query->where('vehicle_condition', $request->ambulance_rating);
        }
        
        // Filter by service rating
        if ($request->has('service_rating') && $request->service_rating) {
            $query->where('service', $request->service_rating);
        }
        
        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Search by comment
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('comment', 'like', "%{$search}%");
        }
        
        // Map 'rating' sort field to 'overall' which is the actual column name
        $sortBy = $request->sort_by ?? 'created_at';
        if ($sortBy === 'rating') {
            $sortBy = 'overall';
        }
        
        $ratings = $query->orderBy($sortBy, $request->sort_order ?? 'desc')
            ->paginate($request->per_page ?? 15)
            ->appends($request->all());
        
        return Inertia::render('Admin/Ratings/Index', [
            'ratings' => $ratings,
            'filters' => [
                'stars' => $request->stars,
                'driver_rating' => $request->driver_rating,
                'ambulance_rating' => $request->ambulance_rating,
                'service_rating' => $request->service_rating,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_order' => $request->sort_order,
                'per_page' => $request->per_page,
            ],
            'filterOptions' => [
                'ratingOptions' => [
                    ['value' => 1, 'label' => '1 Star'],
                    ['value' => 2, 'label' => '2 Stars'],
                    ['value' => 3, 'label' => '3 Stars'],
                    ['value' => 4, 'label' => '4 Stars'],
                    ['value' => 5, 'label' => '5 Stars'],
                ],
            ],
        ]);
    }

    /**
     * Display the specified rating.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $rating = Rating::with(['booking', 'user', 'booking.ambulance', 'booking.driver'])
            ->findOrFail($id);
        
        return Inertia::render('Admin/Ratings/Show', [
            'rating' => $rating,
        ]);
    }

    /**
     * Show the form for responding to a rating.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function respond($id)
    {
        $rating = Rating::findOrFail($id);
        
        return Inertia::render('Admin/Ratings/Respond', [
            'rating' => $rating,
        ]);
    }

    /**
     * Store an admin response to a rating.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeResponse(Request $request, $id)
    {
        $rating = Rating::findOrFail($id);
        
        $validated = $request->validate([
            'admin_response' => 'required|string|max:500',
        ]);
        
        $rating->admin_response = $validated['admin_response'];
        $rating->admin_response_date = now();
        $rating->save();
        
        return redirect()->route('admin.ratings.show', $rating->id)
            ->with('success', 'Response added successfully.');
    }

    /**
     * Remove a rating from the system.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $rating = Rating::findOrFail($id);
        $rating->delete();
        
        return redirect()->route('admin.ratings.index')
            ->with('success', 'Rating removed successfully.');
    }

    /**
     * Display the ratings dashboard with analytics.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Get overall rating statistics
        $overallStats = [
            'averageRating' => Rating::avg('overall'),
            'averageDriverRating' => Rating::avg('punctuality'),
            'averageAmbulanceRating' => Rating::avg('vehicle_condition'),
            'averageServiceRating' => Rating::avg('service'),
            'total' => Rating::count(),
            'fiveStars' => Rating::where('overall', 5)->count(),
            'fourStars' => Rating::where('overall', 4)->count(),
            'threeStars' => Rating::where('overall', 3)->count(),
            'twoStars' => Rating::where('overall', 2)->count(),
            'oneStar' => Rating::where('overall', 1)->count(),
        ];
        
        // Get distribution of ratings
        $ratingDistribution = [
            ['rating' => '5 Stars', 'count' => $overallStats['fiveStars']],
            ['rating' => '4 Stars', 'count' => $overallStats['fourStars']],
            ['rating' => '3 Stars', 'count' => $overallStats['threeStars']],
            ['rating' => '2 Stars', 'count' => $overallStats['twoStars']],
            ['rating' => '1 Star', 'count' => $overallStats['oneStar']],
        ];
        
        // Get top rated drivers
        $topDrivers = Driver::select('drivers.id', 'drivers.name')
            ->selectRaw('AVG(ratings.punctuality) as average_rating')
            ->selectRaw('COUNT(ratings.id) as rating_count')
            ->join('ambulances', 'drivers.id', '=', 'ambulances.driver_id')
            ->join('bookings', 'ambulances.id', '=', 'bookings.ambulance_id')
            ->join('ratings', 'bookings.id', '=', 'ratings.booking_id')
            ->groupBy('drivers.id', 'drivers.name')
            ->having('rating_count', '>=', 3) // Minimum 3 ratings to be considered
            ->orderBy('average_rating', 'desc')
            ->take(5)
            ->get();
        
        // Get top rated ambulances
        $topAmbulances = Ambulance::select('ambulances.id', 'ambulances.vehicle_number', 'ambulances.vehicle_model')
            ->selectRaw('AVG(ratings.vehicle_condition) as average_rating')
            ->selectRaw('COUNT(ratings.id) as rating_count')
            ->join('bookings', 'ambulances.id', '=', 'bookings.ambulance_id')
            ->join('ratings', 'bookings.id', '=', 'ratings.booking_id')
            ->groupBy('ambulances.id', 'ambulances.vehicle_number', 'ambulances.vehicle_model')
            ->having('rating_count', '>=', 3) // Minimum 3 ratings to be considered
            ->orderBy('average_rating', 'desc')
            ->take(5)
            ->get();
        
        // Get recent ratings
        $recentRatings = Rating::with(['booking', 'user', 'booking.ambulance', 'booking.driver'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        
        // Get monthly rating averages for chart
        $monthlyRatings = Rating::selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, AVG(overall) as average_rating')
            ->whereYear('created_at', '>=', now()->subYear())
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)),
                    'average' => round($item->average_rating, 1)
                ];
            });
        
        return Inertia::render('Admin/Ratings/Dashboard', [
            'overallStats' => $overallStats,
            'ratingDistribution' => $ratingDistribution,
            'topDrivers' => $topDrivers,
            'topAmbulances' => $topAmbulances,
            'recentRatings' => $recentRatings,
            'monthlyRatings' => $monthlyRatings,
        ]);
    }
}
