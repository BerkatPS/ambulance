<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Events\BookingStatusUpdated;
use App\Events\DriverAssigned;
use App\Models\BookingActivity;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class LogBookingActivity implements ShouldQueue
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
     * Handle booking created event.
     *
     * @param  BookingCreated  $event
     * @return void
     */
    public function handleBookingCreated(BookingCreated $event)
    {
        $booking = $event->booking;
        
        $this->logActivity($booking->id, 'created', [
            'user_id' => $booking->user_id,
            'type' => $booking->type,
            'patient_name' => $booking->patient_name,
            'pickup_address' => $booking->pickup_address,
            'destination_address' => $booking->destination_address,
        ]);
    }
    
    /**
     * Handle booking status updated event.
     *
     * @param  BookingStatusUpdated  $event
     * @return void
     */
    public function handleBookingStatusUpdated(BookingStatusUpdated $event)
    {
        $booking = $event->booking;
        $previousStatus = $event->previousStatus;
        
        $data = [
            'previous_status' => $previousStatus,
            'new_status' => $booking->status,
        ];
        
        // Add additional data based on status
        switch ($booking->status) {
            case 'confirmed':
                $data['payment_id'] = $booking->payments()->latest()->first()?->id;
                break;
                
            case 'dispatched':
                $data['ambulance_id'] = $booking->ambulance_id;
                $data['driver_id'] = $booking->driver_id;
                $data['estimated_arrival_time'] = $booking->estimated_arrival_time;
                break;
                
            case 'in_progress':
                $data['pickup_time'] = $booking->pickup_time;
                break;
                
            case 'completed':
                $data['completion_time'] = $booking->completion_time;
                $data['distance_traveled'] = $booking->distance_traveled;
                $data['final_price'] = $booking->final_price;
                break;
                
            case 'cancelled':
                $data['cancellation_reason'] = $booking->cancellation_reason;
                $data['cancelled_by'] = $booking->cancelled_by;
                break;
        }
        
        $this->logActivity(
            $booking->id,
            'status_updated_to_' . $booking->status,
            $data
        );
    }
    
    /**
     * Handle driver assigned event.
     *
     * @param  DriverAssigned  $event
     * @return void
     */
    public function handleDriverAssigned(DriverAssigned $event)
    {
        $booking = $event->booking;
        $driver = $event->driver;
        
        $this->logActivity($booking->id, 'driver_assigned', [
            'driver_id' => $driver->id,
            'driver_name' => $driver->name,
            'ambulance_id' => $booking->ambulance_id,
            'assigned_at' => now()->toDateTimeString(),
        ]);
    }
    
    /**
     * Log a booking activity.
     *
     * @param  int  $bookingId
     * @param  string  $action
     * @param  array  $data
     * @return void
     */
    private function logActivity(int $bookingId, string $action, array $data = []): void
    {
        try {
            // Get the actor info
            $actorId = auth()->id() ?? null;
            $actorType = auth()->guard('admin')->check() ? 'admin' : 'user';
            
            // Create activity record
            BookingActivity::create([
                'booking_id' => $bookingId,
                'action' => $action,
                'actor_id' => $actorId,
                'actor_type' => $actorType,
                'data' => $data,
                'created_at' => now(),
            ]);
            
            Log::info('Booking activity logged', [
                'booking_id' => $bookingId,
                'action' => $action,
                'actor_id' => $actorId,
                'actor_type' => $actorType,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log booking activity', [
                'booking_id' => $bookingId,
                'action' => $action,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
