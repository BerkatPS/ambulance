<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First check if drivers already exist
        $driversCount = DB::table('drivers')->count();
        
        if ($driversCount === 0) {
            // Insert new drivers if none exist
            $this->insertDrivers();
        } else {
            // Update existing drivers with authentication details
            $this->updateDriversWithAuthDetails();
        }
    }
    
    /**
     * Insert new drivers into the database.
     */
    private function insertDrivers(): void
    {
        $drivers = [
            [
                'employee_id' => 'D001',
                'name' => 'Joko Widodo',
                'email' => 'joko@ambulance.com',
                'password' => Hash::make('password123'),
                'phone' => '081712345678',
                'license_number' => 'SIM-A-12345678',
                'license_expiry' => '2026-08-15',
                'hire_date' => '2023-01-10',
                'base_salary' => 3500000,
                'status' => 'available',
                'rating' => 4.8,
                'total_trips' => 245,
                'is_active' => true,
                'created_at' => now(),
                'email_verified_at' => now(),
                'remember_token' => null,
            ],
            [
                'employee_id' => 'D002',
                'name' => 'Anwar Ibrahim',
                'email' => 'anwar@ambulance.com',
                'password' => Hash::make('password123'),
                'phone' => '081712345679',
                'license_number' => 'SIM-A-12345679',
                'license_expiry' => '2025-06-20',
                'hire_date' => '2023-02-15',
                'base_salary' => 3200000,
                'status' => 'available',
                'rating' => 4.5,
                'total_trips' => 178,
                'is_active' => true,
                'created_at' => now(),
                'email_verified_at' => now(),
                'remember_token' => null,
            ],
            [
                'employee_id' => 'D003',
                'name' => 'Haris Azhar',
                'email' => 'haris@ambulance.com',
                'password' => Hash::make('password123'),
                'phone' => '081712345680',
                'license_number' => 'SIM-A-12345680',
                'license_expiry' => '2026-03-10',
                'hire_date' => '2023-04-01',
                'base_salary' => 3000000,
                'status' => 'busy',
                'rating' => 4.9,
                'total_trips' => 201,
                'is_active' => true,
                'created_at' => now(),
                'email_verified_at' => now(),
                'remember_token' => null,
            ],
            [
                'employee_id' => 'D004',
                'name' => 'Bambang Pamungkas',
                'email' => 'bambang@ambulance.com',
                'password' => Hash::make('password123'),
                'phone' => '081712345681',
                'license_number' => 'SIM-A-12345681',
                'license_expiry' => '2025-12-05',
                'hire_date' => '2023-06-10',
                'base_salary' => 3100000,
                'status' => 'available',
                'rating' => 4.7,
                'total_trips' => 156,
                'is_active' => true,
                'created_at' => now(),
                'email_verified_at' => now(),
                'remember_token' => null,
            ],
            [
                'employee_id' => 'D005',
                'name' => 'Rudi Sutanto',
                'email' => 'rudi@ambulance.com',
                'password' => Hash::make('password123'),
                'phone' => '081712345682',
                'license_number' => 'SIM-A-12345682',
                'license_expiry' => '2026-04-22',
                'hire_date' => '2023-08-15',
                'base_salary' => 3000000,
                'status' => 'off',
                'rating' => 4.3,
                'total_trips' => 112,
                'is_active' => true,
                'created_at' => now(),
                'email_verified_at' => now(),
                'remember_token' => null,
            ],
        ];

        DB::table('drivers')->insert($drivers);
    }
    
    /**
     * Update existing drivers with authentication details.
     */
    private function updateDriversWithAuthDetails(): void
    {
        $driverAuthDetails = [
            'D001' => [
                'email' => 'joko@ambulance.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            'D002' => [
                'email' => 'anwar@ambulance.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            'D003' => [
                'email' => 'haris@ambulance.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            'D004' => [
                'email' => 'bambang@ambulance.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            'D005' => [
                'email' => 'rudi@ambulance.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
        ];
        
        // Update each driver with authentication details
        foreach ($driverAuthDetails as $employeeId => $details) {
            DB::table('drivers')
                ->where('employee_id', $employeeId)
                ->update($details);
        }
    }
}
