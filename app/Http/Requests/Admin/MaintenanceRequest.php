<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MaintenanceRequest extends FormRequest
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
        $rules = [
            'ambulance_id' => ['required', 'exists:ambulances,id'],
            'maintenance_type' => ['required', 'string', 'in:routine,repair,inspection,equipment'],
            'description' => ['required', 'string', 'max:500'],
            'scheduled_date' => ['required', 'date'],
            'estimated_completion_date' => ['required', 'date', 'after_or_equal:scheduled_date'],
            'estimated_cost' => ['nullable', 'numeric', 'min:0'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
        
        // If updating an existing record, add validation for status and actual cost
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $additionalRules = [
                'status' => ['required', 'string', 'in:scheduled,in_progress,completed,cancelled'],
                'actual_cost' => ['nullable', 'numeric', 'min:0'],
                'completion_date' => ['nullable', 'date', 'after_or_equal:scheduled_date'],
                'completion_notes' => ['nullable', 'string', 'max:500'],
            ];
            
            $rules = array_merge($rules, $additionalRules);
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
            'ambulance_id.required' => 'Please select an ambulance.',
            'ambulance_id.exists' => 'The selected ambulance does not exist.',
            'maintenance_type.required' => 'Please select a maintenance type.',
            'maintenance_type.in' => 'The selected maintenance type is invalid.',
            'description.required' => 'Please provide a description of the maintenance.',
            'scheduled_date.required' => 'Please specify when the maintenance is scheduled.',
            'estimated_completion_date.required' => 'Please provide an estimated completion date.',
            'estimated_completion_date.after_or_equal' => 'The completion date must be on or after the scheduled date.',
            'estimated_cost.min' => 'The estimated cost cannot be negative.',
            'actual_cost.min' => 'The actual cost cannot be negative.',
        ];
    }
}
