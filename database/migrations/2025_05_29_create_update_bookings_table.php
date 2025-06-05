<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the bookings table
        Schema::table('bookings', function (Blueprint $table) {
            // Change type enum to include 'scheduled'
            // Don't drop the column first - this preserves existing data
            DB::statement("ALTER TABLE bookings MODIFY COLUMN type ENUM('standard', 'emergency', 'scheduled') NOT NULL DEFAULT 'scheduled'");
            
            // Add fields for down payment tracking
            $table->decimal('downpayment_amount', 15, 2)->nullable()->after('total_amount');
            $table->timestamp('dp_payment_deadline')->nullable()->after('downpayment_amount');
            $table->timestamp('final_payment_deadline')->nullable()->after('dp_payment_deadline');
            $table->boolean('is_downpayment_paid')->default(false)->after('final_payment_deadline');
            $table->boolean('is_fully_paid')->default(false)->after('is_downpayment_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Revert type enum
            DB::statement("ALTER TABLE bookings MODIFY COLUMN type ENUM('standard', 'emergency') NOT NULL DEFAULT 'standard'");
            
            // Drop added columns
            $table->dropColumn([
                'downpayment_amount',
                'dp_payment_deadline',
                'final_payment_deadline',
                'is_downpayment_paid',
                'is_fully_paid',
            ]);
        });
    }
};
