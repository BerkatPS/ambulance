<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if payments already exist
        $existingCount = DB::table('payments')->count();
        if ($existingCount > 0) {
            // Delete all existing payments to avoid duplicates
            DB::table('payments')->delete();
        }
        
        // Set auto-increment to 1
        DB::statement('ALTER TABLE payments AUTO_INCREMENT = 1');
        
        // Insert payments for different booking scenarios
        $this->createEmergencyFullPayment1();
        $this->createScheduledDownPayment1();
        $this->createScheduledFullPaymentPending();
        $this->createEmergencyFullPaymentPending();
        $this->createScheduledDownPayment2();
        $this->createCompletedBookingWithDpFullPayment();
        $this->createOngoingBookingDownPayment();
        $this->createPendingDownPaymentForScheduledBooking(); // Add new payment for pending DP
    }
    
    private function createEmergencyFullPayment1(): void
    {
        $timestamp = time();
        $bookingId = 1;
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'001',
            'duitku_reference' => 'DUITKU'.$timestamp.'001',
            'payment_type' => 'full_payment',
            'method' => 'qris',
            'amount' => 542500,
            'total_booking_amount' => 542500,
            'downpayment_percentage' => null,
            'status' => 'paid',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'001',
            'qr_code' => 'data:image/png;base64,QRCodeDataSimulated001',
            'va_number' => null,
            'paid_at' => Carbon::now()->subDays(3)->addHours(1),
            'expires_at' => Carbon::now()->subDays(3)->addHours(24),
            'created_at' => Carbon::now()->subDays(3),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'001',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'001',
                'paymentAmount' => 542500,
                'paymentMethod' => 'QRIS',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS',
            ]),
        ];
        
        DB::table('payments')->insert($paymentData);
        
        // Update booking to mark as fully paid
        DB::table('bookings')
            ->where('id', $bookingId)
            ->update(['is_fully_paid' => true]);
    }
    
    private function createScheduledDownPayment1(): void
    {
        $timestamp = time() + 1;
        $bookingId = 2;
        $totalAmount = 516000;
        $downpaymentPercentage = 0.3;
        $downpaymentAmount = round($totalAmount * $downpaymentPercentage);
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'002',
            'duitku_reference' => 'DUITKU'.$timestamp.'002',
            'payment_type' => 'downpayment',
            'method' => 'va_bca',
            'amount' => $downpaymentAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => $downpaymentPercentage,
            'status' => 'paid',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'002',
            'qr_code' => null,
            'va_number' => '39048576123',
            'paid_at' => Carbon::now()->subDays(6)->addHours(2),
            'expires_at' => Carbon::now()->subDays(6)->addHours(24),
            'created_at' => Carbon::now()->subDays(6),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'002',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'002',
                'vaNumber' => '39048576123',
                'paymentAmount' => $downpaymentAmount,
                'paymentMethod' => 'VA',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS',
            ]),
        ];
        
        DB::table('payments')->insert($paymentData);
        
        // Update booking to mark downpayment as paid
        DB::table('bookings')
            ->where('id', $bookingId)
            ->update(['is_downpayment_paid' => true]);
    }
    
    private function createScheduledFullPaymentPending(): void
    {
        $timestamp = time() + 2;
        $bookingId = 2;
        $totalAmount = 516000;
        $downpaymentPercentage = 0.3;
        $remainingAmount = round($totalAmount * (1 - $downpaymentPercentage));
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'003',
            'duitku_reference' => 'DUITKU'.$timestamp.'003',
            'payment_type' => 'full_payment',
            'method' => 'va_bca',
            'amount' => $remainingAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => $downpaymentPercentage,
            'status' => 'pending',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'003',
            'qr_code' => null,
            'va_number' => '39048576124',
            'paid_at' => null,
            'expires_at' => Carbon::now()->addHours(24),
            'created_at' => Carbon::now(),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'003',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'003',
                'vaNumber' => '39048576124',
                'paymentAmount' => $remainingAmount,
                'paymentMethod' => 'VA',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS',
            ]),
        ];
        
        DB::table('payments')->insert($paymentData);
    }
    
    private function createEmergencyFullPaymentPending(): void
    {
        $timestamp = time() + 3;
        $bookingId = 3;
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'004',
            'duitku_reference' => 'DUITKU'.$timestamp.'004',
            'payment_type' => 'full_payment',
            'method' => 'gopay',
            'amount' => 525500,
            'total_booking_amount' => 525500,
            'downpayment_percentage' => null,
            'status' => 'pending',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'004',
            'qr_code' => null,
            'va_number' => null,
            'paid_at' => null,
            'expires_at' => Carbon::now()->addHours(23),
            'created_at' => Carbon::now()->subHour(),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'004',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'004',
                'paymentAmount' => 525500,
                'paymentMethod' => 'GOPAY',
                'resultCode' => '01',
                'resultMessage' => 'PENDING',
            ]),
        ];
        
        DB::table('payments')->insert($paymentData);
    }
    
    private function createScheduledDownPayment2(): void
    {
        $timestamp = time() + 4;
        $bookingId = 5;
        $totalAmount = 534000;
        $downpaymentPercentage = 0.3;
        $downpaymentAmount = round($totalAmount * $downpaymentPercentage);
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'005',
            'duitku_reference' => 'DUITKU'.$timestamp.'005',
            'payment_type' => 'downpayment',
            'method' => 'qris',
            'amount' => $downpaymentAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => $downpaymentPercentage,
            'status' => 'paid',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'005',
            'qr_code' => 'data:image/png;base64,QRCodeDataSimulated005',
            'va_number' => null,
            'paid_at' => Carbon::now()->subDay()->addHours(1),
            'expires_at' => Carbon::now()->subDay()->addHours(24),
            'created_at' => Carbon::now()->subDay(),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'005',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'005',
                'paymentAmount' => $downpaymentAmount,
                'paymentMethod' => 'QRIS',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS',
            ]),
        ];
        
        DB::table('payments')->insert($paymentData);
        
        // Update booking to mark downpayment as paid
        DB::table('bookings')
            ->where('id', $bookingId)
            ->update(['is_downpayment_paid' => true]);
    }
    
    private function createCompletedBookingWithDpFullPayment(): void
    {
        $bookingId = 6;
        $totalAmount = 550000;
        $downpaymentPercentage = 0.3;
        $remainingAmount = round($totalAmount * (1 - $downpaymentPercentage));
        
        // First create a downpayment record
        $timestamp = time() + 5;
        $downpaymentAmount = round($totalAmount * $downpaymentPercentage);
        
        $downpaymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'006',
            'duitku_reference' => 'DUITKU'.$timestamp.'006',
            'payment_type' => 'downpayment',
            'method' => 'va_bni',
            'amount' => $downpaymentAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => $downpaymentPercentage,
            'status' => 'paid',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'006',
            'qr_code' => null,
            'va_number' => '88123456789',
            'paid_at' => Carbon::now()->subDays(22)->addHours(3),
            'expires_at' => Carbon::now()->subDays(22)->addHours(24),
            'created_at' => Carbon::now()->subDays(22),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'006',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'006',
                'vaNumber' => '88123456789',
                'paymentAmount' => $downpaymentAmount,
                'paymentMethod' => 'VA',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS',
            ]),
        ];
        
        DB::table('payments')->insert($downpaymentData);
        
        // Then create a full payment record (remaining amount)
        $timestamp = time() + 6;
        
        $fullPaymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'007',
            'duitku_reference' => 'DUITKU'.$timestamp.'007',
            'payment_type' => 'full_payment',
            'method' => 'va_bni',
            'amount' => $remainingAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => $downpaymentPercentage,
            'status' => 'paid',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'007',
            'qr_code' => null,
            'va_number' => '88123456790',
            'paid_at' => Carbon::now()->subDays(19)->addHours(5),
            'expires_at' => Carbon::now()->subDays(19)->addHours(24),
            'created_at' => Carbon::now()->subDays(19),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'007',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'007',
                'vaNumber' => '88123456790',
                'paymentAmount' => $remainingAmount,
                'paymentMethod' => 'VA',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS',
            ]),
        ];
        
        DB::table('payments')->insert($fullPaymentData);
        
        // Mark booking as fully paid
        DB::table('bookings')
            ->where('id', $bookingId)
            ->update([
                'is_downpayment_paid' => true,
                'is_fully_paid' => true
            ]);
    }
    
    private function createOngoingBookingDownPayment(): void
    {
        $timestamp = time();
        $bookingId = 7;
        $totalAmount = 575000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'008',
            'duitku_reference' => 'DUITKU'.$timestamp.'008',
            'payment_type' => 'downpayment',
            'method' => 'gopay',
            'amount' => $downpaymentAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => 0.3,
            'status' => 'paid',
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'008',
            'qr_code' => null,
            'va_number' => null,
            'paid_at' => Carbon::now()->subHours(5),
            'expires_at' => Carbon::now()->addDay(),
            'created_at' => Carbon::now()->subHours(5),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'008',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'008',
                'paymentAmount' => $downpaymentAmount,
                'paymentMethod' => 'GOPAY',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS'
            ])
        ];
        
        DB::table('payments')->insert($paymentData);
        
        // Update booking to reflect downpayment is paid
        DB::table('bookings')
            ->where('id', $bookingId)
            ->update(['is_downpayment_paid' => true]);
    }
    
    private function createPendingDownPaymentForScheduledBooking(): void
    {
        $timestamp = time();
        $bookingId = 8; // This should match the ID of the booking we just created
        $totalAmount = 650000;
        $downpaymentAmount = round($totalAmount * 0.3); // 30% downpayment
        
        $paymentData = [
            'booking_id' => $bookingId,
            'transaction_id' => 'TRX'.$timestamp.'009',
            'duitku_reference' => 'DUITKU'.$timestamp.'009',
            'payment_type' => 'downpayment',
            'method' => 'va_bca',
            'amount' => $downpaymentAmount,
            'total_booking_amount' => $totalAmount,
            'downpayment_percentage' => 0.3,
            'status' => 'pending', // Payment is pending
            'payment_url' => 'https://duitku.com/payment/'.$timestamp.'009',
            'qr_code' => null,
            'va_number' => '12345678901234',
            'paid_at' => null, // Not paid yet
            'expires_at' => Carbon::now()->addDay(), // Expires in 24 hours
            'created_at' => Carbon::now()->subHours(1),
            'updated_at' => Carbon::now()->subHours(1),
            'duitku_data' => json_encode([
                'paymentUrl' => 'https://duitku.com/payment/'.$timestamp.'009',
                'merchantCode' => 'AMBPRT',
                'reference' => 'DUITKU'.$timestamp.'009',
                'paymentAmount' => $downpaymentAmount,
                'paymentMethod' => 'VA',
                'vaNumber' => '12345678901234',
                'resultCode' => '00',
                'resultMessage' => 'SUCCESS'
            ])
        ];
        
        DB::table('payments')->insert($paymentData);
        
        // No need to update booking since downpayment is still pending
    }
}
