<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Requests from the following domains / hosts will receive stateful API
    | authentication cookies. Typically, these should include your local
    | and production domains which access your API via a frontend SPA.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate a request. If none of these guards
    | are able to authenticate the request, Sanctum will use the bearer
    | token that's present on an incoming request for authentication.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. If this value is null, personal access tokens do
    | not expire. This won't tweak the lifetime of first-party sessions.
    |
    */

    'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 60 * 24 * 7), // 1 week by default

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix personal access tokens with a string. This is useful
    | when multiple Sanctum configurations exist within a single database
    | when using multiple Sanctum apps. This way the tokens don't clash.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | When authenticating your first-party SPA with Sanctum you may need to
    | customize some of the middleware Sanctum uses while processing the
    | request. You may change the middleware listed below as required.
    |
    */

    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Token Models
    |--------------------------------------------------------------------------
    |
    | Here you can specify custom token models for different user types.
    | This allows for separate token management for different user types.
    |
    */

    'models' => [
        'personal_access_token' => Laravel\Sanctum\PersonalAccessToken::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting for API routes protected by Sanctum.
    | These settings help prevent abuse of your API.
    |
    */

    'rate_limiting' => [
        'enabled' => env('SANCTUM_RATE_LIMITING_ENABLED', true),
        'max_attempts' => env('SANCTUM_RATE_LIMITING_MAX_ATTEMPTS', 60),
        'decay_minutes' => env('SANCTUM_RATE_LIMITING_DECAY_MINUTES', 1),
    ],

    /*
    |--------------------------------------------------------------------------
    | Token Abilities
    |--------------------------------------------------------------------------
    |
    | Define default token abilities that can be assigned to tokens.
    | These are used to limit what actions a token can perform.
    |
    */

    'abilities' => [
        'user' => [
            'profile:read',
            'profile:update',
            'bookings:create',
            'bookings:read',
            'bookings:update',
            'bookings:cancel',
            'payments:create',
            'payments:read',
        ],
        'driver' => [
            'profile:read',
            'profile:update',
            'bookings:read',
            'bookings:update',
            'location:update',
        ],
        'admin' => [
            '*', // Full access
        ],
    ],

];
