<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Ambulance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display the emergency booking form
     *
     * @return \Inertia\Response
     */
    public function emergencyBooking()
    {
        return Inertia::render('EmergencyBooking/Emergency');
    }

    /**
     * Display the scheduled booking form
     *
     * @return \Inertia\Response
     */
    public function scheduledBooking()
    {
        return Inertia::render('ScheduledBooking/Create');
    }

    /**
     * Store a newly created emergency booking in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeEmergencyBooking(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_age' => 'nullable|integer|min:0|max:150',
            'condition_notes' => 'nullable|string',
            'pickup_address' => 'required|string',
            'pickup_lat' => 'nullable|numeric',
            'pickup_lng' => 'nullable|numeric',
            'destination_address' => 'required|string',
            'destination_lat' => 'nullable|numeric',
            'destination_lng' => 'nullable|numeric',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
            'priority' => 'required|string|in:critical,urgent,normal',
        ]);

        // Find an available ambulance
        $ambulance = Ambulance::where('status', 'available')->first();

        $booking = new Booking();
        $booking->user_id = Auth::id();
        $booking->ambulance_id = $ambulance ? $ambulance->id : null;
        $booking->patient_name = $validated['patient_name'];
        $booking->patient_age = $validated['patient_age'];
        $booking->condition_notes = $validated['condition_notes'];
        $booking->pickup_address = $validated['pickup_address'];
        $booking->pickup_lat = $validated['pickup_lat'];
        $booking->pickup_lng = $validated['pickup_lng'];
        $booking->destination_address = $validated['destination_address'];
        $booking->destination_lat = $validated['destination_lat'];
        $booking->destination_lng = $validated['destination_lng'];
        $booking->contact_name = $validated['contact_name'];
        $booking->contact_phone = $validated['contact_phone'];
        $booking->notes = $validated['notes'];
        $booking->type = 'emergency';
        $booking->priority = $validated['priority'];
        $booking->status = 'pending';
        $booking->save();

        // If ambulance was found, update its status
        if ($ambulance) {
            $ambulance->status = 'dispatched';
            $ambulance->save();
        }

        return redirect()->route('booking.emergency.confirm', $booking->id);
    }

    /**
     * Store a newly created scheduled booking in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeScheduledBooking(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_age' => 'nullable|integer|min:0|max:150',
            'condition_notes' => 'nullable|string',
            'pickup_address' => 'required|string',
            'pickup_lat' => 'nullable|numeric',
            'pickup_lng' => 'nullable|numeric',
            'destination_address' => 'required|string',
            'destination_lat' => 'nullable|numeric',
            'destination_lng' => 'nullable|numeric',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
            'scheduled_date' => 'required|date|after:today',
            'scheduled_time' => 'required',
        ]);

        $booking = new Booking();
        $booking->user_id = Auth::id();
        $booking->patient_name = $validated['patient_name'];
        $booking->patient_age = $validated['patient_age'];
        $booking->condition_notes = $validated['condition_notes'];
        $booking->pickup_address = $validated['pickup_address'];
        $booking->pickup_lat = $validated['pickup_lat'];
        $booking->pickup_lng = $validated['pickup_lng'];
        $booking->destination_address = $validated['destination_address'];
        $booking->destination_lat = $validated['destination_lat'];
        $booking->destination_lng = $validated['destination_lng'];
        $booking->contact_name = $validated['contact_name'];
        $booking->contact_phone = $validated['contact_phone'];
        $booking->notes = $validated['notes'];
        $booking->type = 'scheduled';
        $booking->priority = 'normal';
        $booking->status = 'scheduled';
        $booking->scheduled_date = $validated['scheduled_date'];
        $booking->scheduled_time = $validated['scheduled_time'];
        $booking->save();

        return redirect()->route('booking.scheduled.confirm', $booking->id);
    }

    /**
     * Display the booking confirmation page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function emergencyConfirmation($id)
    {
        $booking = Booking::with('ambulance')->findOrFail($id);
        
        return Inertia::render('EmergencyBooking/Confirm', [
            'booking' => $booking
        ]);
    }

    /**
     * Display the scheduled booking confirmation page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function scheduledConfirmation($id)
    {
        $booking = Booking::findOrFail($id);
        
        return Inertia::render('ScheduledBooking/Confirm', [
            'booking' => $booking
        ]);
    }

    /**
     * Display a listing of the user's bookings.
     *
     * @return \Inertia\Response
     */
    public function userBookings()
    {
        $bookings = Booking::where('user_id', Auth::id())
            ->with('ambulance')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return Inertia::render('Booking/History', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Display the specified booking details.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $booking = Booking::with(['ambulance', 'payment', 'rating'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);
            
        return Inertia::render('Booking/Show', [
            'booking' => $booking
        ]);
    }

    /**
     * Cancel the specified booking.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel($id)
    {
        $booking = Booking::where('user_id', Auth::id())->findOrFail($id);
        
        // Only allow cancellation of pending or scheduled bookings
        if (in_array($booking->status, ['pending', 'scheduled'])) {
            $booking->status = 'cancelled';
            $booking->save();
            
            // If ambulance was assigned, make it available again
            if ($booking->ambulance_id) {
                $ambulance = Ambulance::find($booking->ambulance_id);
                if ($ambulance) {
                    $ambulance->status = 'available';
                    $ambulance->save();
                }
            }
            
            return redirect()->back()->with('success', 'Booking cancelled successfully.');
        }
        
        return redirect()->back()->with('error', 'This booking cannot be cancelled.');
    }
}
