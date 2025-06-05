<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DriverLocationWebhookController extends Controller
{
    /**
     * Update driver location
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // Validate the webhook request
        $validated = $request->validate([
            'driver_id' => 'required|exists:drivers,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'accuracy' => 'nullable|numeric',
            'timestamp' => 'nullable|date',
        ]);
        
        Log::info('Driver location update received', $validated);
        
        try {
            $driver = Driver::findOrFail($validated['driver_id']);
            
            // In a real app, we would store this in a driver_locations table
            // For now, we'll just update the driver's last_known_location if that field exists
            if (isset($driver->last_known_latitude) && isset($driver->last_known_longitude)) {
                $driver->last_known_latitude = $validated['latitude'];
                $driver->last_known_longitude = $validated['longitude'];
                $driver->last_location_update = $validated['timestamp'] ?? now();
                $driver->save();
            }
            
            // You might also want to update any active bookings this driver is assigned to
            
            return response()->json([
                'success' => true,
                'message' => 'Driver location updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating driver location', [
                'driver_id' => $validated['driver_id'],
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating driver location'
            ], 500);
        }
    }
}
