<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Http\Request;
use Illuminate\Contracts\Foundation\Application;

class Kernel extends ConsoleKernel
{
    /**
     * Create a new console kernel instance.
     */
    public function __construct(Application $app)
    {
        parent::__construct($app);

        // Fix for URL generation in console commands
        $this->app->instance('request', Request::create(env('APP_URL', 'http://localhost'), 'GET'));
    }

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Update driver ratings daily at midnight
        $schedule->command('app:update-driver-ratings')
                 ->dailyAt('00:00')
                 ->withoutOverlapping()
                 ->appendOutputTo(storage_path('logs/driver-ratings.log'));

        // Send maintenance reminders daily at 8:00 AM
        $schedule->command('app:send-maintenance-reminders --days=3')
                 ->dailyAt('08:00')
                 ->withoutOverlapping()
                 ->appendOutputTo(storage_path('logs/maintenance-reminders.log'));

        // Process expired payments every hour
        $schedule->command('app:process-expired-payments --hours=24')
                 ->hourly()
                 ->withoutOverlapping()
                 ->appendOutputTo(storage_path('logs/expired-payments.log'));

        // Send scheduled payment reminders every 10 minutes with environment and path
        $schedule->command('app:check-payment-reminders')
                 ->everyTenMinutes()
                 ->withoutOverlapping(10)
                 ->runInBackground()
                 ->emailOutputOnFailure('admin@ambulance-portal.com')
                 ->onSuccess(function () {
                     \Log::info('Payment reminder check completed successfully');
                 })
                 ->onFailure(function () {
                     \Log::error('Payment reminder check failed');
                 })
                 ->appendOutputTo(storage_path('logs/payment-reminders.log'));

        // Process auto cancellations for unpaid bookings every hour
        $schedule->command('app:check-auto-cancellations')
                 ->hourly()
                 ->withoutOverlapping()
                 ->appendOutputTo(storage_path('logs/auto-cancellations.log'));

        // Weekly system report on Mondays at 7:00 AM
        $schedule->command('app:generate-weekly-report')
                 ->weeklyOn(1, '07:00')
                 ->withoutOverlapping()
                 ->emailOutputTo('admin@ambulance-portal.com');
                 
        // FOR TESTING: Run this command every minute to verify scheduler is working
        $schedule->command('log:info "Scheduler is running"')
                 ->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
