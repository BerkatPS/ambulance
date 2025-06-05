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
        Schema::create('ambulances', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_code', 10)->unique()->comment('AMB001, AMB002');
            $table->string('license_plate', 15)->unique();
            $table->unsignedBigInteger('assigned_driver_id')->nullable()->comment('Current driver');
            $table->enum('status', ['available', 'busy', 'maintenance'])->default('available');
            $table->date('last_service')->nullable();
            $table->date('next_service')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('assigned_driver_id')->references('id')->on('drivers')->onDelete('set null');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ambulances');
    }
};
