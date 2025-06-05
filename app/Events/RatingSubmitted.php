<?php

namespace App\Events;

use App\Models\Booking;
use App\Models\Rating;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RatingSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The rating instance.
     *
     * @var \App\Models\Rating
     */
    public $rating;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Rating  $rating
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function __construct(Rating $rating, Booking $booking)
    {
        $this->rating = $rating;
        $this->booking = $booking;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $channels = [
            new Channel('admin.ratings'),
        ];
        
        // If the rating is not anonymous, also broadcast to the driver's channel
        if (!$this->rating->anonymous && $this->booking->driver_id) {
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
        $data = [
            'rating_id' => $this->rating->id,
            'booking_id' => $this->booking->id,
            'stars' => $this->rating->stars,
            'driver_rating' => $this->rating->driver_rating,
            'ambulance_rating' => $this->rating->ambulance_rating,
            'service_rating' => $this->rating->service_rating,
            'anonymous' => $this->rating->anonymous,
            'created_at' => $this->rating->created_at->toIso8601String(),
        ];
        
        // Only include comments if they exist
        if ($this->rating->comments) {
            $data['comments'] = $this->rating->comments;
        }
        
        // Only include user info if the rating is not anonymous
        if (!$this->rating->anonymous) {
            $data['user_id'] = $this->booking->user_id;
        }
        
        return $data;
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'rating.submitted';
    }
}
