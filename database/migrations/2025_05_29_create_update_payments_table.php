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
        Schema::table('payments', function (Blueprint $table) {
            // Add payment type column for distinguishing between downpayment and full payment
            $table->enum('payment_type', ['downpayment', 'full_payment'])->default('full_payment')->after('method');
            $table->decimal('total_booking_amount', 15, 2)->nullable()->after('amount');
            $table->decimal('downpayment_percentage', 5, 2)->nullable()->after('total_booking_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'payment_type', 
                'total_booking_amount',
                'downpayment_percentage'
            ]);
        });
    }
};
