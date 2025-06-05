<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ambulance extends Model
{
    use HasFactory;

    /**
     * Disable timestamps for this model
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'registration_number',
        'model',
        'year',
        'ambulance_type_id',
        'ambulance_station_id',
        'status',
        'last_maintenance_date',
        'next_maintenance_date',
        'equipment',
        'notes',
        'vehicle_code',
        'license_plate',
        'assigned_driver_id'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'year' => 'integer'
    ];

    /**
     * Get the drivers assigned to this ambulance.
     */
    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class);
    }
    
    /**
     * Get the current driver assigned to this ambulance.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'assigned_driver_id');
    }

    /**
     * Get the bookings for the ambulance.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the maintenance records for the ambulance.
     */
    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }
    
    /**
     * Alias for maintenanceRecords to maintain compatibility with controller.
     */
    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    /**
     * Scope a query to only include available ambulances.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope a query to only include operational ambulances.
     */
    public function scopeOperational($query)
    {
        return $query->whereIn('status', ['available', 'on_duty']);
    }

    /**
     * Scope a query to find ambulances by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('ambulance_type_id', $type);
    }

    /**
     * Get the ambulance type associated with this ambulance.
     */
    public function ambulanceType(): BelongsTo
    {
        return $this->belongsTo(AmbulanceType::class);
    }
    
    /**
     * Get the ambulance station associated with this ambulance.
     */
    public function ambulanceStation(): BelongsTo
    {
        return $this->belongsTo(AmbulanceStation::class);
    }

    /**
     * Scope a query to find ambulances near a location.
     */
    public function scopeNearby($query, $lat, $lng, $radius = 5)
    {
        // Simplified calculation for nearby ambulances
        // In a real application, you would use a more sophisticated calculation
        return $query->whereRaw(
            "(6371 * acos(cos(radians(?)) * cos(radians(current_lat)) * cos(radians(current_lng) - radians(?)) + sin(radians(?)) * sin(radians(current_lat)))) < ?",
            [$lat, $lng, $lat, $radius]
        );
    }
}
