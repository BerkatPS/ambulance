<?php

use App\Http\Controllers\Webhooks\PaymentWebhookController;
use App\Http\Controllers\Webhooks\DriverLocationWebhookController;
use App\Http\Controllers\Webhooks\NotificationWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Webhook Routes
|--------------------------------------------------------------------------
|
| Here is where you can register webhook routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group with "webhook" prefix.
|
*/

// Payment Gateway Webhooks
Route::post('/payment/midtrans', [PaymentWebhookController::class, 'midtrans'])
    ->name('webhook.payment.midtrans');

Route::post('/payment/xendit', [PaymentWebhookController::class, 'xendit'])
    ->name('webhook.payment.xendit');

Route::post('/payment/gopay', [PaymentWebhookController::class, 'gopay'])
    ->name('webhook.payment.gopay');

// Driver Location Updates
Route::post('/driver/location', [DriverLocationWebhookController::class, 'update'])
    ->middleware('api.key')
    ->name('webhook.driver.location');

// Notification Webhooks
Route::post('/notification/push', [NotificationWebhookController::class, 'push'])
    ->middleware('api.key')
    ->name('webhook.notification.push');

// Health check endpoint for monitoring services
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]);
})->name('webhook.health');
