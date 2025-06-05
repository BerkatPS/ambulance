<?php

namespace App\Jobs;

use App\Models\Driver;
use App\Models\DriverLocation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateDriverLocation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The driver instance.
     *
     * @var \App\Models\Driver
     */
    protected $driver;

    /**
     * The latitude.
     *
     * @var float
     */
    protected $latitude;

    /**
     * The longitude.
     *
     * @var float
     */
    protected $longitude;

    /**
     * The accuracy in meters.
     *
     * @var float|null
     */
    protected $accuracy;

    /**
     * The driver's current speed in km/h.
     *
     * @var float|null
     */
    protected $speed;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Driver  $driver
     * @param  float  $latitude
     * @param  float  $longitude
     * @param  float|null  $accuracy
     * @param  float|null  $speed
     * @return void
     */
    public function __construct(Driver $driver, float $latitude, float $longitude, ?float $accuracy = null, ?float $speed = null)
    {
        $this->driver = $driver;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->accuracy = $accuracy;
        $this->speed = $speed;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Create a new driver location record
            DriverLocation::create([
                'driver_id' => $this->driver->id,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'accuracy' => $this->accuracy,
                'speed' => $this->speed,
                'timestamp' => now(),
            ]);

            // Update the driver's current location
            $this->driver->current_latitude = $this->latitude;
            $this->driver->current_longitude = $this->longitude;
            $this->driver->last_location_update = now();
            $this->driver->save();

            // If the driver is currently assigned to a booking in progress,
            // we could update the estimated arrival time based on the new location
            $this->updateEstimatedArrivalForActiveBookings();

            Log::info('Driver location updated', [
                'driver_id' => $this->driver->id,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update driver location', [
                'driver_id' => $this->driver->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update estimated arrival time for active bookings.
     *
     * @return void
     */
    private function updateEstimatedArrivalForActiveBookings()
    {
        // Get active bookings for this driver
        $activeBookings = $this->driver->activeBookings;

        foreach ($activeBookings as $booking) {
            // Only update if booking is in "dispatched" or "in_progress" status
            if (in_array($booking->status, ['dispatched', 'in_progress'])) {
                // In a real application, we'd use a distance matrix API to calculate ETA
                // For simplicity, we'll calculate a rough straight-line distance and ETA
                $destinationLat = $booking->status === 'dispatched' 
                    ? $booking->pickup_latitude 
                    : $booking->destination_latitude;
                
                $destinationLng = $booking->status === 'dispatched' 
                    ? $booking->pickup_longitude 
                    : $booking->destination_longitude;
                
                // Calculate distance in kilometers
                $distance = $this->calculateDistance(
                    $this->latitude, 
                    $this->longitude, 
                    $destinationLat, 
                    $destinationLng
                );
                
                // Assume average speed of 40 km/h for estimation, or use actual speed if available
                $speed = $this->speed ?? 40;
                
                // Calculate ETA in minutes
                $etaMinutes = ($distance / $speed) * 60;
                
                // Update booking with new ETA
                $booking->estimated_arrival_time = now()->addMinutes(ceil($etaMinutes));
                $booking->save();
                
                Log::info('Updated estimated arrival time', [
                    'booking_id' => $booking->id,
                    'driver_id' => $this->driver->id,
                    'distance_km' => $distance,
                    'eta_minutes' => $etaMinutes,
                    'new_eta' => $booking->estimated_arrival_time,
                ]);
            }
        }
    }

    /**
     * Calculate the distance between two points using the Haversine formula.
     *
     * @param  float  $lat1
     * @param  float  $lon1
     * @param  float  $lat2
     * @param  float  $lon2
     * @return float  Distance in kilometers
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        // Earth's radius in kilometers
        $earthRadius = 6371;
        
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * 
             sin($dLon/2) * sin($dLon/2);
             
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        
        return $earthRadius * $c; // Distance in kilometers
    }
}
