<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Driver;
use App\Models\Rating;
use App\Models\Ambulance;

class UpdateDriverRatings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-driver-ratings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all driver ratings based on recent feedback';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting driver ratings update...');
        
        $drivers = Driver::all();
        $updateCount = 0;
        
        foreach ($drivers as $driver) {
            // Find the ambulance(s) associated with this driver
            $ambulanceIds = Ambulance::where('driver_id', $driver->id)->pluck('id')->toArray();
            
            if (empty($ambulanceIds)) {
                $this->line("Driver {$driver->name} (ID: {$driver->id}) has no assigned ambulance, skipping...");
                continue;
            }
            
            // Find all ratings for bookings with these ambulances
            $ratings = Rating::whereHas('booking', function ($query) use ($ambulanceIds) {
                $query->whereIn('ambulance_id', $ambulanceIds);
            })->get();
            
            if ($ratings->isEmpty()) {
                $this->line("Driver {$driver->name} (ID: {$driver->id}) has no ratings yet, skipping...");
                continue;
            }
            
            // Calculate average driver rating
            $avgDriverRating = $ratings->avg('driver_rating');
            
            // Calculate overall rating (weighted average of driver_rating (70%) and service_rating (30%))
            $avgOverallRating = ($ratings->avg('driver_rating') * 0.7) + ($ratings->avg('service_rating') * 0.3);
            
            // Update driver ratings
            $driver->average_rating = round($avgDriverRating, 1);
            $driver->overall_rating = round($avgOverallRating, 1);
            $driver->total_ratings = $ratings->count();
            $driver->last_rating_update = now();
            $driver->save();
            
            $this->info("Updated ratings for driver {$driver->name} (ID: {$driver->id}): " . 
                        "Avg: {$driver->average_rating}, Overall: {$driver->overall_rating}, " . 
                        "Total: {$driver->total_ratings}");
            
            $updateCount++;
        }
        
        $this->info("Driver ratings update completed. Updated {$updateCount} drivers.");
        
        return Command::SUCCESS;
    }
}
