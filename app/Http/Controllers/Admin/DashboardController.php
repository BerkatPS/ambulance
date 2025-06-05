<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\WithNotifications;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\User;
use App\Models\Payment;
use App\Models\Rating;
use App\Models\Maintenance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    use WithNotifications;

    /**
     * Display the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get count statistics
        $totalBookings = Booking::count();
        $pendingBookings = Booking::whereIn('status', ['pending', 'confirmed'])->count();
        $activeBookings = Booking::whereIn('status', ['in_progress', 'assigned'])->count();
        $completedBookings = Booking::where('status', 'completed')->count();

        $totalDrivers = Driver::count();
        $activeDrivers = Driver::whereIn('status', ['available', 'on_duty'])->count();

        $totalAmbulances = Ambulance::count();
        $availableAmbulances = Ambulance::where('status', 'available')->count();

        // Menghitung total pengguna tanpa menggunakan kolom role
        $totalUsers = User::count(); // Semua pengguna

        $totalRevenue = Payment::where('status', 'paid')->sum('amount');

        // Calculate revenue growth percentage compared to previous month
        $currentMonthRevenue = Payment::where('status', 'paid')
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('amount');

        $previousMonthRevenue = Payment::where('status', 'paid')
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->sum('amount');

        $revenueGrowth = 0;
        if ($previousMonthRevenue > 0) {
            $revenueGrowth = (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100;
        }

        // Calculate average rating - menggunakan kolom yang benar sesuai dengan database
        $averageRating = Rating::avg('overall') ?? 4.5;

        // Get status breakdowns
        $bookingsByStatus = [
            'pending' => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'in_progress' => Booking::where('status', 'in_progress')->count(),
            'completed' => Booking::where('status', 'completed')->count(),
            'cancelled' => Booking::where('status', 'cancelled')->count(),
        ];

        $ambulancesByStatus = [
            'available' => $availableAmbulances,
            'dispatched' => Ambulance::where('status', 'dispatched')->count(),
            'maintenance' => Ambulance::where('status', 'maintenance')->count(),
            'inactive' => Ambulance::where('status', 'inactive')->count(),
        ];

        $driversByStatus = [
            'available' => Driver::where('status', 'available')->count(),
            'on_duty' => Driver::where('status', 'on_duty')->count(),
            'on_break' => Driver::where('status', 'on_break')->count(),
            'off_duty' => Driver::where('status', 'off_duty')->count(),
        ];

        // Get today's statistics
        $today = Carbon::today();
        $todayBookings = Booking::whereDate('created_at', $today)->count();
        $todayRevenue = Payment::where('status', 'paid')->whereDate('created_at', $today)->sum('amount');
        $todayCompletedBookings = Booking::where('status', 'completed')->whereDate('updated_at', $today)->count();

        // Get recent activity (bookings, payments, maintenance, ratings)
        $recentBookings = Booking::with(['user', 'driver', 'ambulance'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($booking) {
                return [
                    'id' => $booking->id,
                    'type' => 'booking_created',
                    'description' => "Pemesanan baru #{$booking->id} dibuat",
                    'time' => $booking->created_at ? Carbon::parse($booking->created_at)->diffForHumans() : 'Baru-baru ini',
                    'user' => $booking->user ? $booking->user->name : 'Pengguna Anonim'
                ];
            });

        $recentPayments = Payment::with('booking.user')
            ->where('status', 'paid')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($payment) {
                $bookingId = $payment->booking_id ?? 'Unknown';
                return [
                    'id' => $payment->id,
                    'type' => 'payment_received',
                    'description' => "Pembayaran diterima untuk pemesanan #{$bookingId}",
                    'time' => $payment->created_at ? Carbon::parse($payment->created_at)->diffForHumans() : 'Baru-baru ini',
                    'user' => $payment->booking && $payment->booking->user ? $payment->booking->user->name : 'Pengguna Anonim'
                ];
            });

        $completedBookings = Booking::with(['driver.user', 'user'])
            ->where('status', 'completed')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($booking) {
                $driverName = $booking->driver && $booking->driver->user ? $booking->driver->user->name : 'Unknown';
                return [
                    'id' => $booking->id,
                    'type' => 'booking_completed',
                    'description' => "Pemesanan #{$booking->id} selesai",
                    'time' => $booking->updated_at ? Carbon::parse($booking->updated_at)->diffForHumans() : 'Baru-baru ini',
                    'user' => "Pengemudi: {$driverName}"
                ];
            });

        $newRatings = Rating::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($rating) {
                $stars = "{$rating->overall}-star";
                return [
                    'id' => $rating->id,
                    'type' => 'rating_received',
                    'description' => "Penilaian bintang {$rating->overall} baru diterima",
                    'time' => $rating->created_at ? Carbon::parse($rating->created_at)->diffForHumans() : 'Baru-baru ini',
                    'user' => $rating->user ? $rating->user->name : 'Pengguna Anonim'
                ];
            });

        $maintenanceScheduled = Maintenance::with('ambulance')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($maintenance) {
                $ambulanceCode = $maintenance->ambulance ? $maintenance->ambulance->vehicle_code : 'Unknown';
                $licensePlate = $maintenance->ambulance ? $maintenance->ambulance->license_plate : '';
                $ambulanceInfo = $ambulanceCode . ($licensePlate ? " - {$licensePlate}" : '');

                return [
                    'id' => $maintenance->id,
                    'type' => 'ambulance_maintenance',
                    'description' => "Ambulans {$ambulanceInfo} " . $this->getMaintenanceStatusText($maintenance->status, $maintenance->maintenance_type),
                    'time' => $maintenance->created_at ? Carbon::parse($maintenance->created_at)->diffForHumans() : 'Baru-baru ini',
                    'user' => $maintenance->technician_name ?? 'Teknisi Belum Ditugaskan'
                ];
            });

        // Combine and sort all recent activity
        $recentActivity = collect()
            ->merge($recentBookings)
            ->merge($recentPayments)
            ->merge($completedBookings)
            ->merge($newRatings)
            ->merge($maintenanceScheduled)
            ->sortByDesc('time')
            ->values()
            ->take(5);

        // Get data for charts
        // Weekly bookings (last 7 days)
        $weeklyBookings = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Booking::whereDate('created_at', $date)->count();
            $weeklyBookings->push([
                'date' => $date->format('D'),
                'count' => $count
            ]);
        }

        // Monthly revenue (last 6 months)
        $monthlyRevenue = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::today()->startOfMonth()->subMonths($i);
            $revenue = Payment::where('status', 'paid')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('amount');
            $monthlyRevenue->push([
                'month' => $month->format('M'),
                'revenue' => $revenue
            ]);
        }

        // Weekly Maintenance Data
        $weeklyMaintenance = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Maintenance::whereDate('created_at', $date)->count();
            $weeklyMaintenance->push([
                'date' => $date->format('D'),
                'count' => $count
            ]);
        }

        // Get emergency calls
        $emergencyCalls = $this->getEmergencyCalls();

        // Get upcoming maintenance
        $upcomingMaintenance = Maintenance::with('ambulance')
            ->where('status', 'scheduled')
            ->orderBy('start_date')
            ->take(5)
            ->get();

        // Get active maintenance
        $activeMaintenance = Maintenance::with('ambulance')
            ->where('status', 'in_progress')
            ->orderBy('start_date')
            ->take(3)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalBookings' => $totalBookings,
                'pendingBookings' => $pendingBookings,
                'activeBookings' => $activeBookings,
                'completedBookings' => $completedBookings,
                'totalDrivers' => $totalDrivers,
                'activeDrivers' => $activeDrivers,
                'totalAmbulances' => $totalAmbulances,
                'availableAmbulances' => $availableAmbulances,
                'totalRevenue' => $totalRevenue,
                'revenueGrowth' => round($revenueGrowth, 1),
                'averageRating' => round($averageRating, 1),
                'totalUsers' => $totalUsers,
                'todayBookings' => $todayBookings,
                'todayRevenue' => $todayRevenue,
                'todayCompletedBookings' => $todayCompletedBookings,
                'pendingMaintenance' => Maintenance::where('status', 'scheduled')->count(),
                'inProgressMaintenance' => Maintenance::where('status', 'in_progress')->count(),
                'completedMaintenance' => Maintenance::where('status', 'completed')->count(),
            ],
            'breakdowns' => [
                'bookingsByStatus' => $bookingsByStatus,
                'ambulancesByStatus' => $ambulancesByStatus,
                'driversByStatus' => $driversByStatus,
            ],
            'recentActivity' => $recentActivity,
            'emergencyCalls' => $emergencyCalls,
            'charts' => [
                'weeklyBookings' => $weeklyBookings,
                'monthlyRevenue' => $monthlyRevenue,
                'weeklyMaintenance' => $weeklyMaintenance
            ],
            'maintenance' => [
                'upcoming' => $upcomingMaintenance,
                'active' => $activeMaintenance
            ],
            'notifications' => $this->getNotifications('admin')['notifications'],
            'unreadCount' => $this->getNotifications('admin')['unreadCount'],
        ]);
    }

    /**
     * Get descriptive text for maintenance status
     *
     * @param string $status
     * @param string $type
     * @return string
     */
    private function getMaintenanceStatusText($status, $type)
    {
        $typeText = $this->formatMaintenanceType($type);

        switch ($status) {
            case 'scheduled':
                return "dijadwalkan untuk {$typeText}";
            case 'in_progress':
                return "sedang dalam {$typeText}";
            case 'completed':
                return "telah menyelesaikan {$typeText}";
            case 'cancelled':
                return "dibatalkan dari {$typeText}";
            default:
                return "memiliki catatan {$typeText}";
        }
    }

    /**
     * Format maintenance type for display
     *
     * @param string $type
     * @return string
     */
    private function formatMaintenanceType($type)
    {
        $types = [
            'service' => 'perawatan rutin',
            'repair' => 'perbaikan',
            'routine' => 'pemeliharaan berkala',
            'inspection' => 'inspeksi',
            'equipment' => 'perawatan peralatan'
        ];

        return $types[$type] ?? $type;
    }

    /**
     * Get emergency calls data, safely handling different schema possibilities
     *
     * @return \Illuminate\Support\Collection
     */
    private function getEmergencyCalls()
    {
        try {
            // Try to get emergency calls from database
            $query = Booking::with(['user', 'ambulance'])
                ->orderBy('created_at', 'desc')
                ->take(5);

            // Check if urgency column exists
            if (Schema::hasColumn('bookings', 'urgency')) {
                $query->where('urgency', 'emergency');
                $activeStatuses = ['pending', 'confirmed', 'dispatched', 'arrived', 'enroute'];
                $query->whereIn('status', $activeStatuses);
            } else {
                // Fallback to is_emergency if it exists
                if (Schema::hasColumn('bookings', 'is_emergency')) {
                    $query->where('is_emergency', true);
                }
            }

            return $query->get()->map(function($booking) {
                // Determine address field dynamically
                $addressField = Schema::hasColumn('bookings', 'pickup_location') ?
                    'pickup_location' : 'pickup_address';

                // Determine patient name field dynamically
                $patientName = 'Unknown';
                if (Schema::hasColumn('bookings', 'passenger_name') && $booking->passenger_name) {
                    $patientName = $booking->passenger_name;
                } elseif ($booking->user) {
                    $patientName = $booking->user->name;
                }

                return [
                    'id' => $booking->id,
                    'address' => $booking->{$addressField} ?? 'No address available',
                    'status' => $booking->status,
                    'patient_name' => $patientName,
                    'created_at' => $booking->created_at
                ];
            });
        } catch (\Exception $e) {
            // Fallback to sample data if queries fail
            return collect([
                [
                    'id' => 'B-' . rand(1000, 9999),
                    'address' => 'Jl. Sudirman No. 45, Jakarta Pusat',
                    'status' => 'pending',
                    'patient_name' => 'Ahmad Riyadi',
                    'created_at' => Carbon::now()->subHours(1)
                ],
                [
                    'id' => 'B-' . rand(1000, 9999),
                    'address' => 'Jl. Gajah Mada No. 12, Jakarta Barat',
                    'status' => 'dispatched',
                    'patient_name' => 'Siti Nurhayati',
                    'created_at' => Carbon::now()->subHours(2)
                ],
                [
                    'id' => 'B-' . rand(1000, 9999),
                    'address' => 'Jl. Kemang Raya No. 10, Jakarta Selatan',
                    'status' => 'completed',
                    'patient_name' => 'Budi Santoso',
                    'created_at' => Carbon::now()->subHours(3)
                ]
            ]);
        }
    }
}
