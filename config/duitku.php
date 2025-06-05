<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Duitku Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration needed for the Duitku payment gateway
    | integration. These values should be set in your .env file for security.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | API Environment
    |--------------------------------------------------------------------------
    |
    | Set the environment for the Duitku API.
    | Options: 'sandbox', 'production'
    |
    */
    'environment' => env('DUITKU_ENVIRONMENT', 'sandbox'),

    /*
    |--------------------------------------------------------------------------
    | API URLs
    |--------------------------------------------------------------------------
    |
    | Define the API base URLs for sandbox and production environments.
    |
    */
    'sandbox_base_url' => env('DUITKU_SANDBOX_URL', 'https://sandbox.duitku.com/webapi/api/'),
    'production_base_url' => env('DUITKU_PRODUCTION_URL', 'https://passport.duitku.com/webapi/api/'),

    /*
    |--------------------------------------------------------------------------
    | Merchant Code & API Key
    |--------------------------------------------------------------------------
    |
    | Your Duitku merchant code and API key.
    |
    */
    'merchant_code' => env('DUITKU_MERCHANT_CODE', ''),
    'api_key' => env('DUITKU_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Callback URL
    |--------------------------------------------------------------------------
    |
    | The URL that Duitku will call to update the transaction status.
    |
    */
    'callback_url' => env('DUITKU_CALLBACK_URL', url('/api/services/payment/webhook')),

    /*
    |--------------------------------------------------------------------------
    | Return URL
    |--------------------------------------------------------------------------
    |
    | The URL that users will be redirected to after payment.
    |
    */
    'return_url' => env('DUITKU_RETURN_URL', url('/payment/complete')),

    /*
    |--------------------------------------------------------------------------
    | Expiry Period
    |--------------------------------------------------------------------------
    |
    | Payment expiry period in minutes.
    |
    */
    'expiry_period' => env('DUITKU_EXPIRY_PERIOD', 60), // 1 hour

    /*
    |--------------------------------------------------------------------------
    | Payment Methods
    |--------------------------------------------------------------------------
    |
    | List of available payment methods with their codes.
    |
    */
    'payment_methods' => [
        'VA' => [
            'BCA' => 'BC',
            'Mandiri' => 'M2',
            'BNI' => 'I1',
            'BRI' => 'BR',
            'Permata' => 'BT',
            'CIMB' => 'B1',
        ],
        'RETAIL' => [
            'Alfamart' => 'A1',
            'Indomaret' => 'IR',
        ],
        'EWALLET' => [
            'OVO' => 'OV',
            'DANA' => 'DA',
            'LinkAja' => 'LA',
            'ShopeePay' => 'SA',
        ],
        'QRIS' => [
            'QRIS' => 'QR',
        ],
        'CREDIT_CARD' => [
            'Credit Card' => 'VC',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Currency
    |--------------------------------------------------------------------------
    |
    | The default currency to use for transactions.
    |
    */
    'currency' => env('DUITKU_CURRENCY', 'IDR'),

    /*
    |--------------------------------------------------------------------------
    | Transaction Fee Settings
    |--------------------------------------------------------------------------
    |
    | Define transaction fees for different payment methods.
    | Values can be either a percentage (e.g., 2.9%) or a fixed amount.
    |
    */
    'transaction_fees' => [
        'VA' => [
            'fee_type' => 'fixed', // 'percentage' or 'fixed'
            'fee_amount' => 4000,   // Amount in IDR or percentage value
        ],
        'RETAIL' => [
            'fee_type' => 'fixed',
            'fee_amount' => 5000,
        ],
        'EWALLET' => [
            'fee_type' => 'percentage',
            'fee_amount' => 2.0,    // 2% of transaction amount
        ],
        'QRIS' => [
            'fee_type' => 'percentage',
            'fee_amount' => 0.7,    // 0.7% of transaction amount
        ],
        'CREDIT_CARD' => [
            'fee_type' => 'percentage',
            'fee_amount' => 2.9,    // 2.9% of transaction amount
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Notification Settings
    |--------------------------------------------------------------------------
    |
    | Configure how payment notifications are sent.
    |
    */
    'notifications' => [
        'email' => [
            'enabled' => true,
            'recipients' => [
                'customer' => true,    // Send email to customer
                'admin' => true,       // Send email to admin
            ],
        ],
        'sms' => [
            'enabled' => true,
            'templates' => [
                'payment_created' => 'Your payment of {amount} for booking #{booking_number} has been created. Pay before {expiry_time}.',
                'payment_successful' => 'Your payment of {amount} for booking #{booking_number} is successful. Thank you!',
                'payment_failed' => 'Your payment for booking #{booking_number} has failed. Please try again.',
            ],
        ],
        'push' => [
            'enabled' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Signature Method
    |--------------------------------------------------------------------------
    |
    | The method used to generate the signature for API requests.
    |
    */
    'signature_method' => 'sha256',

    /*
    |--------------------------------------------------------------------------
    | Debug Mode
    |--------------------------------------------------------------------------
    |
    | Enable debug mode to log API requests and responses.
    |
    */
    'debug' => env('DUITKU_DEBUG', false),
];
