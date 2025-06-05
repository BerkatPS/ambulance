<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationsController extends Controller
{
    /**
     * Display a listing of the driver's notifications.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $driver = Auth::guard('driver')->user();
        
        // Get all notifications for the driver
        $notifications = $driver->notifications()->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Driver/Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $driver->unreadNotifications->count(),
        ]);
    }
    
    /**
     * Mark a specific notification as read.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsRead($id)
    {
        $driver = Auth::guard('driver')->user();
        $notification = $driver->notifications()->where('id', $id)->first();
        
        if ($notification) {
            $notification->markAsRead();
        }
        
        return redirect()->back();
    }
    
    /**
     * Mark all notifications as read.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAllAsRead()
    {
        $driver = Auth::guard('driver')->user();
        $driver->unreadNotifications->markAsRead();
        
        return redirect()->back();
    }
    
    /**
     * Delete a notification.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $driver = Auth::guard('driver')->user();
        $driver->notifications()->where('id', $id)->delete();
        
        return redirect()->back();
    }
}
