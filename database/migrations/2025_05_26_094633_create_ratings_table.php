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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('driver_id');
            
            // Simple Rating System
            $table->tinyInteger('overall')->comment('1-5 stars');
            $table->tinyInteger('punctuality')->nullable()->comment('1-5 stars');
            $table->tinyInteger('service')->nullable()->comment('1-5 stars');
            $table->tinyInteger('vehicle_condition')->nullable()->comment('1-5 stars');
            
            // Feedback
            $table->text('comment')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('booking_id')->references('id')->on('bookings');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('driver_id')->references('id')->on('drivers');
            
            $table->unique('booking_id', 'unique_rating');
            $table->index(['driver_id', 'overall']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
