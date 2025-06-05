<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Ambulance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of maintenance records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Maintenance::with(['ambulance']);
        
        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by maintenance type
        if ($request->has('maintenance_type') && $request->maintenance_type) {
            $query->where('maintenance_type', $request->maintenance_type);
        }
        
        // Filter by ambulance
        if ($request->has('ambulance_id') && $request->ambulance_id) {
            $query->where('ambulance_id', $request->ambulance_id);
        }
        
        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('end_date', '<=', $request->end_date);
        }
        
        // Search by description or technician
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('technician_name', 'like', "%{$search}%")
                  ->orWhere('maintenance_code', 'like', "%{$search}%");
            });
        }
        
        // Map sort fields to actual database columns
        $sortBy = $request->sort_by ?? 'start_date';
        if ($sortBy === 'completion_date') {
            $sortBy = 'end_date';
        } elseif ($sortBy === 'maintenance_type') {
            $sortBy = 'maintenance_type';
        }
        
        // Handle relationship sorting
        if (strpos($sortBy, 'ambulance.') === 0) {
            // Extract the column name after the dot
            $ambulanceColumn = substr($sortBy, strlen('ambulance.'));
            
            // Join with the ambulances table if not already joined
            if (!$query->getQuery()->joins || !collect($query->getQuery()->joins)->pluck('table')->contains('ambulances')) {
                $query->join('ambulances', 'maintenance.ambulance_id', '=', 'ambulances.id');
            }
            
            $maintenances = $query->orderBy('ambulances.' . $ambulanceColumn, $request->sort_order ?? 'asc')
                ->paginate($request->per_page ?? 15)
                ->appends($request->all());
        } else {
            $maintenances = $query->orderBy($sortBy, $request->sort_order ?? 'asc')
                ->paginate($request->per_page ?? 15)
                ->appends($request->all());
        }
            
        // Get filter options
        $ambulances = Ambulance::select('id', 'vehicle_code', 'license_plate')
            ->orderBy('vehicle_code')
            ->get()
            ->map(function ($ambulance) {
                return [
                    'value' => $ambulance->id,
                    'label' => "{$ambulance->vehicle_code} - {$ambulance->license_plate}"
                ];
            });
        
        return Inertia::render('Admin/Maintenance/Index', [
            'maintenances' => $maintenances,
            'filters' => [
                'status' => $request->status,
                'maintenance_type' => $request->maintenance_type,
                'ambulance_id' => $request->ambulance_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_order' => $request->sort_order,
                'per_page' => $request->per_page,
            ],
            'filterOptions' => [
                'ambulances' => $ambulances,
                'statuses' => [
                    ['value' => 'scheduled', 'label' => 'Scheduled'],
                    ['value' => 'in_progress', 'label' => 'In Progress'],
                    ['value' => 'completed', 'label' => 'Completed'],
                    ['value' => 'cancelled', 'label' => 'Cancelled'],
                ],
                'maintenanceTypes' => [
                    ['value' => 'service', 'label' => 'Routine Service'],
                    ['value' => 'repair', 'label' => 'Repair'],
                ],
            ],
        ]);
    }

    /**
     * Show the form for creating a new maintenance record.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $ambulances = Ambulance::select('id', 'vehicle_code', 'license_plate')
            ->orderBy('vehicle_code')
            ->get()
            ->map(function ($ambulance) {
                return [
                    'value' => $ambulance->id,
                    'label' => "{$ambulance->vehicle_code} - {$ambulance->license_plate}"
                ];
            });
        
        $maintenanceTypes = [
            ['value' => 'service', 'label' => 'Routine Service'],
            ['value' => 'repair', 'label' => 'Repair'],
        ];
        
        return Inertia::render('Admin/Maintenance/Create', [
            'ambulances' => $ambulances,
            'maintenanceTypes' => $maintenanceTypes,
        ]);
    }

    /**
     * Store a newly created maintenance record in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ambulance_id' => 'required|exists:ambulances,id',
            'maintenance_type' => 'required|string|in:service,repair',
            'description' => 'required|string',
            'start_date' => 'required|date|after_or_equal:today',
            'estimated_completion_date' => 'required|date|after_or_equal:start_date',
            'estimated_cost' => 'nullable|numeric|min:0',
            'technician_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);
        
        $validated['status'] = 'scheduled';
        $validated['maintenance_code'] = $request->maintenance_code;
        $validated['type'] = $validated['maintenance_type'];
        unset($validated['maintenance_type']);
        
        $maintenance = Maintenance::create($validated);
        
        // Update ambulance status if needed
        $ambulance = Ambulance::find($request->ambulance_id);
        if ($ambulance && $request->has('update_ambulance_status') && $request->update_ambulance_status) {
            $ambulance->status = 'maintenance';
            $ambulance->save();
        }
        
        return redirect()->route('admin.maintenance.index')
            ->with('success', 'Maintenance record created successfully.');
    }

    /**
     * Display the specified maintenance record.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $maintenance = Maintenance::with(['ambulance'])->findOrFail($id);
        
        return Inertia::render('Admin/Maintenance/Show', [
            'maintenance' => $maintenance,
        ]);
    }

    /**
     * Show the form for editing the specified maintenance record.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $maintenance = Maintenance::findOrFail($id);
        
        $ambulances = Ambulance::select('id', 'vehicle_code', 'license_plate')
            ->orderBy('vehicle_code')
            ->get()
            ->map(function ($ambulance) {
                return [
                    'value' => $ambulance->id,
                    'label' => "{$ambulance->vehicle_code} - {$ambulance->license_plate}"
                ];
            });
        
        $maintenanceTypes = [
            ['value' => 'service', 'label' => 'Routine Service'],
            ['value' => 'repair', 'label' => 'Repair'],
        ];
        
        $statuses = [
            ['value' => 'scheduled', 'label' => 'Scheduled'],
            ['value' => 'in_progress', 'label' => 'In Progress'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];
        
        return Inertia::render('Admin/Maintenance/Edit', [
            'maintenance' => $maintenance,
            'ambulances' => $ambulances,
            'maintenanceTypes' => $maintenanceTypes,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified maintenance record in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $maintenance = Maintenance::findOrFail($id);
        
        $validated = $request->validate([
            'ambulance_id' => 'required|exists:ambulances,id',
            'maintenance_type' => 'required|string|in:service,repair',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'estimated_completion_date' => 'required|date|after_or_equal:start_date',
            'estimated_cost' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'technician_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:scheduled,in_progress,completed,cancelled',
        ]);
        
        $validated['type'] = $validated['maintenance_type'];
        unset($validated['maintenance_type']);
        
        // If status changes to completed, set completion date
        if ($request->status == 'completed' && $maintenance->status != 'completed') {
            $validated['end_date'] = now();
        }
        
        $maintenance->update($validated);
        
        // Update ambulance status if needed
        if ($request->has('update_ambulance_status') && $request->update_ambulance_status) {
            $ambulance = Ambulance::find($request->ambulance_id);
            if ($ambulance) {
                // If maintenance completed, set ambulance status back to available
                if ($request->status == 'completed') {
                    $ambulance->status = 'available';
                    $ambulance->last_maintenance_date = now();
                    
                    // Set next maintenance date (e.g., 3 months later for routine)
                    if ($request->maintenance_type == 'service') {
                        $ambulance->next_maintenance_date = now()->addMonths(3);
                    }
                } else if ($request->status == 'in_progress') {
                    $ambulance->status = 'maintenance';
                }
                
                $ambulance->save();
            }
        }
        
        return redirect()->route('admin.maintenance.show', $maintenance->id)
            ->with('success', 'Maintenance record updated successfully.');
    }

    /**
     * Remove the specified maintenance record from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $maintenance = Maintenance::findOrFail($id);
        
        // Prevent deletion of in-progress maintenance
        if ($maintenance->status == 'in_progress') {
            return redirect()->back()->with('error', 'Cannot delete in-progress maintenance.');
        }
        
        $maintenance->delete();
        
        return redirect()->route('admin.maintenance.index')
            ->with('success', 'Maintenance record deleted successfully.');
    }

    /**
     * Mark a maintenance record as started.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function startMaintenance($id)
    {
        $maintenance = Maintenance::findOrFail($id);
        
        if ($maintenance->status != 'scheduled') {
            return redirect()->back()->with('error', 'Only scheduled maintenance can be started.');
        }
        
        $maintenance->status = 'in_progress';
        $maintenance->start_date = now();
        $maintenance->save();
        
        // Update ambulance status
        $ambulance = Ambulance::find($maintenance->ambulance_id);
        if ($ambulance) {
            $ambulance->status = 'maintenance';
            $ambulance->save();
        }
        
        return redirect()->route('admin.maintenance.show', $maintenance->id)
            ->with('success', 'Maintenance has been started.');
    }

    /**
     * Mark a maintenance record as completed.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function completeMaintenance(Request $request, $id)
    {
        $maintenance = Maintenance::findOrFail($id);
        
        if ($maintenance->status != 'in_progress') {
            return redirect()->back()->with('error', 'Only in-progress maintenance can be completed.');
        }
        
        $validated = $request->validate([
            'actual_cost' => 'required|numeric|min:0',
            'completion_notes' => 'nullable|string',
        ]);
        
        $maintenance->status = 'completed';
        $maintenance->end_date = now();
        $maintenance->actual_cost = $validated['actual_cost'];
        $maintenance->notes = $maintenance->notes 
            ? $maintenance->notes . "\n\nCompletion Notes: " . $validated['completion_notes']
            : "Completion Notes: " . $validated['completion_notes'];
        $maintenance->save();
        
        // Update ambulance status
        $ambulance = Ambulance::find($maintenance->ambulance_id);
        if ($ambulance) {
            $ambulance->status = 'available';
            $ambulance->last_maintenance_date = now();
            
            // Set next maintenance date
            if ($maintenance->type == 'service') {
                $ambulance->next_maintenance_date = now()->addMonths(3);
            }
            
            $ambulance->save();
        }
        
        return redirect()->route('admin.maintenance.show', $maintenance->id)
            ->with('success', 'Maintenance has been completed.');
    }

    /**
     * Display the maintenance calendar view.
     *
     * @return \Inertia\Response
     */
    public function calendar()
    {
        $maintenances = Maintenance::with(['ambulance'])
            ->whereIn('status', ['scheduled', 'in_progress'])
            ->get()
            ->map(function ($maintenance) {
                return [
                    'id' => $maintenance->id,
                    'title' => $maintenance->ambulance->vehicle_code . ' - ' . ucfirst($maintenance->type),
                    'start' => $maintenance->start_date,
                    'end' => $maintenance->estimated_completion_date,
                    'status' => $maintenance->status,
                    'url' => route('admin.maintenance.show', $maintenance->id),
                    'backgroundColor' => $maintenance->status == 'scheduled' ? '#4299e1' : '#ed8936',
                ];
            });
        
        return Inertia::render('Admin/Maintenance/Calendar', [
            'maintenances' => $maintenances,
        ]);
    }
}
