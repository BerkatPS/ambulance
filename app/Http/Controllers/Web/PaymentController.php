<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display the payment page for a booking.
     *
     * @param  int  $bookingId
     * @return \Inertia\Response
     */
    public function show($bookingId)
    {
        $booking = Booking::with('payment')
            ->where('user_id', Auth::id())
            ->findOrFail($bookingId);
        
        // Check if payment already exists
        if ($booking->payment && $booking->payment->status === 'paid') {
            return redirect()->route('booking.show', $bookingId)
                ->with('info', 'This booking has already been paid.');
        }
        
        // Get payment methods and cost calculation
        $paymentMethods = [
            ['id' => 'cash', 'name' => 'Cash'],
            ['id' => 'credit_card', 'name' => 'Credit Card'],
            ['id' => 'virtual_account', 'name' => 'Virtual Account'],
            ['id' => 'e_wallet', 'name' => 'E-Wallet'],
        ];
        
        $baseCost = $booking->type === 'emergency' ? 500000 : 350000; // Base cost in IDR
        
        return Inertia::render('Payment/Create', [
            'booking' => $booking,
            'paymentMethods' => $paymentMethods,
            'baseCost' => $baseCost
        ]);
    }

    /**
     * Process the payment for a booking.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $bookingId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function process(Request $request, $bookingId)
    {
        $booking = Booking::where('user_id', Auth::id())->findOrFail($bookingId);
        
        $validated = $request->validate([
            'payment_method' => 'required|string|in:cash,credit_card,virtual_account,e_wallet',
            'amount' => 'required|numeric|min:1000',
        ]);
        
        // Check if payment exists
        $payment = Payment::where('booking_id', $booking->id)->first();
        
        if (!$payment) {
            $payment = new Payment();
            $payment->booking_id = $booking->id;
            $payment->user_id = Auth::id();
        }
        
        $payment->amount = $validated['amount'];
        $payment->payment_method = $validated['payment_method'];
        
        // For cash payments, mark as pending until driver confirms
        // For other methods, handle payment gateway integration
        if ($validated['payment_method'] === 'cash') {
            $payment->status = 'pending';
            $payment->payment_date = null;
            $payment->save();
            
            return redirect()->route('booking.show', $bookingId)
                ->with('success', 'Cash payment will be collected by the driver.');
        } else {
            // Handle payment gateway integration
            // This is a simplified example - in a real app, you would integrate with a payment gateway
            
            // Generate a unique transaction ID
            $transactionId = 'TRX-' . time() . '-' . $booking->id;
            $payment->transaction_id = $transactionId;
            $payment->status = 'processing';
            $payment->save();
            
            // Redirect to payment gateway (simulated for this example)
            return redirect()->route('payment.gateway', [
                'booking_id' => $bookingId,
                'transaction_id' => $transactionId
            ]);
        }
    }

    /**
     * Simulated payment gateway page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function gateway(Request $request)
    {
        $payment = Payment::where('transaction_id', $request->transaction_id)
            ->with('booking')
            ->firstOrFail();
        
        return Inertia::render('Payment/Gateway', [
            'payment' => $payment,
            'returnUrl' => route('payment.callback', ['transaction_id' => $payment->transaction_id])
        ]);
    }

    /**
     * Handle payment gateway callback.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback(Request $request)
    {
        $payment = Payment::where('transaction_id', $request->transaction_id)
            ->firstOrFail();
        
        // In a real application, you would validate the payment status with the payment gateway
        // For this example, we'll simply mark it as paid
        $payment->status = 'paid';
        $payment->payment_date = now();
        $payment->save();
        
        return redirect()->route('booking.show', $payment->booking_id)
            ->with('success', 'Payment completed successfully.');
    }

    /**
     * Display a receipt for a completed payment.
     *
     * @param  int  $paymentId
     * @return \Inertia\Response
     */
    public function receipt($paymentId)
    {
        $payment = Payment::with(['booking', 'user'])
            ->where('user_id', Auth::id())
            ->findOrFail($paymentId);
        
        if ($payment->status !== 'paid') {
            return redirect()->route('booking.show', $payment->booking_id)
                ->with('error', 'No receipt available. Payment has not been completed.');
        }
        
        return Inertia::render('Payment/Receipt', [
            'payment' => $payment
        ]);
    }
}
