<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if notifications already exist
        $existingCount = DB::table('notifications')->count();
        if ($existingCount > 0) {
            // Delete all existing notifications to avoid duplicates
            DB::table('notifications')->delete();
        }
        
        // Seed user notifications
        $this->seedUserNotifications();
        
        // Seed admin notifications
        $this->seedAdminNotifications();
    }
    
    /**
     * Seed notifications for users
     */
    private function seedUserNotifications(): void
    {
        // Create booking notifications for user with ID 1
        $userId = 1;
        $bookingId = 1;
        
        // Create a notification for booking created
        DB::table('notifications')->insert([
            'id' => Str::uuid()->toString(),
            'type' => 'App\\Notifications\\BookingCreatedNotification',
            'notifiable_type' => 'App\\Models\\User',
            'notifiable_id' => $userId,
            'data' => json_encode([
                'booking_id' => $bookingId,
                'booking_code' => 'AMB20250515001',
                'message' => 'Your booking has been created successfully',
                'created_at' => Carbon::now()->subDays(3)->format('Y-m-d H:i:s'),
            ]),
            'read_at' => Carbon::now()->subDays(3)->addHours(1),
            'created_at' => Carbon::now()->subDays(3),
            'updated_at' => Carbon::now()->subDays(3),
        ]);
        
        // Create a notification for driver assigned
        DB::table('notifications')->insert([
            'id' => Str::uuid()->toString(),
            'type' => 'App\\Notifications\\DriverAssignedNotification',
            'notifiable_type' => 'App\\Models\\User',
            'notifiable_id' => $userId,
            'data' => json_encode([
                'booking_id' => $bookingId,
                'booking_code' => 'AMB20250515001',
                'driver_id' => 1,
                'driver_name' => 'Joko Widodo',
                'message' => 'A driver has been assigned to your booking',
                'created_at' => Carbon::now()->subDays(3)->addMinutes(5)->format('Y-m-d H:i:s'),
            ]),
            'read_at' => Carbon::now()->subDays(3)->addHours(1),
            'created_at' => Carbon::now()->subDays(3)->addMinutes(5),
            'updated_at' => Carbon::now()->subDays(3)->addMinutes(5),
        ]);
        
        // Create a notification for payment reminder (user 2, booking 2)
        $userId = 2;
        $bookingId = 2;
        
        DB::table('notifications')->insert([
            'id' => Str::uuid()->toString(),
            'type' => 'App\\Notifications\\PaymentReminderNotification',
            'notifiable_type' => 'App\\Models\\User',
            'notifiable_id' => $userId,
            'data' => json_encode([
                'booking_id' => $bookingId,
                'booking_code' => 'AMB20250520001',
                'amount_due' => 361200,
                'message' => 'Payment reminder for your scheduled booking',
                'created_at' => Carbon::now()->subDays(1)->format('Y-m-d H:i:s'),
            ]),
            'read_at' => null, // Unread
            'created_at' => Carbon::now()->subDays(1),
            'updated_at' => Carbon::now()->subDays(1),
        ]);
        
        // Create a notification for another user
        $userId = 3;
        $bookingId = 3;
        
        DB::table('notifications')->insert([
            'id' => Str::uuid()->toString(),
            'type' => 'App\\Notifications\\BookingCreatedNotification',
            'notifiable_type' => 'App\\Models\\User',
            'notifiable_id' => $userId,
            'data' => json_encode([
                'booking_id' => $bookingId,
                'booking_code' => 'AMB20250526001',
                'message' => 'Your emergency booking has been created',
                'created_at' => Carbon::now()->subHours(2)->format('Y-m-d H:i:s'),
            ]),
            'read_at' => Carbon::now()->subHours(1), 
            'created_at' => Carbon::now()->subHours(2),
            'updated_at' => Carbon::now()->subHours(2),
        ]);
    }
    
    /**
     * Seed notifications for admins
     */
    private function seedAdminNotifications(): void
    {
        // Admin ID
        $adminId = 1;
        
        // Create booking confirmed notifications
        for ($i = 1; $i <= 3; $i++) {
            DB::table('notifications')->insert([
                'id' => Str::uuid()->toString(),
                'type' => 'App\\Notifications\\BookingConfirmedNotification',
                'notifiable_type' => 'App\\Models\\Admin',
                'notifiable_id' => $adminId,
                'data' => json_encode([
                    'booking_id' => $i,
                    'booking_code' => 'AMB2025' . sprintf('%02d', $i) . '001',
                    'message' => 'New booking has been confirmed',
                    'created_at' => Carbon::now()->subDays(rand(1, 7))->format('Y-m-d H:i:s'),
                ]),
                'read_at' => $i <= 2 ? Carbon::now()->subDays(rand(1, 2)) : null, // First 2 read, rest unread
                'created_at' => Carbon::now()->subDays(rand(1, 7)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        }
    }
}
