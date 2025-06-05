<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Booking;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if bookings already exist
        $existingCount = DB::table('bookings')->count();
        if ($existingCount > 0) {
            // Delete all existing bookings to avoid duplicates
            DB::table('bookings')->delete();
        }
        
        // Set auto-increment to 1
        DB::statement('ALTER TABLE bookings AUTO_INCREMENT = 1');
        
        // Create various booking scenarios
        $this->createEmergencyBooking1();
        $this->createScheduledBooking1();
        $this->createEmergencyBooking2();
        $this->createPendingEmergencyBooking();
        $this->createScheduledBooking2();
        $this->createCompletedScheduledWithDpBooking();
        $this->createOngoingBookingWithDp();
        $this->createPendingScheduledBookingWithPendingDP(); // Add new scenario
    }
    
    private function createEmergencyBooking1(): void
    {
        $bookingCode = 'AMB20250515001';
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 1, // Budi Santoso
            'driver_id' => 1, // Joko Widodo
            'ambulance_id' => 1, // AMB001
            'type' => 'emergency',
            'priority' => 'urgent',
            'patient_name' => 'Agus Santoso',
            'patient_age' => 65,
            'condition_notes' => 'Heart attack symptoms, chest pain, shortness of breath',
            'pickup_address' => 'Jl. Gatot Subroto No. 15, Jakarta Selatan',
            'pickup_lat' => -6.235900,
            'pickup_lng' => 106.822500,
            'destination_address' => 'RSPAD Gatot Soebroto, Jakarta Pusat',
            'destination_lat' => -6.176100,
            'destination_lng' => 106.837200,
            'contact_name' => 'Budi Santoso',
            'contact_phone' => '081234567890',
            'requested_at' => Carbon::now()->subDays(3),
            'dispatched_at' => Carbon::now()->subDays(3)->addMinutes(5),
            'arrived_at' => Carbon::now()->subDays(3)->addMinutes(20),
            'completed_at' => Carbon::now()->subDays(3)->addMinutes(45),
            'scheduled_at' => null,
            'distance_km' => 8.5,
            'base_price' => 500000,
            'distance_price' => 42500, // 8.5 * 5000
            'total_amount' => 542500, // 500000 + 42500
            'downpayment_amount' => null, // Emergency bookings don't have downpayment
            'dp_payment_deadline' => null,
            'final_payment_deadline' => Carbon::now()->subDays(3)->addHours(24),
            'is_downpayment_paid' => false,
            'is_fully_paid' => true,
            'status' => 'completed',
            'notes' => 'Smooth transport, patient stable upon arrival',
            'created_at' => Carbon::now()->subDays(3),
            'updated_at' => Carbon::now()->subDays(3)->addMinutes(45),
        ];
        
        DB::table('bookings')->insert($bookingData);
        
        // Update driver status to 'available' for completed booking
        DB::table('drivers')
            ->where('id', 1)
            ->update(['status' => 'available']);
    }
    
    private function createScheduledBooking1(): void
    {
        $bookingCode = 'AMB20250520001';
        $totalAmount = 516000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 2, // Siti Rahayu
            'driver_id' => 2, // Anwar Ibrahim
            'ambulance_id' => 2, // AMB002
            'type' => 'scheduled',
            'priority' => 'normal',
            'patient_name' => 'Siti Rahayu',
            'patient_age' => 55,
            'condition_notes' => 'Scheduled dialysis treatment',
            'pickup_address' => 'Jl. Sudirman No. 45, Jakarta Pusat',
            'pickup_lat' => -6.225000,
            'pickup_lng' => 106.830000,
            'destination_address' => 'Rumah Sakit Medistra, Jakarta Selatan',
            'destination_lat' => -6.235700,
            'destination_lng' => 106.825600,
            'contact_name' => 'Ahmad Rahayu',
            'contact_phone' => '081345678901',
            'requested_at' => Carbon::now()->subDays(7),
            'dispatched_at' => null,
            'arrived_at' => null,
            'completed_at' => null,
            'scheduled_at' => Carbon::now()->addDays(2)->setHour(10)->setMinute(0),
            'distance_km' => 3.2,
            'base_price' => 500000,
            'distance_price' => 16000, // 3.2 * 5000
            'total_amount' => $totalAmount, // 500000 + 16000
            'downpayment_amount' => $downpaymentAmount,
            'dp_payment_deadline' => Carbon::now()->subDays(6)->addHours(24),
            'final_payment_deadline' => Carbon::now()->addDays(1),
            'is_downpayment_paid' => true,
            'is_fully_paid' => false,
            'status' => 'confirmed',
            'notes' => 'Weekly dialysis appointment',
            'created_at' => Carbon::now()->subDays(7),
            'updated_at' => Carbon::now()->subDays(6),
        ];
        
        DB::table('bookings')->insert($bookingData);
        
        // For confirmed bookings, driver is assigned but not busy yet
        DB::table('drivers')
            ->where('id', 2)
            ->update(['status' => 'available']);
    }
    
    private function createEmergencyBooking2(): void
    {
        $bookingCode = 'AMB20250526001';
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 3, // Agus Setiawan
            'driver_id' => 3, // Haris Azhar
            'ambulance_id' => 3, // AMB003
            'type' => 'emergency',
            'priority' => 'critical',
            'patient_name' => 'Maya Setiawan',
            'patient_age' => 30,
            'condition_notes' => 'Traffic accident, possible internal bleeding',
            'pickup_address' => 'Jl. Thamrin No. 22, Jakarta Pusat',
            'pickup_lat' => -6.195000,
            'pickup_lng' => 106.823000,
            'destination_address' => 'RSCM, Jakarta Pusat',
            'destination_lat' => -6.186100,
            'destination_lng' => 106.844300,
            'contact_name' => 'Agus Setiawan',
            'contact_phone' => '081234567892',
            'requested_at' => Carbon::now()->subHours(2),
            'dispatched_at' => Carbon::now()->subHours(2)->addMinutes(3),
            'arrived_at' => Carbon::now()->subHours(1)->addMinutes(30),
            'completed_at' => Carbon::now()->subHours(1)->addMinutes(45),
            'scheduled_at' => null,
            'distance_km' => 5.1,
            'base_price' => 500000,
            'distance_price' => 25500, // 5.1 * 5000
            'total_amount' => 525500, // 500000 + 25500
            'downpayment_amount' => null, // Emergency bookings don't have downpayment
            'dp_payment_deadline' => null,
            'final_payment_deadline' => Carbon::now()->addHours(22),
            'is_downpayment_paid' => false,
            'is_fully_paid' => false,
            'status' => 'completed',
            'notes' => 'Critical patient, emergency response team notified',
            'created_at' => Carbon::now()->subHours(2),
            'updated_at' => Carbon::now()->subHours(1)->addMinutes(45),
        ];
        
        DB::table('bookings')->insert($bookingData);
        
        // Update driver status to 'available' for completed booking
        DB::table('drivers')
            ->where('id', 3)
            ->update(['status' => 'available']);
    }
    
    private function createPendingEmergencyBooking(): void
    {
        $bookingCode = 'AMB20250526002';
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 4, // Dewi Lestari
            'driver_id' => null,
            'ambulance_id' => null,
            'type' => 'emergency',
            'priority' => 'urgent',
            'patient_name' => 'Andi Lestari',
            'patient_age' => 42,
            'condition_notes' => 'Severe allergic reaction, difficulty breathing',
            'pickup_address' => 'Jl. Kemang Raya No. 10, Jakarta Selatan',
            'pickup_lat' => -6.260000,
            'pickup_lng' => 106.813000,
            'destination_address' => 'RS Pondok Indah, Jakarta Selatan',
            'destination_lat' => -6.265900,
            'destination_lng' => 106.785200,
            'contact_name' => 'Dewi Lestari',
            'contact_phone' => '081234567893',
            'requested_at' => Carbon::now()->subMinutes(15),
            'dispatched_at' => null,
            'arrived_at' => null,
            'completed_at' => null,
            'scheduled_at' => null,
            'distance_km' => 4.3,
            'base_price' => 500000,
            'distance_price' => 21500, // 4.3 * 5000
            'total_amount' => 521500, // 500000 + 21500
            'downpayment_amount' => null, // Emergency bookings don't have downpayment
            'dp_payment_deadline' => null,
            'final_payment_deadline' => null,
            'is_downpayment_paid' => false,
            'is_fully_paid' => false,
            'status' => 'pending',
            'notes' => 'Patient self-administered EpiPen',
            'created_at' => Carbon::now()->subMinutes(15),
            'updated_at' => Carbon::now()->subMinutes(15),
        ];
        
        DB::table('bookings')->insert($bookingData);
    }
    
    private function createScheduledBooking2(): void
    {
        $bookingCode = 'AMB20250531001';
        $totalAmount = 534000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 5, // Ahmad Wahyu
            'driver_id' => 4, // Dian Sastro
            'ambulance_id' => 4, // AMB004
            'type' => 'scheduled',
            'priority' => 'normal',
            'patient_name' => 'Rina Wahyu',
            'patient_age' => 63,
            'condition_notes' => 'Post-surgery transport to rehabilitation center',
            'pickup_address' => 'RS Siloam Semanggi, Jakarta Selatan',
            'pickup_lat' => -6.226200,
            'pickup_lng' => 106.811300,
            'destination_address' => 'Pusat Rehabilitasi Medika, Jakarta Timur',
            'destination_lat' => -6.225400,
            'destination_lng' => 106.900700,
            'contact_name' => 'Ahmad Wahyu',
            'contact_phone' => '081234567894',
            'requested_at' => Carbon::now()->subDays(2),
            'dispatched_at' => null,
            'arrived_at' => null,
            'completed_at' => null,
            'scheduled_at' => Carbon::now()->addDays(5)->setHour(13)->setMinute(0),
            'distance_km' => 6.8,
            'base_price' => 500000,
            'distance_price' => 34000, // 6.8 * 5000
            'total_amount' => $totalAmount, // 500000 + 34000
            'downpayment_amount' => $downpaymentAmount,
            'dp_payment_deadline' => Carbon::now()->subDay()->addHours(24),
            'final_payment_deadline' => Carbon::now()->addDays(4),
            'is_downpayment_paid' => true,
            'is_fully_paid' => false,
            'status' => 'confirmed',
            'notes' => 'Patient has limited mobility, requires wheelchair assistance',
            'created_at' => Carbon::now()->subDays(2),
            'updated_at' => Carbon::now()->subDays(1),
        ];
        
        DB::table('bookings')->insert($bookingData);
        
        // Driver is available until the scheduled date
        DB::table('drivers')
            ->where('id', 4)
            ->update(['status' => 'available']);
    }
    
    private function createCompletedScheduledWithDpBooking(): void
    {
        $bookingCode = 'AMB20250510001';
        $totalAmount = 550000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 2, // Siti Rahayu 
            'driver_id' => 2, // Anwar Ibrahim
            'ambulance_id' => 2, // AMB002
            'type' => 'scheduled',
            'priority' => 'normal',
            'patient_name' => 'Siti Rahayu',
            'patient_age' => 55,
            'condition_notes' => 'Regular dialysis appointment',
            'pickup_address' => 'Jl. Sudirman No. 45, Jakarta Pusat',
            'pickup_lat' => -6.225000,
            'pickup_lng' => 106.830000,
            'destination_address' => 'Rumah Sakit Medistra, Jakarta Selatan',
            'destination_lat' => -6.235700,
            'destination_lng' => 106.825600,
            'contact_name' => 'Ahmad Rahayu',
            'contact_phone' => '081345678901',
            'requested_at' => Carbon::now()->subDays(25),
            'dispatched_at' => Carbon::now()->subDays(20)->setHour(9)->setMinute(45),
            'arrived_at' => Carbon::now()->subDays(20)->setHour(10)->setMinute(0),
            'completed_at' => Carbon::now()->subDays(20)->setHour(12)->setMinute(30),
            'scheduled_at' => Carbon::now()->subDays(20)->setHour(10)->setMinute(0),
            'distance_km' => 10.0,
            'base_price' => 500000,
            'distance_price' => 50000, // 10 * 5000
            'total_amount' => $totalAmount, // 500000 + 50000
            'downpayment_amount' => $downpaymentAmount,
            'dp_payment_deadline' => Carbon::now()->subDays(22),
            'final_payment_deadline' => Carbon::now()->subDays(19),
            'is_downpayment_paid' => true,
            'is_fully_paid' => true,
            'status' => 'completed',
            'notes' => 'Regular service, everything went smoothly',
            'created_at' => Carbon::now()->subDays(25),
            'updated_at' => Carbon::now()->subDays(20),
        ];
        
        DB::table('bookings')->insert($bookingData);
    }
    
    private function createOngoingBookingWithDp(): void
    {
        $bookingCode = 'AMB20250531002';
        $totalAmount = 575000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 3, // Agus Setiawan
            'driver_id' => 5, // Maya Septha
            'ambulance_id' => 5, // AMB005
            'type' => 'scheduled',
            'priority' => 'normal',
            'patient_name' => 'Rudi Setiawan',
            'patient_age' => 72,
            'condition_notes' => 'Transport for scheduled heart surgery',
            'pickup_address' => 'Jl. Bintaro Raya No. 23, Jakarta Selatan',
            'pickup_lat' => -6.270000,
            'pickup_lng' => 106.760000,
            'destination_address' => 'Rumah Sakit Jantung Harapan Kita, Jakarta Barat',
            'destination_lat' => -6.187700,
            'destination_lng' => 106.799500,
            'contact_name' => 'Agus Setiawan',
            'contact_phone' => '081234567892',
            'requested_at' => Carbon::now()->subHours(6),
            'dispatched_at' => Carbon::now()->subMinutes(30),
            'arrived_at' => null,
            'completed_at' => null,
            'scheduled_at' => Carbon::now()->addHour(),
            'distance_km' => 15.0,
            'base_price' => 500000,
            'distance_price' => 75000, // 15 * 5000
            'total_amount' => $totalAmount, // 500000 + 75000
            'downpayment_amount' => $downpaymentAmount,
            'dp_payment_deadline' => Carbon::now()->subHours(3),
            'final_payment_deadline' => Carbon::now()->addDays(1),
            'is_downpayment_paid' => true,
            'is_fully_paid' => false,
            'status' => 'dispatched',
            'notes' => 'Patient needs oxygen supply during transport',
            'created_at' => Carbon::now()->subHours(6),
            'updated_at' => Carbon::now()->subMinutes(30),
        ];
        
        DB::table('bookings')->insert($bookingData);
        
        // Driver is currently busy with this booking
        DB::table('drivers')
            ->where('id', 5)
            ->update(['status' => 'busy']);
    }
    
    private function createPendingScheduledBookingWithPendingDP(): void
    {
        $bookingCode = 'AMB20250531003';
        $totalAmount = 650000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $bookingData = [
            'booking_code' => $bookingCode,
            'user_id' => 4, // Budi Santoso
            'driver_id' => null, // Not assigned yet
            'ambulance_id' => null, // Not assigned yet
            'type' => 'scheduled',
            'priority' => 'normal',
            'patient_name' => 'Anita Sari',
            'patient_age' => 45,
            'condition_notes' => 'Regular dialysis treatment',
            'pickup_address' => 'Jl. Pangeran Jayakarta No. 15, Jakarta Pusat',
            'pickup_lat' => -6.145000,
            'pickup_lng' => 106.842000,
            'destination_address' => 'Rumah Sakit Medistra, Jakarta Selatan',
            'destination_lat' => -6.237500,
            'destination_lng' => 106.832000,
            'contact_name' => 'Budi Santoso',
            'contact_phone' => '081234567894',
            'requested_at' => Carbon::now()->subHours(1),
            'dispatched_at' => null,
            'arrived_at' => null,
            'completed_at' => null,
            'scheduled_at' => Carbon::now()->addDays(3)->setHour(10)->setMinute(0),
            'distance_km' => 18.0,
            'base_price' => 500000,
            'distance_price' => 150000, // 18 * 8333
            'total_amount' => $totalAmount, // 500000 + 150000
            'downpayment_amount' => $downpaymentAmount,
            'dp_payment_deadline' => Carbon::now()->addDay(), // 24 hours to pay DP
            'final_payment_deadline' => Carbon::now()->addDays(3)->setHour(8)->setMinute(0), // 2 hours before scheduled time
            'is_downpayment_paid' => false, // DP not paid yet
            'is_fully_paid' => false,
            'status' => 'pending',
            'notes' => 'Patient needs wheelchair access',
            'created_at' => Carbon::now()->subHours(1),
            'updated_at' => Carbon::now()->subHours(1),
        ];
        
        DB::table('bookings')->insert($bookingData);
    }
}
