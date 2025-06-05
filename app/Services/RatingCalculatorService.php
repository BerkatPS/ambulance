<?php

namespace App\Services;

use App\Models\Driver;
use App\Models\Rating;
use App\Models\Ambulance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RatingCalculatorService
{
    /**
     * Calculate and update driver rating.
     *
     * @param  \App\Models\Driver  $driver
     * @param  float|null  $newRating
     * @return float Updated average rating
     */
    public function updateDriverRating(Driver $driver, ?float $newRating = null): float
    {
        try {
            DB::beginTransaction();

            // If a new rating is provided, include it in the calculation
            if ($newRating !== null) {
                $this->updateRatingStatistics($driver, $newRating);
            } else {
                // Recalculate from all ratings
                $this->recalculateDriverRating($driver);
            }

            DB::commit();

            return $driver->average_rating;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating driver rating', [
                'driver_id' => $driver->id,
                'error' => $e->getMessage()
            ]);

            // Return current rating if update failed
            return $driver->average_rating ?? 0;
        }
    }

    /**
     * Calculate and update ambulance rating.
     *
     * @param  \App\Models\Ambulance  $ambulance
     * @param  float|null  $newRating
     * @return float Updated average rating
     */
    public function updateAmbulanceRating(Ambulance $ambulance, ?float $newRating = null): float
    {
        try {
            DB::beginTransaction();

            // If a new rating is provided, include it in the calculation
            if ($newRating !== null) {
                $this->updateAmbulanceRatingStatistics($ambulance, $newRating);
            } else {
                // Recalculate from all ratings
                $this->recalculateAmbulanceRating($ambulance);
            }

            DB::commit();

            return $ambulance->average_rating;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating ambulance rating', [
                'ambulance_id' => $ambulance->id,
                'error' => $e->getMessage()
            ]);

            // Return current rating if update failed
            return $ambulance->average_rating ?? 0;
        }
    }

    /**
     * Calculate service quality rating from all ratings.
     *
     * @param  string  $timeFrame Options: 'all', 'month', 'week', 'day'
     * @return array Rating statistics
     */
    public function calculateServiceRating(string $timeFrame = 'all'): array
    {
        try {
            // Build query based on time frame
            $query = Rating::query();

            // Apply time frame filter
            switch ($timeFrame) {
                case 'month':
                    $query->where('created_at', '>=', now()->subMonth());
                    break;
                case 'week':
                    $query->where('created_at', '>=', now()->subWeek());
                    break;
                case 'day':
                    $query->where('created_at', '>=', now()->subDay());
                    break;
                default:
                    // 'all' - no time filter
                    break;
            }

            // Get aggregate ratings
            $aggregates = $query->selectRaw('
                AVG(stars) as overall_rating, 
                AVG(driver_rating) as avg_driver_rating, 
                AVG(ambulance_rating) as avg_ambulance_rating, 
                AVG(service_rating) as avg_service_rating,
                COUNT(*) as total_ratings
            ')->first();

            // Get rating distribution
            $distribution = $query->selectRaw('
                stars,
                COUNT(*) as count
            ')
            ->groupBy('stars')
            ->orderBy('stars', 'desc')
            ->get()
            ->pluck('count', 'stars')
            ->toArray();

            // Fill in missing stars
            for ($i = 1; $i <= 5; $i++) {
                if (!isset($distribution[$i])) {
                    $distribution[$i] = 0;
                }
            }
            ksort($distribution);

            return [
                'overall_rating' => round($aggregates->overall_rating ?? 0, 2),
                'driver_rating' => round($aggregates->avg_driver_rating ?? 0, 2),
                'ambulance_rating' => round($aggregates->avg_ambulance_rating ?? 0, 2),
                'service_rating' => round($aggregates->avg_service_rating ?? 0, 2),
                'total_ratings' => $aggregates->total_ratings ?? 0,
                'distribution' => $distribution,
                'time_frame' => $timeFrame
            ];
        } catch (\Exception $e) {
            Log::error('Error calculating service rating', [
                'time_frame' => $timeFrame,
                'error' => $e->getMessage()
            ]);

            // Return default values on error
            return [
                'overall_rating' => 0,
                'driver_rating' => 0,
                'ambulance_rating' => 0,
                'service_rating' => 0,
                'total_ratings' => 0,
                'distribution' => [
                    1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0
                ],
                'time_frame' => $timeFrame,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get driver performance statistics.
     *
     * @param  \App\Models\Driver  $driver
     * @param  string  $timeFrame Options: 'all', 'month', 'week', 'day'
     * @return array Performance statistics
     */
    public function getDriverPerformance(Driver $driver, string $timeFrame = 'all'): array
    {
        try {
            // Get time frame
            $startDate = null;
            switch ($timeFrame) {
                case 'month':
                    $startDate = now()->subMonth();
                    break;
                case 'week':
                    $startDate = now()->subWeek();
                    break;
                case 'day':
                    $startDate = now()->subDay();
                    break;
            }

            // Build booking query
            $bookingQuery = $driver->bookings();
            if ($startDate) {
                $bookingQuery->where('created_at', '>=', $startDate);
            }

            // Get booking statistics
            $totalBookings = $bookingQuery->count();
            $completedBookings = $bookingQuery->where('status', 'completed')->count();
            $cancelledBookings = $bookingQuery->where('status', 'cancelled')->count();

            // Calculate completion rate
            $completionRate = $totalBookings > 0 ? ($completedBookings / $totalBookings) * 100 : 0;

            // Get average response time (time between booking creation and pickup)
            $avgResponseTime = $driver->bookings()
                ->where('status', 'completed')
                ->whereNotNull('created_at')
                ->whereNotNull('pickup_time');
                
            if ($startDate) {
                $avgResponseTime->where('created_at', '>=', $startDate);
            }
            
            $avgResponseTime = $avgResponseTime->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, pickup_time)) as avg_response_time')
                ->first()
                ->avg_response_time ?? 0;

            // Get rating statistics
            $ratingQuery = Rating::whereHas('booking', function ($query) use ($driver) {
                $query->where('driver_id', $driver->id);
            });
            
            if ($startDate) {
                $ratingQuery->where('created_at', '>=', $startDate);
            }
            
            $ratingStats = $ratingQuery->selectRaw('
                AVG(driver_rating) as avg_rating,
                COUNT(*) as total_ratings
            ')->first();

            return [
                'driver_id' => $driver->id,
                'driver_name' => $driver->name,
                'time_frame' => $timeFrame,
                'total_bookings' => $totalBookings,
                'completed_bookings' => $completedBookings,
                'cancelled_bookings' => $cancelledBookings,
                'completion_rate' => round($completionRate, 2),
                'average_response_time' => round($avgResponseTime, 2),
                'average_rating' => round($ratingStats->avg_rating ?? 0, 2),
                'total_ratings' => $ratingStats->total_ratings ?? 0
            ];
        } catch (\Exception $e) {
            Log::error('Error calculating driver performance', [
                'driver_id' => $driver->id,
                'time_frame' => $timeFrame,
                'error' => $e->getMessage()
            ]);

            // Return default values on error
            return [
                'driver_id' => $driver->id,
                'driver_name' => $driver->name,
                'time_frame' => $timeFrame,
                'total_bookings' => 0,
                'completed_bookings' => 0,
                'cancelled_bookings' => 0,
                'completion_rate' => 0,
                'average_response_time' => 0,
                'average_rating' => 0,
                'total_ratings' => 0,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update rating statistics for a driver.
     *
     * @param  \App\Models\Driver  $driver
     * @param  float  $newRating
     * @return void
     */
    protected function updateRatingStatistics(Driver $driver, float $newRating): void
    {
        // Get current rating data
        $currentAverage = $driver->average_rating ?? 0;
        $totalRatings = $driver->total_ratings ?? 0;
        
        // Calculate new average
        if ($totalRatings > 0) {
            // Formula: new_avg = ((old_avg * total) + new_rating) / (total + 1)
            $newAverage = (($currentAverage * $totalRatings) + $newRating) / ($totalRatings + 1);
        } else {
            $newAverage = $newRating;
        }
        
        // Update driver record
        $driver->average_rating = round($newAverage, 2);
        $driver->total_ratings = $totalRatings + 1;
        
        // Track rating distribution
        $this->updateRatingDistribution($driver, $newRating);
        
        $driver->save();
    }

    /**
     * Update the driver's rating distribution.
     *
     * @param  \App\Models\Driver  $driver
     * @param  float  $newRating
     * @return void
     */
    protected function updateRatingDistribution(Driver $driver, float $newRating): void
    {
        // Get current distribution or initialize
        $distribution = $driver->rating_distribution ?? [
            '1' => 0,
            '2' => 0,
            '3' => 0,
            '4' => 0,
            '5' => 0,
        ];
        
        // Round rating to nearest integer for distribution
        $roundedRating = round($newRating);
        
        // Ensure rating is within valid range
        $roundedRating = max(1, min(5, $roundedRating));
        
        // Increment count for this rating
        $distribution[(string)$roundedRating]++;
        
        // Save updated distribution
        $driver->rating_distribution = $distribution;
    }

    /**
     * Recalculate a driver's rating from all ratings.
     *
     * @param  \App\Models\Driver  $driver
     * @return void
     */
    protected function recalculateDriverRating(Driver $driver): void
    {
        // Get all ratings for this driver
        $ratings = Rating::whereHas('booking', function ($query) use ($driver) {
            $query->where('driver_id', $driver->id);
        })->get();
        
        if ($ratings->isEmpty()) {
            $driver->average_rating = 0;
            $driver->total_ratings = 0;
            $driver->rating_distribution = [
                '1' => 0,
                '2' => 0,
                '3' => 0,
                '4' => 0,
                '5' => 0,
            ];
            $driver->save();
            return;
        }
        
        // Calculate average rating
        $averageRating = $ratings->avg('driver_rating');
        
        // Calculate rating distribution
        $distribution = [
            '1' => 0,
            '2' => 0,
            '3' => 0,
            '4' => 0,
            '5' => 0,
        ];
        
        foreach ($ratings as $rating) {
            $roundedRating = round($rating->driver_rating);
            $roundedRating = max(1, min(5, $roundedRating));
            $distribution[(string)$roundedRating]++;
        }
        
        // Update driver record
        $driver->average_rating = round($averageRating, 2);
        $driver->total_ratings = $ratings->count();
        $driver->rating_distribution = $distribution;
        $driver->save();
    }

    /**
     * Update rating statistics for an ambulance.
     *
     * @param  \App\Models\Ambulance  $ambulance
     * @param  float  $newRating
     * @return void
     */
    protected function updateAmbulanceRatingStatistics(Ambulance $ambulance, float $newRating): void
    {
        // Get current rating data
        $currentAverage = $ambulance->average_rating ?? 0;
        $totalRatings = $ambulance->total_ratings ?? 0;
        
        // Calculate new average
        if ($totalRatings > 0) {
            // Formula: new_avg = ((old_avg * total) + new_rating) / (total + 1)
            $newAverage = (($currentAverage * $totalRatings) + $newRating) / ($totalRatings + 1);
        } else {
            $newAverage = $newRating;
        }
        
        // Update ambulance record
        $ambulance->average_rating = round($newAverage, 2);
        $ambulance->total_ratings = $totalRatings + 1;
        $ambulance->save();
    }

    /**
     * Recalculate an ambulance's rating from all ratings.
     *
     * @param  \App\Models\Ambulance  $ambulance
     * @return void
     */
    protected function recalculateAmbulanceRating(Ambulance $ambulance): void
    {
        // Get all ratings for this ambulance
        $ratings = Rating::whereHas('booking', function ($query) use ($ambulance) {
            $query->where('ambulance_id', $ambulance->id);
        })->get();
        
        if ($ratings->isEmpty()) {
            $ambulance->average_rating = 0;
            $ambulance->total_ratings = 0;
            $ambulance->save();
            return;
        }
        
        // Calculate average rating
        $averageRating = $ratings->avg('ambulance_rating');
        
        // Update ambulance record
        $ambulance->average_rating = round($averageRating, 2);
        $ambulance->total_ratings = $ratings->count();
        $ambulance->save();
    }
}
