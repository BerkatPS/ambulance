<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;
use App\Exceptions\PaymentException;

class PaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if the booking belongs to the authenticated user
        if (auth()->check() && $this->route('booking')) {
            $booking = $this->route('booking');
            return $booking->user_id === auth()->id();
        }
        
        return true; // Guest users can make payments with proper booking info
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'booking_id' => ['required', 'exists:bookings,id'],
            'payment_method' => ['required', 'string', 'in:cash,credit_card,virtual_account,e_wallet'],
            'amount' => ['required', 'numeric', 'min:1'],
        ];
        
        // Add specific rules based on payment method
        switch ($this->input('payment_method')) {
            case 'credit_card':
                $rules = array_merge($rules, [
                    'card_number' => ['required', 'string', 'min:13', 'max:19'],
                    'card_holder_name' => ['required', 'string', 'max:255'],
                    'expiry_month' => ['required', 'numeric', 'min:1', 'max:12'],
                    'expiry_year' => ['required', 'numeric', 'min:' . date('Y'), 'max:' . (date('Y') + 20)],
                    'cvv' => ['required', 'numeric', 'digits_between:3,4'],
                ]);
                break;
                
            case 'virtual_account':
                $rules = array_merge($rules, [
                    'bank_code' => ['required', 'string', 'max:10'],
                ]);
                break;
                
            case 'e_wallet':
                $rules = array_merge($rules, [
                    'wallet_provider' => ['required', 'string', 'in:gopay,ovo,dana,linkaja,shopeepay'],
                    'phone_number' => ['required', 'string', 'max:15'],
                ]);
                break;
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
            'booking_id.required' => 'Booking information is required.',
            'booking_id.exists' => 'The selected booking does not exist.',
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'The selected payment method is invalid.',
            'amount.required' => 'Payment amount is required.',
            'amount.min' => 'Payment amount must be greater than zero.',
            'card_number.required' => 'Please enter your card number.',
            'card_holder_name.required' => 'Please enter the card holder name.',
            'expiry_month.required' => 'Please enter the card expiry month.',
            'expiry_year.required' => 'Please enter the card expiry year.',
            'cvv.required' => 'Please enter the CVV code.',
            'bank_code.required' => 'Please select a bank.',
            'wallet_provider.required' => 'Please select an e-wallet provider.',
            'wallet_provider.in' => 'The selected e-wallet provider is invalid.',
            'phone_number.required' => 'Please enter your phone number.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \App\Exceptions\PaymentException
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $bookingId = $this->input('booking_id');
        
        throw PaymentException::validationError(
            $validator->errors()->first(),
            $bookingId ? (int) $bookingId : null
        );
    }
}
