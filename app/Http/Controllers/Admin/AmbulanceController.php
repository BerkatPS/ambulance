<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ambulance;
use App\Models\AmbulanceType;
use App\Models\AmbulanceStation;
use App\Models\Driver;
use App\Models\Booking;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AmbulanceController extends Controller
{
    /**
     * Display a listing of the ambulances.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Ambulance::query()
            ->with(['ambulanceType', 'ambulanceStation']);
        
        // Apply filters
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        if ($request->type) {
            $query->where('ambulance_type_id', $request->type);
        }
        
        if ($request->station) {
            $query->where('ambulance_station_id', $request->station);
        }
        
        // Apply search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('registration_number', 'like', "%{$request->search}%")
                  ->orWhere('vehicle_code', 'like', "%{$request->search}%")
                  ->orWhere('license_plate', 'like', "%{$request->search}%")
                  ->orWhere('model', 'like', "%{$request->search}%");
            });
        }
        
        $ambulances = $query->orderBy($request->sort_by && in_array($request->sort_by, ['vehicle_code', 'model', 'status', 'created_at', 'year']) ? $request->sort_by : 'vehicle_code', $request->sort_order ?? 'asc')
            ->paginate($request->per_page ?? 15)
            ->appends($request->all());
            
        // Get filter options
        $ambulanceTypes = AmbulanceType::select('id', 'name')->get();
        $ambulanceStations = AmbulanceStation::select('id', 'name')->get();
        
        return Inertia::render('Admin/Ambulances/Index', [
            'ambulances' => $ambulances,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'type' => $request->type,
                'station' => $request->station,
            ],
            'ambulanceTypes' => $ambulanceTypes,
            'ambulanceStations' => $ambulanceStations,
            'statusOptions' => [
                ['value' => 'available', 'label' => 'Tersedia'],
                ['value' => 'on_duty', 'label' => 'Sedang Bertugas'],
                ['value' => 'maintenance', 'label' => 'Dalam Pemeliharaan'],
                ['value' => 'inactive', 'label' => 'Tidak Aktif'],
            ],
        ]);
    }

    /**
     * Show the form for creating a new ambulance.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $ambulanceTypes = AmbulanceType::all();
        $ambulanceStations = AmbulanceStation::all();
        
        return Inertia::render('Admin/Ambulances/Create', [
            'ambulanceTypes' => $ambulanceTypes,
            'ambulanceStations' => $ambulanceStations,
            'statusOptions' => [
                ['value' => 'available', 'label' => 'Tersedia'],
                ['value' => 'on_duty', 'label' => 'Sedang Bertugas'],
                ['value' => 'maintenance', 'label' => 'Dalam Pemeliharaan'],
                ['value' => 'inactive', 'label' => 'Tidak Aktif'],
            ],
        ]);
    }

    /**
     * Store a newly created ambulance in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:255|unique:ambulances',
            'model' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'ambulance_type_id' => 'required|exists:ambulance_types,id',
            'ambulance_station_id' => 'nullable|exists:ambulance_stations,id',
            'status' => 'required|in:available,on_duty,maintenance,inactive',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'equipment' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        
        $ambulance = Ambulance::create($validated);
        
        return redirect()->route('admin.ambulances.show', $ambulance)
            ->with('success', 'Ambulans berhasil ditambahkan.');
    }

    /**
     * Display the specified ambulance.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $ambulance = Ambulance::with(['ambulanceType', 'ambulanceStation'])
            ->findOrFail($id);
            
        // Get active bookings - using correct column names
        $activeBookings = Booking::where('ambulance_id', $id)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->orderBy('scheduled_at', 'asc')  
            ->take(5)
            ->get();
            
        // Get recent bookings - using correct column names
        $recentBookings = Booking::where('ambulance_id', $id)
            ->whereIn('status', ['completed', 'cancelled'])
            ->orderBy('completed_at', 'desc')  
            ->take(5)
            ->get();
            
        // Get maintenance records
        $maintenanceRecords = Maintenance::where('ambulance_id', $id)
            ->orderBy('start_date', 'desc')
            ->take(5)
            ->get();
            
        return Inertia::render('Admin/Ambulances/Show', [
            'ambulance' => $ambulance,
            'activeBookings' => $activeBookings,
            'recentBookings' => $recentBookings,
            'maintenanceRecords' => $maintenanceRecords,
        ]);
    }

    /**
     * Show the form for editing the specified ambulance.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $ambulance = Ambulance::findOrFail($id);
        $ambulanceTypes = AmbulanceType::all();
        $ambulanceStations = AmbulanceStation::all();
        
        return Inertia::render('Admin/Ambulances/Edit', [
            'ambulance' => $ambulance,
            'ambulanceTypes' => $ambulanceTypes,
            'ambulanceStations' => $ambulanceStations,
            'statusOptions' => [
                ['value' => 'available', 'label' => 'Tersedia'],
                ['value' => 'on_duty', 'label' => 'Sedang Bertugas'],
                ['value' => 'maintenance', 'label' => 'Dalam Pemeliharaan'],
                ['value' => 'inactive', 'label' => 'Tidak Aktif'],
            ],
        ]);
    }

    /**
     * Update the specified ambulance in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $ambulance = Ambulance::findOrFail($id);
        
        $validated = $request->validate([
            'registration_number' => 'required|string|max:255|unique:ambulances,registration_number,' . $id,
            'model' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'ambulance_type_id' => 'required|exists:ambulance_types,id',
            'ambulance_station_id' => 'nullable|exists:ambulance_stations,id',
            'status' => 'required|in:available,on_duty,maintenance,inactive',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'equipment' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        
        $ambulance->update($validated);
        
        return redirect()->route('admin.ambulances.show', $ambulance)
            ->with('success', 'Ambulans berhasil diperbarui.');
    }

    /**
     * Remove the specified ambulance from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $ambulance = Ambulance::findOrFail($id);
        
        // Check if ambulance has active bookings
        $activeBookings = Booking::where('ambulance_id', $id)
            ->whereIn('status', ['pending', 'confirmed', 'dispatched', 'arrived'])
            ->exists();
            
        if ($activeBookings) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus ambulans yang sedang memiliki pemesanan aktif.');
        }
        
        $ambulance->delete();
        
        return redirect()->route('admin.ambulances.index')
            ->with('success', 'Ambulans berhasil dihapus.');
    }

    /**
     * Show the form for scheduling maintenance.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function scheduleMaintenance($id)
    {
        $ambulance = Ambulance::findOrFail($id);
        
        return Inertia::render('Admin/Ambulances/ScheduleMaintenance', [
            'ambulance' => $ambulance,
        ]);
    }

    /**
     * Store a new maintenance record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeMaintenance(Request $request, $id)
    {
        $ambulance = Ambulance::findOrFail($id);
        
        $validated = $request->validate([
            'maintenance_type' => 'required|string|in:routine,repair,inspection,equipment',
            'description' => 'required|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'cost' => 'nullable|numeric|min:0',
            'technician_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);
        
        // Generate a unique maintenance code
        $maintenanceCode = 'MAINT-' . strtoupper(substr(md5(uniqid()), 0, 8));
        
        $maintenance = new Maintenance();
        $maintenance->ambulance_id = $ambulance->id;
        $maintenance->maintenance_code = $maintenanceCode;
        $maintenance->maintenance_type = $validated['maintenance_type'];
        $maintenance->description = $validated['description'];
        $maintenance->start_date = $validated['start_date'];
        $maintenance->end_date = $validated['end_date'];
        $maintenance->cost = $validated['cost'] ?? 0;
        $maintenance->technician_name = $validated['technician_name'] ?? '';
        $maintenance->notes = $validated['notes'] ?? '';
        $maintenance->status = 'scheduled';
        $maintenance->save();
        
        // Update ambulance status to maintenance
        $ambulance->status = 'maintenance';
        $ambulance->last_maintenance_date = now();
        $ambulance->next_maintenance_date = $validated['end_date'];
        $ambulance->save();
        
        return redirect()->route('admin.ambulances.show', $ambulance->id)
            ->with('success', 'Jadwal pemeliharaan berhasil dibuat.');
    }

    /**
     * Complete a maintenance record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param  int  $maintenanceId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function completeMaintenance(Request $request, $id, $maintenanceId)
    {
        $ambulance = Ambulance::findOrFail($id);
        $maintenance = Maintenance::where('ambulance_id', $id)
            ->where('id', $maintenanceId)
            ->firstOrFail();
            
        $validated = $request->validate([
            'notes' => 'required|string',
            'cost' => 'nullable|numeric|min:0',
        ]);
        
        $maintenance->status = 'completed';
        $maintenance->end_date = now();
        $maintenance->notes = $validated['notes'];
        $maintenance->cost = $validated['cost'] ?? $maintenance->cost;
        $maintenance->save();
        
        // Update ambulance status back to available
        $ambulance->status = 'available';
        $ambulance->last_maintenance_date = now();
        
        // Calculate next maintenance date (3 months from now by default)
        $ambulance->next_maintenance_date = now()->addMonths(3);
        $ambulance->save();
        
        return redirect()->route('admin.ambulances.show', $ambulance->id)
            ->with('success', 'Pemeliharaan berhasil diselesaikan.');
    }

    /**
     * Activate an ambulance (set status to available).
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function activate($id)
    {
        $ambulance = Ambulance::findOrFail($id);
        $ambulance->status = 'available';
        $ambulance->save();
        
        return redirect()->route('admin.ambulances.show', $ambulance->id)
            ->with('success', 'Ambulans berhasil diaktifkan.');
    }

    /**
     * Deactivate an ambulance (set status to inactive).
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deactivate($id)
    {
        $ambulance = Ambulance::findOrFail($id);
        $ambulance->status = 'inactive';
        $ambulance->save();
        
        return redirect()->route('admin.ambulances.show', $ambulance->id)
            ->with('success', 'Ambulans berhasil dinonaktifkan.');
    }
}
