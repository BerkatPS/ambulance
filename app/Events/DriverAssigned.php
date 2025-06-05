<?php

namespace App\Events;

use App\Models\Booking;
use App\Models\Driver;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DriverAssigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * The driver instance.
     *
     * @var \App\Models\Driver
     */
    public $driver;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Booking  $booking
     * @param  \App\Models\Driver  $driver
     * @return void
     */
    public function __construct(Booking $booking, Driver $driver)
    {
        $this->booking = $booking;
        $this->driver = $driver;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new Channel('admin.bookings'),
            new PrivateChannel('user.' . $this->booking->user_id),
            new PrivateChannel('driver.' . $this->driver->id),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'booking_id' => $this->booking->id,
            'driver_id' => $this->driver->id,
            'user_id' => $this->booking->user_id,
            'driver_name' => $this->driver->name,
            'driver_phone' => $this->driver->phone,
            'driver_rating' => $this->driver->average_rating,
            'ambulance_id' => $this->booking->ambulance_id,
            'pickup_address' => $this->booking->pickup_address,
            'destination_address' => $this->booking->destination_address,
            'patient_name' => $this->booking->patient_name,
            'patient_condition' => $this->booking->patient_condition,
            'assigned_at' => now()->toIso8601String(),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'driver.assigned';
    }
}
