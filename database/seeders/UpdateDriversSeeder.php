<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateDriversSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // This seeder updates drivers with their assigned ambulances
        // after both tables have been created to resolve circular dependency
        
        $driverAmbulanceMap = [
            // driver_id => ambulance_id
            1 => 1, // Driver 1 (Joko) assigned to Ambulance 1 (AMB001)
            2 => 2, // Driver 2 (Anwar) assigned to Ambulance 2 (AMB002)
            3 => 3, // Driver 3 (Haris) assigned to Ambulance 3 (AMB003)
            4 => 4, // Driver 4 (Bambang) assigned to Ambulance 4 (AMB004)
            // Driver 5 has no ambulance assigned (AMB005 is in maintenance)
        ];
        
        foreach ($driverAmbulanceMap as $driverId => $ambulanceId) {
            // Update the driver with the ambulance_id
            DB::table('drivers')
                ->where('id', $driverId)
                ->update(['ambulance_id' => $ambulanceId]);
                
            // In our new schema, we've removed the assigned_driver_id column from ambulances
            // Drivers now reference ambulances through the ambulance_id column
        }
    }
}
