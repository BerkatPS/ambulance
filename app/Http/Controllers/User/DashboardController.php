<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Traits\WithNotifications;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use WithNotifications;

    /**
     * Display the user dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get recent bookings - both active and completed, for a more comprehensive overview
        $bookings = Booking::where('user_id', $user->id)
            ->with(['ambulance', 'driver', 'payment', 'rating'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                // Check if the booking has been rated
                $booking->has_rating = $booking->rating()->exists();
                
                // Format dates for Indonesian display
                $booking->formatted_requested_at = $booking->requested_at ? $booking->requested_at->format('d F Y, H:i') : null;
                $booking->formatted_scheduled_at = $booking->scheduled_at ? $booking->scheduled_at->format('d F Y, H:i') : null;
                $booking->formatted_completed_at = $booking->completed_at ? $booking->completed_at->format('d F Y, H:i') : null;
                
                // Set booking time based on type
                $booking->booking_time = $booking->type === 'scheduled' 
                    ? ($booking->scheduled_at ?? $booking->requested_at)
                    : ($booking->requested_at ?? now());
                
                // Set emergency payment info if applicable
                if ($booking->type === 'emergency' && $booking->status === 'completed') {
                    $paymentDeadline = $booking->completed_at 
                        ? Carbon::parse($booking->completed_at)->addDays(7) 
                        : Carbon::now()->addDays(7);
                    
                    $booking->payment_deadline = $paymentDeadline->format('d F Y, H:i');
                    $booking->isEmergencyPaymentDue = $booking->payment && $booking->payment->status !== 'paid';
                    
                    // Calculate time remaining until deadline (in minutes)
                    $booking->paymentReminderInterval = 300000; // 5 minutes in milliseconds
                    
                    // Add this flag to indicate if the payment is approaching deadline (within 24 hours)
                    $booking->isPaymentUrgent = $paymentDeadline->diffInHours(now()) <= 24;
                }
                
                return $booking;
            });
        
        // Get only active bookings for the alert notification
        $activeBookings = Booking::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'assigned', 'dispatched', 'enroute', 'arrived'])
            ->with(['ambulance', 'driver', 'payment'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                // Format dates
                $booking->formatted_requested_at = $booking->requested_at ? $booking->requested_at->format('d F Y, H:i') : null;
                $booking->formatted_scheduled_at = $booking->scheduled_at ? $booking->scheduled_at->format('d F Y, H:i') : null;
                
                // Set booking time based on type
                $booking->booking_time = $booking->type === 'scheduled' 
                    ? ($booking->scheduled_at ?? $booking->requested_at)
                    : ($booking->requested_at ?? now());
                
                return $booking;
            });
        
        // Get pending payments that need user attention
        $pendingPayments = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'pending')
            ->with('booking')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($payment) {
                // Format payment dates for Indonesian display
                $payment->formatted_created_at = $payment->created_at ? $payment->created_at->format('d F Y, H:i') : null;
                $payment->formatted_paid_at = $payment->paid_at ? $payment->paid_at->format('d F Y, H:i') : null;
                
                // Add payment due date info
                if ($payment->booking && $payment->booking->type === 'emergency') {
                    $dueDate = $payment->booking->completed_at 
                        ? Carbon::parse($payment->booking->completed_at)->addDays(7)
                        : Carbon::parse($payment->created_at)->addDays(7);
                    
                    $payment->due_date = $dueDate->format('d F Y, H:i');
                    $payment->is_approaching_deadline = $dueDate->diffInHours(now()) <= 24;
                } else if ($payment->booking && $payment->booking->type === 'scheduled') {
                    if ($payment->payment_type === 'downpayment') {
                        // Downpayment due 24 hours after creation
                        $dueDate = Carbon::parse($payment->created_at)->addDay();
                        $payment->due_date = $dueDate->format('d F Y, H:i');
                        $payment->is_approaching_deadline = $dueDate->diffInHours(now()) <= 6;
                    } else {
                        // Final payment due 3 days after completion
                        $dueDate = $payment->booking->completed_at 
                            ? Carbon::parse($payment->booking->completed_at)->addDays(3)
                            : Carbon::parse($payment->created_at)->addDays(3);
                        
                        $payment->due_date = $dueDate->format('d F Y, H:i');
                        $payment->is_approaching_deadline = $dueDate->diffInHours(now()) <= 12;
                    }
                }
                
                return $payment;
            });
        
        // Get all completed bookings that need ratings
        $bookingsNeedingRating = Booking::where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereDoesntHave('rating')
            ->count();
            
        // Get stats
        $totalBookings = Booking::where('user_id', $user->id)->count();
        $completedBookings = Booking::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $emergencyBookings = Booking::where('user_id', $user->id)
            ->where('type', 'emergency')
            ->count();
        
        $totalPayments = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'paid')
            ->sum('amount');
            
        $averageRating = Rating::where('user_id', $user->id)->avg('overall') ?: 0;
        $totalRatings = Rating::where('user_id', $user->id)->count();
        
        // Check if there are any emergency bookings with pending payments
        $hasEmergencyPaymentsDue = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->where('type', 'emergency')
                  ->where('status', 'completed');
            })
            ->where('status', 'pending')
            ->exists();
        
        // Get recent payment history for summary
        $recentPaymentHistory = Payment::whereHas('booking', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();
        
        return Inertia::render('User/Dashboard', [
            'bookings' => $bookings,
            'activeBookings' => $activeBookings,
            'pendingPayments' => $pendingPayments,
            'bookingsNeedingRating' => $bookingsNeedingRating,
            'hasEmergencyPaymentsDue' => $hasEmergencyPaymentsDue,
            'stats' => [
                'totalBookings' => $totalBookings,
                'completedBookings' => $completedBookings,
                'emergencyBookings' => $emergencyBookings,
                'totalPayments' => $totalPayments,
                'averageRating' => number_format($averageRating, 1),
                'totalRatings' => $totalRatings,
            ],
            'recentPaymentHistory' => $recentPaymentHistory,
            'notifications' => $this->getNotifications()['notifications'],
            'unreadCount' => $this->getNotifications()['unreadCount'],
        ]);
    }
}
