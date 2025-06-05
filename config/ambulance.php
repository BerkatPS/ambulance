<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ambulance System Settings
    |--------------------------------------------------------------------------
    |
    | General settings for the ambulance booking system.
    |
    */

    'system' => [
        'name' => env('APP_NAME', 'Ambulance Booking System'),
        'logo' => env('APP_LOGO', 'images/logo.png'),
        'timezone' => env('APP_TIMEZONE', 'Asia/Jakarta'),
        'currency' => env('APP_CURRENCY', 'IDR'),
        'language' => env('APP_LOCALE', 'id'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Booking Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for ambulance bookings.
    |
    */

    'booking' => [
        'allow_instant_booking' => env('ALLOW_INSTANT_BOOKING', true),
        'allow_scheduled_booking' => env('ALLOW_SCHEDULED_BOOKING', true),
        'advance_booking_days' => env('ADVANCE_BOOKING_DAYS', 7),
        'minimum_booking_notice_minutes' => env('MIN_BOOKING_NOTICE', 15),
        'auto_assign_driver' => env('AUTO_ASSIGN_DRIVER', true),
        'max_distance_for_driver_km' => env('MAX_DRIVER_DISTANCE', 5),
        'auto_cancel_after_minutes' => env('AUTO_CANCEL_AFTER', 15),
        'status_options' => [
            'pending' => 'Pending',
            'assigned' => 'Driver Assigned',
            'accepted' => 'Driver Accepted',
            'on_the_way' => 'Driver On The Way',
            'arrived' => 'Driver Arrived',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'rejected' => 'Rejected',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Driver Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for ambulance drivers.
    |
    */

    'driver' => [
        'auto_approve_drivers' => env('AUTO_APPROVE_DRIVERS', false),
        'location_update_frequency_seconds' => env('DRIVER_LOCATION_UPDATE_FREQUENCY', 30),
        'idle_timeout_minutes' => env('DRIVER_IDLE_TIMEOUT', 30),
        'required_documents' => [
            'driver_license',
            'medical_certificate',
            'vehicle_license',
            'insurance',
            'profile_photo',
        ],
        'status_options' => [
            'active' => 'Active',
            'on_duty' => 'On Duty',
            'off_duty' => 'Off Duty',
            'on_break' => 'On Break',
            'inactive' => 'Inactive',
            'suspended' => 'Suspended',
            'blocked' => 'Blocked',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Ambulance Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for ambulance vehicles.
    |
    */

    'ambulance' => [
        'types' => [
            'basic' => [
                'name' => 'Basic Ambulance',
                'description' => 'Standard ambulance for non-emergency transport',
                'base_price' => 150000,
                'price_per_km' => 5000,
            ],
            'advanced' => [
                'name' => 'Advanced Ambulance',
                'description' => 'Advanced life support ambulance with medical equipment',
                'base_price' => 300000,
                'price_per_km' => 8000,
            ],
            'icu' => [
                'name' => 'ICU Ambulance',
                'description' => 'Fully equipped ICU ambulance for critical patients',
                'base_price' => 500000,
                'price_per_km' => 10000,
            ],
        ],
        'status_options' => [
            'available' => 'Available',
            'in_use' => 'In Use',
            'maintenance' => 'Under Maintenance',
            'out_of_service' => 'Out of Service',
        ],
        'maintenance_interval_days' => env('AMBULANCE_MAINTENANCE_INTERVAL', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for payment processing.
    |
    */

    'payment' => [
        'default_gateway' => env('DEFAULT_PAYMENT_GATEWAY', 'duitku'),
        'payment_due_hours' => env('PAYMENT_DUE_HOURS', 24),
        'auto_cancel_unpaid_hours' => env('AUTO_CANCEL_UNPAID_HOURS', 48),
        'status_options' => [
            'pending' => 'Pending',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'refunded' => 'Refunded',
            'cancelled' => 'Cancelled',
        ],
        'available_methods' => [
            'bank_transfer' => 'Bank Transfer',
            'credit_card' => 'Credit Card',
            'e_wallet' => 'E-Wallet',
            'retail' => 'Retail Outlet',
            'qris' => 'QRIS',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for system notifications.
    |
    */

    'notifications' => [
        'channels' => [
            'mail' => env('ENABLE_EMAIL_NOTIFICATIONS', true),
            'sms' => env('ENABLE_SMS_NOTIFICATIONS', true),
            'push' => env('ENABLE_PUSH_NOTIFICATIONS', true),
            'database' => env('ENABLE_DATABASE_NOTIFICATIONS', true),
        ],
        'templates' => [
            'booking_created' => [
                'subject' => 'New Ambulance Booking #{booking_id}',
                'channels' => ['mail', 'sms', 'push'],
            ],
            'driver_assigned' => [
                'subject' => 'Driver Assigned to Your Booking #{booking_id}',
                'channels' => ['mail', 'sms', 'push'],
            ],
            'driver_on_the_way' => [
                'subject' => 'Driver is On The Way - Booking #{booking_id}',
                'channels' => ['sms', 'push'],
            ],
            'driver_arrived' => [
                'subject' => 'Driver Has Arrived - Booking #{booking_id}',
                'channels' => ['sms', 'push'],
            ],
            'booking_completed' => [
                'subject' => 'Booking #{booking_id} Completed',
                'channels' => ['mail', 'sms', 'push'],
            ],
            'payment_reminder' => [
                'subject' => 'Payment Reminder for Booking #{booking_id}',
                'channels' => ['mail', 'sms'],
            ],
            'payment_received' => [
                'subject' => 'Payment Received for Booking #{booking_id}',
                'channels' => ['mail', 'sms', 'push'],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Admin Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for admin panel and permissions.
    |
    */

    'admin' => [
        'roles' => [
            'super_admin' => 'Super Administrator',
            'admin' => 'Administrator',
            'manager' => 'Manager',
            'dispatcher' => 'Dispatcher',
            'support' => 'Customer Support',
            'finance' => 'Finance Officer',
        ],
        'permissions' => [
            'manage_users' => 'Manage Users',
            'manage_drivers' => 'Manage Drivers',
            'manage_ambulances' => 'Manage Ambulances',
            'manage_bookings' => 'Manage Bookings',
            'manage_payments' => 'Manage Payments',
            'view_reports' => 'View Reports',
            'system_settings' => 'System Settings',
        ],
        'default_pagination' => env('ADMIN_DEFAULT_PAGINATION', 15),
    ],

    /*
    |--------------------------------------------------------------------------
    | API Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for API access and integration.
    |
    */

    'api' => [
        'throttle' => [
            'rate_limit' => env('API_RATE_LIMIT', 60),
            'rate_limit_period' => env('API_RATE_LIMIT_PERIOD', 1), // in minutes
        ],
        'token_expiration_days' => env('API_TOKEN_EXPIRATION_DAYS', 30),
        'require_api_key' => env('REQUIRE_API_KEY', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Map and Location Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for maps and location services.
    |
    */

    'maps' => [
        'default_latitude' => env('DEFAULT_LATITUDE', '-6.2088'),
        'default_longitude' => env('DEFAULT_LONGITUDE', '106.8456'),
        'default_zoom' => env('DEFAULT_ZOOM', 12),
        'distance_calculation' => env('DISTANCE_CALCULATION', 'google_maps'), // google_maps, haversine
        'refresh_interval_seconds' => env('MAP_REFRESH_INTERVAL', 15),
    ],

    /*
    |--------------------------------------------------------------------------
    | Audit and Logging
    |--------------------------------------------------------------------------
    |
    | Configuration for system auditing and logging.
    |
    */

    'audit' => [
        'enabled' => env('ENABLE_AUDIT_LOGGING', true),
        'log_authentication' => env('LOG_AUTHENTICATION', true),
        'log_model_changes' => env('LOG_MODEL_CHANGES', true),
        'purge_logs_after_days' => env('PURGE_LOGS_AFTER_DAYS', 90),
    ],
    
];
