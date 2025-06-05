<?php

namespace App\Http\Middleware;

use App\Http\Traits\WithNotifications;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareNotificationsData
{
    use WithNotifications;
    
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $notificationData = $this->getNotifications();
            
            Inertia::share([
                'notifications' => $notificationData['notifications'],
                'unreadCount' => $notificationData['unreadCount'],
            ]);
        } 
        
        if (auth('admin')->check()) {
            $adminNotificationData = $this->getNotifications('admin');
            
            Inertia::share([
                'adminNotifications' => $adminNotificationData['notifications'],
                'adminUnreadCount' => $adminNotificationData['unreadCount'],
            ]);
        }
        
        return $next($request);
    }
}
