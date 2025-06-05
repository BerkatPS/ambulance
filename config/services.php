<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | API Authentication Services
    |--------------------------------------------------------------------------
    |
    | This section defines API tokens for third-party services integrating
    | with the ambulance booking system.
    |
    */
    'api' => [
        'tokens' => [
            env('HOSPITAL_API_TOKEN'),
            env('PARTNER_API_TOKEN'),
            env('EMERGENCY_SERVICE_API_TOKEN'),
            env('PAYMENT_GATEWAY_WEBHOOK_TOKEN'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | SMS Gateway Services
    |--------------------------------------------------------------------------
    |
    | SMS gateway configurations for sending notifications.
    |
    */
    'sms' => [
        'provider' => env('SMS_PROVIDER', 'twilio'),
        'twilio' => [
            'sid' => env('TWILIO_SID'),
            'token' => env('TWILIO_TOKEN'),
            'from' => env('TWILIO_FROM'),
        ],
        'nexmo' => [
            'key' => env('NEXMO_KEY'),
            'secret' => env('NEXMO_SECRET'),
            'from' => env('NEXMO_FROM'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Map Services
    |--------------------------------------------------------------------------
    |
    | Configurations for map and location services used in the application.
    |
    */
    'maps' => [
        'provider' => env('MAP_PROVIDER', 'google'),
        'google' => [
            'api_key' => env('GOOGLE_MAPS_API_KEY'),
        ],
        'mapbox' => [
            'api_key' => env('MAPBOX_API_KEY'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Duitku Payment Gateway
    |--------------------------------------------------------------------------
    |
    | Konfigurasi untuk integrasi dengan payment gateway Duitku.
    |
    */
    'duitku' => [
        'base_url' => env('DUITKU_BASE_URL', 'https://sandbox.duitku.com/webapi'),
        'merchant_code' => env('DUITKU_MERCHANT_CODE', 'DS23272'),
        'api_key' => env('DUITKU_API_KEY', '50bdb112c6321e8969a78b8c458ddf7e'),
    ],

];
