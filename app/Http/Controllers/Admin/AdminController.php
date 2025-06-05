<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $admin = $request->user('admin');
        
        // Get recent notifications
        $notifications = $admin->notifications()
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($notification) {
                $data = is_array($notification->data) ? $notification->data : json_decode($notification->data, true);
                
                return [
                    'id' => $notification->id,
                    'type' => $data['type'] ?? $notification->type,
                    'title' => $data['title'] ?? 'Notification',
                    'message' => $data['message'] ?? '',
                    'time' => $notification->created_at->diffForHumans(),
                    'read' => !is_null($notification->read_at),
                    'action_url' => $data['action_url'] ?? null,
                    'created_at' => $notification->created_at
                ];
            });
        
        $unreadCount = $admin->unreadNotifications()->count();
        
        // Count upcoming and emergency bookings
        $upcomingBookings = \App\Models\Booking::where('status', 'pending')
            ->orWhere('status', 'confirmed')
            ->count();
            
        $emergencyBookings = \App\Models\Booking::where('type', 'emergency')
            ->where(function($query) {
                $query->where('status', 'pending')
                    ->orWhere('status', 'confirmed');
            })
            ->count();
            
        $activeDrivers = \App\Models\Driver::where('is_active', 1)->count();
        $todayBookings = \App\Models\Booking::whereDate('created_at', today())->count();
        
        return Inertia::render('Admin/Dashboard', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
            'stats' => [
                'upcomingBookings' => $upcomingBookings,
                'emergencyBookings' => $emergencyBookings,
                'activeDrivers' => $activeDrivers,
                'todayBookings' => $todayBookings
            ]
        ]);
    }

    /**
     * Display the admin login form.
     *
     * @return \Inertia\Response
     */
    public function showLoginForm()
    {
        return Inertia::render('Admin/Auth/Login');
    }

    /**
     * Handle an admin login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Log the admin out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('admin.login');
    }
}
