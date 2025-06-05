<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if ratings already exist
        $existingCount = DB::table('ratings')->count();
        if ($existingCount > 0) {
            // Delete all existing ratings to avoid duplicates
            DB::table('ratings')->delete();
        }
        
        // Create ratings for completed bookings
        $this->createRating1();
        $this->createRating2();
        $this->createRating3();
    }
    
    private function createRating1(): void
    {
        DB::table('ratings')->insert([
            'booking_id' => 1,
            'user_id' => 1, // Budi Santoso
            'driver_id' => 1, // Joko Widodo
            'overall' => 5,
            'punctuality' => 5,
            'service' => 5,
            'vehicle_condition' => 4,
            'comment' => 'Layanan sangat baik dan cepat. Pengemudi sangat profesional dalam menangani situasi darurat. Ambulans datang dalam waktu 15 menit setelah pemesanan.',
            'created_at' => Carbon::now()->subDays(2),
        ]);
        
        // Update driver's average rating
        DB::table('drivers')
            ->where('id', 1)
            ->update(['rating' => 5.0]);
    }
    
    private function createRating2(): void
    {
        DB::table('ratings')->insert([
            'booking_id' => 3,
            'user_id' => 3, // Agus Setiawan
            'driver_id' => 3, // Haris Azhar
            'overall' => 4,
            'punctuality' => 4,
            'service' => 3,
            'vehicle_condition' => 5,
            'comment' => 'Pengemudi sangat cepat tanggap dan profesional, ambulans dalam kondisi sangat baik dan bersih. Namun pelayanan bisa lebih ditingkatkan lagi.',
            'created_at' => Carbon::now()->subHour(),
        ]);
        
        // Update driver's average rating
        DB::table('drivers')
            ->where('id', 3)
            ->update(['rating' => 4.0]);
    }
    
    private function createRating3(): void
    {
        DB::table('ratings')->insert([
            'booking_id' => 7, // Another completed booking
            'user_id' => 2, // Siti Rahayu
            'driver_id' => 2, // Anwar Ibrahim
            'overall' => 3,
            'punctuality' => 2,
            'service' => 4,
            'vehicle_condition' => 3,
            'comment' => 'Pengemudi cukup ramah, tapi terlambat 10 menit dari jadwal. Kondisi ambulans cukup bersih namun ada beberapa peralatan yang perlu diperbarui.',
            'created_at' => Carbon::now()->subDays(5),
        ]);
        
        // Update driver's average rating
        DB::table('drivers')
            ->where('id', 2)
            ->update(['rating' => 3.0]);
    }
}
