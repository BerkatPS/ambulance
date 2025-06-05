<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Events\BookingStatusUpdated;
use App\Jobs\SendBookingNotification as SendBookingNotificationJob;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendBookingNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

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
     * Handle the BookingCreated event.
     *
     * @param  BookingCreated  $event
     * @return void
     */
    public function handleBookingCreated(BookingCreated $event)
    {
        $booking = $event->booking;
        
        Log::info('Booking created notification triggered', [
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
        ]);
        
        // Dispatch job to send notification
        SendBookingNotificationJob::dispatch(
            $booking,
            'booking_created'
        );
    }

    /**
     * Handle the BookingStatusUpdated event.
     *
     * @param  BookingStatusUpdated  $event
     * @return void
     */
    public function handleBookingStatusUpdated(BookingStatusUpdated $event)
    {
        $booking = $event->booking;
        $previousStatus = $event->previousStatus;
        $currentStatus = $booking->status;
        
        Log::info('Booking status updated notification triggered', [
            'booking_id' => $booking->id,
            'previous_status' => $previousStatus,
            'current_status' => $currentStatus,
        ]);
        
        // Only send notifications for certain status changes
        if ($this->shouldSendNotification($previousStatus, $currentStatus)) {
            $notificationType = $this->getNotificationTypeForStatus($currentStatus);
            $additionalData = $this->getAdditionalData($booking, $previousStatus, $currentStatus);
            
            // Dispatch job to send notification
            SendBookingNotificationJob::dispatch(
                $booking,
                $notificationType,
                $additionalData
            );
        }
    }
    
    /**
     * Determine if a notification should be sent for this status change.
     *
     * @param  string  $previousStatus
     * @param  string  $currentStatus
     * @return bool
     */
    private function shouldSendNotification(string $previousStatus, string $currentStatus): bool
    {
        // Define status transitions that should trigger notifications
        $notifiableTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['dispatched', 'cancelled'],
            'dispatched' => ['in_progress', 'cancelled'],
            'in_progress' => ['completed', 'cancelled'],
            'payment_failed' => ['confirmed', 'cancelled'],
        ];
        
        return isset($notifiableTransitions[$previousStatus]) && 
               in_array($currentStatus, $notifiableTransitions[$previousStatus]);
    }
    
    /**
     * Get the notification type based on booking status.
     *
     * @param  string  $status
     * @return string
     */
    private function getNotificationTypeForStatus(string $status): string
    {
        $notificationTypes = [
            'confirmed' => 'booking_confirmed',
            'dispatched' => 'ambulance_dispatched',
            'in_progress' => 'ambulance_arrived',
            'completed' => 'booking_completed',
            'cancelled' => 'booking_cancelled',
        ];
        
        return $notificationTypes[$status] ?? 'booking_status_updated';
    }
    
    /**
     * Get additional data for the notification based on status.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $previousStatus
     * @param  string  $currentStatus
     * @return array
     */
    private function getAdditionalData($booking, string $previousStatus, string $currentStatus): array
    {
        $data = [];
        
        switch ($currentStatus) {
            case 'dispatched':
                // Include estimated arrival time
                $data['estimated_arrival'] = $booking->estimated_arrival_time 
                    ? $booking->estimated_arrival_time->format('H:i') 
                    : 'As soon as possible';
                break;
                
            case 'cancelled':
                // Include cancellation reason
                $data['reason'] = $booking->cancellation_reason ?? 'No reason provided';
                break;
        }
        
        // If a driver was assigned, include driver info
        if ($booking->driver_id && in_array($currentStatus, ['dispatched', 'in_progress'])) {
            $driver = $booking->driver;
            if ($driver) {
                $data['driver_name'] = $driver->name;
                $data['driver_phone'] = $driver->phone;
            }
        }
        
        return $data;
    }
}
