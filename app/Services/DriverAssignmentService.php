<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Driver;
use App\Models\Ambulance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DriverAssignmentService
{
    /**
     * The distance calculator service instance.
     *
     * @var \App\Services\DistanceCalculatorService
     */
    protected $distanceCalculator;

    /**
     * Create a new service instance.
     *
     * @param  \App\Services\DistanceCalculatorService  $distanceCalculator
     * @return void
     */
    public function __construct(DistanceCalculatorService $distanceCalculator)
    {
        $this->distanceCalculator = $distanceCalculator;
    }

    /**
     * Find the best available driver for a booking.
     *
     * @param  \App\Models\Booking  $booking
     * @return array [Driver|null, Ambulance|null]
     */
    public function findBestDriver(Booking $booking): array
    {
        try {
            // Ensure booking has pickup coordinates
            if (!$booking->pickup_latitude || !$booking->pickup_longitude) {
                Log::warning('Cannot find driver without pickup coordinates', [
                    'booking_id' => $booking->id
                ]);
                return [null, null];
            }

            // Get required ambulance type
            $ambulanceType = $booking->ambulance_type ?? 'basic';

            // Find available drivers nearby
            $nearbyDrivers = $this->distanceCalculator->findNearestDrivers(
                $booking->pickup_latitude,
                $booking->pickup_longitude,
                10, // Limit
                15, // Max distance in km
                $ambulanceType
            );

            if (empty($nearbyDrivers)) {
                Log::info('No nearby drivers found for booking', [
                    'booking_id' => $booking->id,
                    'pickup_lat' => $booking->pickup_latitude,
                    'pickup_lng' => $booking->pickup_longitude,
                    'ambulance_type' => $ambulanceType
                ]);
                return [null, null];
            }

            // Apply driver selection logic (nearest, highest rated, etc.)
            $selectedDriver = $this->selectOptimalDriver($nearbyDrivers, $booking);
            
            if (!$selectedDriver) {
                return [null, null];
            }

            // Get the driver's assigned ambulance
            $ambulance = $selectedDriver->assignedAmbulance;
            
            if (!$ambulance) {
                Log::warning('Selected driver has no assigned ambulance', [
                    'driver_id' => $selectedDriver->id,
                    'booking_id' => $booking->id
                ]);
                return [null, null];
            }

            return [$selectedDriver, $ambulance];
        } catch (\Exception $e) {
            Log::error('Error finding best driver', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
            return [null, null];
        }
    }

    /**
     * Manually assign a specific driver to a booking.
     *
     * @param  \App\Models\Booking  $booking
     * @param  int  $driverId
     * @return array [Driver|null, Ambulance|null]
     */
    public function assignSpecificDriver(Booking $booking, int $driverId): array
    {
        try {
            // Find the driver
            $driver = Driver::find($driverId);
            
            if (!$driver) {
                Log::warning('Driver not found for manual assignment', [
                    'driver_id' => $driverId,
                    'booking_id' => $booking->id
                ]);
                return [null, null];
            }

            // Check if driver is available
            if ($driver->status !== 'available') {
                Log::warning('Attempting to assign unavailable driver', [
                    'driver_id' => $driverId,
                    'booking_id' => $booking->id,
                    'driver_status' => $driver->status
                ]);
                return [null, null];
            }

            // Get the driver's assigned ambulance
            $ambulance = $driver->assignedAmbulance;
            
            if (!$ambulance) {
                Log::warning('Selected driver has no assigned ambulance', [
                    'driver_id' => $driver->id,
                    'booking_id' => $booking->id
                ]);
                return [null, null];
            }

            // Check if ambulance type matches the booking requirement
            if ($booking->ambulance_type && $booking->ambulance_type !== $ambulance->type) {
                Log::warning('Driver\'s ambulance type does not match booking requirement', [
                    'driver_id' => $driver->id,
                    'booking_id' => $booking->id,
                    'required_type' => $booking->ambulance_type,
                    'available_type' => $ambulance->type
                ]);
                return [null, null];
            }

            return [$driver, $ambulance];
        } catch (\Exception $e) {
            Log::error('Error assigning specific driver', [
                'booking_id' => $booking->id,
                'driver_id' => $driverId,
                'error' => $e->getMessage()
            ]);
            return [null, null];
        }
    }

    /**
     * Find and assign the nearest available ambulance of a specific type.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $ambulanceType
     * @return array [Driver|null, Ambulance|null]
     */
    public function findAndAssignAmbulanceByType(Booking $booking, string $ambulanceType): array
    {
        try {
            // Find available ambulances of the specified type with drivers
            $availableAmbulances = Ambulance::where('type', $ambulanceType)
                ->where('status', 'available')
                ->whereNotNull('assigned_driver_id')
                ->whereHas('driver', function ($query) {
                    $query->where('status', 'available');
                })
                ->with('driver')
                ->get();

            if ($availableAmbulances->isEmpty()) {
                Log::info('No available ambulances of type ' . $ambulanceType, [
                    'booking_id' => $booking->id
                ]);
                return [null, null];
            }

            // If booking has coordinates, find the nearest ambulance
            if ($booking->pickup_latitude && $booking->pickup_longitude) {
                $nearestAmbulance = null;
                $shortestDistance = PHP_FLOAT_MAX;
                $selectedDriver = null;

                foreach ($availableAmbulances as $ambulance) {
                    $driver = $ambulance->driver;
                    
                    // Skip if driver has no location
                    if (!$driver->current_latitude || !$driver->current_longitude) {
                        continue;
                    }
                    
                    $distance = $this->distanceCalculator->calculateDirectDistance(
                        $booking->pickup_latitude,
                        $booking->pickup_longitude,
                        $driver->current_latitude,
                        $driver->current_longitude
                    );
                    
                    if ($distance < $shortestDistance) {
                        $shortestDistance = $distance;
                        $nearestAmbulance = $ambulance;
                        $selectedDriver = $driver;
                    }
                }
                
                if ($nearestAmbulance && $selectedDriver) {
                    return [$selectedDriver, $nearestAmbulance];
                }
            }

            // If no coordinates or no nearest found, just take the first available one
            $ambulance = $availableAmbulances->first();
            $driver = $ambulance->driver;
            
            return [$driver, $ambulance];
        } catch (\Exception $e) {
            Log::error('Error finding ambulance by type', [
                'booking_id' => $booking->id,
                'ambulance_type' => $ambulanceType,
                'error' => $e->getMessage()
            ]);
            return [null, null];
        }
    }

    /**
     * Auto reassign a booking if the driver becomes unavailable.
     *
     * @param  \App\Models\Booking  $booking
     * @return array [Driver|null, Ambulance|null]
     */
    public function autoReassignBooking(Booking $booking): array
    {
        try {
            // Only reassign if booking is in a state that allows reassignment
            if (!in_array($booking->status, ['confirmed', 'dispatched'])) {
                Log::info('Booking not eligible for reassignment', [
                    'booking_id' => $booking->id,
                    'status' => $booking->status
                ]);
                return [null, null];
            }

            // Log the reassignment attempt
            Log::info('Attempting to reassign booking', [
                'booking_id' => $booking->id,
                'previous_driver_id' => $booking->driver_id
            ]);

            // Find a new driver
            return $this->findBestDriver($booking);
        } catch (\Exception $e) {
            Log::error('Error reassigning booking', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
            return [null, null];
        }
    }

    /**
     * Assign an ambulance to a driver.
     *
     * @param  int  $driverId
     * @param  int  $ambulanceId
     * @return bool
     */
    public function assignAmbulanceToDriver(int $driverId, int $ambulanceId): bool
    {
        try {
            DB::beginTransaction();

            // Find the driver
            $driver = Driver::find($driverId);
            if (!$driver) {
                throw new \Exception("Driver not found: {$driverId}");
            }

            // Find the ambulance
            $ambulance = Ambulance::find($ambulanceId);
            if (!$ambulance) {
                throw new \Exception("Ambulance not found: {$ambulanceId}");
            }

            // Check if ambulance is already assigned to another driver
            if ($ambulance->assigned_driver_id && $ambulance->assigned_driver_id != $driverId) {
                // Unassign from previous driver
                $previousDriver = Driver::find($ambulance->assigned_driver_id);
                if ($previousDriver) {
                    $previousDriver->assigned_ambulance_id = null;
                    $previousDriver->save();
                }
            }

            // Unassign any previous ambulance from this driver
            if ($driver->assigned_ambulance_id && $driver->assigned_ambulance_id != $ambulanceId) {
                $previousAmbulance = Ambulance::find($driver->assigned_ambulance_id);
                if ($previousAmbulance) {
                    $previousAmbulance->assigned_driver_id = null;
                    $previousAmbulance->save();
                }
            }

            // Update ambulance
            $ambulance->assigned_driver_id = $driverId;
            $ambulance->status = 'assigned';
            $ambulance->save();

            // Update driver
            $driver->assigned_ambulance_id = $ambulanceId;
            $driver->save();

            DB::commit();
            
            Log::info('Ambulance assigned to driver', [
                'driver_id' => $driverId,
                'ambulance_id' => $ambulanceId
            ]);
            
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error assigning ambulance to driver', [
                'driver_id' => $driverId,
                'ambulance_id' => $ambulanceId,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    /**
     * Select the optimal driver from a list of nearby drivers.
     *
     * @param  array  $nearbyDrivers
     * @param  \App\Models\Booking  $booking
     * @return \App\Models\Driver|null
     */
    protected function selectOptimalDriver(array $nearbyDrivers, Booking $booking): ?Driver
    {
        if (empty($nearbyDrivers)) {
            return null;
        }

        // For emergency bookings, simply pick the nearest driver
        if ($booking->type === 'emergency') {
            return $nearbyDrivers[0]['driver'];
        }

        // For non-emergency bookings, use a weighted scoring system
        $scoredDrivers = [];
        
        foreach ($nearbyDrivers as $driverData) {
            $driver = $driverData['driver'];
            $distance = $driverData['distance'];
            
            // Base score - inverse of distance (closer is better)
            $distanceScore = 1 / (1 + $distance);
            
            // Rating score - higher is better
            $ratingScore = ($driver->average_rating ?? 3) / 5;
            
            // Experience score - based on total completed bookings
            $completedBookings = $driver->completed_bookings_count ?? 0;
            $experienceScore = min(1, $completedBookings / 100); // Cap at 100 bookings
            
            // Calculate weighted total score
            // 50% distance, 30% rating, 20% experience
            $totalScore = ($distanceScore * 0.5) + ($ratingScore * 0.3) + ($experienceScore * 0.2);
            
            $scoredDrivers[] = [
                'driver' => $driver,
                'score' => $totalScore
            ];
        }
        
        // Sort by score (highest first)
        usort($scoredDrivers, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });
        
        // Return the highest scoring driver
        return $scoredDrivers[0]['driver'];
    }
}
