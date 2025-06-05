<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Admin;
use App\Models\User;
use App\Models\Driver;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Admin notification channel
Broadcast::channel('admin.notifications.{adminId}', function ($user, $adminId) {
    return (int) $user->id === (int) $adminId && $user instanceof Admin;
});

// User notification channel
Broadcast::channel('user.notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId && $user instanceof User;
});

// Driver notification channel
Broadcast::channel('driver.notifications.{driverId}', function ($user, $driverId) {
    return (int) $user->id === (int) $driverId && $user instanceof Driver;
});

// Emergency bookings channel for all admins
Broadcast::channel('emergency-bookings', function ($user) {
    return $user instanceof Admin;
});

// Driver status channel for tracking driver status changes
Broadcast::channel('driver.status.{driverId}', function ($user, $driverId) {
    // Admins can subscribe to all driver statuses
    if ($user instanceof Admin) {
        return true;
    }
    
    // Drivers can only subscribe to their own status
    if ($user instanceof Driver) {
        return (int) $user->id === (int) $driverId;
    }
    
    return false;
});

// Booking updates channel
Broadcast::channel('booking.updates.{bookingId}', function ($user, $bookingId) {
    // Check if the user is allowed to receive updates for this booking
    // This can be customized based on your application's logic
    return true;
});
