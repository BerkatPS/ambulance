<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Maintenance;
use App\Models\Ambulance;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendMaintenanceReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-maintenance-reminders {--days=3 : Days before scheduled maintenance to send reminder}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for upcoming ambulance maintenance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $this->info("Sending maintenance reminders for appointments scheduled in {$days} days...");
        
        // Calculate the target date
        $targetDate = Carbon::now()->addDays($days)->toDateString();
        
        // Find scheduled maintenance for the target date
        $maintenances = Maintenance::with(['ambulance'])
            ->where('status', 'scheduled')
            ->whereDate('scheduled_date', $targetDate)
            ->get();
        
        if ($maintenances->isEmpty()) {
            $this->info("No maintenance appointments scheduled for {$targetDate}.");
            return Command::SUCCESS;
        }
        
        $this->info("Found {$maintenances->count()} maintenance appointments scheduled for {$targetDate}.");
        
        // Also check for ambulances that are due for regular maintenance
        $ambulancesDueForMaintenance = Ambulance::whereDate('next_maintenance_date', $targetDate)
            ->whereNotIn('id', $maintenances->pluck('ambulance_id')->toArray())
            ->get();
        
        if ($ambulancesDueForMaintenance->isNotEmpty()) {
            $this->info("Found {$ambulancesDueForMaintenance->count()} additional ambulances due for regular maintenance on {$targetDate}.");
        }
        
        // Send notifications for scheduled maintenance
        foreach ($maintenances as $maintenance) {
            $this->sendMaintenanceReminder($maintenance);
        }
        
        // Send notifications for ambulances due for regular maintenance
        foreach ($ambulancesDueForMaintenance as $ambulance) {
            $this->sendRegularMaintenanceReminder($ambulance);
        }
        
        $this->info("Maintenance reminders sent successfully.");
        
        return Command::SUCCESS;
    }
    
    /**
     * Send a reminder for a scheduled maintenance appointment.
     *
     * @param \App\Models\Maintenance $maintenance
     * @return void
     */
    private function sendMaintenanceReminder($maintenance)
    {
        // In a real implementation, this would send an actual email.
        // For now, we'll just log the information.
        $ambulance = $maintenance->ambulance;
        
        $this->line("Sending maintenance reminder for ambulance {$ambulance->vehicle_number} ({$ambulance->vehicle_model})");
        $this->line("  Maintenance Type: " . ucfirst($maintenance->maintenance_type));
        $this->line("  Scheduled Date: " . Carbon::parse($maintenance->scheduled_date)->format('Y-m-d H:i'));
        $this->line("  Description: {$maintenance->description}");
        $this->line("  Vendor: " . ($maintenance->vendor ?? 'Not specified'));
        
        // In a real application, you would use something like:
        /*
        Mail::to('fleet@ambulance-portal.com')->send(new MaintenanceReminderMail($maintenance));
        
        if ($maintenance->vendor_email) {
            Mail::to($maintenance->vendor_email)->send(new VendorMaintenanceReminderMail($maintenance));
        }
        */
    }
    
    /**
     * Send a reminder for regular maintenance that's due.
     *
     * @param \App\Models\Ambulance $ambulance
     * @return void
     */
    private function sendRegularMaintenanceReminder($ambulance)
    {
        $this->line("Sending regular maintenance reminder for ambulance {$ambulance->vehicle_number} ({$ambulance->vehicle_model})");
        $this->line("  Last Maintenance: " . ($ambulance->last_maintenance_date 
            ? Carbon::parse($ambulance->last_maintenance_date)->format('Y-m-d')
            : 'Never'));
        $this->line("  Next Maintenance Due: " . Carbon::parse($ambulance->next_maintenance_date)->format('Y-m-d'));
        
        // In a real application, you would use something like:
        /*
        Mail::to('fleet@ambulance-portal.com')->send(new RegularMaintenanceReminderMail($ambulance));
        */
    }
}
