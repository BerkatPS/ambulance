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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 15)->unique()->comment('AMB20241201001');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('ambulance_id')->nullable();
            
            // Service Type
            $table->enum('type', ['emergency', 'scheduled']);
            $table->enum('priority', ['critical', 'urgent', 'normal'])->default('normal');
            
            // Patient Info (Essential Only)
            $table->string('patient_name', 100);
            $table->integer('patient_age')->nullable();
            $table->text('condition_notes')->nullable()->comment('Optional medical info');
            
            // Locations
            $table->text('pickup_address');
            $table->decimal('pickup_lat', 8, 6)->nullable()->comment('For distance calc');
            $table->decimal('pickup_lng', 9, 6)->nullable();
            $table->text('destination_address');
            $table->decimal('destination_lat', 8, 6)->nullable();
            $table->decimal('destination_lng', 9, 6)->nullable();
            
            // Contact
            $table->string('contact_name', 100);
            $table->string('contact_phone', 15);
            
            // Timing
            $table->timestamp('requested_at');
            $table->timestamp('scheduled_at')->nullable()->comment('For scheduled bookings');
            $table->timestamp('dispatched_at')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            // Pricing (Fixed Rate)
            $table->decimal('distance_km', 5, 2)->nullable()->comment('Calculated distance');
            $table->integer('base_price')->default(500000)->comment('IDR 500k');
            $table->integer('distance_price')->default(0)->comment('km * 5000');
            $table->integer('total_amount')->comment('Total in IDR');
            
            // Status Flow
            $table->enum('status', ['pending', 'confirmed', 'dispatched', 'arrived', 'completed', 'cancelled'])
                   ->default('pending');
            
            // Additional
            $table->text('notes')->nullable();
            $table->text('cancel_reason')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('set null');
            $table->foreign('ambulance_id')->references('id')->on('ambulances')->onDelete('set null');
            
            $table->index('booking_code');
            $table->index('status');
            $table->index(['type', 'priority']);
            $table->index('requested_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
