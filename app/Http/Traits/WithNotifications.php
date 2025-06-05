<?php

namespace App\Http\Traits;

use Illuminate\Http\Request;

trait WithNotifications
{
    /**
     * Get notifications for the authenticated user.
     * 
     * @param Request|string|null $requestOrGuard
     * @return array
     */
    protected function getNotifications($requestOrGuard = null)
    {
        // If parameter is a Request object, use default guard
        $guard = null;
        if ($requestOrGuard instanceof Request) {
            $guard = null;
        } else {
            $guard = $requestOrGuard;
        }

        if (!auth()->check() && ($guard && !auth($guard)->check())) {
            return [
                'notifications' => [],
                'unreadCount' => 0
            ];
        }

        $user = $guard ? auth($guard)->user() : auth()->user();
        
        $notifications = $user->notifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
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
        
        $unreadCount = $user->unreadNotifications()->count();
        
        return [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount
        ];
    }

    /**
     * Get unread notifications count for the authenticated user.
     * 
     * @param Request|string|null $requestOrGuard
     * @return int
     */
    protected function getUnreadCount($requestOrGuard = null)
    {
        // If parameter is a Request object, use default guard
        $guard = null;
        if ($requestOrGuard instanceof Request) {
            $guard = null;
        } else {
            $guard = $requestOrGuard;
        }

        if (!auth()->check() && ($guard && !auth($guard)->check())) {
            return 0;
        }

        $user = $guard ? auth($guard)->user() : auth()->user();
        
        return $user->unreadNotifications()->count();
    }
}
