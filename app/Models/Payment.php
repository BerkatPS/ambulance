<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_id',
        'transaction_id',
        'duitku_reference',
        'type',
        'method',
        'payment_type',
        'amount',
        'total_booking_amount',
        'downpayment_percentage',
        'status',
        'payment_url',
        'va_number',
        'qr_code',
        'paid_at',
        'expires_at',
        'duitku_data'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'integer',
        'total_booking_amount' => 'integer',
        'downpayment_percentage' => 'float',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
        'duitku_data' => 'array'
    ];

    /**
     * Get the booking that owns the payment.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
    
    /**
     * Get the user who made the booking associated with this payment.
     */
    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            Booking::class,
            'id', // Foreign key on bookings table
            'id', // Foreign key on users table
            'booking_id', // Local key on payments table
            'user_id' // Local key on bookings table
        );
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope a query to only include failed payments.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope a query to filter by payment method.
     */
    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Scope a query to only include downpayment payments.
     */
    public function scopeDownpayment($query)
    {
        return $query->where('payment_type', 'downpayment');
    }

    /**
     * Scope a query to only include full payments.
     */
    public function scopeFullPayment($query)
    {
        return $query->where('payment_type', 'full_payment');
    }
    
    /**
     * Check if payment is a downpayment
     * 
     * @return bool
     */
    public function isDownPayment()
    {
        return $this->payment_type === 'downpayment';
    }
    
    /**
     * Check if payment is a full payment
     * 
     * @return bool
     */
    public function isFullPayment()
    {
        return $this->payment_type === 'full_payment';
    }
    
    /**
     * Check if payment has expired
     * 
     * @return bool
     */
    public function hasExpired()
    {
        return $this->expires_at && now()->gt($this->expires_at) && $this->status === 'pending';
    }
    
    /**
     * Get remaining time before expiry in minutes
     * 
     * @return int|null
     */
    public function getRemainingTimeInMinutes()
    {
        if (!$this->expires_at || $this->status !== 'pending') {
            return null;
        }
        
        return max(0, now()->diffInMinutes($this->expires_at, false));
    }
}
