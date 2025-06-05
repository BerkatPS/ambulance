<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class RatingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if the booking belongs to the authenticated user
        if (auth()->check() && $this->route('booking')) {
            $booking = $this->route('booking');
            
            // Only allow rating if the booking is completed and belongs to the user
            return $booking->user_id === auth()->id() && $booking->status === 'completed';
        }
        
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booking_id' => ['required', 'exists:bookings,id'],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
            'driver_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'ambulance_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'service_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comments' => ['nullable', 'string', 'max:500'],
            'anonymous' => ['nullable', 'boolean'],
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
            'booking_id.required' => 'Booking information is required.',
            'booking_id.exists' => 'The selected booking does not exist.',
            'stars.required' => 'Please provide an overall rating.',
            'stars.min' => 'The rating must be at least 1 star.',
            'stars.max' => 'The rating cannot be more than 5 stars.',
            'driver_rating.required' => 'Please rate the driver.',
            'ambulance_rating.required' => 'Please rate the ambulance.',
            'service_rating.required' => 'Please rate the service.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert checkbox value to boolean
        if ($this->has('anonymous')) {
            $this->merge([
                'anonymous' => filter_var($this->anonymous, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}
