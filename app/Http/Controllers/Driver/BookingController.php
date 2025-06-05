<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use App\Events\EmergencyBookingUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Menampilkan daftar pesanan untuk driver.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $driver = Auth::guard('driver')->user();

        // Query dasar dengan relasi yang diperlukan
        $query = Booking::where('driver_id', $driver->id)
                ->with([
                    'user',          // Data pengguna
                    'ambulance',     // Data ambulans
                ]);

        // Filter untuk pesanan aktif atau riwayat
        if ($request->has('history') && $request->history) {
            $query->whereIn('status', ['completed', 'cancelled']);

            // Filter tambahan untuk tampilan riwayat
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from') && !empty($request->date_from)) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->has('date_to') && !empty($request->date_to)) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
        } else {
            // Pesanan aktif - hanya menampilkan yang perlu ditangani driver
            $query->whereIn('status', ['pending', 'confirmed', 'dispatched', 'arrived', 'enroute']);
        }

        // Filter tambahan yang berlaku untuk keduanya
        if ($request->has('urgency') && !empty($request->urgency)) {
            $query->where('urgency', $request->urgency);
        }

        // Urutkan berdasarkan yang terbaru
        $query->orderBy('created_at', 'desc');

        // Paginasi hasil
        $perPage = $request->has('per_page') ? $request->per_page : 10;
        $bookings = $query->paginate($perPage)->withQueryString();

        // Dapatkan detail ambulans jika driver memiliki yang ditugaskan
        $driverAmbulance = null;
        if ($driver->ambulance_id) {
            $driverAmbulance = Ambulance::find($driver->ambulance_id);
        }

        return Inertia::render('Driver/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->all(),
            'driver' => $driver,
            'driverAmbulance' => $driverAmbulance,
            'urgencyOptions' => [
                'normal' => 'Normal',
                'urgent' => 'Mendesak',
                'emergency' => 'Darurat'
            ],
            'statusOptions' => [
                'pending' => 'Menunggu',
                'confirmed' => 'Dikonfirmasi',
                'dispatched' => 'Dikirim',
                'arrived' => 'Tiba di Lokasi',
                'enroute' => 'Dalam Perjalanan',
                'completed' => 'Selesai',
                'cancelled' => 'Dibatalkan',
            ],
            'perPageOptions' => [5, 10, 25, 50],
            'currentPerPage' => (int) $perPage,
        ]);
    }

    /**
     * Menampilkan halaman riwayat pesanan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function history(Request $request)
    {
        // Panggil method index dengan parameter history
        $request->merge(['history' => true]);
        return $this->index($request);
    }

    /**
     * Menampilkan detail pesanan.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::with([
            'user',
            'ambulance',
            'rating',
            'payment'
        ])->findOrFail($id);

        // Periksa apakah pesanan ini ditugaskan ke driver ini
        if ($booking->driver_id != $driver->id) {
            return redirect()->route('driver.bookings.index')->with('error', 'Pesanan ini tidak ditugaskan kepada Anda.');
        }

        // Sembunyikan informasi keuangan yang tidak diperlukan driver
        $booking->makeHidden([
            'base_fare',
            'distance_fare',
            'total_fare',
            'payment_method',
            'payment_status'
        ]);

        return Inertia::render('Driver/Bookings/Show', [
            'booking' => $booking
        ]);
    }

    /**
     * Menerima pesanan.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function accept($id)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::findOrFail($id);

        // Periksa apakah booking sudah ditugaskan ke driver lain
        if ($booking->driver_id && $booking->driver_id != $driver->id) {
            return redirect()->back()->with('error', 'Pesanan ini sudah ditugaskan ke driver lain.');
        }

        // Periksa apakah statusnya masih pending
        if ($booking->status !== 'pending') {
            return redirect()->back()->with('error', 'Status pesanan sudah berubah, tidak dapat diterima.');
        }

        // Update status booking
        $booking->driver_id = $driver->id;
        $booking->setAttribute('status', 'confirmed');
        $booking->save();

        // Update status driver menjadi sibuk
        $driver->status = 'busy'; // Status harus sesuai dengan ENUM yang valid
        $driver->save();

        // Update status ambulance jika ada
        if ($driver->ambulance_id) {
            $ambulance = Ambulance::find($driver->ambulance_id);
            if ($ambulance) {
                $ambulance->status = 'on_duty';
                $ambulance->save();
            }
        }

        return redirect()->back()->with('success', 'Pesanan berhasil diterima.');
    }

    /**
     * Memulai perjalanan.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function start($id)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::findOrFail($id);

        // Periksa apakah pesanan ditugaskan ke driver ini
        if ($booking->driver_id != $driver->id) {
            return redirect()->back()->with('error', 'Pesanan ini tidak ditugaskan kepada Anda.');
        }

        // Periksa apakah status pesanan adalah confirmed
        if ($booking->status !== 'confirmed') {
            return redirect()->back()->with('error', 'Status pesanan tidak sesuai, tidak dapat memulai perjalanan.');
        }

        // Update status pesanan
        $booking->setAttribute('status', 'dispatched'); // Menggunakan 'dispatched' sebagai nilai ENUM yang valid
        $booking->pickup_time = now();
        $booking->save();

        // Pastikan status driver sibuk
        if ($driver->status !== 'busy') {
            $driver->status = 'busy';
            $driver->save();

            // Update status ambulance jika ditugaskan
            if ($driver->ambulance_id) {
                $ambulance = Ambulance::find($driver->ambulance_id);
                if ($ambulance) {
                    $ambulance->status = 'on_duty';
                    $ambulance->save();
                }
            }
        }

        return redirect()->back()->with('success', 'Perjalanan dimulai.');
    }

    /**
     * Menandai tiba di lokasi penjemputan.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function arrive($id)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::with('payment')->findOrFail($id);

        // Periksa apakah pesanan ditugaskan ke driver ini
        if ($booking->driver_id != $driver->id) {
            return redirect()->back()->with('error', 'Pesanan ini tidak ditugaskan kepada Anda.');
        }

        // Periksa apakah status pesanan sesuai
        if ($booking->status !== 'dispatched') {
            return redirect()->back()->with('error', 'Status pesanan tidak sesuai, tidak dapat menandai tiba di lokasi.');
        }

        // Update status pesanan
        $booking->setAttribute('status', 'arrived');
        
        // Pastikan pickup_time tercatat jika belum ada
        if (!$booking->pickup_time) {
            $booking->pickup_time = now();
        }
        
        $booking->save();

        // Log perubahan status
        \Illuminate\Support\Facades\Log::info('Driver telah tiba di lokasi penjemputan', [
            'booking_id' => $booking->id,
            'driver_id' => $driver->id,
            'pickup_time' => $booking->pickup_time,
        ]);

        return redirect()->back()->with('success', 'Berhasil menandai tiba di lokasi penjemputan.');
    }

    /**
     * Mulai perjalanan ke tujuan setelah sampai di lokasi penjemputan.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function depart($id)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::with('payment')->findOrFail($id);

        // Pastikan driver adalah yang sedang login
        if ($booking->driver_id !== $driver->id) {
            return redirect()->back()->with('error', 'Anda tidak berhak mengakses pesanan ini.');
        }

        if ($booking->status !== 'arrived') {
            return redirect()->back()->with('error', 'Status pesanan tidak sesuai, tidak dapat memulai perjalanan ke tujuan.');
        }

        // Untuk booking emergency, periksa apakah pembayaran sudah dilakukan
        if ($booking->type === 'emergency') {
            // Jika belum ada pembayaran atau statusnya masih pending, beri peringatan
            if (!$booking->payment || $booking->payment->status !== 'paid') {
                return redirect()->back()->with('warning', 'Perjalanan dapat dilanjutkan, namun ingatkan pasien untuk menyelesaikan pembayaran segera.');
            }
        }

        // Untuk booking terjadwal, periksa apakah uang muka sudah dibayar
        if ($booking->type === 'scheduled') {
            if (!$booking->is_downpayment_paid) {
                return redirect()->back()->with('error', 'Pasien harus membayar uang muka terlebih dahulu sebelum perjalanan dapat dilanjutkan.');
            }
        }

        // Update status pesanan ke 'enroute' - perjalanan menuju tujuan
        $booking->setAttribute('status', 'enroute');
        $booking->save();

        // Log perubahan status
        \Illuminate\Support\Facades\Log::info('Driver memulai perjalanan ke tujuan', [
            'booking_id' => $booking->id,
            'driver_id' => $driver->id,
            'status_change' => 'arrived -> enroute',
        ]);

        return redirect()->back()->with('success', 'Perjalanan menuju tujuan dimulai.');
    }

    /**
     * Menyelesaikan perjalanan.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function complete($id)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::with('payment')->findOrFail($id);

        // Periksa apakah pesanan ditugaskan ke driver ini
        if ($booking->driver_id != $driver->id) {
            return redirect()->back()->with('error', 'Pesanan ini tidak ditugaskan kepada Anda.');
        }

        // Periksa apakah status pesanan sesuai
        if (!in_array($booking->status, ['dispatched', 'arrived', 'enroute'])) {
            return redirect()->back()->with('error', 'Status pesanan tidak sesuai, tidak dapat menyelesaikan perjalanan.');
        }

        // Periksa pembayaran untuk booking emergency
        if ($booking->type === 'emergency' && $booking->status === 'arrived') {
            // Cek apakah sudah ada pembayaran dan status pembayarannya
            if (!$booking->payment || $booking->payment->status !== 'paid') {
                return redirect()->back()->with('error', 'Pesanan darurat memerlukan pembayaran penuh sebelum dapat diselesaikan. Mohon informasikan pasien untuk menyelesaikan pembayaran.');
            }
        }

        // Periksa pembayaran final untuk booking terjadwal
        if ($booking->type === 'scheduled' && $booking->status === 'arrived') {
            // Cek apakah pembayaran final sudah dilakukan
            $finalPaymentExists = $booking->payment && 
                                 $booking->payment->payment_type === 'final_payment' && 
                                 $booking->payment->status === 'paid';
            
            if (!$finalPaymentExists) {
                return redirect()->back()->with('error', 'Pesanan terjadwal memerlukan pembayaran akhir sebelum dapat diselesaikan. Mohon informasikan pasien untuk menyelesaikan pembayaran.');
            }
        }

        // Update status pesanan
        $booking->setAttribute('status', 'completed');
        $booking->completion_time = now();
        $booking->save();

        // Update status driver menjadi tersedia
        $driver->status = 'available';
        $driver->total_trips = $driver->total_trips + 1;
        $driver->save();

        // Update status ambulance jika ditugaskan
        if ($driver->ambulance_id) {
            $ambulance = Ambulance::find($driver->ambulance_id);
            if ($ambulance) {
                $ambulance->status = 'available';
                $ambulance->save();
            }
        }

        return redirect()->back()->with('success', 'Perjalanan berhasil diselesaikan.');
    }

    /**
     * Membatalkan pesanan.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel($id, Request $request)
    {
        $driver = Auth::guard('driver')->user();
        $booking = Booking::findOrFail($id);

        // Periksa apakah pesanan ditugaskan ke driver ini
        if ($booking->driver_id != $driver->id) {
            return redirect()->back()->with('error', 'Pesanan ini tidak ditugaskan kepada Anda.');
        }

        // Periksa apakah status pesanan masih bisa dibatalkan
        if (!in_array($booking->status, ['confirmed', 'dispatched'])) {
            return redirect()->back()->with('error', 'Status pesanan tidak dapat dibatalkan pada tahap ini.');
        }

        // Validasi alasan pembatalan
        $request->validate([
            'cancellation_reason' => 'required|string|max:255',
        ]);

        // Update status pesanan
        $booking->setAttribute('status', 'cancelled');
        $booking->cancellation_reason = $request->cancellation_reason;
        $booking->save();

        // Update status driver menjadi tersedia
        $driver->status = 'available';
        $driver->save();

        // Update status ambulance jika ditugaskan
        if ($driver->ambulance_id) {
            $ambulance = Ambulance::find($driver->ambulance_id);
            if ($ambulance) {
                $ambulance->status = 'available';
                $ambulance->save();
            }
        }

        return redirect()->back()->with('success', 'Pesanan dibatalkan.');
    }

    /**
     * Accept an emergency booking
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function acceptEmergency(Request $request)
    {
        // Validasi request
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);
        
        $driver = Auth::guard('driver')->user();
        
        // Cek apakah driver tersedia dan memiliki ambulans
        if ($driver->status !== 'available') {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus dalam status tersedia untuk menerima booking darurat.'
            ], 400);
        }
        
        if (!$driver->ambulance_id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda memerlukan ambulans untuk menerima booking darurat.'
            ], 400);
        }
        
        // Ambil booking
        $booking = Booking::find($validated['booking_id']);
        
        // Cek apakah booking masih tersedia (belum diambil driver lain)
        if ($booking->status !== 'pending' || $booking->driver_id !== null) {
            return response()->json([
                'success' => false,
                'message' => 'Booking ini sudah diterima oleh driver lain.'
            ], 400);
        }
        
        // Cek apakah booking berjenis emergency
        if ($booking->type !== 'emergency') {
            return response()->json([
                'success' => false,
                'message' => 'Booking ini bukan booking darurat.'
            ], 400);
        }
        
        // Update status booking
        DB::beginTransaction();
        
        try {
            // Update booking
            $booking->driver_id = $driver->id;
            $booking->ambulance_id = $driver->ambulance_id;
            $booking->status = 'dispatched';  // Menggunakan status valid: 'dispatched' dari nilai enum yang diperbolehkan
            $booking->accepted_at = now();
            $booking->save();
            
            // Update status driver menjadi busy
            $driver->status = 'busy';
            $driver->save();
            
            // Broadcast event booking telah diupdate
            event(new EmergencyBookingUpdated($booking));
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Booking darurat berhasil diterima.',
                'booking_id' => $booking->id
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error accepting emergency booking: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menerima booking. Silakan coba lagi.'
            ], 500);
        }
    }
}
