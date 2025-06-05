<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Temporarily disable foreign key checks for seeding
        Schema::disableForeignKeyConstraints();
        
        // Seed in order to respect foreign key constraints
        $this->call([
            // Independent tables first
            UserSeeder::class,
            AdminSeeder::class,
            
            // Ambulance types and stations (needed before ambulances)
            AmbulanceTypeSeeder::class,
            AmbulanceStationSeeder::class,
            
            // Need to create drivers first (without assigned ambulances)
            DriverSeeder::class,
            
            // Then create ambulances (which can reference drivers)
            AmbulanceSeeder::class,
            
            // Update drivers with ambulance assignments
            // (this needs to be done after both tables exist)
            UpdateDriversSeeder::class,
            
            // Then tables that depend on users, drivers, and ambulances
            BookingSeeder::class,
            PaymentSeeder::class,
            RatingSeeder::class,
            MaintenanceSeeder::class,
            
            // Notifications (depends on users, admins, bookings)
            NotificationSeeder::class,
        ]);
        
        // Re-enable foreign key checks after seeding
        Schema::enableForeignKeyConstraints();
    }
}
