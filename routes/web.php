<?php

use App\Http\Controllers\EmergencyBookingController;
use App\Http\Controllers\EmergencyContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\BookingController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\RatingController;
use App\Http\Controllers\User\ScheduledPaymentController;
use App\Http\Controllers\User\SupportController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Home page (Welcome screen)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::post('/emergency-booking', [EmergencyBookingController::class, 'store'])->name('emergency-booking.store');
Route::get('/emergency-booking/{bookingCode}', [EmergencyBookingController::class, 'show'])->name('emergency-booking.show');

// Admin Routes - Redirect to admin login if not authenticated
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin home redirect
    Route::get('/', function () {
        return redirect()->route('admin.login');
    });

    require __DIR__.'/admin.php';
});

// Driver Routes
Route::prefix('driver')->name('driver.')->group(function () {
    // Redirect to driver login if accessing driver root
    Route::get('/', function () {
        return redirect()->route('driver.login');
    });

    // Driver Authentication Routes
    Route::get('/login', [App\Http\Controllers\Driver\AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [App\Http\Controllers\Driver\AuthController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Driver\AuthController::class, 'logout'])->name('logout');

    // Driver Protected Routes
    Route::middleware(['auth:driver'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\Driver\DashboardController::class, 'index'])->name('dashboard');

        // Status Update
        Route::post('/update-status', [App\Http\Controllers\Driver\DashboardController::class, 'updateStatus'])->name('update-status');

        // Ambulance Assignment
        Route::post('/release-ambulance', [App\Http\Controllers\Driver\DashboardController::class, 'releaseAmbulance'])->name('release-ambulance');

        // Emergency Booking Auto-Assignment
        Route::post('/accept-emergency-booking', [App\Http\Controllers\Driver\DashboardController::class, 'acceptEmergencyBooking'])->name('accept-emergency-booking');

        // Profile
        Route::get('/profile', [App\Http\Controllers\Driver\ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [App\Http\Controllers\Driver\ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [App\Http\Controllers\Driver\ProfileController::class, 'updatePassword'])->name('profile.password.update');

        // Bookings
        Route::get('/bookings', [App\Http\Controllers\Driver\BookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/history', [App\Http\Controllers\Driver\BookingController::class, 'history'])->name('bookings.history');
        Route::get('/bookings/{id}', [App\Http\Controllers\Driver\BookingController::class, 'show'])->name('bookings.show');
        Route::post('/bookings/{id}/accept', [App\Http\Controllers\Driver\BookingController::class, 'accept'])->name('bookings.accept');
        Route::post('/bookings/accept-emergency', [App\Http\Controllers\Driver\BookingController::class, 'acceptEmergency'])->name('bookings.accept-emergency');
        Route::post('/bookings/{id}/start', [App\Http\Controllers\Driver\BookingController::class, 'start'])->name('bookings.start');
        Route::post('/bookings/{id}/arrive', [App\Http\Controllers\Driver\BookingController::class, 'arrive'])->name('bookings.arrive');
        Route::post('/bookings/{id}/depart', [App\Http\Controllers\Driver\BookingController::class, 'depart'])->name('bookings.depart');
        Route::post('/bookings/{id}/complete', [App\Http\Controllers\Driver\BookingController::class, 'complete'])->name('bookings.complete');
        Route::post('/bookings/{id}/cancel', [App\Http\Controllers\Driver\BookingController::class, 'cancel'])->name('bookings.cancel');

        // Location
        Route::post('/location/update', [App\Http\Controllers\Driver\LocationController::class, 'update'])->name('location.update');
        Route::post('/location/availability', [App\Http\Controllers\Driver\LocationController::class, 'updateAvailability'])->name('location.availability');

        // Notifications
        Route::get('/notifications', [App\Http\Controllers\Driver\NotificationsController::class, 'index'])->name('driver.notifications.index');
        Route::post('/notifications/{id}/read', [App\Http\Controllers\Driver\NotificationsController::class, 'markAsRead'])->name('driver.notifications.read');
        Route::post('/notifications/read-all', [App\Http\Controllers\Driver\NotificationsController::class, 'markAllAsRead'])->name('driver.notifications.read.all');
        Route::delete('/notifications/{id}', [App\Http\Controllers\Driver\NotificationsController::class, 'destroy'])->name('driver.notifications.destroy');

        // Ratings
        Route::get('/ratings', [App\Http\Controllers\Driver\RatingController::class, 'index'])->name('ratings.index');
    });
});

// User Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // User Dashboard
    Route::get('/user/dashboard', [DashboardController::class, 'index'])->name('user.dashboard');

    // Redirect to the appropriate dashboard based on user role
    Route::get('/dashboard', function () {
        // Check user role and redirect accordingly
        if (Auth::check()) {
            $user = Auth::user();

            // Check if user is an admin
            if ($user->is_admin) {
                return redirect()->route('admin.dashboard');
            }

            // Regular user
            return redirect()->route('user.dashboard');
        }

        // If auth guard is driver
        if (Auth::guard('driver')->check()) {
            return redirect()->route('driver.dashboard');
        }

        return redirect()->route('user.dashboard');
    })->name('dashboard');

    // User Bookings
    Route::get('/user/bookings', [BookingController::class, 'index'])->name('user.bookings.index');
    Route::get('/user/bookings/history', [BookingController::class, 'history'])->name('user.bookings.history');
    Route::get('/user/bookings/create', [BookingController::class, 'create'])->name('user.bookings.create');
    Route::post('/user/bookings', [BookingController::class, 'store'])->name('user.bookings.store');
    Route::get('/user/bookings/active', [BookingController::class, 'active'])->name('user.bookings.active');
    Route::get('/user/bookings/history', [BookingController::class, 'history'])->name('user.bookings.history');
    Route::get('/user/bookings/{bookingId}', [BookingController::class, 'show'])->name('user.bookings.show');
    Route::post('/user/bookings/{bookingId}/cancel', [BookingController::class, 'cancel'])->name('user.bookings.cancel');
    Route::post('/user/bookings/{bookingId}/send-payment-reminder', [BookingController::class, 'sendEmergencyPaymentReminder'])->name('user.bookings.send-payment-reminder');

    // User Payments
    Route::get('/user/payments', [PaymentController::class, 'index'])->name('user.payments.index');
    Route::get('/user/payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');
    Route::get('/user/payments/{payment}/pay', [PaymentController::class, 'pay'])->name('payments.pay');
    Route::post('/user/payments/{payment}/process', [PaymentController::class, 'process'])->name('payments.process');
    Route::get('/user/payments/{payment}/receipt', [PaymentController::class, 'receipt'])->name('payments.receipt');

    // Scheduled Payments
    Route::get('/user/bookings/{bookingId}/downpayment', [ScheduledPaymentController::class, 'showDownpayment'])->name('bookings.downpayment');
    Route::post('/user/bookings/{bookingId}/downpayment', [ScheduledPaymentController::class, 'processDownpayment'])->name('bookings.downpayment.process');
    Route::get('/user/bookings/{bookingId}/final-payment', [ScheduledPaymentController::class, 'showFinalPayment'])->name('bookings.final-payment');
    Route::post('/user/bookings/{bookingId}/final-payment', [ScheduledPaymentController::class, 'processFinalPayment'])->name('bookings.final-payment.process');
    Route::get('/user/payments/{payment}/instructions', [ScheduledPaymentController::class, 'showInstructions'])->name('payments.instructions');
    Route::get('/user/payments/{payment}/check-status', [ScheduledPaymentController::class, 'checkPaymentStatus'])->name('payments.check-status');
    Route::post('/payments/callback', [ScheduledPaymentController::class, 'handleCallback'])->name('payments.callback');
    // Tambahkan rute alternatif untuk mendukung URL callback yang terdaftar di Duitku
    Route::post('/payment/callback', [ScheduledPaymentController::class, 'handleCallback'])->name('payment.callback');

    // Emergency Payments
    Route::get('/user/bookings/{bookingId}/fullpayment', [PaymentController::class, 'fullPayment'])->name('bookings.fullpayment');
    Route::post('/user/bookings/{bookingId}/fullpayment', [PaymentController::class, 'processFullPayment'])->name('bookings.fullpayment.process');
    Route::post('/user/bookings/{bookingId}/send-payment-reminder', [PaymentController::class, 'sendPaymentReminder'])->name('user.bookings.send-payment-reminder');

    // User Ratings
    Route::get('/user/ratings', [RatingController::class, 'index'])->name('user.ratings.index');
    Route::get('/user/ratings/create/{bookingId}', [RatingController::class, 'create'])->name('user.ratings.create');
    // Tambahkan rute alternatif untuk rating
    Route::get('/user/create-rating/{id}', [RatingController::class, 'create'])->name('user.create.rating');
    Route::post('/user/ratings', [RatingController::class, 'store'])->name('user.ratings.store');
    Route::get('/user/ratings/{rating}', [RatingController::class, 'show'])->name('user.ratings.show');
    Route::get('/user/ratings/{rating}/edit', [RatingController::class, 'edit'])->name('ratings.edit');
    Route::put('/user/ratings/{rating}', [RatingController::class, 'update'])->name('ratings.update');

    // User Support
    Route::get('/user/support', [SupportController::class, 'index'])->name('support');
    Route::get('/user/support/create', [SupportController::class, 'create'])->name('support.create');
    Route::post('/user/support', [SupportController::class, 'store'])->name('support.store');

    // User Notifications
    Route::get('/user/notifications', [NotificationController::class, 'index'])->name('user.notifications.index');
    Route::post('/user/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('user.notifications.read');
    Route::post('/user/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('user.notifications.read.all');
    Route::delete('/user/notifications/{id}', [NotificationController::class, 'destroy'])->name('user.notifications.destroy');

    // User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Emergency Contacts
    Route::get('/profile/emergency-contacts', [EmergencyContactController::class, 'index'])->name('profile.emergency-contacts');
    Route::post('/profile/emergency-contacts', [EmergencyContactController::class, 'store'])->name('profile.emergency-contacts.store');
    Route::delete('/profile/emergency-contacts/{id}', [EmergencyContactController::class, 'destroy'])->name('profile.emergency-contacts.destroy');
});

require __DIR__.'/auth.php';

// Webhook Routes
Route::prefix('webhook')->group(function () {
    require __DIR__.'/webhook.php';
});
