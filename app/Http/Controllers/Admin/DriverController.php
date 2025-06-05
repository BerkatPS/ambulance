<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Ambulance;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DriverController extends Controller
{
    /**
     * Display a listing of the drivers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Driver::with('ambulance');
        
        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by ambulance
        if ($request->has('ambulance_id') && $request->ambulance_id) {
            $query->where('ambulance_id', $request->ambulance_id);
        }
        
        // Search by name, license, or phone
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('license_number', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        
        $drivers = $query->orderBy($request->sort_by ?? 'name', $request->sort_order ?? 'asc')
            ->paginate($request->per_page ?? 15)
            ->appends($request->all());
            
        // Get filter options - using correct columns based on current database schema
        // Available ambulances are those not assigned to any driver (not in drivers.ambulance_id)
        $ambulances = Ambulance::where('status', 'available')
            ->orWhere('status', 'inactive')
            ->whereNotIn('id', function($query) {
                $query->select('ambulance_id')
                    ->from('drivers')
                    ->whereNotNull('ambulance_id');
            })
            ->select('id', 'vehicle_code', 'license_plate', 'status', 'model', 'registration_number')
            ->get();
        
        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => $drivers,
            'filters' => [
                'status' => $request->status,
                'ambulance_id' => $request->ambulance_id,
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_order' => $request->sort_order,
                'per_page' => $request->per_page,
            ],
            'filterOptions' => [
                'ambulances' => $ambulances,
                'statuses' => [
                    ['value' => 'available', 'label' => 'Tersedia'],
                    ['value' => 'busy', 'label' => 'Sibuk'],
                    ['value' => 'off', 'label' => 'Tidak Bertugas'],
                ],
            ],
        ]);
    }

    /**
     * Show the form for creating a new driver.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Get ambulances that aren't assigned to any driver
        $availableAmbulances = Ambulance::whereNotIn('id', function($query) {
            $query->select('ambulance_id')
                ->from('drivers')
                ->whereNotNull('ambulance_id');
        })->get();
        
        return Inertia::render('Admin/Drivers/Create', [
            'availableAmbulances' => $availableAmbulances,
        ]);
    }

    /**
     * Store a newly created driver in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'license_number' => 'required|string|max:20|unique:drivers',
            'phone' => 'required|string|max:15|unique:drivers',
            'email' => 'nullable|string|email|max:255|unique:drivers',
            'employee_id' => 'required|string|max:10|unique:drivers',
            'license_expiry' => 'required|date',
            'hire_date' => 'required|date',
            'base_salary' => 'required|integer|min:0',
            'ambulance_id' => 'nullable|exists:ambulances,id',
            'status' => 'required|string|in:available,busy,off',
        ]);
        
        // Create the driver record
        $driver = Driver::create($validated);
        
        return redirect()->route('admin.drivers.index')
            ->with('success', 'Pengemudi berhasil ditambahkan.');
    }

    /**
     * Display the specified driver.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $driver = Driver::with(['ambulance'])->findOrFail($id);
        
        // Get recent bookings for this driver
        $recentBookings = Booking::where('ambulance_id', $driver->ambulance_id)
            ->with(['user', 'ambulance'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        
        // Get driver stats
        $totalBookings = Booking::where('ambulance_id', $driver->ambulance_id)->count();
        
        $completedBookings = Booking::where('ambulance_id', $driver->ambulance_id)
            ->where('status', 'completed')
            ->count();
        
        return Inertia::render('Admin/Drivers/Show', [
            'driver' => $driver,
            'recentBookings' => $recentBookings,
            'stats' => [
                'totalBookings' => $totalBookings,
                'completedBookings' => $completedBookings,
                'rating' => $driver->rating ?? 0,
                'totalTrips' => $driver->total_trips ?? 0,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified driver.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $driver = Driver::findOrFail($id);
        
        // Get ambulances that aren't assigned to any driver or are assigned to this driver
        $availableAmbulances = Ambulance::where(function($query) use ($driver) {
            $query->whereNotIn('id', function($subquery) use ($driver) {
                $subquery->select('ambulance_id')
                    ->from('drivers')
                    ->where('id', '!=', $driver->id)
                    ->whereNotNull('ambulance_id');
            })->orWhere('id', $driver->ambulance_id);
        })->get();
        
        return Inertia::render('Admin/Drivers/Edit', [
            'driver' => $driver,
            'availableAmbulances' => $availableAmbulances,
        ]);
    }

    /**
     * Update the specified driver in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $driver = Driver::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'license_number' => 'required|string|max:20|unique:drivers,license_number,' . $id,
            'phone' => 'required|string|max:15|unique:drivers,phone,' . $id,
            'email' => 'nullable|string|email|max:255|unique:drivers,email,' . $id,
            'employee_id' => 'required|string|max:10|unique:drivers,employee_id,' . $id,
            'license_expiry' => 'required|date',
            'hire_date' => 'required|date',
            'base_salary' => 'required|integer|min:0',
            'ambulance_id' => 'nullable|exists:ambulances,id',
            'status' => 'required|string|in:available,busy,off',
        ]);
        
        // Check if ambulance assignment has changed
        $oldAmbulanceId = $driver->ambulance_id;
        $newAmbulanceId = $validated['ambulance_id'];
        
        // Update the driver record
        $driver->update($validated);
        
        // Handle ambulance assignments and status changes
        if ($oldAmbulanceId !== $newAmbulanceId) {
            // If previously assigned to an ambulance, reset that ambulance's assigned_driver_id to null
            if ($oldAmbulanceId) {
                $oldAmbulance = Ambulance::find($oldAmbulanceId);
                if ($oldAmbulance) {
                    $oldAmbulance->status = 'available';
                    $oldAmbulance->save();
                }
            }
            
            // If newly assigned to an ambulance, update the ambulance's assigned_driver_id
            if ($newAmbulanceId) {
                $newAmbulance = Ambulance::find($newAmbulanceId);
                if ($newAmbulance) {
                    $newAmbulance->status = 'on_duty';
                    $newAmbulance->save();
                    
                    // Also update driver status to available if not already busy
                    if ($driver->status === 'off') {
                        $driver->status = 'available';
                        $driver->save();
                    }
                }
            }
        }
        
        return redirect()->route('admin.drivers.show', $driver->id)
            ->with('success', 'Pengemudi berhasil diperbarui.');
    }

    /**
     * Assign an ambulance to a driver.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $driver
     * @return \Illuminate\Http\RedirectResponse
     */
    public function assignAmbulance(Request $request, $driver)
    {
        $validated = $request->validate([
            'ambulance_id' => 'required|exists:ambulances,id',
        ]);
        
        $driver = Driver::findOrFail($driver);
        $ambulance = Ambulance::findOrFail($validated['ambulance_id']);
        
        // Check if ambulance is already assigned to another driver
        $assignedToOtherDriver = Driver::where('ambulance_id', $ambulance->id)
            ->where('id', '!=', $driver->id)
            ->exists();
            
        if ($assignedToOtherDriver) {
            return back()->with('error', 'Ambulans ini sudah ditugaskan ke pengemudi lain.');
        }
        
        // If driver already has an ambulance, update that ambulance's status to 'available'
        if ($driver->ambulance_id) {
            $oldAmbulance = Ambulance::find($driver->ambulance_id);
            if ($oldAmbulance) {
                $oldAmbulance->status = 'available';
                $oldAmbulance->save();
            }
        }
        
        // Assign the new ambulance to the driver
        $driver->ambulance_id = $ambulance->id;
        
        // If driver status is 'off', change it to 'available'
        if ($driver->status === 'off') {
            $driver->status = 'available';
        }
        
        $driver->save();
        
        // Update the ambulance status to 'on_duty'
        $ambulance->status = 'on_duty';
        $ambulance->save();
        
        return redirect()->route('admin.drivers.index')
            ->with('success', 'Ambulans berhasil ditugaskan ke pengemudi.');
    }

    /**
     * Set driver status to available.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setAvailable($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->status = 'available';
        $driver->save();
        
        return redirect()->route('admin.drivers.show', $driver->id)
            ->with('success', 'Status pengemudi berhasil diubah menjadi Tersedia.');
    }

    /**
     * Set driver status to busy.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setBusy($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->status = 'busy';
        $driver->save();
        
        return redirect()->route('admin.drivers.show', $driver->id)
            ->with('success', 'Status pengemudi berhasil diubah menjadi Sibuk.');
    }

    /**
     * Set driver status to off.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setOff($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->status = 'off';
        $driver->save();
        
        return redirect()->route('admin.drivers.show', $driver->id)
            ->with('success', 'Status pengemudi berhasil diubah menjadi Tidak Bertugas.');
    }

    /**
     * Remove the specified driver from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $driver = Driver::findOrFail($id);
        
        // Only allow deletion if driver has no bookings
        $hasBookings = Booking::where('ambulance_id', $driver->ambulance_id)->exists();
        
        if ($hasBookings) {
            return redirect()->back()->with('error', 'Pengemudi tidak dapat dihapus karena memiliki riwayat pemesanan.');
        }
        
        $driver->delete();
        
        return redirect()->route('admin.drivers.index')
            ->with('success', 'Pengemudi berhasil dihapus.');
    }
}
