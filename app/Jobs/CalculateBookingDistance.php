<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\DriverLocation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class CalculateBookingDistance implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    protected $booking;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Only calculate for completed bookings without distance
        if ($this->booking->status !== 'completed' || $this->booking->distance_traveled > 0) {
            return;
        }

        try {
            // Get the route distance either from GPS data or API
            if ($this->hasLocationHistory()) {
                $this->calculateFromLocationHistory();
            } else {
                $this->calculateFromDirectionsAPI();
            }

            // Update the price based on the distance
            $this->updateBookingPrice();

            Log::info('Booking distance calculated', [
                'booking_id' => $this->booking->id,
                'distance' => $this->booking->distance_traveled,
                'updated_price' => $this->booking->final_price
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to calculate booking distance', [
                'booking_id' => $this->booking->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Check if we have location history for this trip.
     *
     * @return bool
     */
    private function hasLocationHistory(): bool
    {
        // Check if we have driver location history for this booking
        if (!$this->booking->driver_id) {
            return false;
        }

        $count = DriverLocation::where('driver_id', $this->booking->driver_id)
            ->where('timestamp', '>=', $this->booking->created_at)
            ->where('timestamp', '<=', $this->booking->completion_time ?? now())
            ->count();

        return $count > 1; // Need at least 2 points to calculate distance
    }

    /**
     * Calculate distance from driver location history.
     *
     * @return void
     */
    private function calculateFromLocationHistory(): void
    {
        // Get driver location points during this trip
        $locations = DriverLocation::where('driver_id', $this->booking->driver_id)
            ->where('timestamp', '>=', $this->booking->created_at)
            ->where('timestamp', '<=', $this->booking->completion_time ?? now())
            ->orderBy('timestamp')
            ->get();

        // Calculate total distance from location points
        $totalDistance = 0;
        $prevLocation = null;

        foreach ($locations as $location) {
            if ($prevLocation) {
                $totalDistance += $this->calculateDistance(
                    $prevLocation->latitude,
                    $prevLocation->longitude,
                    $location->latitude,
                    $location->longitude
                );
            }
            $prevLocation = $location;
        }

        // Update the booking with calculated distance
        $this->booking->distance_traveled = $totalDistance;
        $this->booking->save();
    }

    /**
     * Calculate distance using a directions API (simulated).
     *
     * @return void
     */
    private function calculateFromDirectionsAPI(): void
    {
        // In a real application, this would call a maps API
        // For demonstration, we'll calculate straight-line distance

        // Check if we have coordinates for pickup and destination
        if (!$this->booking->pickup_latitude || !$this->booking->destination_latitude) {
            // Fallback to a reasonable estimate based on addresses
            $estimatedDistance = 5.0; // Default to 5 km
            
            // Update booking with estimated distance
            $this->booking->distance_traveled = $estimatedDistance;
            $this->booking->is_distance_estimated = true;
            $this->booking->save();
            
            return;
        }

        // Calculate direct distance between pickup and destination
        $distance = $this->calculateDistance(
            $this->booking->pickup_latitude,
            $this->booking->pickup_longitude,
            $this->booking->destination_latitude,
            $this->booking->destination_longitude
        );

        // Apply a multiplier to account for road routes (not straight lines)
        // Typically roads are 20-30% longer than straight lines
        $roadMultiplier = 1.3;
        $estimatedRoadDistance = $distance * $roadMultiplier;

        // Update booking with calculated distance
        $this->booking->distance_traveled = $estimatedRoadDistance;
        $this->booking->is_distance_estimated = true;
        $this->booking->save();
    }

    /**
     * Update the booking price based on the calculated distance.
     *
     * @return void
     */
    private function updateBookingPrice(): void
    {
        // If we already have a final price, don't recalculate
        if ($this->booking->final_price > 0) {
            return;
        }

        // Get base price from booking
        $basePrice = $this->booking->base_price ?? 0;
        
        // Calculate price based on distance
        // In a real application, you would use a more complex pricing model
        $pricePerKm = 2.5; // $2.50 per kilometer
        $distancePrice = $this->booking->distance_traveled * $pricePerKm;
        
        // Add any additional fees
        $additionalFees = $this->booking->additional_fees ?? 0;
        
        // Calculate total price
        $totalPrice = $basePrice + $distancePrice + $additionalFees;
        
        // Apply any discounts
        $discount = $this->booking->discount_amount ?? 0;
        $finalPrice = max(0, $totalPrice - $discount);
        
        // Update booking with final price
        $this->booking->per_km_rate = $pricePerKm;
        $this->booking->distance_price = $distancePrice;
        $this->booking->final_price = $finalPrice;
        $this->booking->save();
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
