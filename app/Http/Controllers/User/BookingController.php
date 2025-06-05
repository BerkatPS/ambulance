<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Traits\WithNotifications;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Payment;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

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

        // Check for expired bookings that need to be automatically cancelled
        $this->checkExpiredBookings();
    }

    /**
     * Check for expired bookings that need to be automatically cancelled
     * after 24 hours of non-payment
     *
     * @return void
     */
    private function checkExpiredBookings()
    {
        try {
            // Find pending bookings older than 24 hours that don't have paid payments
            $expiredBookings = Booking::where('status', 'pending')
                ->where('created_at', '<=', Carbon::now()->subHours(24))
                ->whereHas('payment', function($query) {
                    $query->whereNull('paid_at');
                })
                ->orWhere(function($query) {
                    $query->where('status', 'pending')
                        ->where('created_at', '<=', Carbon::now()->subHours(24))
                        ->doesntHave('payment');
                })
                ->get();

            foreach ($expiredBookings as $booking) {
                // Auto-cancel the booking
                $booking->status = 'cancelled';
                $booking->cancel_reason = 'Automatically cancelled due to payment timeout (24 hours)';
                $booking->cancelled_at = Carbon::now();
                $booking->save();

                // Release ambulance if assigned
                if ($booking->ambulance_id) {
                    $ambulance = Ambulance::find($booking->ambulance_id);
                    if ($ambulance && $ambulance->status !== 'available') {
                        $ambulance->status = 'available';
                        $ambulance->save();
                    }
                }

                // Release driver if assigned
                if ($booking->driver_id) {
                    $driver = Driver::find($booking->driver_id);
                    if ($driver && $driver->status === 'busy') {
                        $driver->status = 'available';
                        $driver->save();
                    }
                }

                // Send notification to user about the auto-cancellation
                try {
                    $this->notificationService->sendBookingCancelledNotification($booking);
                } catch (\Exception $e) {
                    \Log::error("Failed to send auto-cancel notification for booking #{$booking->id}: " . $e->getMessage());
                }

                \Log::info("Auto-cancelled booking #{$booking->id} due to payment timeout");
            }
        } catch (\Exception $e) {
            \Log::error("Error checking expired bookings: " . $e->getMessage());
        }
    }

    /**
     * Display a listing of the user's bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Booking::where('user_id', $user->id)
            ->with(['ambulance', 'driver', 'payment']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('booking_time', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('booking_time', '<=', $request->end_date);
        }

        // Filter by active (non-completed, non-cancelled) or history
        $showHistory = $request->has('history') && $request->history === 'true';

        if ($showHistory) {
            // History: show completed and cancelled bookings
            $query->whereIn('status', ['completed', 'cancelled']);
        } else {
            // Active: exclude completed and cancelled bookings
            $query->whereNotIn('status', ['completed', 'cancelled']);
        }

        $bookings = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends($request->except('page'));

        return Inertia::render('User/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $request->status,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'history' => $showHistory,
            ],
            'filterOptions' => [
                'statuses' => [
                    ['value' => 'pending', 'label' => 'Menunggu'],
                    ['value' => 'confirmed', 'label' => 'Dikonfirmasi'],
                    ['value' => 'dispatched', 'label' => 'Dikirim'],
                    ['value' => 'in_progress', 'label' => 'Dalam Proses'],
                    ['value' => 'completed', 'label' => 'Selesai'],
                    ['value' => 'cancelled', 'label' => 'Dibatalkan'],
                ],
                'types' => [
                    ['value' => 'standard', 'label' => 'Standar'],
                    ['value' => 'emergency', 'label' => 'Darurat'],
                    ['value' => 'scheduled', 'label' => 'Terjadwal'],
                ],
            ],
        ]);
    }

    /**
     * Display a listing of the user's active bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function active(Request $request)
    {
        $user = $request->user();

        $query = Booking::where('user_id', $user->id)
            ->whereNotIn('status', ['completed', 'cancelled']);

        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by type if provided
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Get bookings with relationships
        $bookings = $query->with(['ambulance', 'driver', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends($request->except('page'));

        // Get notifications data
        $notificationsData = $this->getNotifications($request);

        return Inertia::render('User/Bookings/Active', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $request->status,
                'type' => $request->type,
            ],
            'filterOptions' => [
                'statuses' => [
                    ['value' => 'pending', 'label' => 'Menunggu'],
                    ['value' => 'confirmed', 'label' => 'Dikonfirmasi'],
                    ['value' => 'dispatched', 'label' => 'Dikirim'],
                    ['value' => 'in_progress', 'label' => 'Dalam Proses'],
                ],
                'types' => [
                    ['value' => 'standard', 'label' => 'Standar'],
                    ['value' => 'emergency', 'label' => 'Darurat'],
                    ['value' => 'scheduled', 'label' => 'Terjadwal'],
                ],
            ],
            'notifications' => $notificationsData['notifications'],
            'unreadCount' => $notificationsData['unreadCount'],
            'status' => session('status'),
        ]);
    }

    /**
     * Display a listing of the user's booking history.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $query = Booking::where('user_id', $user->id)
            ->whereIn('status', ['completed', 'cancelled']);

        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by type if provided
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Get bookings with relationships
        $bookings = $query->with(['ambulance', 'driver', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends($request->except('page'));

        // Get notifications data
        $notificationsData = $this->getNotifications($request);

        return Inertia::render('User/Bookings/History', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $request->status,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'filterOptions' => [
                'statuses' => [
                    ['value' => 'completed', 'label' => 'Selesai'],
                    ['value' => 'cancelled', 'label' => 'Dibatalkan'],
                ],
                'types' => [
                    ['value' => 'standard', 'label' => 'Standar'],
                    ['value' => 'emergency', 'label' => 'Darurat'],
                    ['value' => 'scheduled', 'label' => 'Terjadwal'],
                ],
            ],
            'notifications' => $notificationsData['notifications'],
            'unreadCount' => $notificationsData['unreadCount'],
            'status' => session('status'),
        ]);
    }

    /**
     * Show the form for creating a new booking.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Get ambulance types for selection with pricing information
        $ambulanceTypes = DB::table('ambulances')
            ->select('id', 'vehicle_code as name', 'license_plate as description')
            ->where('status', 'available')
            ->get()
            ->map(function($ambulance) {
                // Default base price from migration (500000 IDR)
                $basePrice = 500000;

                // Format base price for display in IDR
                $ambulance->base_rate = $basePrice;
                $ambulance->formatted_price = 'Rp ' . number_format($basePrice, 0, ',', '.');

                return $ambulance;
            });

        return Inertia::render('User/Bookings/Create', [
            'ambulanceTypes' => $ambulanceTypes,
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
        // Enable query logging untuk debugging
        DB::enableQueryLog();

        // Log semua data yang diterima untuk debugging
        \Log::channel('booking')->info('Raw booking request data', [
            'all_data' => $request->all()
        ]);

        // Validasi data sesuai dengan skema database
        $baseRules = [
            'type' => 'required|in:standard,emergency,scheduled',
            'pickup_address' => 'required|string',
            'pickup_lat' => 'nullable|numeric',
            'pickup_lng' => 'nullable|numeric',
            'destination_address' => 'required|string',
            'destination_lat' => 'nullable|numeric',
            'destination_lng' => 'nullable|numeric',
            'patient_name' => 'required|string|max:100',
            'patient_age' => 'nullable|numeric',
            'contact_name' => 'required|string|max:100',
            'contact_phone' => 'required|string|max:15',
            'notes' => 'nullable|string',
            'condition_notes' => 'nullable|string',
            'priority' => 'nullable|string|in:critical,urgent,normal',
        ];

        // Ambulance ID menjadi optional untuk semua tipe booking
        $baseRules['ambulance_id'] = 'nullable|exists:ambulances,id';

        // Jika tipe booking adalah scheduled, scheduled_at wajib diisi
        if ($request->type === 'scheduled') {
            $rules = array_merge($baseRules, [
                'scheduled_at' => 'required|date|after:now',
            ]);
        } else {
            $rules = array_merge($baseRules, [
                'scheduled_at' => 'nullable|date',
            ]);
        }

        $validated = $request->validate($rules);
        $user = $request->user();

        \Log::channel('booking')->info('Booking request validated', [
            'user_id' => $user->id,
            'type' => $validated['type'],
            'data' => $validated
        ]);

        // Untuk semua tipe booking, cari ambulance available secara otomatis jika tidak dipilih
        $ambulanceId = null;
        if (empty($validated['ambulance_id'])) {
            // Cari ambulance yang tersedia dengan driver yang tersedia
            $availableAmbulance = Ambulance::whereHas('drivers', function($query) {
                $query->where('status', 'available');
            })->where('status', 'available')->first();
            
            if ($availableAmbulance) {
                $ambulanceId = $availableAmbulance->id;
                \Log::channel('booking')->info('Auto-matched ambulance for booking', [
                    'booking_type' => $validated['type'],
                    'ambulance_id' => $ambulanceId
                ]);
            } else {
                // Jika tidak ada ambulance dengan driver available, cari ambulance available saja
                $anyAvailableAmbulance = Ambulance::where('status', 'available')->first();
                if ($anyAvailableAmbulance) {
                    $ambulanceId = $anyAvailableAmbulance->id;
                    \Log::channel('booking')->info('Auto-matched ambulance (without driver) for booking', [
                        'booking_type' => $validated['type'],
                        'ambulance_id' => $ambulanceId
                    ]);
                } else {
                    \Log::channel('booking')->error('No available ambulance for booking');
                    return back()->withErrors([
                        'error' => 'Tidak ada ambulans yang tersedia saat ini. Silakan coba beberapa saat lagi atau hubungi kami.',
                    ])->withInput();
                }
            }
        } else {
            // Pastikan ambulance yang dipilih tersedia (jika user masih memilihnya secara manual)
            $ambulance = Ambulance::find($validated['ambulance_id']);
            if (!$ambulance || $ambulance->status !== 'available') {
                \Log::channel('booking')->error('Ambulance not available', [
                    'ambulance_id' => $validated['ambulance_id'],
                    'status' => $ambulance ? $ambulance->status : 'not found'
                ]);

                return back()->withErrors([
                    'ambulance_id' => 'Ambulans yang dipilih tidak tersedia. Sistem akan mencarikan ambulans lain yang tersedia.',
                ])->withInput();
            }
            $ambulanceId = $validated['ambulance_id'];
        }

        // Create the booking
        try {
            DB::beginTransaction();

            // Buat booking baru dengan data dari form
            $booking = new Booking();
            $booking->user_id = $user->id;
            $booking->ambulance_id = $ambulanceId;
            $booking->type = $validated['type'];

            // Set data pasien dan kontak
            $booking->patient_name = $validated['patient_name'];
            $booking->patient_age = $validated['patient_age'] ?? null;
            $booking->contact_name = $validated['contact_name'];
            $booking->contact_phone = $validated['contact_phone'];

            // Set lokasi jemput dan tujuan
            $booking->pickup_address = $validated['pickup_address'];
            $booking->pickup_lat = $validated['pickup_lat'] ?? null;
            $booking->pickup_lng = $validated['pickup_lng'] ?? null;
            $booking->destination_address = $validated['destination_address'];
            $booking->destination_lat = $validated['destination_lat'] ?? null;
            $booking->destination_lng = $validated['destination_lng'] ?? null;

            // Set priority default jika tidak ada
            $booking->priority = $validated['priority'] ?? ($validated['type'] === 'emergency' ? 'urgent' : 'normal');

            // Set waktu dan status
            $booking->requested_at = now();
            $booking->status = 'pending';

            if ($validated['type'] === 'emergency') {
                $booking->scheduled_at = now();
            } elseif ($validated['type'] === 'scheduled' && isset($validated['scheduled_at'])) {
                $booking->scheduled_at = Carbon::parse($validated['scheduled_at']);
            }

            // Set catatan
            $booking->notes = $validated['notes'] ?? null;
            $booking->condition_notes = $validated['condition_notes'] ?? $validated['notes'] ?? null;

            // Set default nilai pembayaran
            $booking->base_price = 500000;
            $booking->distance_price = 0;
            $booking->total_amount = $booking->base_price;
            $booking->is_downpayment_paid = false;
            $booking->is_fully_paid = false;

            // Generate kode booking yang unik
            $today = now()->format('Ymd');
            $latestBooking = Booking::where('booking_code', 'like', 'AMB' . $today . '%')
                ->orderBy('booking_code', 'desc')
                ->first();

            $sequence = '001';
            if ($latestBooking) {
                $lastSequence = intval(substr($latestBooking->booking_code, -3));
                $sequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);
            }
            $booking->booking_code = 'AMB' . $today . $sequence;

            // Untuk booking terjadwal
            if ($validated['type'] === 'scheduled') {
                $booking->downpayment_amount = round($booking->total_amount * 0.3);
                $booking->dp_payment_deadline = now()->addHours(24);

                $scheduledTime = Carbon::parse($validated['scheduled_at']);
                $booking->final_payment_deadline = $scheduledTime->copy()->subHours(24);
            }

            // Log data booking sebelum disimpan
            \Log::channel('booking')->info('Booking object before save', [
                'booking_data' => $booking->toArray()
            ]);

            // Simpan booking
            $saveResult = $booking->save();

            // Log hasil penyimpanan
            \Log::channel('booking')->info('Booking save attempt', [
                'result' => $saveResult,
                'booking_id' => $booking->id ?? 'not assigned',
                'queries' => DB::getQueryLog()
            ]);

            if (!$saveResult) {
                throw new \Exception("Failed to save booking to database");
            }

            // Otomatis buat data pembayaran untuk booking terjadwal
            if ($validated['type'] === 'scheduled') {
                // Buat pembayaran uang muka (downpayment)
                $payment = new Payment();
                $payment->booking_id = $booking->id;
                $payment->payment_type = 'downpayment';
                $payment->amount = $booking->downpayment_amount;
                $payment->status = 'pending';
                $payment->created_at = now();
                $payment->expires_at = $booking->dp_payment_deadline;

                // Generate transaction ID unik
                $payment->transaction_id = 'TRX-DP-' . $booking->booking_code;

                $payment->save();

                \Log::channel('booking')->info('Downpayment payment created', [
                    'booking_id' => $booking->id,
                    'payment_id' => $payment->id,
                    'amount' => $payment->amount
                ]);
            }

            DB::commit();

            \Log::channel('booking')->info('Booking transaction completed successfully', [
                'booking_id' => $booking->id,
                'booking_code' => $booking->booking_code
            ]);

            // Kirim notifikasi setelah transaksi berhasil
            try {
                $this->notificationService->sendBookingCreatedNotification($booking);

                if ($validated['type'] === 'emergency') {
                    $this->notificationService->sendEmergencyBookingNotification($booking);
                    
                    // Log informasi sebelum mencoba auto-assign
                    \Log::info('Mencoba melakukan auto-assign untuk booking darurat', [
                        'booking_id' => $booking->id,
                        'booking_code' => $booking->booking_code,
                        'pickup_lat' => $booking->pickup_lat,
                        'pickup_lng' => $booking->pickup_lng
                    ]);
                    
                    // Periksa driver yang tersedia
                    $availableDrivers = \App\Models\Driver::where('status', 'available')
                        ->whereNotNull('ambulance_id')
                        ->get();
                    
                    \Log::info('Status driver yang tersedia untuk tugas darurat', [
                        'booking_id' => $booking->id,
                        'available_drivers_count' => $availableDrivers->count(),
                        'drivers' => $availableDrivers->map(function($driver) {
                            return [
                                'id' => $driver->id,
                                'name' => $driver->name,
                                'ambulance_id' => $driver->ambulance_id
                            ];
                        })
                    ]);
                    
                    $this->tryAutoAssignForEmergency($booking);
                }
            } catch (\Exception $notifyException) {
                \Log::channel('booking')->error('Notification error: ' . $notifyException->getMessage(), [
                    'booking_id' => $booking->id,
                    'error' => $notifyException->getMessage(),
                    'trace' => $notifyException->getTraceAsString()
                ]);
            }

            // Redirect ke halaman yang sesuai
            if ($validated['type'] === 'scheduled') {
                return redirect()->route('user.bookings.show', $booking->id)
                    ->with('success', 'Booking terjadwal berhasil dibuat. Anda akan menerima konfirmasi segera.');
            } else {
                return redirect()->route('user.bookings.show', $booking->id)
                    ->with('success', 'Booking berhasil dibuat. Anda akan menerima konfirmasi segera.');
            }

        } catch (\Exception $e) {
            DB::rollBack();

            \Log::channel('booking')->error('Booking creation failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'data' => $validated,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'queries' => DB::getQueryLog()
            ]);

            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat membuat booking: ' . $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Try to automatically assign an available driver and ambulance for emergency bookings
     * Follows two-phase assignment:
     * 1) First tries to find nearest available driver (30 seconds)
     * 2) If no driver found, broadcasts to all available drivers (max 1 minute)
     *
     * @param \App\Models\Booking $booking
     * @return void
     */
    private function tryAutoAssignForEmergency(Booking $booking)
    {
        try {
            // Dispatch a job to handle the driver assignment
            // This allows us to implement the time-based logic for driver search
            \App\Jobs\AssignDriverForEmergencyBooking::dispatch($booking)
                ->onQueue('emergency');

            \Log::info('Emergency driver assignment job dispatched', [
                'booking_id' => $booking->id,
                'queue' => 'emergency'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error dispatching emergency assignment job', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified booking.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = request()->user();

        $booking = Booking::where('id', $id)
            ->where('user_id', $user->id)
            ->with([
                'ambulance:id,vehicle_code,license_plate,status',
                'driver:id,name,phone,rating',
                'payment',
                'rating'
            ])
            ->firstOrFail();

        // Format pickup_time untuk ditampilkan di frontend jika tersedia
        if ($booking->pickup_time) {
            // Pastikan pickup_time adalah objek Carbon, jika tidak, konversikan
            if (is_string($booking->pickup_time)) {
                $booking->formatted_pickup_time = \Carbon\Carbon::parse($booking->pickup_time)->format('Y-m-d H:i:s');
            } else {
                $booking->formatted_pickup_time = $booking->pickup_time->format('Y-m-d H:i:s');
            }
        }
        
        // Jika status booking adalah dispatched, arrived, atau enroute, tambahkan informasi lokasi driver
        if (in_array($booking->status, ['dispatched', 'arrived', 'enroute']) && $booking->driver) {
            // Dapatkan lokasi driver terbaru jika ada
            $driver = Driver::find($booking->driver->id);
            
            if ($driver) {
                // Tambahkan informasi lokasi terakhir driver untuk ditampilkan di frontend
                $booking->driver->current_location = [
                    'lat' => $driver->current_lat ?? -6.200000,
                    'lng' => $driver->current_lng ?? 106.816666,
                    'last_updated' => $driver->location_updated_at ? \Carbon\Carbon::parse($driver->location_updated_at)->diffForHumans() : 'Tidak diketahui'
                ];
            }
        }
        
        // Terjemahkan status ke Bahasa Indonesia
        $booking->status_id = $booking->status;
        $booking->status = $this->translateStatus($booking->status);
        
        // Cek status pembayaran
        $paymentStatus = 'unpaid'; // Default status
        
        if ($booking->payment) {
            if ($booking->payment->paid_at) {
                $paymentStatus = 'paid';
            } elseif ($booking->payment->cancelled_at) {
                $paymentStatus = 'cancelled';
            }
            
            $booking->payment->status_id = $paymentStatus;
            $booking->payment->status = $this->translatePaymentStatus($paymentStatus);
        }

        // Jika booking darurat dan sudah arrived, buat payment jika belum ada
        if ($booking->type === 'emergency' && $booking->status === 'arrived' && !$booking->payment) {
            // Buat data pembayaran penuh untuk layanan darurat
            $payment = new Payment();
            $payment->booking_id = $booking->id;
            $payment->payment_type = 'full_payment';
            $payment->amount = $booking->total_amount;
            $payment->status = 'pending';
            $payment->created_at = now();
            $payment->expires_at = now()->addDays(7); // Tenggat waktu 7 hari

            // Generate transaction ID unik
            $payment->transaction_id = 'TRX-EMRG-' . $booking->booking_code;

            $payment->save();

            // Reload booking dengan data pembayaran terbaru
            $booking = $booking->fresh(['payment']);

            // Kirim notifikasi pembayaran pertama
            $this->notificationService->sendPaymentReminderNotification($booking, 'urgent', 1);
        }

        // Cek apakah booking terjadwal tanpa data pembayaran
        if ($booking->type === 'scheduled' && !$booking->payment) {
            // Buat data pembayaran otomatis
            $payment = new Payment();
            $payment->booking_id = $booking->id;
            $payment->payment_type = 'downpayment';
            $payment->amount = round($booking->total_amount * 0.3); // 30% uang muka
            $payment->status = 'pending';
            $payment->created_at = now();
            $payment->expires_at = now()->addHours(24);

            // Generate transaction ID unik
            $payment->transaction_id = 'TRX-DP-' . $booking->booking_code;

            $payment->save();

            // Reload booking dengan data pembayaran terbaru
            $booking = $booking->fresh(['payment']);
        }

        // Cek jika booking terjadwal sudah arrived dan perlu pembayaran final
        if ($booking->type === 'scheduled' && $booking->status === 'arrived' && $booking->is_downpayment_paid && 
            (!$booking->payment || $booking->payment->payment_type === 'downpayment')) {
            
            // Buat data pembayaran final untuk layanan terjadwal
            $payment = new Payment();
            $payment->booking_id = $booking->id;
            $payment->payment_type = 'final_payment';
            $payment->amount = $booking->total_amount - round($booking->total_amount * 0.3); // 70% sisanya
            $payment->status = 'pending';
            $payment->created_at = now();
            $payment->expires_at = now()->addHours(24);

            // Generate transaction ID unik
            $payment->transaction_id = 'TRX-FINAL-' . $booking->booking_code;

            $payment->save();

            // Reload booking dengan data pembayaran terbaru
            $booking = $booking->fresh(['payment']);

            // Kirim notifikasi pembayaran final
            $this->notificationService->sendPaymentReminderNotification($booking, 'normal', 1);
        }

        // Get notifications data
        $notificationsData = $this->getNotifications();

        // Check if the booking can be rated (is completed and not yet rated)
        $canRate = $booking->status === 'completed' &&
                  !$booking->rating &&
                  $booking->driver_id;

        // Tambahkan flag untuk menentukan apakah harus menampilkan informasi pembayaran
        $showPaymentInfo = false;

        // Tampilkan info pembayaran jika terjadwal atau jika darurat dan sudah arrived/completed
        if ($booking->type === 'scheduled' ||
            ($booking->type === 'emergency' && in_array($booking->status, ['arrived', 'completed']))) {
            $showPaymentInfo = true;
        }

        // Tambahkan flag untuk menandai apakah ini tagihan darurat yang memerlukan pengingat
        $isEmergencyPaymentDue = $booking->type === 'emergency' &&
                               $booking->status === 'arrived' &&
                               $booking->payment &&
                               $booking->payment->status === 'pending';

        // Tambahkan flag untuk menandai apakah ini tagihan final pada booking terjadwal
        $isScheduledFinalPaymentDue = $booking->type === 'scheduled' &&
                                    $booking->status === 'arrived' &&
                                    $booking->is_downpayment_paid &&
                                    $booking->payment &&
                                    $booking->payment->payment_type === 'final_payment' &&
                                    $booking->payment->status === 'pending';

        return Inertia::render('User/Bookings/Show', [
            'booking' => $booking,
            'canRate' => $canRate,
            'canCancel' => in_array($booking->status, ['pending', 'confirmed']),
            'notifications' => $notificationsData['notifications'],
            'unreadCount' => $notificationsData['unreadCount'],
            'showPaymentInfo' => $showPaymentInfo,
            'isEmergencyPaymentDue' => $isEmergencyPaymentDue,
            'isScheduledFinalPaymentDue' => $isScheduledFinalPaymentDue,
            'paymentReminderInterval' => 5000, // 5 detik dalam milidetik
        ]);
    }

    /**
     * Cancel the specified booking.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel($id)
    {
        $user = request()->user();
        $booking = Booking::where('user_id', $user->id)->findOrFail($id);

        // Only pending or confirmed bookings can be cancelled
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'Only pending or confirmed bookings can be cancelled.');
        }

        $booking->status = 'cancelled';
        $booking->cancel_reason = 'Cancelled by user';
        $booking->save();

        // If there was a driver assigned, make them available again
        if ($booking->driver_id) {
            $driver = Driver::find($booking->driver_id);
            if ($driver && $driver->status === 'busy') {
                $driver->status = 'available';
                $driver->save();
            }
        }

        // If there was an ambulance assigned, make it available again
        if ($booking->ambulance_id) {
            $ambulance = Ambulance::find($booking->ambulance_id);
            if ($ambulance && $ambulance->status !== 'available') {
                $ambulance->status = 'available';
                $ambulance->save();
            }
        }

        return redirect()->route('user.bookings.index')
            ->with('success', 'Booking cancelled successfully.');
    }

    /**
     * Send a real-time payment reminder for emergency bookings.
     * This endpoint is called by the frontend to trigger reminders.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendEmergencyPaymentReminder($id)
    {
        $user = request()->user();
        $booking = Booking::where('user_id', $user->id)
            ->with('payment')
            ->findOrFail($id);

        // Pastikan ini adalah booking darurat yang sudah selesai dan pembayaran tertunda
        if ($booking->type !== 'emergency' ||
            $booking->status !== 'completed' ||
            !$booking->payment ||
            $booking->payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Pengingat pembayaran hanya berlaku untuk booking darurat yang sudah selesai dengan pembayaran tertunda.'
            ]);
        }

        // Kirim pengingat real-time
        $this->notificationService->sendEmergencyPaymentReminder($booking);

        return response()->json([
            'success' => true,
            'message' => 'Pengingat pembayaran darurat dikirim.'
        ]);
    }

    /**
     * Send payment reminders for scheduled bookings due soon
     *
     * @return void
     */
    public function sendScheduledPaymentReminders()
    {
        try {
            // Cek uang muka yang belum dibayar dan mendekati batas waktu
            $pendingDownpayments = Booking::where('type', 'scheduled')
                ->where('is_downpayment_paid', false)
                ->whereNotNull('dp_payment_deadline')
                ->where('dp_payment_deadline', '<=', now()->addHours(6)) // 6 jam sebelum deadline
                ->where('dp_payment_deadline', '>', now()) // belum melewati deadline
                ->where('status', '!=', 'cancelled')
                ->with('user')
                ->get();

            foreach ($pendingDownpayments as $booking) {
                $this->notificationService->sendPaymentReminderNotification(
                    $booking,
                    'downpayment',
                    1
                );

                \Log::info('Sent downpayment reminder for scheduled booking', [
                    'booking_id' => $booking->id,
                    'deadline' => $booking->dp_payment_deadline
                ]);
            }

            // Cek pembayaran akhir yang belum dibayar dan mendekati jadwal bookingnya (H-1)
            $pendingFinalPayments = Booking::where('type', 'scheduled')
                ->where('is_downpayment_paid', true)
                ->where('is_fully_paid', false)
                ->whereNotNull('final_payment_deadline')
                ->where('final_payment_deadline', '<=', now()->addHours(6)) // 6 jam sebelum deadline
                ->where('final_payment_deadline', '>', now()) // belum melewati deadline
                ->where('status', '!=', 'cancelled')
                ->with('user')
                ->get();

            foreach ($pendingFinalPayments as $booking) {
                $this->notificationService->sendPaymentReminderNotification(
                    $booking,
                    'final_payment',
                    1
                );

                \Log::info('Sent final payment reminder for scheduled booking', [
                    'booking_id' => $booking->id,
                    'deadline' => $booking->final_payment_deadline,
                    'scheduled_date' => $booking->scheduled_at
                ]);
            }

            return response()->json([
                'success' => true,
                'downpayment_reminders' => $pendingDownpayments->count(),
                'final_payment_reminders' => $pendingFinalPayments->count()
            ]);

        } catch (\Exception $e) {
            \Log::error('Error sending payment reminders', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Proses pembatalan otomatis booking yang belum bayar uang muka melewati deadline
     *
     * @return void
     */
    public function processAutoCancellations()
    {
        try {
            // Cari booking yang tenggat dp_payment_deadline-nya sudah lewat dan belum bayar DP
            $overdueBookings = Booking::where('type', 'scheduled')
                ->where('is_downpayment_paid', false)
                ->whereNotNull('dp_payment_deadline')
                ->where('dp_payment_deadline', '<', now()) // sudah melewati tenggat
                ->where('status', 'pending')
                ->get();

            $cancelled = 0;
            foreach ($overdueBookings as $booking) {
                // Update status booking menjadi cancelled
                $booking->status = 'cancelled';
                $booking->cancel_reason = 'Cancelled due to overdue downpayment';
                $booking->save();

                // Kirim notifikasi pembatalan
                $this->notificationService->sendBookingCancelledNotification($booking);

                $cancelled++;

                \Log::info('Auto-cancelled booking due to overdue downpayment', [
                    'booking_id' => $booking->id,
                    'deadline' => $booking->dp_payment_deadline
                ]);
            }

            return response()->json([
                'success' => true,
                'cancelled_count' => $cancelled
            ]);
        } catch (\Exception $e) {
            \Log::error('Error processing auto cancellations', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Terjemahkan status ke Bahasa Indonesia
     */
    private function translateStatus($status)
    {
        $translations = [
            'pending' => 'Menunggu Konfirmasi',
            'confirmed' => 'Terkonfirmasi',
            'cancelled' => 'Dibatalkan',
            'rejected' => 'Ditolak',
            'dispatched' => 'Ambulans Dikirim',
            'arrived' => 'Ambulans Tiba',
            'pickup' => 'Penjemputan Pasien',
            'enroute' => 'Menuju Rumah Sakit',
            'completed' => 'Selesai',
            'assigned' => 'Driver Ditugaskan',
            'inprogress' => 'Dalam Proses'
        ];
        
        return $translations[$status] ?? ucfirst($status);
    }
    
    /**
     * Terjemahkan status pembayaran ke Bahasa Indonesia
     */
    private function translatePaymentStatus($status)
    {
        $translations = [
            'unpaid' => 'Belum Dibayar',
            'paid' => 'Lunas',
            'cancelled' => 'Dibatalkan',
            'refunded' => 'Dikembalikan',
            'pending' => 'Proses Pembayaran'
        ];
        
        return $translations[$status] ?? ucfirst($status);
    }
}
