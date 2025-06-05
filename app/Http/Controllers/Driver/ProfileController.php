<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the driver's profile edit form.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        $driver = Auth::guard('driver')->user();
        
        return Inertia::render('Driver/Profile/Edit', [
            'driver' => $driver,
        ]);
    }

    /**
     * Update the driver's profile information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $driver = Auth::guard('driver')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('drivers')->ignore($driver->id),
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('drivers')->ignore($driver->id),
            ],
            'license_number' => 'required|string|max:255',
            'license_expiry' => 'required|date|after:today',
        ]);
        
        $driver->update($validated);
        
        return redirect()->route('driver.profile.edit')
            ->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the driver's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $driver = Auth::guard('driver')->user();
        
        // Check if the current password matches
        if (!Hash::check($validated['current_password'], $driver->password)) {
            return back()->withErrors([
                'current_password' => 'The provided current password is incorrect.',
            ]);
        }
        
        $driver->update([
            'password' => Hash::make($validated['password']),
        ]);
        
        return redirect()->route('driver.profile.edit')
            ->with('success', 'Password updated successfully.');
    }
}
