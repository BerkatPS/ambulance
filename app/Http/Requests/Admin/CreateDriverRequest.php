<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateDriverRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->guard('admin')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'unique:drivers'],
            'email' => ['required', 'email', 'max:255', 'unique:drivers'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'license_number' => ['required', 'string', 'max:50', 'unique:drivers'],
            'license_expiry' => ['required', 'date', 'after:today'],
            'date_of_birth' => ['required', 'date', 'before:18 years ago'],
            'years_of_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'emergency_contact_name' => ['required', 'string', 'max:255'],
            'emergency_contact_phone' => ['required', 'string', 'max:20'],
            'status' => ['required', 'string', 'in:active,inactive,on_leave'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'license_document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter the driver\'s full name.',
            'phone.required' => 'Please enter the driver\'s phone number.',
            'phone.unique' => 'This phone number is already registered with another driver.',
            'email.required' => 'Please enter the driver\'s email address.',
            'email.unique' => 'This email address is already registered with another driver.',
            'license_number.required' => 'Please enter the driver\'s license number.',
            'license_number.unique' => 'This license number is already registered with another driver.',
            'license_expiry.required' => 'Please enter the driver\'s license expiry date.',
            'license_expiry.after' => 'The license expiry date must be in the future.',
            'date_of_birth.required' => 'Please enter the driver\'s date of birth.',
            'date_of_birth.before' => 'The driver must be at least 18 years old.',
            'emergency_contact_name.required' => 'Please enter an emergency contact name.',
            'emergency_contact_phone.required' => 'Please enter an emergency contact phone number.',
        ];
    }
}
