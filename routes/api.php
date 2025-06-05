<?php
//
//use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Route;
//
///*
//|--------------------------------------------------------------------------
//| API Routes
//|--------------------------------------------------------------------------
//|
//| Here is where you can register API routes for your application. These
//| routes are loaded by the RouteServiceProvider and all of them will
//| be assigned to the "api" middleware group. Make something great!
//|
//*/
//
//// Authentication API Routes
//Route::post('/auth/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
//Route::post('/auth/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
//
//// Public Emergency Booking API Routes
//Route::post('/emergency-booking', [App\Http\Controllers\Api\EmergencyBookingController::class, 'store']);
//Route::get('/emergency-booking/{bookingCode}', [App\Http\Controllers\Api\EmergencyBookingController::class, 'show']);
//
//// API Routes protected by Sanctum
//Route::middleware('auth:sanctum')->group(function () {
//    // User Profile
//    Route::get('/user', function (Request $request) {
//        return $request->user();
//    });
//
//    // Bookings API
//    Route::apiResource('/bookings', App\Http\Controllers\Api\BookingController::class);
//    Route::post('/bookings/{booking}/cancel', [App\Http\Controllers\Api\BookingController::class, 'cancel']);
//    Route::post('/bookings/{booking}/rate', [App\Http\Controllers\Api\BookingController::class, 'rate']);
//    Route::get('/bookings/{booking}/track', [App\Http\Controllers\Api\BookingController::class, 'track']);
//
//    // Payments API
//    Route::get('/payments', [App\Http\Controllers\Api\PaymentController::class, 'index']);
//    Route::get('/payments/{payment}', [App\Http\Controllers\Api\PaymentController::class, 'show']);
//    Route::post('/payments/process', [App\Http\Controllers\Api\PaymentController::class, 'process']);
//
//    // User Profile API
//    Route::get('/profile', [App\Http\Controllers\Api\ProfileController::class, 'show']);
//    Route::put('/profile', [App\Http\Controllers\Api\ProfileController::class, 'update']);
//    Route::put('/profile/change-password', [App\Http\Controllers\Api\ProfileController::class, 'changePassword']);
//});
//
//// Driver API Routes protected by Sanctum and Driver Middleware
//Route::middleware(['auth:sanctum', 'driver'])->prefix('driver')->group(function () {
//    // Driver Profile
//    Route::get('/profile', [App\Http\Controllers\Api\Driver\ProfileController::class, 'show']);
//    Route::put('/profile', [App\Http\Controllers\Api\Driver\ProfileController::class, 'update']);
//
//    // Driver Bookings
//    Route::get('/bookings', [App\Http\Controllers\Api\Driver\BookingController::class, 'index']);
//    Route::get('/bookings/active', [App\Http\Controllers\Api\Driver\BookingController::class, 'active']);
//    Route::get('/bookings/{booking}', [App\Http\Controllers\Api\Driver\BookingController::class, 'show']);
//    Route::post('/bookings/{booking}/accept', [App\Http\Controllers\Api\Driver\BookingController::class, 'accept']);
//    Route::post('/bookings/{booking}/pickup', [App\Http\Controllers\Api\Driver\BookingController::class, 'pickup']);
//    Route::post('/bookings/{booking}/complete', [App\Http\Controllers\Api\Driver\BookingController::class, 'complete']);
//    Route::post('/bookings/{booking}/cancel', [App\Http\Controllers\Api\Driver\BookingController::class, 'cancel']);
//
//    // Location Updates
//    Route::post('/location/update', [App\Http\Controllers\Api\Driver\LocationController::class, 'update'])
//        ->middleware('track.location');
//
//    // Ambulance Management
//    Route::get('/ambulance', [App\Http\Controllers\Api\Driver\AmbulanceController::class, 'show']);
//    Route::post('/ambulance/report-issue', [App\Http\Controllers\Api\Driver\AmbulanceController::class, 'reportIssue']);
//});
//
//// External Services API Routes (protected by API Authentication)
//Route::middleware('api.auth')->prefix('services')->group(function () {
//    // Webhooks for payment providers
//    Route::post('/payment/webhook', [App\Http\Controllers\Api\Services\PaymentWebhookController::class, 'handle']);
//
//    // Hospital Integration APIs
//    Route::post('/hospital/patient-transfer', [App\Http\Controllers\Api\Services\HospitalController::class, 'patientTransfer']);
//    Route::get('/hospital/ambulance-availability', [App\Http\Controllers\Api\Services\HospitalController::class, 'ambulanceAvailability']);
//
//    // Partner Integration APIs
//    Route::get('/partners/ambulance-status', [App\Http\Controllers\Api\Services\PartnerController::class, 'ambulanceStatus']);
//});
