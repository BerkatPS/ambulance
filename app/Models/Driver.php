<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Driver extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'driver_code',
        'full_name',
        'name',
        'email',
        'password',
        'phone',
        'license_number',
        'license_expiry',
        'experience_years',
        'status',
        'current_location',
        'current_lat',
        'current_lng',
        'is_available',
        'profile_photo',
        'ambulance_id',
        'employee_id',
        'remember_token',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'license_expiry' => 'date',
        'current_lat' => 'decimal:6',
        'current_lng' => 'decimal:6',
        'experience_years' => 'integer',
        'is_available' => 'boolean',
        'password' => 'hashed',
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the user associated with the driver.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the ambulance associated with the driver.
     */
    public function ambulance(): BelongsTo
    {
        return $this->belongsTo(Ambulance::class);
    }

    /**
     * Get the bookings for the driver.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the ratings for the driver.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Scope a query to only include available drivers.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope a query to only include active drivers.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to find drivers near a location.
     */
    public function scopeNearby($query, $lat, $lng, $radius = 5)
    {
        // Simplified calculation for nearby drivers
        // In a real application, you would use a more sophisticated calculation
        return $query->whereRaw(
            "(6371 * acos(cos(radians(?)) * cos(radians(current_lat)) * cos(radians(current_lng) - radians(?)) + sin(radians(?)) * sin(radians(current_lat)))) < ?",
            [$lat, $lng, $lat, $radius]
        );
    }
}
