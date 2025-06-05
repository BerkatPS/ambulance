<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RatingController extends Controller
{
    /**
     * Display a listing of the driver ratings.
     */
    public function index(Request $request)
    {
        $driver = Auth::guard('driver')->user();
        
        $query = Rating::with(['booking', 'user'])
            ->where('driver_id', $driver->id);
        
        // Apply filters
        if ($request->filled('rating')) {
            $query->where('overall', $request->rating);
        }
        
        if ($request->filled('date_from')) {
            $query->whereHas('booking', function ($q) use ($request) {
                $q->whereDate('completed_at', '>=', $request->date_from);
            });
        }
        
        if ($request->filled('date_to')) {
            $query->whereHas('booking', function ($q) use ($request) {
                $q->whereDate('completed_at', '<=', $request->date_to);
            });
        }
        
        // Get paginated results
        $ratings = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        // Calculate rating summary
        $summary = [
            'total_ratings' => Rating::where('driver_id', $driver->id)->count(),
            'average_overall' => (float) Rating::where('driver_id', $driver->id)->avg('overall') ?: 0,
            'average_punctuality' => (float) Rating::where('driver_id', $driver->id)->avg('punctuality') ?: 0,
            'average_service' => (float) Rating::where('driver_id', $driver->id)->avg('service') ?: 0,
            'average_vehicle' => (float) Rating::where('driver_id', $driver->id)->avg('vehicle_condition') ?: 0,
            'rating_distribution' => [
                '5' => Rating::where('driver_id', $driver->id)->where('overall', 5)->count(),
                '4' => Rating::where('driver_id', $driver->id)->where('overall', 4)->count(),
                '3' => Rating::where('driver_id', $driver->id)->where('overall', 3)->count(),
                '2' => Rating::where('driver_id', $driver->id)->where('overall', 2)->count(),
                '1' => Rating::where('driver_id', $driver->id)->where('overall', 1)->count(),
            ]
        ];
        
        return Inertia::render('Driver/Ratings/Index', [
            'ratings' => $ratings,
            'summary' => $summary,
            'filters' => $request->only(['rating', 'date_from', 'date_to']),
        ]);
    }
}
