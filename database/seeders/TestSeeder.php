<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add a very simple test entry that doesn't rely on URL generation
        try {
            DB::table('admins')->insert([
                'name' => 'Test Admin',
                'email' => 'test@example.com',
                'phone' => '1234567890',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Just silently continue if there's an error
            // This is just a test to see if we can get past the URL generator issue
        }
    }
}
