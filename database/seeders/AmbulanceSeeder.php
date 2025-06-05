<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AmbulanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ambulances = [
            [
                'vehicle_code' => 'AMB001',
                'license_plate' => 'B 1234 AMB',
                'registration_number' => 'REG-001-2025',
                'model' => 'Toyota HiAce',
                'year' => 2023,
                'ambulance_type_id' => 1, // AGD - Emergency
                'ambulance_station_id' => 1, // Jakarta Pusat
                'status' => 'available',
                'last_maintenance_date' => '2025-04-15',
                'next_maintenance_date' => '2025-07-15',
                'equipment' => 'Defibrillator, Ventilator, Oxygen Tank, Stretcher, First Aid Kit',
                'notes' => 'Ambulans gawat darurat dengan peralatan lengkap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'vehicle_code' => 'AMB002',
                'license_plate' => 'B 2345 AMB',
                'registration_number' => 'REG-002-2025',
                'model' => 'Mercedes Sprinter',
                'year' => 2024,
                'ambulance_type_id' => 2, // API - Intensive Care
                'ambulance_station_id' => 2, // Jakarta Selatan
                'status' => 'available',
                'last_maintenance_date' => '2025-04-10',
                'next_maintenance_date' => '2025-07-10',
                'equipment' => 'Advanced Life Support, Cardiac Monitor, Incubator, Ventilator, Suction Unit',
                'notes' => 'Ambulans perawatan intensif untuk pasien kritis',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'vehicle_code' => 'AMB003',
                'license_plate' => 'B 3456 AMB',
                'registration_number' => 'REG-003-2025',
                'model' => 'Ford Transit',
                'year' => 2023,
                'ambulance_type_id' => 3, // ATP - Transport
                'ambulance_station_id' => 3, // Jakarta Barat
                'status' => 'on_duty',
                'last_maintenance_date' => '2025-03-22',
                'next_maintenance_date' => '2025-06-22',
                'equipment' => 'Basic Life Support, Wheelchair, Stretcher, Oxygen Supply',
                'notes' => 'Ambulans transportasi pasien antar fasilitas',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'vehicle_code' => 'AMB004',
                'license_plate' => 'B 4567 AMB',
                'registration_number' => 'REG-004-2025',
                'model' => 'Volkswagen Transporter',
                'year' => 2022,
                'ambulance_type_id' => 1, // AGD - Emergency
                'ambulance_station_id' => 4, // Jakarta Timur
                'status' => 'available',
                'last_maintenance_date' => '2025-05-01',
                'next_maintenance_date' => '2025-08-01',
                'equipment' => 'Defibrillator, Ventilator, ECG Monitor, Oxygen Tank, Stretcher',
                'notes' => 'Ambulans gawat darurat dengan peralatan lengkap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'vehicle_code' => 'AMB005',
                'license_plate' => 'B 5678 AMB',
                'registration_number' => 'REG-005-2025',
                'model' => 'Isuzu NQR',
                'year' => 2024,
                'ambulance_type_id' => 4, // Khusus - Special
                'ambulance_station_id' => 5, // Jakarta Utara
                'status' => 'maintenance',
                'last_maintenance_date' => '2025-05-20',
                'next_maintenance_date' => '2025-08-20',
                'equipment' => 'Special Medical Equipment, Mobile X-Ray, Isolation Unit',
                'notes' => 'Ambulans khusus dengan modifikasi untuk kasus khusus',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Check if any ambulances already exist
        $existingCount = DB::table('ambulances')->count();
        if ($existingCount > 0) {
            // Delete all existing ambulances to avoid duplicates
            DB::table('ambulances')->delete();
        }

        // Insert ambulances one by one
        foreach ($ambulances as $ambulance) {
            DB::table('ambulances')->insert($ambulance);
        }
    }
}
