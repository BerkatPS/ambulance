<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\WithNotifications;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    use WithNotifications;
    
    /**
     * The notification service instance.
     *
     * @var \App\Services\NotificationService
     */
    protected $notificationService;
    
    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'ambulance', 'driver', 'payment']);
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('patient_name', 'like', "%{$search}%")
                  ->orWhere('pickup_address', 'like', "%{$search}%")
                  ->orWhere('destination_address', 'like', "%{$search}%")
                  ->orWhere('contact_phone', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        // Filter by booking type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }
        
        // Filter by priority
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }
        
        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        // Pagination
        $bookings = $query->latest()->paginate(10)->withQueryString();
        
        // Get filter data for dropdowns
        $statuses = [
            'pending' => 'Menunggu',
            'confirmed' => 'Dikonfirmasi',
            'dispatched' => 'Dikirim',
            'arrived' => 'Tiba di Lokasi',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan'
        ];
        
        // Current filters for form values
        $filters = [
            'search' => $request->search,
            'type' => $request->type,
            'priority' => $request->priority,
            'status' => $request->status,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to
        ];
        
        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $filters,
            'statuses' => $statuses
        ]);
    }

    /**
     * Display the specified booking.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $booking = Booking::with([
            'user', 
            'ambulance.ambulanceType', 
            'driver', 
            'payment', 
            'rating'
        ])->findOrFail($id);
            
        // Get available ambulances for assignment
        $availableAmbulances = Ambulance::where('status', 'available')
            ->orWhere('id', $booking->ambulance_id)
            ->with('ambulanceType')
            ->get();
            
        // Get available drivers for assignment
        $availableDrivers = Driver::where('status', 'available')
            ->orWhere('id', $booking->driver_id ?? 0)
            ->get();
            
        // Get all valid booking statuses
        $statuses = [
            'pending' => 'Menunggu',
            'confirmed' => 'Dikonfirmasi',
            'dispatched' => 'Dikirim',
            'arrived' => 'Tiba di Lokasi',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan'
        ];
        
        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
            'availableAmbulances' => $availableAmbulances,
            'availableDrivers' => $availableDrivers,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Show the form for editing the specified booking.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $booking = Booking::with(['user', 'ambulance.ambulanceType', 'driver', 'payment'])
            ->findOrFail($id);
            
        // Get available ambulances for assignment
        $availableAmbulances = Ambulance::where('status', 'available')
            ->orWhere('id', $booking->ambulance_id)
            ->with('ambulanceType')
            ->get();
            
        // Get available drivers
        $availableDrivers = Driver::where('status', 'available')
            ->orWhere('id', $booking->driver_id)
            ->get();
            
        // Get all valid booking statuses
        $statuses = [
            'pending' => 'Menunggu',
            'confirmed' => 'Dikonfirmasi',
            'dispatched' => 'Dikirim',
            'arrived' => 'Tiba di Lokasi',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan'
        ];
        
        return Inertia::render('Admin/Bookings/Edit', [
            'booking' => $booking,
            'availableAmbulances' => $availableAmbulances,
            'availableDrivers' => $availableDrivers,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified booking in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // Validate request
        $validated = $request->validate([
            'patient_name' => 'required|string|max:100',
            'patient_age' => 'nullable|integer',
            'condition_notes' => 'nullable|string',
            'pickup_address' => 'required|string',
            'pickup_lat' => 'nullable|numeric',
            'pickup_lng' => 'nullable|numeric',
            'destination_address' => 'required|string',
            'destination_lat' => 'nullable|numeric',
            'destination_lng' => 'nullable|numeric',
            'contact_name' => 'required|string|max:100',
            'contact_phone' => 'required|string|max:15',
            'notes' => 'nullable|string',
        ]);
        
        // Find booking
        $booking = Booking::findOrFail($id);
        
        // Update booking
        $booking->update($validated);
        
        // Flash success message
        session()->flash('flash.banner', 'Pemesanan berhasil diperbarui.');
        session()->flash('flash.bannerStyle', 'success');
        
        return redirect()->route('admin.bookings.show', $booking->id);
    }

    /**
     * Assign an ambulance to a booking.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function assignAmbulance(Request $request, $id)
    {
        // Validate request
        $validated = $request->validate([
            'ambulance_id' => 'required|exists:ambulances,id',
            'driver_id' => 'required|exists:drivers,id',
        ]);
        
        // Find booking
        $booking = Booking::findOrFail($id);
        
        // Get previous ambulance and driver
        $previousAmbulanceId = $booking->ambulance_id;
        $previousDriverId = $booking->driver_id;
        
        // Update booking
        $booking->ambulance_id = $validated['ambulance_id'];
        $booking->driver_id = $validated['driver_id'];
        
        // Update status to confirmed if it was pending
        if ($booking->status === 'pending') {
            $booking->status = 'confirmed';
        }
        
        $booking->save();
        
        // Update ambulance status
        $ambulance = Ambulance::find($validated['ambulance_id']);
        if ($ambulance) {
            $ambulance->status = 'on_duty';
            $ambulance->save();
        }
        
        // Update driver status
        $driver = Driver::find($validated['driver_id']);
        if ($driver) {
            $driver->status = 'assigned';
            $driver->save();
        }
        
        // Set previous ambulance and driver back to available if they're different
        if ($previousAmbulanceId && $previousAmbulanceId != $validated['ambulance_id']) {
            $prevAmbulance = Ambulance::find($previousAmbulanceId);
            if ($prevAmbulance) {
                $prevAmbulance->status = 'available';
                $prevAmbulance->save();
            }
        }
        
        if ($previousDriverId && $previousDriverId != $validated['driver_id']) {
            $prevDriver = Driver::find($previousDriverId);
            if ($prevDriver) {
                $prevDriver->status = 'available';
                $prevDriver->save();
            }
        }
        
        // Send notification to driver about assignment
        if ($driver && $driver->user_id) {
            $this->notificationService->sendToUser(
                $driver->user_id,
                'Anda telah ditugaskan ke pemesanan baru',
                'Anda telah ditugaskan ke pemesanan #' . $booking->id . '. Silakan periksa detail pemesanan Anda.',
                'booking',
                $booking->id
            );
        }
        
        // Send notification to user about assignment
        $this->notificationService->sendToUser(
            $booking->user_id,
            'Ambulans telah ditugaskan ke pemesanan Anda',
            'Ambulans dan pengemudi telah ditugaskan ke pemesanan Anda #' . $booking->id . '.',
            'booking',
            $booking->id
        );
        
        // Flash success message
        session()->flash('flash.banner', 'Ambulans dan pengemudi berhasil ditugaskan ke pemesanan.');
        session()->flash('flash.bannerStyle', 'success');
        
        return redirect()->route('admin.bookings.show', $booking->id);
    }

    /**
     * Update the booking status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, $id)
    {
        // Validate request
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,dispatched,arrived,completed,cancelled',
            'cancel_reason' => 'nullable|required_if:status,cancelled|string',
        ]);
        
        // Find booking
        $booking = Booking::findOrFail($id);
        
        // Get old status
        $oldStatus = $booking->status;
        
        // Update booking status
        $booking->status = $validated['status'];
        
        // Add cancel reason if status is cancelled
        if ($validated['status'] === 'cancelled' && isset($validated['cancel_reason'])) {
            $booking->cancel_reason = $validated['cancel_reason'];
        }
        
        // Update timestamps based on status
        switch ($validated['status']) {
            case 'dispatched':
                $booking->dispatched_at = now();
                break;
            case 'arrived':
                $booking->arrived_at = now();
                break;
            case 'completed':
                $booking->completed_at = now();
                break;
        }
        
        $booking->save();
        
        // Update ambulance and driver status
        if ($booking->ambulance_id && $booking->driver_id) {
            $ambulance = Ambulance::find($booking->ambulance_id);
            $driver = Driver::find($booking->driver_id);
            
            // Handle status changes
            if ($validated['status'] === 'dispatched') {
                // Set ambulance to on_duty (not busy - which is not a valid enum value)
                if ($ambulance) {
                    $ambulance->status = 'on_duty';
                    $ambulance->save();
                }
                
                if ($driver) {
                    $driver->status = 'busy';
                    $driver->save();
                }
            } elseif ($validated['status'] === 'completed' || $validated['status'] === 'cancelled') {
                // Set ambulance and driver back to available
                if ($ambulance) {
                    $ambulance->status = 'available';
                    $ambulance->save();
                }
                
                if ($driver) {
                    $driver->status = 'available';
                    $driver->save();
                }
            }
        }
        
        // Send notification to user about status change
        $statusMessages = [
            'confirmed' => 'Pemesanan Anda telah dikonfirmasi.',
            'dispatched' => 'Ambulans sedang dalam perjalanan ke lokasi penjemputan.',
            'arrived' => 'Ambulans telah tiba di lokasi penjemputan.',
            'completed' => 'Pemesanan Anda telah selesai.',
            'cancelled' => 'Pemesanan Anda telah dibatalkan.'
        ];
        
        if (isset($statusMessages[$validated['status']])) {
            $this->notificationService->sendToUser(
                $booking->user_id,
                'Status pemesanan diperbarui',
                $statusMessages[$validated['status']],
                'booking',
                $booking->id
            );
        }
        
        // Send notification to driver if assigned
        if ($booking->driver_id && $driver && $driver->user_id) {
            $driverStatusMessages = [
                'confirmed' => 'Pemesanan #' . $booking->id . ' telah dikonfirmasi.',
                'cancelled' => 'Pemesanan #' . $booking->id . ' telah dibatalkan.'
            ];
            
            if (isset($driverStatusMessages[$validated['status']])) {
                $this->notificationService->sendToUser(
                    $driver->user_id,
                    'Status pemesanan diperbarui',
                    $driverStatusMessages[$validated['status']],
                    'booking',
                    $booking->id
                );
            }
        }
        
        // Flash success message
        session()->flash('flash.banner', 'Status pemesanan berhasil diperbarui.');
        session()->flash('flash.bannerStyle', 'success');
        
        return redirect()->route('admin.bookings.show', $booking->id);
    }

    /**
     * Display the emergency bookings dashboard.
     *
     * @return \Inertia\Response
     */
    public function emergencyDashboard()
    {
        $activeEmergencyBookings = Booking::where('type', 'emergency')
            ->whereIn('status', ['pending', 'confirmed', 'dispatched', 'arrived'])
            ->with(['user', 'ambulance', 'driver'])
            ->orderBy('requested_at', 'desc')
            ->get();
            
        $availableAmbulances = Ambulance::where('status', 'available')
            ->with('ambulanceType')
            ->get();
            
        $availableDrivers = Driver::where('status', 'available')
            ->get();
            
        return Inertia::render('Admin/Bookings/EmergencyDashboard', [
            'activeBookings' => $activeEmergencyBookings,
            'availableAmbulances' => $availableAmbulances,
            'availableDrivers' => $availableDrivers,
        ]);
    }

    /**
     * Display the scheduled bookings dashboard.
     *
     * @return \Inertia\Response
     */
    public function scheduledDashboard()
    {
        // Today's scheduled bookings
        $today = now()->format('Y-m-d');
        $todayBookings = Booking::where('type', 'scheduled')
            ->whereDate('scheduled_at', $today)
            ->with(['user', 'ambulance', 'driver'])
            ->orderBy('scheduled_at')
            ->get();
            
        // Upcoming scheduled bookings (next 7 days excluding today)
        $upcomingBookings = Booking::where('type', 'scheduled')
            ->whereDate('scheduled_at', '>', $today)
            ->whereDate('scheduled_at', '<=', now()->addDays(7)->format('Y-m-d'))
            ->with(['user', 'ambulance', 'driver'])
            ->orderBy('scheduled_at')
            ->get();
            
        $availableAmbulances = Ambulance::where('status', 'available')
            ->with('ambulanceType')
            ->get();
            
        $availableDrivers = Driver::where('status', 'available')
            ->get();
            
        return Inertia::render('Admin/Bookings/ScheduledDashboard', [
            'todayBookings' => $todayBookings,
            'upcomingBookings' => $upcomingBookings,
            'availableAmbulances' => $availableAmbulances,
            'availableDrivers' => $availableDrivers,
        ]);
    }

    /**
     * Display the create booking page.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $availableAmbulances = Ambulance::where('status', 'available')
            ->with('ambulanceType')
            ->get();
            
        $availableDrivers = Driver::where('status', 'available')
            ->get();
            
        $users = User::where('role', 'customer')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone']);
            
        return Inertia::render('Admin/Bookings/Create', [
            'availableAmbulances' => $availableAmbulances,
            'availableDrivers' => $availableDrivers,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created booking in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:standard,emergency,scheduled',
            'priority' => 'required|in:critical,urgent,normal',
            'patient_name' => 'required|string|max:100',
            'patient_age' => 'nullable|integer',
            'condition_notes' => 'nullable|string',
            'pickup_address' => 'required|string',
            'pickup_lat' => 'nullable|numeric',
            'pickup_lng' => 'nullable|numeric',
            'destination_address' => 'required|string',
            'destination_lat' => 'nullable|numeric',
            'destination_lng' => 'nullable|numeric',
            'contact_name' => 'required|string|max:100',
            'contact_phone' => 'required|string|max:15',
            'scheduled_at' => 'required_if:type,scheduled|nullable|date',
            'notes' => 'nullable|string',
            'ambulance_id' => 'nullable|exists:ambulances,id',
            'driver_id' => 'nullable|exists:drivers,id',
        ]);
        
        // Set base price and calculate total
        $basePrice = 500000; // Default base price
        $validated['base_price'] = $basePrice;
        $validated['total_amount'] = $basePrice; // Initially set to base price
        
        // Set requested_at time
        $validated['requested_at'] = now();
        
        // Set initial status
        $validated['status'] = 'pending';
        
        // Create booking
        $booking = Booking::create($validated);
        
        // If ambulance and driver are assigned
        if (!empty($validated['ambulance_id']) && !empty($validated['driver_id'])) {
            // Update ambulance status
            $ambulance = Ambulance::find($validated['ambulance_id']);
            if ($ambulance) {
                $ambulance->status = 'on_duty';
                $ambulance->save();
            }
            
            // Update driver status
            $driver = Driver::find($validated['driver_id']);
            if ($driver) {
                $driver->status = 'assigned';
                $driver->save();
            }
            
            // Update booking status
            $booking->status = 'confirmed';
            $booking->save();
            
            // Send notification to driver
            if ($driver && $driver->user_id) {
                $this->notificationService->sendToUser(
                    $driver->user_id,
                    'Anda telah ditugaskan ke pemesanan baru',
                    'Anda telah ditugaskan ke pemesanan #' . $booking->id . '. Silakan periksa detail pemesanan Anda.',
                    'booking',
                    $booking->id
                );
            }
        }
        
        // Send notification to user
        $this->notificationService->sendToUser(
            $booking->user_id,
            'Pemesanan baru dibuat',
            'Pemesanan ambulans baru Anda #' . $booking->id . ' telah dibuat.',
            'booking',
            $booking->id
        );
        
        // Flash success message
        session()->flash('flash.banner', 'Pemesanan berhasil dibuat.');
        session()->flash('flash.bannerStyle', 'success');
        
        return redirect()->route('admin.bookings.show', $booking->id);
    }
}
