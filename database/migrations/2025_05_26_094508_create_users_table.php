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
        // Drop default columns from users table and add our custom ones
        Schema::table('users', function (Blueprint $table) {
            // Drop existing columns that we don't need
            if (Schema::hasColumn('users', 'email')) {
                $table->dropColumn('email');
            }
            if (Schema::hasColumn('users', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }
            if (Schema::hasColumn('users', 'password')) {
                $table->dropColumn('password');
            }
            if (Schema::hasColumn('users', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
            if (Schema::hasColumn('users', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
            
            // Add our new columns if they don't exist
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 15)->unique()->after('name')->comment('Primary identifier');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'city')) {
                $table->string('city', 50)->nullable()->after('address');
            }
            
            // Add index
            if (Schema::hasColumn('users', 'phone')) {
                $table->index('phone');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove our custom columns if they exist
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('users', 'address')) {
                $table->dropColumn('address');
            }
            if (Schema::hasColumn('users', 'city')) {
                $table->dropColumn('city');
            }
            
            // Remove index
            if (Schema::hasIndex('users', 'users_phone_index')) {
                $table->dropIndex('users_phone_index');
            }
            
            // Restore Laravel default columns
            if (!Schema::hasColumn('users', 'email')) {
                $table->string('email')->unique()->after('name');
            }
            if (!Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'password')) {
                $table->string('password')->after('email_verified_at');
            }
            if (!Schema::hasColumn('users', 'remember_token')) {
                $table->rememberToken()->after('password');
            }
            if (!Schema::hasColumn('users', 'updated_at')) {
                $table->timestamp('updated_at')->nullable()->after('created_at');
            }
        });
    }
};
