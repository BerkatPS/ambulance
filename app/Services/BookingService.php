<?php

namespace App\Services;

use App\Events\BookingCreated;
use App\Events\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\User;
use App\Models\Driver;
use App\Models\Ambulance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Jobs\CalculateBookingDistance;
use App\Jobs\SendBookingNotification;

class BookingService
{
    /**
     * The distance calculator service instance.
     *
     * @var \App\Services\DistanceCalculatorService
     */
    protected $distanceCalculator;

    /**
     * The driver assignment service instance.
     *
     * @var \App\Services\DriverAssignmentService
     */
    protected $driverAssignment;

    /**
     * Create a new service instance.
     *
     * @param  \App\Services\DistanceCalculatorService  $distanceCalculator
     * @param  \App\Services\DriverAssignmentService  $driverAssignment
     * @return void
     */
    public function __construct(
        DistanceCalculatorService $distanceCalculator,
        DriverAssignmentService $driverAssignment
    ) {
        $this->distanceCalculator = $distanceCalculator;
        $this->driverAssignment = $driverAssignment;
    }

    /**
     * Create a new booking.
     *
     * @param  array  $data
     * @param  \App\Models\User|null  $user
     * @return \App\Models\Booking
     */
    public function createBooking(array $data, ?User $user = null): Booking
    {
        try {
            DB::beginTransaction();

            // Extract booking data
            $bookingData = $this->prepareBookingData($data, $user);

            // Create the booking
            $booking = Booking::create($bookingData);

            // Calculate initial price estimate if we have coordinates
            if (isset($data['pickup_latitude'], $data['pickup_longitude'], 
                      $data['destination_latitude'], $data['destination_longitude'])) {
                
                $estimatedDistance = $this->distanceCalculator->calculateDirectDistance(
                    $data['pickup_latitude'],
                    $data['pickup_longitude'],
                    $data['destination_latitude'],
                    $data['destination_longitude']
                );
                
                $priceEstimate = $this->calculatePriceEstimate($estimatedDistance, $data['type'] ?? 'standard');
                $booking->estimated_price = $priceEstimate;
                $booking->estimated_distance = $estimatedDistance;
                $booking->save();
            }

            // For emergency bookings, try to assign a driver immediately
            if ($booking->type === 'emergency') {
                $this->attemptImmediateDriverAssignment($booking);
            }

            DB::commit();

            // Dispatch event after successful creation
            event(new BookingCreated($booking));

            // Return the created booking
            return $booking;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create booking', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Update a booking's status.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $status
     * @param  array  $additionalData
     * @return \App\Models\Booking
     */
    public function updateStatus(Booking $booking, string $status, array $additionalData = []): Booking
    {
        try {
            $previousStatus = $booking->status;

            // Handle specific status transitions
            switch ($status) {
                case 'confirmed':
                    $this->handleConfirmedStatus($booking, $additionalData);
                    break;

                case 'dispatched':
                    $this->handleDispatchedStatus($booking, $additionalData);
                    break;

                case 'in_progress':
                    $this->handleInProgressStatus($booking, $additionalData);
                    break;

                case 'completed':
                    $this->handleCompletedStatus($booking, $additionalData);
                    break;

                case 'cancelled':
                    $this->handleCancelledStatus($booking, $additionalData);
                    break;
            }

            // Update general status and any additional fields
            $booking->status = $status;
            $booking->fill($additionalData);
            $booking->save();

            // Dispatch event for status update
            event(new BookingStatusUpdated($booking, $previousStatus));

            return $booking;
        } catch (\Exception $e) {
            Log::error('Failed to update booking status', [
                'booking_id' => $booking->id,
                'status' => $status,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Assign a driver to a booking.
     *
     * @param  \App\Models\Booking  $booking
     * @param  \App\Models\Driver|null  $driver
     * @param  \App\Models\Ambulance|null  $ambulance
     * @return \App\Models\Booking
     */
    public function assignDriver(Booking $booking, ?Driver $driver = null, ?Ambulance $ambulance = null): Booking
    {
        try {
            // If no driver is specified, try to find the best available driver
            if (!$driver) {
                list($driver, $ambulance) = $this->driverAssignment->findBestDriver($booking);
                
                if (!$driver) {
                    throw new \Exception('No available drivers found');
                }
            }

            // If driver is specified but no ambulance, try to get driver's assigned ambulance
            if ($driver && !$ambulance) {
                $ambulance = $driver->assignedAmbulance;
                
                if (!$ambulance) {
                    throw new \Exception('Driver has no assigned ambulance');
                }
            }

            // Assign driver and ambulance to booking
            $booking->driver_id = $driver->id;
            $booking->ambulance_id = $ambulance->id;
            $booking->driver_assigned_at = now();
            $booking->save();

            // Update driver status to busy
            $driver->status = 'busy';
            $driver->current_booking_id = $booking->id;
            $driver->save();

            // Dispatch driver assigned event
            event(new \App\Events\DriverAssigned($booking, $driver));

            return $booking;
        } catch (\Exception $e) {
            Log::error('Failed to assign driver to booking', [
                'booking_id' => $booking->id,
                'driver_id' => $driver->id ?? null,
                'ambulance_id' => $ambulance->id ?? null,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Calculate price for a completed booking.
     *
     * @param  \App\Models\Booking  $booking
     * @param  float|null  $distanceTraveled
     * @return float
     */
    public function calculateFinalPrice(Booking $booking, ?float $distanceTraveled = null): float
    {
        // Use provided distance or booking's distance
        $distance = $distanceTraveled ?? $booking->distance_traveled;
        
        // If no distance is available, calculate it
        if (!$distance) {
            CalculateBookingDistance::dispatchSync($booking);
            $distance = $booking->distance_traveled;
        }
        
        // Base price based on booking type
        $basePrice = $this->getBasePrice($booking->type);
        
        // Per kilometer rate
        $perKmRate = 2.50; // $2.50 per km
        
        // Calculate distance price
        $distancePrice = $distance * $perKmRate;
        
        // Add additional fees
        $additionalFees = $booking->additional_fees ?? 0;
        
        // Calculate total before discounts
        $totalBeforeDiscount = $basePrice + $distancePrice + $additionalFees;
        
        // Apply any discounts
        $discount = $booking->discount_amount ?? 0;
        
        // Calculate final price
        $finalPrice = max(0, $totalBeforeDiscount - $discount);
        
        // Update booking with price details
        $booking->base_price = $basePrice;
        $booking->per_km_rate = $perKmRate;
        $booking->distance_price = $distancePrice;
        $booking->final_price = $finalPrice;
        $booking->save();
        
        return $finalPrice;
    }

    /**
     * Cancel a booking.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $reason
     * @param  string  $cancelledBy
     * @return \App\Models\Booking
     */
    public function cancelBooking(Booking $booking, string $reason, string $cancelledBy = 'user'): Booking
    {
        try {
            DB::beginTransaction();

            // Free up driver if one was assigned
            if ($booking->driver_id) {
                $driver = $booking->driver;
                $driver->status = 'available';
                $driver->current_booking_id = null;
                $driver->save();
            }

            // Update booking status
            $previousStatus = $booking->status;
            $booking->status = 'cancelled';
            $booking->cancellation_reason = $reason;
            $booking->cancelled_by = $cancelledBy;
            $booking->cancelled_at = now();
            $booking->save();

            DB::commit();

            // Dispatch event
            event(new BookingStatusUpdated($booking, $previousStatus));

            return $booking;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to cancel booking', [
                'booking_id' => $booking->id,
                'reason' => $reason,
                'cancelled_by' => $cancelledBy,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Prepare booking data for creation.
     *
     * @param  array  $data
     * @param  \App\Models\User|null  $user
     * @return array
     */
    protected function prepareBookingData(array $data, ?User $user = null): array
    {
        $bookingData = [
            'user_id' => $user ? $user->id : ($data['user_id'] ?? null),
            'type' => $data['type'] ?? 'scheduled',
            'status' => 'pending',
            'patient_name' => $data['patient_name'],
            'patient_age' => $data['patient_age'] ?? null,
            'patient_gender' => $data['patient_gender'] ?? null,
            'patient_condition' => $data['patient_condition'] ?? null,
            'pickup_address' => $data['pickup_address'],
            'pickup_latitude' => $data['pickup_latitude'] ?? null,
            'pickup_longitude' => $data['pickup_longitude'] ?? null,
            'destination_address' => $data['destination_address'],
            'destination_latitude' => $data['destination_latitude'] ?? null,
            'destination_longitude' => $data['destination_longitude'] ?? null,
            'contact_name' => $data['contact_name'],
            'contact_phone' => $data['contact_phone'],
            'contact_relationship' => $data['contact_relationship'] ?? null,
            'notes' => $data['notes'] ?? null,
            'ambulance_type' => $data['ambulance_type'] ?? 'basic',
        ];

        // Handle scheduled bookings
        if ($data['type'] === 'scheduled' && isset($data['pickup_date'], $data['pickup_time'])) {
            $bookingData['pickup_datetime'] = $data['pickup_date'] . ' ' . $data['pickup_time'];
        }

        return $bookingData;
    }

    /**
     * Calculate a price estimate based on distance and type.
     *
     * @param  float  $distance
     * @param  string  $type
     * @return float
     */
    protected function calculatePriceEstimate(float $distance, string $type): float
    {
        $basePrice = $this->getBasePrice($type);
        $perKmRate = 2.50; // $2.50 per km
        
        // Apply a multiplier to straight-line distance to estimate road distance
        $roadDistanceMultiplier = 1.3;
        $estimatedRoadDistance = $distance * $roadDistanceMultiplier;
        
        // Calculate distance price
        $distancePrice = $estimatedRoadDistance * $perKmRate;
        
        // Calculate total estimated price
        $estimatedPrice = $basePrice + $distancePrice;
        
        return $estimatedPrice;
    }

    /**
     * Get base price based on booking type.
     *
     * @param  string  $type
     * @return float
     */
    protected function getBasePrice(string $type): float
    {
        $prices = [
            'basic' => 50.00,      // Basic ambulance
            'advanced' => 100.00,   // Advanced life support
            'emergency' => 75.00,   // Emergency response
            'scheduled' => 40.00,   // Scheduled transport
            'neonatal' => 120.00,   // Neonatal transport
            'patient_transport' => 35.00, // Basic patient transport
        ];
        
        return $prices[$type] ?? $prices['basic'];
    }

    /**
     * Attempt to assign a driver immediately for emergency bookings.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    protected function attemptImmediateDriverAssignment(Booking $booking): void
    {
        try {
            list($driver, $ambulance) = $this->driverAssignment->findBestDriver($booking);
            
            if ($driver && $ambulance) {
                $this->assignDriver($booking, $driver, $ambulance);
                
                // Update booking status to confirmed for emergency bookings
                // (Payment can be handled later for emergencies)
                $this->updateStatus($booking, 'confirmed');
            }
        } catch (\Exception $e) {
            Log::warning('Could not immediately assign driver to emergency booking', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
            // Don't rethrow - this is a nice-to-have, not a requirement
        }
    }

    /**
     * Handle confirmed status transition.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $data
     * @return void
     */
    protected function handleConfirmedStatus(Booking $booking, array $data): void
    {
        $booking->confirmed_at = now();
    }

    /**
     * Handle dispatched status transition.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $data
     * @return void
     */
    protected function handleDispatchedStatus(Booking $booking, array $data): void
    {
        $booking->dispatched_at = now();
        
        // Set estimated arrival time if provided, otherwise calculate it
        if (isset($data['estimated_arrival_time'])) {
            $booking->estimated_arrival_time = $data['estimated_arrival_time'];
        } else if ($booking->driver_id) {
            // Calculate ETA based on driver's current location
            $driver = $booking->driver;
            if ($driver && $driver->current_latitude && $driver->current_longitude) {
                $distance = $this->distanceCalculator->calculateDirectDistance(
                    $driver->current_latitude,
                    $driver->current_longitude,
                    $booking->pickup_latitude,
                    $booking->pickup_longitude
                );
                
                // Assume average speed of 40 km/h
                $etaMinutes = ($distance / 40) * 60;
                $booking->estimated_arrival_time = now()->addMinutes(ceil($etaMinutes));
            }
        }
    }

    /**
     * Handle in_progress status transition.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $data
     * @return void
     */
    protected function handleInProgressStatus(Booking $booking, array $data): void
    {
        $booking->pickup_time = $data['pickup_time'] ?? now();
        
        // Calculate ETA to destination if coordinates are available
        if ($booking->pickup_latitude && $booking->destination_latitude) {
            $distance = $this->distanceCalculator->calculateDirectDistance(
                $booking->pickup_latitude,
                $booking->pickup_longitude,
                $booking->destination_latitude,
                $booking->destination_longitude
            );
            
            // Assume average speed of 40 km/h
            $etaMinutes = ($distance / 40) * 60;
            $booking->estimated_arrival_time = now()->addMinutes(ceil($etaMinutes));
        }
    }

    /**
     * Handle completed status transition.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $data
     * @return void
     */
    protected function handleCompletedStatus(Booking $booking, array $data): void
    {
        $booking->completion_time = $data['completion_time'] ?? now();
        
        // Calculate distance and final price
        $distanceTraveled = $data['distance_traveled'] ?? null;
        $this->calculateFinalPrice($booking, $distanceTraveled);
        
        // Free up the driver
        if ($booking->driver_id) {
            $driver = $booking->driver;
            $driver->status = 'available';
            $driver->current_booking_id = null;
            $driver->save();
        }
        
        // Send a notification to request rating
        SendBookingNotification::dispatch(
            $booking,
            'booking_completed'
        );
    }

    /**
     * Handle cancelled status transition.
     *
     * @param  \App\Models\Booking  $booking
     * @param  array  $data
     * @return void
     */
    protected function handleCancelledStatus(Booking $booking, array $data): void
    {
        $booking->cancellation_reason = $data['cancellation_reason'] ?? 'No reason provided';
        $booking->cancelled_by = $data['cancelled_by'] ?? 'user';
        $booking->cancelled_at = now();
        
        // Free up the driver if one was assigned
        if ($booking->driver_id) {
            $driver = $booking->driver;
            $driver->status = 'available';
            $driver->current_booking_id = null;
            $driver->save();
        }
    }
}
