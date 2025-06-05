<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Maintenance extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'maintenance';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ambulance_id',
        'maintenance_code',
        'maintenance_type',
        'description',
        'status',
        'cost',
        'start_date',
        'end_date',
        'technician_name',
        'notes'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'cost' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime'
    ];

    /**
     * Get the ambulance that owns the maintenance record.
     */
    public function ambulance(): BelongsTo
    {
        return $this->belongsTo(Ambulance::class);
    }

    /**
     * Scope a query to only include ongoing maintenance.
     */
    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing');
    }

    /**
     * Scope a query to only include completed maintenance.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include scheduled maintenance.
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope a query to get maintenance by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('maintenance_type', $type);
    }
}
