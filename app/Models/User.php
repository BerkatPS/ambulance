<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'city',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function username()
    {
        return 'phone';
    }

    /**
     * Get all bookings for this user.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get all ratings given by this user.
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Get all custom notifications for this user.
     */
    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable')
                    ->orderBy('created_at', 'desc');
    }
    
    /**
     * Get all emergency contacts for this user.
     */
    public function emergencyContacts()
    {
        return $this->hasMany(EmergencyContact::class);
    }
}
