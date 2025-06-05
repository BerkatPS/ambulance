<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Display a listing of the payments.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Base query
        $query = Payment::with(['booking.user']);
        
        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by payment method
        if ($request->has('method') && $request->method) {
            $query->where('method', $request->method);
        }
        
        // Filter by payment type
        if ($request->has('payment_type') && $request->payment_type) {
            $query->where('payment_type', $request->payment_type);
        }
        
        // Filter by date range - created_at
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Filter by amount range
        if ($request->has('min_amount') && $request->min_amount) {
            $query->where('amount', '>=', $request->min_amount);
        }
        
        if ($request->has('max_amount') && $request->max_amount) {
            $query->where('amount', '<=', $request->max_amount);
        }
        
        // Search by transaction ID or booking details
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhere('va_number', 'like', "%{$search}%")
                  ->orWhere('duitku_reference', 'like', "%{$search}%")
                  ->orWhereHas('booking', function ($sq) use ($search) {
                      $sq->where('booking_number', 'like', "%{$search}%");
                  });
            });
        }
        
        // Default sort by created_at desc if not specified
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        
        // Check if sorting by user/booking relation field
        if (strpos($sortBy, 'booking.') === 0) {
            // Extract field after the dot
            $bookingField = substr($sortBy, strlen('booking.'));
            
            // Join with bookings table
            if (!$query->getQuery()->joins || !collect($query->getQuery()->joins)->pluck('table')->contains('bookings')) {
                $query->join('bookings', 'payments.booking_id', '=', 'bookings.id')
                    ->select('payments.*');
            }
            
            $query->orderBy('bookings.'.$bookingField, $sortOrder);
        } else {
            // Ensure we're only sorting by valid columns
            $validColumns = ['created_at', 'amount', 'status', 'method', 'transaction_id', 'paid_at', 'expires_at'];
            if (in_array($sortBy, $validColumns)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('created_at', 'desc');
            }
        }
        
        $payments = $query->paginate($request->per_page ?? 15)
            ->appends($request->all());
            
        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => [
                'status' => $request->status,
                'method' => $request->method,
                'payment_type' => $request->payment_type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'min_amount' => $request->min_amount,
                'max_amount' => $request->max_amount,
                'search' => $request->search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $request->per_page,
            ],
            'filterOptions' => [
                'statuses' => [
                    ['value' => 'pending', 'label' => 'Pending'],
                    ['value' => 'paid', 'label' => 'Dibayar'],
                    ['value' => 'failed', 'label' => 'Gagal'],
                    ['value' => 'expired', 'label' => 'Kedaluwarsa'],
                ],
                'methods' => [
                    ['value' => 'qris', 'label' => 'QRIS'],
                    ['value' => 'va_bca', 'label' => 'Virtual Account BCA'],
                    ['value' => 'va_mandiri', 'label' => 'Virtual Account Mandiri'],
                    ['value' => 'va_bri', 'label' => 'Virtual Account BRI'],
                    ['value' => 'va_bni', 'label' => 'Virtual Account BNI'],
                    ['value' => 'gopay', 'label' => 'GoPay'],
                ],
                'paymentTypes' => [
                    ['value' => 'downpayment', 'label' => 'Uang Muka'],
                    ['value' => 'full_payment', 'label' => 'Pembayaran Penuh'],
                ],
            ],
        ]);
    }

    /**
     * Display the specified payment.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $payment = Payment::with(['booking.user'])->findOrFail($id);
        
        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment,
            'paymentMethod' => $this->formatPaymentMethod($payment->method),
            'paymentStatus' => $this->formatPaymentStatus($payment->status),
            'paymentType' => $this->formatPaymentType($payment->payment_type),
            'formattedAmount' => $this->formatCurrency($payment->amount),
            'formattedTotalBookingAmount' => $this->formatCurrency($payment->total_booking_amount),
        ]);
    }

    /**
     * Update the specified payment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string|in:pending,paid,failed,expired',
            'notes' => 'nullable|string',
        ]);
        
        // Update paid_at timestamp if status changed to paid
        if ($validated['status'] == 'paid' && $payment->status != 'paid') {
            $payment->paid_at = now();
        }
        
        $payment->status = $validated['status'];
        // Add notes to duitku_data if it exists
        if (isset($validated['notes']) && $validated['notes']) {
            $duitkuData = $payment->duitku_data ? json_decode($payment->duitku_data, true) : [];
            $duitkuData['admin_notes'] = $validated['notes'];
            $payment->duitku_data = json_encode($duitkuData);
        }
        $payment->save();
        
        return redirect()->route('admin.payments.show', $payment->id)
            ->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    /**
     * Generate an invoice for the payment.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function invoice($id)
    {
        $payment = Payment::with(['booking', 'booking.user'])->findOrFail($id);
        
        if ($payment->status !== 'paid') {
            return redirect()->route('admin.payments.show', $id)
                ->with('error', 'Tidak dapat menghasilkan invoice untuk pembayaran yang belum selesai.');
        }
        
        return Inertia::render('Admin/Payments/Invoice', [
            'payment' => $payment,
            'invoice' => [
                'number' => 'INV-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),
                'date' => $payment->paid_at ? Carbon::parse($payment->paid_at)->format('d M Y') : null,
                'company' => [
                    'name' => 'Ambulance Portal Service',
                    'address' => 'Jalan Ambulans No. 123, Jakarta',
                    'phone' => '+62 21 555-1234',
                    'email' => 'admin@ambulance-portal.com',
                ],
            ],
            'formattedAmount' => $this->formatCurrency($payment->amount),
            'formattedTotalBookingAmount' => $this->formatCurrency($payment->total_booking_amount),
            'paymentMethod' => $this->formatPaymentMethod($payment->method),
            'paymentType' => $this->formatPaymentType($payment->payment_type),
        ]);
    }

    /**
     * Format payment status for display
     * 
     * @param string $status
     * @return string
     */
    private function formatPaymentStatus($status)
    {
        $statuses = [
            'pending' => 'Menunggu Pembayaran',
            'paid' => 'Sudah Dibayar',
            'failed' => 'Gagal',
            'expired' => 'Kedaluwarsa'
        ];
        
        return $statuses[$status] ?? $status;
    }
    
    /**
     * Format payment method for display
     * 
     * @param string $method
     * @return string
     */
    private function formatPaymentMethod($method)
    {
        $methods = [
            'qris' => 'QRIS',
            'va_bca' => 'Virtual Account BCA',
            'va_mandiri' => 'Virtual Account Mandiri',
            'va_bri' => 'Virtual Account BRI',
            'va_bni' => 'Virtual Account BNI',
            'gopay' => 'GoPay'
        ];
        
        return $methods[$method] ?? $method;
    }
    
    /**
     * Format payment type for display
     * 
     * @param string $type
     * @return string
     */
    private function formatPaymentType($type)
    {
        $types = [
            'downpayment' => 'Uang Muka',
            'full_payment' => 'Pembayaran Penuh'
        ];
        
        return $types[$type] ?? $type;
    }
    
    /**
     * Format currency for display
     * 
     * @param int|float $amount
     * @return string
     */
    private function formatCurrency($amount)
    {
        if (!$amount) {
            return 'Rp0';
        }
        
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }
}
