<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Backup existing data
        $maintenanceData = DB::table('maintenance')->get();
        
        // Drop the old table
        Schema::dropIfExists('maintenance');
        
        // Create the new table with the correct schema
        Schema::create('maintenance', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ambulance_id');
            $table->string('maintenance_code')->nullable();
            $table->enum('maintenance_type', ['service', 'repair', 'routine', 'inspection', 'equipment']);
            $table->text('description');
            $table->integer('cost')->nullable()->comment('IDR cost');
            $table->string('technician_name')->nullable();
            $table->text('notes')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            
            $table->foreign('ambulance_id')->references('id')->on('ambulances');
            $table->index(['ambulance_id', 'status']);
            $table->index('end_date');
        });
        
        // Restore the data with mapping
        foreach ($maintenanceData as $record) {
            DB::table('maintenance')->insert([
                'id' => $record->id,
                'ambulance_id' => $record->ambulance_id,
                'maintenance_code' => 'MAINT-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'maintenance_type' => $record->type,
                'description' => $record->description,
                'cost' => $record->cost,
                'technician_name' => null,
                'notes' => null,
                'start_date' => $record->service_date,
                'end_date' => $record->next_due,
                'status' => $record->status === 'done' ? 'completed' : $record->status,
                'created_at' => $record->created_at,
                'updated_at' => now()
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Backup the data in the new format
        $maintenanceData = DB::table('maintenance')->get();
        
        // Drop the new table
        Schema::dropIfExists('maintenance');
        
        // Recreate the original table structure
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
        
        // Restore the original data
        foreach ($maintenanceData as $record) {
            $type = in_array($record->maintenance_type, ['service', 'repair']) 
                ? $record->maintenance_type 
                : 'service';
            
            $status = $record->status === 'completed' ? 'done' : 'scheduled';
            
            DB::table('maintenance')->insert([
                'id' => $record->id,
                'ambulance_id' => $record->ambulance_id,
                'type' => $type,
                'description' => $record->description,
                'cost' => $record->cost,
                'service_date' => $record->start_date,
                'next_due' => $record->end_date,
                'status' => $status,
                'created_at' => $record->created_at
            ]);
        }
    }
};
