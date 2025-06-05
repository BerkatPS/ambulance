<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if users already exist
        $existingCount = DB::table('users')->count();
        if ($existingCount > 0) {
            // Only delete users that aren't referenced in bookings
            $usersWithNoBookings = DB::table('users')
                ->whereNotIn('id', function($query) {
                    $query->select('user_id')->from('bookings');
                })
                ->pluck('id');
                
            if (count($usersWithNoBookings) > 0) {
                DB::table('users')->whereIn('id', $usersWithNoBookings)->delete();
            }
        }
        
        // Define our user data
        $users = [
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567890',
                'address' => 'Jl. Merdeka No. 123, RT 05/RW 02',
                'city' => 'Jakarta Selatan',
                'password' => Hash::make('password'),
                'remember_token' => null,
                'created_at' => Carbon::now()->subMonths(2),
                'updated_at' => Carbon::now()->subMonths(2),
            ],
            [
                'name' => 'Siti Rahayu',
                'phone' => '081234567891',
                'address' => 'Jl. Pahlawan No. 45, RT 03/RW 04',
                'city' => 'Jakarta Pusat',
                'password' => Hash::make('password'),
                'remember_token' => null,
                'created_at' => Carbon::now()->subMonths(1)->subDays(15),
                'updated_at' => Carbon::now()->subMonths(1)->subDays(15),
            ],
            [
                'name' => 'Agus Setiawan',
                'phone' => '081234567892',
                'address' => 'Jl. Sudirman No. 78, RT 10/RW 03',
                'city' => 'Jakarta Barat',
                'password' => Hash::make('password'),
                'remember_token' => null,
                'created_at' => Carbon::now()->subMonths(1),
                'updated_at' => Carbon::now()->subMonths(1),
            ],
            [
                'name' => 'Dewi Lestari',
                'phone' => '081234567893',
                'address' => 'Jl. Gatot Subroto No. 21, RT 08/RW 05',
                'city' => 'Jakarta Timur',
                'password' => Hash::make('password'),
                'remember_token' => null,
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ],
            [
                'name' => 'Hendra Wijaya',
                'phone' => '081234567894',
                'address' => 'Jl. Thamrin No. 56, RT 04/RW 06',
                'city' => 'Jakarta Utara',
                'password' => Hash::make('password'),
                'remember_token' => null,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
        ];

        // Insert users one by one to check for duplicates
        foreach ($users as $user) {
            // Check if a user with this phone number already exists
            $existingUser = DB::table('users')->where('phone', $user['phone'])->first();
            if (!$existingUser) {
                DB::table('users')->insert($user);
            }
        }
    }
}
