<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
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
            'status' => ['required', 'string', 'in:pending,confirmed,dispatched,in_progress,completed,cancelled,payment_failed'],
            'ambulance_id' => ['nullable', 'exists:ambulances,id'],
            'pickup_date' => ['nullable', 'date'],
            'pickup_time' => ['nullable', 'date_format:H:i'],
            'admin_notes' => ['nullable', 'string', 'max:500'],
            'estimated_arrival_time' => ['nullable', 'date'],
            'completion_time' => ['nullable', 'date'],
            'cancellation_reason' => ['nullable', 'required_if:status,cancelled', 'string', 'max:500'],
            'distance_traveled' => ['nullable', 'numeric', 'min:0'],
            'adjusted_price' => ['nullable', 'numeric', 'min:0'],
            'send_notification' => ['nullable', 'boolean'],
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
            'status.required' => 'Please select a status for the booking.',
            'status.in' => 'The selected status is invalid.',
            'ambulance_id.exists' => 'The selected ambulance does not exist.',
            'cancellation_reason.required_if' => 'Please provide a reason for cancellation.',
            'adjusted_price.min' => 'The adjusted price cannot be negative.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert checkbox value to boolean
        if ($this->has('send_notification')) {
            $this->merge([
                'send_notification' => filter_var($this->send_notification, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
        
        // Combine date and time fields if both are present
        if ($this->filled('pickup_date') && $this->filled('pickup_time')) {
            $pickupDateTime = $this->pickup_date . ' ' . $this->pickup_time;
            $this->merge([
                'pickup_datetime' => $pickupDateTime,
            ]);
        }
    }
}
