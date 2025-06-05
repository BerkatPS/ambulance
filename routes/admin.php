<?php

use App\Http\Controllers\Admin\AmbulanceController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\RatingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MaintenanceController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group with "admin" prefix.
|
*/

// Admin Authentication Routes
Route::middleware('guest:admin')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:admin')->name('logout');

// Admin Protected Routes
Route::middleware(['auth:admin'])->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Profile & Settings
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    // Maintenance Mode
    Route::get('/maintenance', [MaintenanceController::class, 'index'])->name('maintenance');
    Route::put('/maintenance', [MaintenanceController::class, 'update'])->name('maintenance.update');
    Route::get('/maintenance/{id}', [MaintenanceController::class, 'show'])->name('maintenance.show');

    // Ambulance Management
    Route::resource('ambulances', AmbulanceController::class)->except(['show'])->names([
        'index' => 'ambulances.index',
        'create' => 'ambulances.create',
        'store' => 'ambulances.store',
        'edit' => 'ambulances.edit',
        'update' => 'ambulances.update',
        'destroy' => 'ambulances.destroy',
    ]);

    // Driver Management
    Route::resource('drivers', DriverController::class)->names([
        'index' => 'drivers.index',
        'create' => 'drivers.create',
        'store' => 'drivers.store',
        'show' => 'drivers.show',
        'edit' => 'drivers.edit',
        'update' => 'drivers.update',
        'destroy' => 'drivers.destroy',
    ]);
    Route::put('drivers/{driver}/assign', [DriverController::class, 'assignAmbulance'])->name('drivers.assign');
    Route::post('drivers/assign-ambulance', [DriverController::class, 'assignAmbulanceToDriver'])->name('drivers.assign-ambulance');
    Route::put('drivers/{driver}/status', [DriverController::class, 'updateStatus'])->name('drivers.status');
    Route::put('drivers/{driver}/reset-password', [DriverController::class, 'resetPassword'])->name('drivers.reset-password');
    Route::get('drivers/{driver}/tracking', [DriverController::class, 'tracking'])->name('drivers.tracking');

    // User Management
    Route::resource('users', UserController::class)->names([
        'index' => 'users.index',
        'create' => 'users.create',
        'store' => 'users.store',
        'show' => 'users.show',
        'edit' => 'users.edit',
        'update' => 'users.update',
        'destroy' => 'users.destroy',
    ]);
    Route::put('users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
    Route::put('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');

    // Booking Management
    Route::resource('bookings', BookingController::class)->only(['index', 'show', 'update', 'destroy'])->names([
        'index' => 'bookings.index',
        'show' => 'bookings.show',
        'update' => 'bookings.update',
        'destroy' => 'bookings.destroy',
    ]);
    Route::get('bookings/emergency', [BookingController::class, 'emergency'])->name('bookings.emergency');
    Route::get('bookings/scheduled', [BookingController::class, 'scheduled'])->name('bookings.scheduled');
    Route::get('bookings/history', [BookingController::class, 'history'])->name('bookings.history');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::put('bookings/{booking}/assign', [BookingController::class, 'assignDriver'])->name('bookings.assign');
    Route::put('bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.update-status');
    Route::get('bookings/{booking}/invoice', [BookingController::class, 'invoice'])->name('bookings.invoice');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('admin.notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('admin.notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('admin.notifications.read.all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('admin.notifications.destroy');
    Route::post('/notifications/send', [NotificationController::class, 'send'])->name('admin.notifications.send');

    // Payment Management
    Route::resource('payments', PaymentController::class)->only(['index', 'show'])->names([
        'index' => 'payments.index',
        'show' => 'payments.show',
    ]);
    Route::put('payments/{payment}/status', [PaymentController::class, 'updateStatus'])->name('payments.update-status');
    Route::get('payments/{payment}/invoice', [PaymentController::class, 'invoice'])->name('payments.invoice');

    // Ratings Management
    Route::resource('ratings', RatingController::class)->except(['create', 'store'])->names([
        'index' => 'ratings.index',
        'show' => 'ratings.show',
        'edit' => 'ratings.edit',
        'update' => 'ratings.update',
        'destroy' => 'ratings.destroy',
    ]);
    Route::put('ratings/{rating}/visibility', [RatingController::class, 'toggleVisibility'])->name('ratings.visibility');
});
