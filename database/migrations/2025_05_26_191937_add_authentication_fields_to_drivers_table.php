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
        Schema::table('drivers', function (Blueprint $table) {
            // Add email field if it doesn't exist already
            if (!Schema::hasColumn('drivers', 'email')) {
                $table->string('email')->unique()->nullable();
            }
            
            // Add password field if it doesn't exist already
            if (!Schema::hasColumn('drivers', 'password')) {
                $table->string('password')->nullable();
            }
            
            // Add remember_token field if it doesn't exist already
            if (!Schema::hasColumn('drivers', 'remember_token')) {
                $table->rememberToken();
            }
            
            // Add email_verified_at field if it doesn't exist already
            if (!Schema::hasColumn('drivers', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            // Only drop columns if they exist
            if (Schema::hasColumn('drivers', 'email')) {
                $table->dropColumn('email');
            }
            
            if (Schema::hasColumn('drivers', 'password')) {
                $table->dropColumn('password');
            }
            
            if (Schema::hasColumn('drivers', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
            
            if (Schema::hasColumn('drivers', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }
        });
    }
};
