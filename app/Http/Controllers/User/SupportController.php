<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Display the support page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('User/Support/Index');
    }
    
    /**
     * Show the form for creating a new support ticket.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        $booking_id = $request->query('booking_id');
        $booking = null;
        
        if ($booking_id) {
            $booking = \App\Models\Booking::where('id', $booking_id)
                ->where('user_id', auth()->id())
                ->first();
        }
        
        return Inertia::render('User/Support/Create', [
            'booking' => $booking,
        ]);
    }
    
    /**
     * Store a new support ticket.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'category' => 'required|string|in:booking,payment,account,other',
            'priority' => 'required|string|in:low,medium,high',
        ]);
        
        // Here you would typically save the support ticket to the database
        // For now, we'll just redirect with a success message
        
        return redirect()->route('support')->with('success', 'Your support request has been submitted successfully. Our team will contact you shortly.');
    }
}
