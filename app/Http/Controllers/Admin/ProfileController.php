<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the admin's profile.
     *
     * @return \Inertia\Response
     */
    public function show()
    {
        $admin = Auth::guard('admin')->user();
        
        return Inertia::render('Admin/Profile/Show', [
            'admin' => $admin,
        ]);
    }

    /**
     * Update the admin's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins,email,' . $admin->id,
            'phone' => 'nullable|string|max:20',
            'current_password' => 'nullable|required_with:password',
            'password' => 'nullable|string|min:8|confirmed',
        ]);
        
        // Check current password if attempting to change password
        if (isset($validated['current_password'])) {
            if (!Hash::check($validated['current_password'], $admin->password)) {
                return back()->withErrors([
                    'current_password' => 'The provided password does not match your current password.',
                ]);
            }
        }
        
        // Update admin data
        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? $admin->phone,
        ];
        
        // Update password if provided
        if (isset($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }
        
        $admin->update($updateData);
        
        return redirect()->route('admin.profile')->with('success', 'Profile updated successfully.');
    }

    /**
     * Display the admin's settings.
     *
     * @return \Inertia\Response
     */
    public function showSettings()
    {
        $admin = Auth::guard('admin')->user();
        
        return Inertia::render('Admin/Settings/Show', [
            'admin' => $admin,
            'settings' => [
                'notifications_enabled' => $admin->notifications_enabled ?? true,
                'theme' => $admin->theme ?? 'light',
                'language' => $admin->language ?? 'en',
            ],
        ]);
    }

    /**
     * Update the admin's settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateSettings(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $validated = $request->validate([
            'notifications_enabled' => 'boolean',
            'theme' => 'string|in:light,dark',
            'language' => 'string|in:en,id',
        ]);
        
        $admin->update([
            'notifications_enabled' => $validated['notifications_enabled'],
            'theme' => $validated['theme'],
            'language' => $validated['language'],
        ]);
        
        return redirect()->route('admin.settings')->with('success', 'Settings updated successfully.');
    }
}
