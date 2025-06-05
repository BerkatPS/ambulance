<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AssignAmbulanceRequest extends FormRequest
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
            'driver_id' => ['required', 'exists:drivers,id'],
            'ambulance_id' => ['required', 'exists:ambulances,id'],
            'assignment_notes' => ['nullable', 'string', 'max:500'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_permanent' => ['nullable', 'boolean'],
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
            'driver_id.required' => 'Please select a driver.',
            'driver_id.exists' => 'The selected driver does not exist.',
            'ambulance_id.required' => 'Please select an ambulance.',
            'ambulance_id.exists' => 'The selected ambulance does not exist.',
            'start_date.required' => 'Please specify when this assignment starts.',
            'end_date.after_or_equal' => 'The end date must be on or after the start date.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert checkbox value to boolean
        if ($this->has('is_permanent')) {
            $this->merge([
                'is_permanent' => filter_var($this->is_permanent, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}
