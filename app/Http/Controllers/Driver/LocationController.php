<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LocationController extends Controller
{
    /**
     * Update the driver's current location.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'driver_id' => 'sometimes|exists:drivers,id',
                'booking_id' => 'sometimes|exists:bookings,id',
            ]);
            
            // Get the driver - either from auth or from the provided driver_id
            if (Auth::guard('driver')->check()) {
                $driver = Auth::guard('driver')->user();
            } elseif (isset($validated['driver_id'])) {
                $driver = Driver::find($validated['driver_id']);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Driver not authenticated or specified',
                ], 401);
            }
            
            // Format location as JSON string
            $location = json_encode([
                'lat' => $validated['latitude'],
                'lng' => $validated['longitude'],
                'updated_at' => now()->toIso8601String(),
            ]);
            
            // Update driver's current location
            $driver->current_location = $location;
            $driver->save();
            
            // Update booking location if booking_id is provided
            if (isset($validated['booking_id'])) {
                $booking = Booking::find($validated['booking_id']);
                if ($booking) {
                    // Make sure booking belongs to this driver or allow admins to update
                    if ($booking->driver_id == $driver->id || Auth::guard('admin')->check()) {
                        $booking->driver_location = $location;
                        $booking->save();
                    }
                }
            }
            
            // Log the location update
            Log::info('Driver location updated', [
                'driver_id' => $driver->id,
                'driver_name' => $driver->name,
                'location' => $location,
                'booking_id' => $validated['booking_id'] ?? null,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Lokasi berhasil diperbarui',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error updating driver location', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui lokasi: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Update the driver's availability status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAvailability(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,busy,off',
        ]);
        
        $driver = Auth::guard('driver')->user();
        $oldStatus = $driver->status;
        $driver->status = $validated['status'];
        $driver->save();
        
        // Update ambulance status if assigned
        if ($driver->ambulance_id) {
            $ambulance = Ambulance::find($driver->ambulance_id);
            if ($ambulance) {
                switch ($validated['status']) {
                    case 'available':
                        $ambulance->status = 'available';
                        break;
                    case 'busy':
                        $ambulance->status = 'on_duty'; // Changed from 'busy' to 'on_duty' to match valid enum values
                        break;
                    case 'off':
                        $ambulance->status = 'maintenance';
                        break;
                }
                $ambulance->save();
            }
        }
        
        // Log the status update
        Log::info('Driver status updated', [
            'driver_id' => $driver->id,
            'driver_name' => $driver->name,
            'old_status' => $oldStatus,
            'new_status' => $driver->status,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Status updated to ' . strtoupper($validated['status']),
            'status' => $validated['status'],
        ]);
    }
}
