<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EmergencyBookingController extends Controller
{
    /**
     * Store a new emergency booking and redirect to confirmation page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:100',
            'contact_number' => 'required|string|max:15',
            'location' => 'required|string|max:500',
            'emergency_type' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);
        
        try {
            // Generate a unique booking reference
            $bookingCode = 'AMB' . date('Ymd') . sprintf('%03d', Booking::count() + 1);
            
            // Create the booking
            $booking = new Booking();
            $booking->booking_code = $bookingCode;
            $booking->user_id = Auth::id() ?? 1; // Default to user 1 if not logged in (for demo purposes)
            $booking->driver_id = null; // Will be assigned later
            $booking->ambulance_id = null; // Will be assigned later
            
            // Service Type
            $booking->type = 'emergency';
            $booking->priority = 'urgent'; // Default for emergency bookings
            
            // Patient Info
            $booking->patient_name = $validated['patient_name'];
            $booking->patient_age = null; // Could be added to form later
            $booking->condition_notes = $validated['description'] ?? null;
            
            // Locations - For emergency, pickup address is the current location
            $booking->pickup_address = $validated['location'];
            $booking->pickup_lat = null; // Could integrate with maps API
            $booking->pickup_lng = null;
            $booking->destination_address = 'Nearest Hospital'; // Default for emergency
            $booking->destination_lat = null;
            $booking->destination_lng = null;
            
            // Contact info
            $booking->contact_name = $validated['patient_name']; // Same as patient in emergency
            $booking->contact_phone = $validated['contact_number'];
            
            // Timing
            $booking->requested_at = now();
            $booking->scheduled_at = null; // Not applicable for emergency
            
            // Pricing - Will be calculated later
            $booking->base_price = 500000; // Default base price
            $booking->distance_price = 0;
            $booking->total_amount = 500000; // Initial total
            
            // Status
            $booking->status = 'pending';
            
            // Notes
            $booking->notes = 'Emergency: ' . $validated['emergency_type'];
            
            $booking->save();
            
            // In a real application, you would send notifications to admins and available drivers here
            
            // Redirect to confirmation page with booking details
            return Inertia::render('EmergencyBooking/Confirm', [
                'booking' => [
                    'id' => $booking->booking_code,
                    'created_at' => $booking->created_at,
                    'status' => $booking->status,
                    'patient_name' => $booking->patient_name,
                    'contact_number' => $booking->contact_phone,
                    'location' => $booking->pickup_address,
                    'emergency_type' => $validated['emergency_type'],
                    'description' => $booking->condition_notes,
                    'eta' => 10, // Estimated time in minutes (would be calculated in real app)
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error creating emergency booking: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'An error occurred while processing your emergency booking. Please try again or call our emergency hotline.',
            ]);
        }
    }

    /**
     * Show the confirmation page for an existing booking.
     *
     * @param  string  $bookingCode
     * @return \Illuminate\Http\Response
     */
    public function show($bookingCode)
    {
        $booking = Booking::where('booking_code', $bookingCode)
            ->where('type', 'emergency')
            ->firstOrFail();
        
        return Inertia::render('EmergencyBooking/Confirm', [
            'booking' => [
                'id' => $booking->booking_code,
                'created_at' => $booking->created_at,
                'status' => $booking->status,
                'patient_name' => $booking->patient_name,
                'contact_number' => $booking->contact_phone,
                'location' => $booking->pickup_address,
                'emergency_type' => $booking->notes, // Extracted from notes
                'description' => $booking->condition_notes,
                'eta' => 10, // Estimated time in minutes (would be calculated in real app)
            ]
        ]);
    }
}
