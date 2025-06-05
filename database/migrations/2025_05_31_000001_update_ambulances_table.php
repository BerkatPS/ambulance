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
        // First add the columns without constraints
        Schema::table('ambulances', function (Blueprint $table) {
            // Drop existing columns we're going to replace
            $table->dropForeign(['assigned_driver_id']);
            $table->dropColumn(['assigned_driver_id']);
            
            // Add new columns
            $table->string('registration_number')->nullable()->after('id');
            $table->string('model')->nullable()->after('registration_number');
            $table->integer('year')->nullable()->after('model');
            $table->unsignedBigInteger('ambulance_type_id')->nullable()->after('year');
            $table->unsignedBigInteger('ambulance_station_id')->nullable()->after('ambulance_type_id');
            $table->string('equipment')->nullable()->after('next_service');
            $table->text('notes')->nullable()->after('equipment');
            
            // Add updated_at column
            $table->timestamp('updated_at')->nullable();
        });
        
        // Update data to avoid constraint violations
        DB::table('ambulances')->update([
            'registration_number' => DB::raw('CONCAT("REG-", id)'),
            'model' => DB::raw('CONCAT("Model-", id)'),
        ]);
        
        // Now add constraints and modify columns after data is migrated
        Schema::table('ambulances', function (Blueprint $table) {
            // Make columns required now that we have data
            $table->string('registration_number')->nullable(false)->unique()->change();
            $table->string('model')->nullable(false)->change();
            
            // Update enum values for status - need to handle any existing data first
            $table->renameColumn('status', 'old_status');
        });
        
        // Add new status column with updated enum values
        Schema::table('ambulances', function (Blueprint $table) {
            $table->enum('status', ['available', 'on_duty', 'maintenance', 'inactive'])->default('available')->after('ambulance_station_id');
        });
        
        // Migrate data from old status to new status
        DB::table('ambulances')->update([
            'status' => DB::raw("CASE 
                WHEN old_status = 'available' THEN 'available'
                WHEN old_status = 'busy' THEN 'on_duty'
                WHEN old_status = 'maintenance' THEN 'maintenance'
                ELSE 'available'
            END")
        ]);
        
        // Drop the old status column
        Schema::table('ambulances', function (Blueprint $table) {
            $table->dropColumn('old_status');
            
            // Rename service columns to maintenance
            $table->renameColumn('last_service', 'last_maintenance_date');
            $table->renameColumn('next_service', 'next_maintenance_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First drop constraints
        Schema::table('ambulances', function (Blueprint $table) {
            // Rename maintenance columns back to service
            $table->renameColumn('last_maintenance_date', 'last_service');
            $table->renameColumn('next_maintenance_date', 'next_service');
            
            // Remove status enum 
            $table->dropColumn('status');
        });
        
        // Add original status back
        Schema::table('ambulances', function (Blueprint $table) {
            $table->enum('status', ['available', 'busy', 'maintenance'])->default('available');
        });
        
        // Drop new columns
        Schema::table('ambulances', function (Blueprint $table) {
            $table->dropColumn([
                'registration_number', 
                'model', 
                'year', 
                'ambulance_type_id', 
                'ambulance_station_id',
                'equipment',
                'notes',
                'updated_at'
            ]);
        });
        
        // Add original columns back
        Schema::table('ambulances', function (Blueprint $table) {
            $table->unsignedBigInteger('assigned_driver_id')->nullable();
            $table->foreign('assigned_driver_id')->references('id')->on('drivers')->onDelete('set null');
        });
    }
};
