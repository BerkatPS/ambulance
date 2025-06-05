<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Str;

class DashboardController extends Controller
{
    /**
     * Display the driver dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $driver = Auth::guard('driver')->user();
        $driver->load('user');
        
        // Get ambulance details if assigned
        $ambulance = null;
        if ($driver->ambulance_id) {
            $ambulance = Ambulance::find($driver->ambulance_id);
        }
        
        // Get recent bookings - excluding completed and cancelled
        $recentBookings = Booking::where('driver_id', $driver->id)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->with(['user', 'payment', 'rating'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                // Format dates for Indonesian display
                $booking->formatted_requested_at = $booking->requested_at ? $booking->requested_at->format('d F Y, H:i') : null;
                $booking->formatted_scheduled_at = $booking->scheduled_at ? $booking->scheduled_at->format('d F Y, H:i') : null;
                $booking->formatted_completed_at = $booking->completed_at ? $booking->completed_at->format('d F Y, H:i') : null;
                
                // Set booking time based on type
                $booking->booking_time = $booking->type === 'scheduled' 
                    ? ($booking->formatted_scheduled_at ?? 'N/A')
                    : ($booking->formatted_requested_at ?? 'N/A');
                
                return $booking;
            });
        
        // Get emergency bookings that are unassigned
        $emergencyBookings = [];
        
        // Hanya tampilkan emergency bookings jika driver berstatus available dan memiliki ambulans
        if ($driver->status === 'available' && $driver->ambulance_id) {
            $emergencyBookings = Booking::where('type', 'emergency')
                ->where('status', 'pending')
                ->whereNull('driver_id')
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    // Format dates for Indonesian display
                    $booking->formatted_requested_at = $booking->requested_at ? $booking->requested_at->format('d F Y, H:i') : null;
                    
                    // Add extra fields for UI display
                    $booking->time_since_request = $booking->requested_at ? $booking->requested_at->diffForHumans() : 'Baru saja';
                    $booking->patient_name = $booking->user->name ?? 'Pasien Darurat';
                    $booking->pickup_address_short = \Str::limit($booking->pickup_address, 50, '...');
                    
                    return $booking;
                });
        }
        
        // Calculate driver stats
        $stats = $this->calculateDriverStats($driver);
        
        return Inertia::render('Driver/Dashboard', [
            'driver' => $driver,
            'ambulance' => $ambulance,
            'recent_bookings' => $recentBookings,
            'emergency_bookings' => $emergencyBookings,
            'stats' => $stats,
        ]);
    }
    
    /**
     * Calculate driver statistics
     *
     * @param  \App\Models\Driver  $driver
     * @return array
     */
    private function calculateDriverStats(Driver $driver)
    {
        // Total completed trips
        $totalTrips = Booking::where('driver_id', $driver->id)
            ->where('status', 'completed')
            ->count();
        
        // Total earnings (from completed bookings)
        $totalEarnings = Booking::where('driver_id', $driver->id)
            ->where('status', 'completed')
            ->whereHas('payment', function ($query) {
                $query->where('status', 'paid');
            })
            ->with('payment')
            ->get()
            ->sum(function ($booking) {
                return $booking->payment ? ($booking->payment->driver_amount ?? 0) : 0;
            });
        
        // Average rating - using the ratings table
        $averageRating = \App\Models\Rating::where('driver_id', $driver->id)
            ->avg('overall') ?? 0;
        
        // Current month's earnings
        $currentMonthEarnings = Booking::where('driver_id', $driver->id)
            ->where('status', 'completed')
            ->whereHas('payment', function ($query) {
                $query->where('status', 'paid');
            })
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->with('payment')
            ->get()
            ->sum(function ($booking) {
                return $booking->payment ? ($booking->payment->driver_amount ?? 0) : 0;
            });
        
        return [
            'total_trips' => $totalTrips,
            'total_earnings' => $totalEarnings,
            'average_rating' => number_format($averageRating, 1),
            'current_month_earnings' => $currentMonthEarnings,
        ];
    }
    
    /**
     * Update driver status
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,busy,off',
            'force_reset' => 'sometimes|boolean'
        ]);
        
        $driver = Auth::guard('driver')->user();
        $driverId = $driver->id;
        
        $oldStatus = $driver->status;
        $newStatus = $validated['status'];
        $forceReset = $request->boolean('force_reset', false);
        
        try {
            // Log status update request
            Log::info("Driver status update requested", [
                'driver_id' => $driverId,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'force_reset' => $forceReset,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
            
            // Check if driver has active bookings that aren't completed
            $hasActiveBookings = Booking::where('driver_id', $driverId)
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->exists();
            
            // Prevent status changes if driver has active bookings
            if ($hasActiveBookings && !$forceReset) {
                $errorMessage = "Anda tidak dapat mengubah status karena masih memiliki pesanan aktif. Selesaikan pesanan Anda terlebih dahulu.";
                Log::warning("Driver attempted to change status while having active bookings", [
                    'driver_id' => $driverId,
                    'old_status' => $oldStatus,
                    'requested_status' => $newStatus
                ]);
                
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => $errorMessage
                    ], 403);
                }
                
                return redirect()->back()->with('error', $errorMessage);
            }
            
            // Only update if status is changing or if we're force resetting
            if ($oldStatus !== $newStatus || $forceReset) {
                // Get a fresh instance from the database to prevent stale data
                $driver = Driver::find($driverId);
                
                if (!$driver) {
                    $errorMessage = "Driver not found with ID: $driverId";
                    Log::error($errorMessage);
                    
                    if ($request->wantsJson()) {
                        return response()->json([
                            'success' => false,
                            'message' => $errorMessage
                        ], 404);
                    }
                    
                    return redirect()->back()->with('error', $errorMessage);
                }
                
                // Update directly in database to ensure it persists
                $driver->status = $newStatus;
                $saved = $driver->save();
                
                // Verify the update with a direct DB query
                $updatedDriver = Driver::find($driverId);
                $verifiedStatus = $updatedDriver ? $updatedDriver->status : null;
                
                Log::info("Status update verification", [
                    'driver_id' => $driverId,
                    'requested_status' => $newStatus,
                    'verified_status' => $verifiedStatus,
                    'saved_result' => $saved
                ]);
                
                if (!$saved || $verifiedStatus !== $newStatus) {
                    $errorMessage = 'Failed to update status. Database save failed or verification failed.';
                    Log::error($errorMessage, [
                        'driver_id' => $driverId,
                        'requested_status' => $newStatus,
                        'verified_status' => $verifiedStatus
                    ]);
                    
                    if ($request->wantsJson()) {
                        return response()->json([
                            'success' => false,
                            'message' => $errorMessage
                        ], 500);
                    }
                    
                    return redirect()->back()->with('error', $errorMessage);
                }
                
                // Update associated ambulance status
                if ($driver->ambulance_id) {
                    $ambulance = Ambulance::find($driver->ambulance_id);
                    if ($ambulance) {
                        $ambulanceStatusMap = [
                            'off' => 'unavailable',
                            'available' => 'available',
                            'busy' => 'busy'
                        ];
                        
                        $ambulance->status = $ambulanceStatusMap[$newStatus];
                        $ambulance->save();
                        
                        Log::info("Updated ambulance status", [
                            'ambulance_id' => $ambulance->id, 
                            'new_status' => $ambulance->status
                        ]);
                    }
                }
                
                $successMessage = "Status berhasil diperbarui menjadi " . strtoupper($this->getStatusTranslation($newStatus));
                Log::info($successMessage, ['driver_id' => $driverId]);
                
                // For Inertia responses, update the driver prop
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => $successMessage,
                        'status' => $newStatus
                    ]);
                }
                
                // For regular responses, update session data
                $driver->refresh(); // Refresh the model from the database
                $request->session()->put('driver_status', $newStatus); // Store in session for extra safety
                
                return redirect()->back()->with([
                    'success' => $successMessage,
                    'driver' => $driver // Pass the updated driver model back
                ]);
            } else {
                $message = "Status tidak berubah (tetap " . strtoupper($this->getStatusTranslation($oldStatus)) . ")";
                Log::info($message, ['driver_id' => $driverId]);
                
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => $message,
                        'status' => $oldStatus
                    ]);
                }
                
                return redirect()->back()->with('info', $message);
            }
        } catch (\Exception $e) {
            $errorMessage = "Error updating status: " . $e->getMessage();
            Log::error($errorMessage, [
                'driver_id' => $driverId,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ], 500);
            }
            
            return redirect()->back()->with('error', $errorMessage);
        }
    }
    
    /**
     * Allow driver to release their ambulance assignment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function releaseAmbulance(Request $request)
    {
        $driver = Auth::guard('driver')->user();
        
        if (!$driver->ambulance_id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki ambulans yang ditugaskan.');
        }
        
        try {
            // Get the ambulance before removing the relationship
            $ambulance = Ambulance::find($driver->ambulance_id);
            
            // Update ambulance to remove assigned_driver_id if it matches this driver
            if ($ambulance && $ambulance->assigned_driver_id == $driver->id) {
                $ambulance->assigned_driver_id = null;
                $ambulance->save();
            }
            
            // Update driver to remove ambulance_id
            $driver->ambulance_id = null;
            // Update driver status to available
            $driver->status = 'available';
            $driver->save();
            
            return redirect()->back()->with('success', 'Ambulans berhasil dilepaskan.');
        } catch (\Exception $e) {
            Log::error('Error releasing ambulance: ' . $e->getMessage(), [
                'driver_id' => $driver->id,
                'ambulance_id' => $driver->ambulance_id
            ]);
            
            return redirect()->back()->with('error', 'Terjadi kesalahan saat melepaskan ambulans.');
        }
    }

    /**
     * Accept an emergency booking automatically without admin intervention
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function acceptEmergencyBooking(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $driver = Auth::guard('driver')->user();
        $booking = Booking::findOrFail($validated['booking_id']);

        // Check if the driver is available and has an ambulance
        if ($driver->status !== 'available') {
            return redirect()->back()->with('error', 'Anda harus berstatus available untuk menerima pesanan darurat.');
        }

        if (!$driver->ambulance_id) {
            return redirect()->back()->with('error', 'Anda harus memiliki ambulans yang ditugaskan untuk menerima pesanan darurat.');
        }

        // Check if the booking is still pending and an emergency
        if ($booking->status !== 'pending' || $booking->type !== 'emergency') {
            return redirect()->back()->with('error', 'Pesanan ini tidak lagi tersedia atau bukan pesanan darurat.');
        }

        try {
            // Start a transaction to ensure data consistency
            \DB::beginTransaction();

            // Get the ambulance
            $ambulance = Ambulance::find($driver->ambulance_id);
            if (!$ambulance || $ambulance->status !== 'available') {
                \DB::rollBack();
                return redirect()->back()->with('error', 'Ambulans Anda tidak tersedia saat ini.');
            }

            // Update the booking with driver and ambulance information
            $booking->driver_id = $driver->id;
            
            // If booking already has an ambulance assigned and it's different from the driver's ambulance
            if ($booking->ambulance_id && $booking->ambulance_id != $driver->ambulance_id) {
                // Set the old ambulance status back to available
                $oldAmbulance = Ambulance::find($booking->ambulance_id);
                if ($oldAmbulance) {
                    $oldAmbulance->status = 'available';
                    $oldAmbulance->save();
                }
            }
            
            // Assign driver's ambulance to the booking
            $booking->ambulance_id = $driver->ambulance_id;
            $booking->status = 'confirmed';
            $booking->confirmed_at = now();
            $booking->save();

            // Update driver status to busy
            $driver->status = 'busy';
            $driver->save();

            // Update ambulance status
            $ambulance->status = 'on_duty';
            $ambulance->save();

            // Send notification about assignment
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->sendDriverAssignedNotification($booking, $driver);

            // Log the successful assignment
            Log::info('Driver auto-accepted emergency booking', [
                'booking_id' => $booking->id,
                'driver_id' => $driver->id,
                'ambulance_id' => $driver->ambulance_id
            ]);

            \DB::commit();

            return redirect()->back()->with('success', 'Anda berhasil menerima pesanan darurat. Silakan menuju lokasi penjemputan secepatnya.');
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error accepting emergency booking: ' . $e->getMessage(), [
                'driver_id' => $driver->id,
                'booking_id' => $validated['booking_id'],
                'exception' => $e->getMessage()
            ]);
            
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menerima pesanan darurat: ' . $e->getMessage());
        }
    }
    
    /**
     * Get translated status string
     * 
     * @param string $status
     * @return string
     */
    private function getStatusTranslation($status)
    {
        $translations = [
            'available' => 'tersedia',
            'busy' => 'sibuk',
            'off' => 'tidak bertugas'
        ];
        
        return $translations[$status] ?? $status;
    }
}
