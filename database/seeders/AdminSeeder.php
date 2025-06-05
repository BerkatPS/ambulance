<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $existingAdmin = DB::table('admins')->where('email', 'admin@ambulance-portal.com')->first();
        
        if (!$existingAdmin) {
            DB::table('admins')->insert([
                'name' => 'Admin Utama',
                'email' => 'admin@ambulance-portal.com',
                'phone' => '081122334455',
                'password' => Hash::make('password123'), // In production, use a stronger password
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
