<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of the notifications.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->latest()
            ->paginate(10)
            ->through(function ($notification) {
                $data = $notification->data;
                
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $data['title'] ?? 'Notification',
                    'message' => $data['message'] ?? '',
                    'time' => $notification->created_at->diffForHumans(),
                    'read' => !is_null($notification->read_at),
                    'action_url' => $data['action_url'] ?? null,
                    'action_text' => $data['action_text'] ?? null,
                    'image_url' => $data['image_url'] ?? null,
                    'created_at' => $notification->created_at
                ];
            });
            
        return Inertia::render('User/Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }
    
    /**
     * Mark a notification as read.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsRead($id)
    {
        $user = request()->user();
        $notification = $user->notifications()->findOrFail($id);
        
        $notification->markAsRead();
        
        $data = $notification->data;
        $actionUrl = $data['action_url'] ?? null;
        
        if ($actionUrl) {
            return redirect($actionUrl);
        }
        
        return redirect()->back()->with('success', 'Notification marked as read');
    }
    
    /**
     * Mark all notifications as read.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAllAsRead()
    {
        $user = request()->user();
        $user->unreadNotifications->markAsRead();
        
        return redirect()->back()->with('success', 'All notifications marked as read');
    }
    
    /**
     * Delete a notification.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $user = request()->user();
        $notification = $user->notifications()->findOrFail($id);
        
        $notification->delete();
        
        return redirect()->back()->with('success', 'Notification deleted');
    }
}
