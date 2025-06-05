<?php

namespace App\Http\Controllers;

use App\Models\EmergencyContact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EmergencyContactController extends Controller
{
    /**
     * Display a listing of the user's emergency contacts.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $emergencyContacts = $user->emergencyContacts()->get();
        
        return Inertia::render('Profile/EmergencyContacts', [
            'emergencyContacts' => $emergencyContacts,
            'success' => session('success'),
        ]);
    }
    
    /**
     * Store a newly created emergency contact.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);
        
        $user = Auth::user();
        
        // Create the emergency contact in the database
        $user->emergencyContacts()->create($validated);
        
        return redirect()->route('profile.emergency-contacts')->with('success', 'Emergency contact added successfully.');
    }
    
    /**
     * Remove the specified emergency contact.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        try {
            // Delete the emergency contact from the database
            $contact = Auth::user()->emergencyContacts()->findOrFail($id);
            $contact->delete();
            
            if (request()->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'Emergency contact removed successfully.']);
            }
            
            return redirect()->route('profile.emergency-contacts')->with('success', 'Emergency contact removed successfully.');
        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Failed to delete emergency contact.'], 500);
            }
            
            return redirect()->route('profile.emergency-contacts')->with('error', 'Failed to delete emergency contact.');
        }
    }
}
