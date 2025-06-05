<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_id',
        'user_id',
        'driver_id',      // Changed back to driver_id based on actual DB schema
        'rating',         // Using rating field
        'comments',       // Using comments field
        'punctuality',
        'service',
        'vehicle_condition'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
        'punctuality' => 'integer',
        'service' => 'integer',
        'vehicle_condition' => 'integer'
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the booking that owns the rating.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user that owns the rating.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the driver that was rated.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id'); // Using driver_id
    }

    /**
     * Scope a query to only include high ratings.
     */
    public function scopeHighRatings($query)
    {
        return $query->where('rating', '>=', 4);
    }

    /**
     * Scope a query to only include low ratings.
     */
    public function scopeLowRatings($query)
    {
        return $query->where('rating', '<', 3);
    }

    /**
     * Scope a query to only include ratings for a specific driver.
     */
    public function scopeForDriver($query, $driverId)
    {
        return $query->where('driver_id', $driverId);
    }
}
