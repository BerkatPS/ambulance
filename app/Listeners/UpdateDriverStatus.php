<?php

namespace App\Listeners;

use App\Events\DriverAssigned;
use App\Events\BookingStatusUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UpdateDriverStatus implements ShouldQueue
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
     * Handle the driver assigned event.
     *
     * @param  DriverAssigned  $event
     * @return void
     */
    public function handle(DriverAssigned $event)
    {
        $driver = $event->driver;
        $booking = $event->booking;
        
        Log::info('Updating driver status after assignment', [
            'driver_id' => $driver->id,
            'booking_id' => $booking->id,
            'previous_status' => $driver->status,
        ]);
        
        // Update driver status to busy when assigned to a booking
        $driver->status = 'busy';
        $driver->current_booking_id = $booking->id;
        $driver->save();
        
        Log::info('Driver status updated to busy', [
            'driver_id' => $driver->id,
            'booking_id' => $booking->id,
        ]);
    }
    
    /**
     * Handle booking status updated event to update driver status accordingly.
     *
     * @param  BookingStatusUpdated  $event
     * @return void
     */
    public function handleBookingStatusUpdated(BookingStatusUpdated $event)
    {
        $booking = $event->booking;
        $previousStatus = $event->previousStatus;
        $currentStatus = $booking->status;
        
        // Only process if the booking has a driver assigned
        if (!$booking->driver_id) {
            return;
        }
        
        $driver = $booking->driver;
        
        // Update driver status based on booking status change
        if (in_array($currentStatus, ['completed', 'cancelled'])) {
            if ($driver->current_booking_id == $booking->id) {
                Log::info('Updating driver status after booking completion/cancellation', [
                    'driver_id' => $driver->id,
                    'booking_id' => $booking->id,
                    'previous_status' => $driver->status,
                    'booking_status' => $currentStatus,
                ]);
                
                // Reset driver to available
                $driver->status = 'available';
                $driver->current_booking_id = null;
                $driver->save();
                
                Log::info('Driver status updated to available', [
                    'driver_id' => $driver->id,
                ]);
            }
        }
    }
}
