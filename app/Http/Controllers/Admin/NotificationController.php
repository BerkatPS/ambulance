<?php

namespace App\Http\Controllers\Admin;

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
        $admin = $request->user('admin');
        
        $notifications = $admin->notifications()
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
            
        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $admin->unreadNotifications()->count(),
        ]);
    }
    
    /**
     * Mark a notification as read.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsRead(Request $request, $id)
    {
        $admin = $request->user('admin');
        $notification = $admin->notifications()->where('id', $id)->first();
        
        if ($notification) {
            $notification->markAsRead();
        }
        
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read successfully.'
            ]);
        }
        
        return back()->with('success', 'Notifikasi telah ditandai sebagai dibaca.');
    }
    
    /**
     * Mark all notifications as read.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAllAsRead(Request $request)
    {
        $admin = $request->user('admin');
        $admin->unreadNotifications->markAsRead();
        
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read successfully.'
            ]);
        }
        
        return back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }
    
    /**
     * Delete a notification.
     *
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request, $id)
    {
        $admin = $request->user('admin');
        $notification = $admin->notifications()->where('id', $id)->first();
        
        if ($notification) {
            $notification->delete();
        }
        
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully.'
            ]);
        }
        
        return back()->with('success', 'Notifikasi telah dihapus.');
    }
}
