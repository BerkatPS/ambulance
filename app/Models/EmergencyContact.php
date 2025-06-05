<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'relationship',
        'phone',
        'address',
    ];

    /**
     * Get the user that owns the emergency contact.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
