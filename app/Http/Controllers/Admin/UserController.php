<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // Filter by status (if implemented)
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by city
        if ($request->has('city') && $request->city) {
            $query->where('city', $request->city);
        }
        
        // Search by name, phone, or address
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }
        
        $users = $query->orderBy($request->sort_by && in_array($request->sort_by, ['name', 'phone', 'created_at', 'city']) ? $request->sort_by : 'name', $request->sort_order ?? 'asc')
            ->paginate($request->per_page ?? 15)
            ->appends($request->all());
            
        // Get filter options - unique cities
        $cities = User::distinct('city')
            ->whereNotNull('city')
            ->pluck('city')
            ->map(function ($city) {
                return ['value' => $city, 'label' => $city];
            });
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'status' => $request->status,
                'city' => $request->city,
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_order' => $request->sort_order,
                'per_page' => $request->per_page,
            ],
            'filterOptions' => [
                'cities' => $cities,
                'statuses' => [
                    ['value' => 'active', 'label' => 'Active'],
                    ['value' => 'inactive', 'label' => 'Inactive'],
                ],
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
        ]);
        
        $user = User::create($validated);
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        
        // Get user bookings
        $bookings = Booking::where('user_id', $id)
            ->with(['ambulance', 'payment'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        
        // Get user stats
        $totalBookings = Booking::where('user_id', $id)->count();
        $emergencyBookings = Booking::where('user_id', $id)->where('type', 'emergency')->count();
        $scheduledBookings = Booking::where('user_id', $id)->where('type', 'scheduled')->count();
        
        // Use bookings to get payments instead of directly querying payments
        $totalPayments = Booking::where('user_id', $id)
            ->join('payments', 'bookings.id', '=', 'payments.booking_id')
            ->where('payments.status', 'paid')
            ->sum('payments.amount');
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'bookings' => $bookings,
            'stats' => [
                'totalBookings' => $totalBookings,
                'emergencyBookings' => $emergencyBookings,
                'scheduledBookings' => $scheduledBookings,
                'totalPayments' => $totalPayments,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users,phone,' . $id,
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:active,inactive',
        ]);
        
        $user->update($validated);
        
        return redirect()->route('admin.users.show', $user->id)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Check if user has active bookings
        $activeBookings = Booking::where('user_id', $id)
            ->whereIn('status', ['pending', 'confirmed', 'dispatched', 'in_progress'])
            ->exists();
            
        if ($activeBookings) {
            return redirect()->back()->with('error', 'Cannot delete user with active bookings.');
        }
        
        // Consider soft delete or anonymization instead of hard delete for GDPR compliance
        $user->delete();
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Display the user's booking history.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function bookingHistory($id)
    {
        $user = User::findOrFail($id);
        
        $bookings = Booking::where('user_id', $id)
            ->with(['ambulance', 'payment', 'rating'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('Admin/Users/BookingHistory', [
            'user' => $user,
            'bookings' => $bookings,
        ]);
    }

    /**
     * Display the user's payment history.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function paymentHistory($id)
    {
        $user = User::findOrFail($id);
        
        $payments = Payment::where('user_id', $id)
            ->with('booking')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('Admin/Users/PaymentHistory', [
            'user' => $user,
            'payments' => $payments,
        ]);
    }
}
