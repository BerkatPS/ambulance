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
        Schema::table('admins', function (Blueprint $table) {
            $table->boolean('notifications_enabled')->default(true)->after('password');
            $table->string('theme', 10)->default('light')->after('notifications_enabled');
            $table->string('language', 5)->default('en')->after('theme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn(['notifications_enabled', 'theme', 'language']);
        });
    }
};
