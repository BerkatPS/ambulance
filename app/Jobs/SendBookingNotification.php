<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendBookingNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    protected $booking;
    
    /**
     * The notification type.
     *
     * @var string
     */
    protected $notificationType;
    
    /**
     * Additional data for the notification.
     *
     * @var array
     */
    protected $additionalData;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $notificationType
     * @param  array  $additionalData
     * @return void
     */
    public function __construct(Booking $booking, string $notificationType, array $additionalData = [])
    {
        $this->booking = $booking;
        $this->notificationType = $notificationType;
        $this->additionalData = $additionalData;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Get the user associated with this booking
            $user = User::find($this->booking->user_id);
            
            if (!$user) {
                Log::warning('User not found for booking notification', [
                    'booking_id' => $this->booking->id,
                    'user_id' => $this->booking->user_id
                ]);
                return;
            }
            
            // Determine which notification to send based on type
            switch ($this->notificationType) {
                case 'booking_created':
                    $this->sendBookingCreatedNotification($user);
                    break;
                    
                case 'booking_confirmed':
                    $this->sendBookingConfirmedNotification($user);
                    break;
                    
                case 'driver_assigned':
                    $this->sendDriverAssignedNotification($user);
                    break;
                    
                case 'ambulance_dispatched':
                    $this->sendAmbulanceDispatchedNotification($user);
                    break;
                    
                case 'ambulance_arrived':
                    $this->sendAmbulanceArrivedNotification($user);
                    break;
                    
                case 'booking_completed':
                    $this->sendBookingCompletedNotification($user);
                    break;
                    
                case 'booking_cancelled':
                    $this->sendBookingCancelledNotification($user);
                    break;
                    
                default:
                    Log::warning('Unknown notification type', [
                        'booking_id' => $this->booking->id,
                        'notification_type' => $this->notificationType
                    ]);
                    break;
            }
            
            Log::info('Booking notification sent', [
                'booking_id' => $this->booking->id,
                'user_id' => $user->id,
                'notification_type' => $this->notificationType
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send booking notification', [
                'booking_id' => $this->booking->id,
                'notification_type' => $this->notificationType,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Send booking created notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendBookingCreatedNotification(User $user)
    {
        // In a real application, this would send an SMS, email, push notification, etc.
        // For demonstration purposes, we'll just log it
        Log::info('Booking created notification would be sent', [
            'user_name' => $user->name,
            'user_phone' => $user->phone,
            'booking_id' => $this->booking->id,
            'booking_type' => $this->booking->type,
            'booking_status' => $this->booking->status
        ]);
    }
    
    /**
     * Send booking confirmed notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendBookingConfirmedNotification(User $user)
    {
        // Implementation would be similar to above
        Log::info('Booking confirmed notification would be sent', [
            'user_name' => $user->name,
            'booking_id' => $this->booking->id
        ]);
    }
    
    /**
     * Send driver assigned notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendDriverAssignedNotification(User $user)
    {
        $driverName = $this->additionalData['driver_name'] ?? 'Unknown';
        $driverPhone = $this->additionalData['driver_phone'] ?? 'Unknown';
        
        Log::info('Driver assigned notification would be sent', [
            'user_name' => $user->name,
            'booking_id' => $this->booking->id,
            'driver_name' => $driverName,
            'driver_phone' => $driverPhone
        ]);
    }
    
    /**
     * Send ambulance dispatched notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendAmbulanceDispatchedNotification(User $user)
    {
        $estimatedArrival = $this->additionalData['estimated_arrival'] ?? 'Unknown';
        
        Log::info('Ambulance dispatched notification would be sent', [
            'user_name' => $user->name,
            'booking_id' => $this->booking->id,
            'estimated_arrival' => $estimatedArrival
        ]);
    }
    
    /**
     * Send ambulance arrived notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendAmbulanceArrivedNotification(User $user)
    {
        Log::info('Ambulance arrived notification would be sent', [
            'user_name' => $user->name,
            'booking_id' => $this->booking->id
        ]);
    }
    
    /**
     * Send booking completed notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendBookingCompletedNotification(User $user)
    {
        Log::info('Booking completed notification would be sent', [
            'user_name' => $user->name,
            'booking_id' => $this->booking->id,
            'request_rating' => true
        ]);
    }
    
    /**
     * Send booking cancelled notification.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function sendBookingCancelledNotification(User $user)
    {
        $reason = $this->additionalData['reason'] ?? 'No reason provided';
        
        Log::info('Booking cancelled notification would be sent', [
            'user_name' => $user->name,
            'booking_id' => $this->booking->id,
            'reason' => $reason
        ]);
    }
}
