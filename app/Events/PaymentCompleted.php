<?php

namespace App\Events;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The payment instance.
     *
     * @var \App\Models\Payment
     */
    public $payment;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * The previous booking status.
     *
     * @var string
     */
    public $previousBookingStatus;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Payment  $payment
     * @param  \App\Models\Booking  $booking
     * @param  string  $previousBookingStatus
     * @return void
     */
    public function __construct(Payment $payment, Booking $booking, string $previousBookingStatus)
    {
        $this->payment = $payment;
        $this->booking = $booking;
        $this->previousBookingStatus = $previousBookingStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new Channel('admin.payments'),
            new PrivateChannel('user.' . $this->booking->user_id),
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
            'payment_id' => $this->payment->id,
            'booking_id' => $this->booking->id,
            'user_id' => $this->booking->user_id,
            'amount' => $this->payment->amount,
            'payment_method' => $this->payment->payment_method,
            'status' => $this->payment->status,
            'booking_status' => $this->booking->status,
            'previous_booking_status' => $this->previousBookingStatus,
            'processed_at' => $this->payment->processed_at->toIso8601String(),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'payment.completed';
    }
}
