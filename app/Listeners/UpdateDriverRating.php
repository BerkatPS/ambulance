<?php

namespace App\Listeners;

use App\Events\RatingSubmitted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateDriverRating implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  RatingSubmitted  $event
     * @return void
     */
    public function handle(RatingSubmitted $event)
    {
        $rating = $event->rating;
        $booking = $event->booking;
        
        // Only proceed if there is a driver assigned to the booking
        if (!$booking->driver_id) {
            Log::info('No driver to update rating for', [
                'booking_id' => $booking->id,
                'rating_id' => $rating->id,
            ]);
            return;
        }
        
        $driver = $booking->driver;
        
        Log::info('Processing driver rating update', [
            'driver_id' => $driver->id,
            'booking_id' => $booking->id,
            'rating_id' => $rating->id,
            'driver_rating' => $rating->driver_rating,
        ]);
        
        try {
            // Calculate new rating statistics
            $this->updateDriverRatingStatistics($driver, $rating->driver_rating);
            
            Log::info('Driver rating updated successfully', [
                'driver_id' => $driver->id,
                'previous_rating' => $driver->average_rating,
                'new_rating' => $driver->average_rating,
                'total_ratings' => $driver->total_ratings,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update driver rating', [
                'driver_id' => $driver->id,
                'rating_id' => $rating->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
    
    /**
     * Update driver rating statistics.
     *
     * @param  \App\Models\Driver  $driver
     * @param  int  $newRating
     * @return void
     */
    private function updateDriverRatingStatistics($driver, int $newRating): void
    {
        // Update rating in a database transaction
        DB::transaction(function () use ($driver, $newRating) {
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
            
            // Track rating distribution (optional)
            $this->updateRatingDistribution($driver, $newRating);
            
            $driver->save();
        });
    }
    
    /**
     * Update the driver's rating distribution.
     *
     * @param  \App\Models\Driver  $driver
     * @param  int  $newRating
     * @return void
     */
    private function updateRatingDistribution($driver, int $newRating): void
    {
        // Get current distribution or initialize
        $distribution = $driver->rating_distribution ?? [
            '1' => 0,
            '2' => 0,
            '3' => 0,
            '4' => 0,
            '5' => 0,
        ];
        
        // Increment count for this rating
        $distribution[(string)$newRating]++;
        
        // Save updated distribution
        $driver->rating_distribution = $distribution;
    }
}
