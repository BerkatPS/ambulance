<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * The previous status of the booking.
     *
     * @var string
     */
    public $previousStatus;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $previousStatus
     * @return void
     */
    public function __construct(Booking $booking, string $previousStatus)
    {
        $this->booking = $booking;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $channels = [
            new Channel('admin.bookings'),
            new PrivateChannel('user.' . $this->booking->user_id),
        ];

        // If a driver is assigned, also broadcast to their channel
        if ($this->booking->driver_id) {
            $channels[] = new PrivateChannel('driver.' . $this->booking->driver_id);
        }

        return $channels;
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
            'user_id' => $this->booking->user_id,
            'driver_id' => $this->booking->driver_id,
            'status' => $this->booking->status,
            'previous_status' => $this->previousStatus,
            'updated_at' => $this->booking->updated_at->toIso8601String(),
            'estimated_arrival_time' => $this->booking->estimated_arrival_time ? 
                $this->booking->estimated_arrival_time->toIso8601String() : null,
            'completion_time' => $this->booking->completion_time ? 
                $this->booking->completion_time->toIso8601String() : null,
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'booking.status_updated';
    }
}
