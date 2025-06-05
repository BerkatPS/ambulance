<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmergencyBookingCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('emergency-bookings');
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'patient_name' => $this->booking->patient_name,
            'pickup_address' => $this->booking->pickup_address,
            'destination_address' => $this->booking->destination_address,
            'type' => 'emergency',
            'status' => $this->booking->status,
            'created_at' => $this->booking->created_at->toDateTimeString(),
            'action_url' => route('admin.bookings.show', $this->booking->id)
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'emergency.booking.created';
    }
}
