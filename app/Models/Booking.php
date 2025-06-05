<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_code',
        'user_id',
        'driver_id',
        'ambulance_id',
        'type',
        'priority',
        'patient_name',
        'patient_age',
        'condition_notes',
        'pickup_address',
        'pickup_lat',
        'pickup_lng',
        'destination_address',
        'destination_lat',
        'destination_lng',
        'contact_name',
        'contact_phone',
        'requested_at',
        'scheduled_at',
        'dispatched_at',
        'arrived_at',
        'completed_at',
        'distance_km',
        'base_price',
        'distance_price',
        'total_amount',
        'downpayment_amount',
        'dp_payment_deadline',
        'final_payment_deadline',
        'is_downpayment_paid',
        'is_fully_paid',
        'status',
        'notes',
        'cancel_reason'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'pickup_lat' => 'decimal:6',
        'pickup_lng' => 'decimal:6',
        'destination_lat' => 'decimal:6',
        'destination_lng' => 'decimal:6',
        'distance_km' => 'decimal:2',
        'requested_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'dispatched_at' => 'datetime',
        'arrived_at' => 'datetime',
        'completed_at' => 'datetime',
        'dp_payment_deadline' => 'datetime',
        'final_payment_deadline' => 'datetime',
        'is_downpayment_paid' => 'boolean',
        'is_fully_paid' => 'boolean'
    ];

    /**
     * Get the user that made the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the driver assigned to the booking.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    /**
     * Get the ambulance assigned to the booking.
     */
    public function ambulance(): BelongsTo
    {
        return $this->belongsTo(Ambulance::class);
    }

    /**
     * Get the payment associated with the booking.
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
    
    /**
     * Get the rating associated with the booking.
     */
    public function rating(): HasOne
    {
        return $this->hasOne(Rating::class);
    }

    /**
     * Get formatted pickup location attribute.
     */
    public function getPickupLocationAttribute()
    {
        return [
            'address' => $this->pickup_address,
            'lat' => $this->pickup_lat,
            'lng' => $this->pickup_lng
        ];
    }

    /**
     * Get formatted dropoff location attribute.
     */
    public function getDropoffLocationAttribute()
    {
        return [
            'address' => $this->destination_address,
            'lat' => $this->destination_lat,
            'lng' => $this->destination_lng
        ];
    }

    /**
     * Format date for Indonesian users.
     */
    public function getFormattedRequestedAtAttribute()
    {
        return $this->requested_at ? $this->requested_at->format('d F Y, H:i') : null;
    }

    /**
     * Format scheduled date for Indonesian users.
     */
    public function getFormattedScheduledAtAttribute()
    {
        return $this->scheduled_at ? $this->scheduled_at->format('d F Y, H:i') : null;
    }

    /**
     * Format completed date for Indonesian users.
     */
    public function getFormattedCompletedAtAttribute()
    {
        return $this->completed_at ? $this->completed_at->format('d F Y, H:i') : null;
    }

    /**
     * Get formatted booking time based on type.
     */
    public function getBookingTimeAttribute()
    {
        return $this->type === 'scheduled' 
            ? ($this->scheduled_at ? $this->scheduled_at->format('d F Y, H:i') : 'N/A')
            : ($this->requested_at ? $this->requested_at->format('d F Y, H:i') : 'N/A');
    }

    /**
     * Calculate downpayment amount (30% of total amount)
     *
     * @return float
     */
    public function calculateDownpayment()
    {
        return round($this->total_amount * 0.3);
    }

    /**
     * Calculate remaining payment amount (70% of total amount)
     *
     * @return float
     */
    public function calculateRemainingPayment()
    {
        return $this->total_amount - $this->downpayment_amount;
    }

    /**
     * Check if the booking is of scheduled type
     * 
     * @return bool
     */
    public function isScheduledBooking()
    {
        return $this->type === 'scheduled';
    }

    /**
     * Check if the booking requires downpayment
     * 
     * @return bool
     */
    public function requiresDownpayment()
    {
        return $this->isScheduledBooking() && !$this->is_downpayment_paid;
    }

    /**
     * Check if the booking requires final payment
     * 
     * @return bool
     */
    public function requiresFinalPayment()
    {
        return $this->isScheduledBooking() && $this->is_downpayment_paid && !$this->is_fully_paid;
    }

    /**
     * Check if the booking has expired downpayment deadline
     * 
     * @return bool
     */
    public function hasExpiredDownpaymentDeadline()
    {
        return $this->dp_payment_deadline && now()->gt($this->dp_payment_deadline) && !$this->is_downpayment_paid;
    }

    /**
     * Check if the booking has expired final payment deadline
     * 
     * @return bool
     */
    public function hasExpiredFinalPaymentDeadline()
    {
        return $this->final_payment_deadline && now()->gt($this->final_payment_deadline) && !$this->is_fully_paid;
    }

    /**
     * Scope a query to only include emergency bookings.
     */
    public function scopeEmergency($query)
    {
        return $query->where('type', 'emergency');
    }

    /**
     * Scope a query to only include scheduled bookings.
     */
    public function scopeScheduled($query)
    {
        return $query->where('type', 'scheduled');
    }

    /**
     * Scope a query to only include pending bookings.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include confirmed bookings.
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    /**
     * Scope a query to only include dispatched bookings.
     */
    public function scopeDispatched($query)
    {
        return $query->where('status', 'dispatched');
    }

    /**
     * Scope a query to only include arrived bookings.
     */
    public function scopeArrived($query)
    {
        return $query->where('status', 'arrived');
    }
    
    /**
     * Scope a query to only include completed bookings.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include cancelled bookings.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Scope a query to get bookings by priority.
     */
    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }
}
