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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id', 10)->unique()->comment('Simple ID: D001, D002');
            $table->string('name', 100);
            $table->string('phone', 15)->unique();
            $table->string('license_number', 20)->unique();
            $table->date('license_expiry');
            $table->date('hire_date');
            $table->integer('base_salary')->default(3000000)->comment('IDR (simplified to INT)');
            $table->enum('status', ['available', 'busy', 'off'])->default('available');
            $table->decimal('rating', 2, 1)->default(5.0)->comment('1.0-5.0 scale');
            $table->integer('total_trips')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('status');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
