<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
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
        $rules = [
            'type' => ['required', 'string', 'in:emergency,scheduled'],
            'patient_name' => ['required', 'string', 'max:255'],
            'patient_age' => ['required', 'integer', 'min:0', 'max:120'],
            'patient_gender' => ['required', 'string', 'in:male,female,other'],
            'patient_condition' => ['required', 'string', 'max:500'],
            'pickup_address' => ['required', 'string', 'max:500'],
            'pickup_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'pickup_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'destination_address' => ['required', 'string', 'max:500'],
            'destination_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'destination_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'contact_relationship' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'ambulance_type' => ['nullable', 'string', 'in:basic,advanced,neonatal,patient_transport'],
        ];
        
        // Add additional rules for scheduled bookings
        if ($this->input('type') === 'scheduled') {
            $rules = array_merge($rules, [
                'pickup_date' => ['required', 'date', 'after_or_equal:today'],
                'pickup_time' => ['required', 'date_format:H:i'],
            ]);
        }
        
        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Please select a booking type.',
            'type.in' => 'Booking type must be either emergency or scheduled.',
            'patient_name.required' => 'Please enter the patient\'s name.',
            'patient_age.required' => 'Please enter the patient\'s age.',
            'patient_gender.required' => 'Please select the patient\'s gender.',
            'patient_condition.required' => 'Please describe the patient\'s condition.',
            'pickup_address.required' => 'Please enter the pickup address.',
            'destination_address.required' => 'Please enter the destination address.',
            'contact_name.required' => 'Please enter a contact name.',
            'contact_phone.required' => 'Please enter a contact phone number.',
            'pickup_date.required' => 'Please select a pickup date.',
            'pickup_date.after_or_equal' => 'The pickup date must be today or a future date.',
            'pickup_time.required' => 'Please select a pickup time.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Combine date and time fields for scheduled bookings
        if ($this->filled('pickup_date') && $this->filled('pickup_time')) {
            $pickupDateTime = $this->pickup_date . ' ' . $this->pickup_time;
            $this->merge([
                'pickup_datetime' => $pickupDateTime,
            ]);
        }
    }
}
