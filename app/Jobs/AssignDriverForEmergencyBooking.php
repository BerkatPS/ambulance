<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Ambulance;
use App\Services\NotificationService;
use Carbon\Carbon;

class AssignDriverForEmergencyBooking implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    protected $booking;
    
    /**
     * Count of retry attempts
     *
     * @var int
     */
    protected $retryCount;
    
    /**
     * Maximum number of retries
     *
     * @var int
     */
    protected $maxRetries = 12; // total 1 menit dalam interval 5 detik
    
    /**
     * What phase of driver search we're in (nearby or broadcast)
     *
     * @var string
     */
    protected $phase = 'nearby';
    
    /**
     * Start time of the job
     *
     * @var \Carbon\Carbon
     */
    protected $startTime;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
        $this->retryCount = 0;
        $this->startTime = now();
        $this->queue = 'emergency';
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Cek apakah booking masih dalam status yang memerlukan penugasan
            $this->booking = $this->booking->fresh();
            if ($this->booking->driver_id || $this->booking->status !== 'pending') {
                Log::info('Emergency booking assignment skipped - already assigned or not pending', [
                    'booking_id' => $this->booking->id,
                    'driver_id' => $this->booking->driver_id,
                    'status' => $this->booking->status
                ]);
                return;
            }

            $this->retryCount++;
            $driver = null;

            // Phase 1: Search nearby drivers (30 seconds)
            if ($this->phase === 'nearby' && $this->startTime->diffInSeconds(now()) <= 30) {
                Log::info('Emergency booking - searching for nearby drivers', [
                    'booking_id' => $this->booking->id,
                    'attempt' => $this->retryCount,
                    'phase' => $this->phase
                ]);
                
                // Find available drivers with active status
                if ($this->booking->pickup_lat && $this->booking->pickup_lng) {
                    try {
                        // Use raw query for finding nearby drivers based on coordinates
                        $driver = Driver::select('drivers.*')
                            ->where('drivers.status', 'available') // Status must be one of: 'available', 'busy', 'off'
                            ->where('drivers.is_active', true)
                            ->whereNotNull('drivers.ambulance_id')
                            ->orderByRaw(
                                "SQRT(POW(drivers.last_location_lat - ?, 2) + POW(drivers.last_location_lng - ?, 2))", 
                                [$this->booking->pickup_lat, $this->booking->pickup_lng]
                            )
                            ->first();
                            
                        Log::info('Query for nearby drivers executed', [
                            'driver_found' => $driver ? true : false,
                            'driver_id' => $driver ? $driver->id : null
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Error finding nearby drivers', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                    }
                } else {
                    try {
                        // If no coordinates, find the most recently active available driver
                        $driver = Driver::where('status', 'available')
                            ->where('is_active', true)
                            ->whereNotNull('ambulance_id')
                            ->orderBy('updated_at', 'desc')
                            ->first();
                            
                        Log::info('Query for recently active drivers executed', [
                            'driver_found' => $driver ? true : false,
                            'driver_id' => $driver ? $driver->id : null
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Error finding recently active drivers', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                    }
                }
            }
            // Phase 2: Broadcast to all available drivers (60 seconds)
            else if ($this->startTime->diffInSeconds(now()) <= 90) {
                $this->phase = 'broadcast';
                
                Log::info('Emergency booking - broadcasting to all available drivers', [
                    'booking_id' => $this->booking->id,
                    'attempt' => $this->retryCount,
                    'phase' => $this->phase
                ]);

                try {
                    // Find any available active driver
                    $driver = Driver::where('status', 'available')
                        ->where('is_active', true)
                        ->whereNotNull('ambulance_id')
                        ->inRandomOrder()
                        ->first();
                        
                    Log::info('Query for any available drivers executed', [
                        'driver_found' => $driver ? true : false,
                        'driver_id' => $driver ? $driver->id : null
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error finding any available drivers', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // If driver found, assign to booking
            if ($driver) {
                $this->assignDriverToBooking($driver);
                return;
            }

            // If still no driver and not at retry limit,
            // schedule this job to run again in 5 seconds
            if ($this->retryCount < $this->maxRetries) {
                self::dispatch($this->booking)
                    ->delay(now()->addSeconds(5));
            } else {
                // If exceeded retry limit, notify admin
                Log::warning('Emergency booking - no drivers available after all attempts', [
                    'booking_id' => $this->booking->id,
                    'total_attempts' => $this->retryCount
                ]);
                
                // Send notification to admin that no driver is available
                $notificationService = app(NotificationService::class);
                $notificationService->sendToAdmin(
                    'Tidak ada driver tersedia',
                    "Tidak ada driver tersedia untuk booking darurat #{$this->booking->id}. Mohon tindak lanjut manual.",
                    'emergency_unassigned',
                    $this->booking->id
                );
            }
        } catch (\Exception $e) {
            Log::error('Unexpected error in emergency booking assignment job', [
                'booking_id' => $this->booking->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Assign driver to booking
     * 
     * @param \App\Models\Driver $driver
     * @return void
     */
    private function assignDriverToBooking(Driver $driver)
    {
        try {
            DB::beginTransaction();
            
            // Assign the driver to the booking
            $this->booking->driver_id = $driver->id;
            
            // Jika ambulance_id dari driver berbeda, maka update status ambulance asli kembali ke available
            if ($this->booking->ambulance_id != $driver->ambulance_id) {
                // Set ambulance yang lama kembali ke available
                $oldAmbulance = Ambulance::find($this->booking->ambulance_id);
                if ($oldAmbulance) {
                    $oldAmbulance->status = 'available';
                    $oldAmbulance->save();
                }
                
                // Update booking dengan ambulance baru
                $this->booking->ambulance_id = $driver->ambulance_id;
            }
            
            $this->booking->status = 'confirmed';
            $this->booking->confirmed_at = now();
            $this->booking->save();
            
            // Update driver status to busy
            $driver->status = 'busy'; 
            $driver->save();
            
            // Also update the ambulance status
            $ambulance = Ambulance::find($driver->ambulance_id);
            if ($ambulance) {
                $ambulance->status = 'on_duty'; 
                $ambulance->save();
            }
            
            DB::commit();
            
            // Send notification about assignment
            $notificationService = app(NotificationService::class);
            $notificationService->sendDriverAssignedNotification($this->booking, $driver);
            
            Log::info('Emergency booking driver assigned', [
                'booking_id' => $this->booking->id,
                'driver_id' => $driver->id,
                'ambulance_id' => $driver->ambulance_id,
                'assignment_phase' => $this->phase,
                'total_attempts' => $this->retryCount,
                'time_elapsed' => $this->startTime->diffInSeconds(now())
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error assigning driver for emergency booking', [
                'booking_id' => $this->booking->id,
                'driver_id' => $driver->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
