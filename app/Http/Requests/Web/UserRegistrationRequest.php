<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public request, authorized for all users
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
            'phone' => ['required', 'string', 'max:20', 'unique:users'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'medical_conditions' => ['nullable', 'string', 'max:500'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'agree_terms' => ['required', 'accepted'],
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
            'name.required' => 'Please enter your full name.',
            'phone.required' => 'Please enter your phone number.',
            'phone.unique' => 'This phone number is already registered.',
            'address.required' => 'Please enter your address.',
            'city.required' => 'Please enter your city.',
            'password.required' => 'Please create a password.',
            'password.confirmed' => 'The password confirmation does not match.',
            'agree_terms.required' => 'You must agree to the terms and conditions.',
            'agree_terms.accepted' => 'You must agree to the terms and conditions.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert checkbox value to boolean
        if ($this->has('agree_terms')) {
            $this->merge([
                'agree_terms' => filter_var($this->agree_terms, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}
