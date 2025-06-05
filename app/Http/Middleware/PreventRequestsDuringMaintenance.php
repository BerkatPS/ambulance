<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    /**
     * The URIs that should be reachable while maintenance mode is enabled.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Critical emergency booking endpoints should remain accessible
        'emergency-booking*',
        'api/emergency-booking*',
        // Admin access during maintenance
        'admin/login',
        'admin/dashboard',
    ];
}
