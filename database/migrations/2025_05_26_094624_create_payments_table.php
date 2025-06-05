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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id');
            $table->string('transaction_id', 50)->unique();
            $table->string('duitku_reference', 50)->nullable();
            
            // Payment Details
            $table->enum('type', ['down_payment', 'full_payment']);
            $table->enum('method', ['qris', 'va_bca', 'va_mandiri', 'va_bri', 'va_bni', 'gopay']);
            $table->integer('amount')->comment('IDR amount');
            
            // Status & URLs
            $table->enum('status', ['pending', 'paid', 'failed', 'expired'])->default('pending');
            $table->text('payment_url')->nullable()->comment('Duitku redirect');
            $table->string('va_number', 30)->nullable()->comment('Virtual account number');
            $table->text('qr_code')->nullable()->comment('QRIS string');
            
            // Timestamps
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            
            // Duitku Response Data
            $table->json('duitku_data')->nullable()->comment('Store API responses');
            
            $table->foreign('booking_id')->references('id')->on('bookings');
            $table->index(['booking_id', 'type']);
            $table->index('status');
            $table->index('method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
