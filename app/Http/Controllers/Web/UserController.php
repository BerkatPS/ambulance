<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display the user's profile.
     *
     * @return \Inertia\Response
     */
    public function profile()
    {
        return Inertia::render('Profile/Edit', [
            'user' => Auth::user()
        ]);
    }

    /**
     * Update the user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
        ]);
        
        $user->name = $validated['name'];
        $user->phone = $validated['phone'];
        $user->address = $validated['address'];
        $user->city = $validated['city'];
        $user->save();
        
        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Show the form for uploading medical documents.
     *
     * @return \Inertia\Response
     */
    public function documents()
    {
        $user = Auth::user();
        
        return Inertia::render('Profile/Documents', [
            'user' => $user,
            'documents' => $user->documents
        ]);
    }

    /**
     * Upload a medical document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function uploadDocument(Request $request)
    {
        $validated = $request->validate([
            'document_type' => 'required|string|in:medical_record,insurance,id_card,other',
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'notes' => 'nullable|string',
        ]);
        
        $user = Auth::user();
        
        $path = $request->file('document')->store('user_documents/' . $user->id, 'public');
        
        $user->documents()->create([
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'notes' => $validated['notes'],
        ]);
        
        return redirect()->back()->with('success', 'Document uploaded successfully.');
    }

    /**
     * Display the family members list.
     *
     * @return \Inertia\Response
     */
    public function familyMembers()
    {
        $user = Auth::user();
        
        return Inertia::render('Profile/FamilyMembers', [
            'user' => $user,
            'familyMembers' => $user->familyMembers
        ]);
    }

    /**
     * Add a family member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addFamilyMember(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:50',
            'age' => 'nullable|integer|min:0|max:150',
            'medical_notes' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
        ]);
        
        $user = Auth::user();
        
        $user->familyMembers()->create($validated);
        
        return redirect()->back()->with('success', 'Family member added successfully.');
    }
}
