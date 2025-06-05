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
        Schema::create('maintenance', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ambulance_id');
            $table->enum('type', ['service', 'repair'])->comment('service, repair');
            $table->text('description');
            $table->integer('cost')->nullable()->comment('IDR cost');
            $table->date('service_date');
            $table->date('next_due')->nullable();
            $table->enum('status', ['scheduled', 'done'])->default('scheduled');
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('ambulance_id')->references('id')->on('ambulances');
            $table->index(['ambulance_id', 'status']);
            $table->index('next_due');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance');
    }
};
