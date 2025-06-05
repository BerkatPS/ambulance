<?php

/**
 * Database Setup Script
 * 
 * This script directly creates the database schema without using Laravel's migration system,
 * avoiding the URL generator issue that occurs during artisan migrations.
 */

// Load .env file manually to get database credentials
$env = parse_ini_file(__DIR__ . '/.env');

// Database connection details
$host = $env['DB_HOST'] ?? 'localhost';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? 'laravel';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

echo "Connecting to database: {$database} on {$host}:{$port}\n";

try {
    // Connect to the MySQL server
    $pdo = new PDO("mysql:host={$host};port={$port}", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    echo "Creating database if it doesn't exist...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}`");
    $pdo->exec("USE `{$database}`");
    
    // Drop existing tables for fresh schema
    echo "Dropping existing tables...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
    $result = $pdo->query("SHOW TABLES");
    while ($row = $result->fetch(PDO::FETCH_NUM)) {
        $pdo->exec("DROP TABLE IF EXISTS `{$row[0]}`");
        echo "  Dropped table: {$row[0]}\n";
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
    
    // Create users table
    echo "Creating users table...\n";
    $pdo->exec("CREATE TABLE `users` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL,
        `email_verified_at` timestamp NULL DEFAULT NULL,
        `password` varchar(255) NOT NULL,
        `remember_token` varchar(100) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `users_email_unique` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create admins table
    echo "Creating admins table...\n";
    $pdo->exec("CREATE TABLE `admins` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(100) NOT NULL,
        `email` varchar(255) NOT NULL,
        `phone` varchar(15) NOT NULL,
        `password` varchar(255) NOT NULL,
        `remember_token` varchar(100) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `admins_email_unique` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create drivers table
    echo "Creating drivers table...\n";
    $pdo->exec("CREATE TABLE `drivers` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(100) NOT NULL,
        `email` varchar(255) NOT NULL,
        `phone` varchar(15) NOT NULL,
        `license_number` varchar(50) NOT NULL,
        `experience_years` int NOT NULL DEFAULT 0,
        `rating` decimal(3,2) DEFAULT 0.00,
        `status` enum('available','busy','offline') DEFAULT 'offline',
        `password` varchar(255) NOT NULL,
        `remember_token` varchar(100) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `drivers_email_unique` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create ambulances table
    echo "Creating ambulances table...\n";
    $pdo->exec("CREATE TABLE `ambulances` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `vehicle_number` varchar(20) NOT NULL,
        `model` varchar(50) NOT NULL,
        `capacity` int NOT NULL DEFAULT 1,
        `equipment` text,
        `status` enum('available','busy','maintenance') DEFAULT 'available',
        `driver_id` bigint(20) UNSIGNED DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `ambulances_vehicle_number_unique` (`vehicle_number`),
        KEY `ambulances_driver_id_foreign` (`driver_id`),
        CONSTRAINT `ambulances_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create bookings table
    echo "Creating bookings table...\n";
    $pdo->exec("CREATE TABLE `bookings` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `user_id` bigint(20) UNSIGNED NOT NULL,
        `driver_id` bigint(20) UNSIGNED DEFAULT NULL,
        `ambulance_id` bigint(20) UNSIGNED DEFAULT NULL,
        `pickup_location` varchar(255) NOT NULL,
        `destination` varchar(255) NOT NULL,
        `pickup_time` datetime NOT NULL,
        `status` enum('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
        `notes` text,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `bookings_user_id_foreign` (`user_id`),
        KEY `bookings_driver_id_foreign` (`driver_id`),
        KEY `bookings_ambulance_id_foreign` (`ambulance_id`),
        CONSTRAINT `bookings_ambulance_id_foreign` FOREIGN KEY (`ambulance_id`) REFERENCES `ambulances` (`id`) ON DELETE SET NULL,
        CONSTRAINT `bookings_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE SET NULL,
        CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create payments table
    echo "Creating payments table...\n";
    $pdo->exec("CREATE TABLE `payments` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `booking_id` bigint(20) UNSIGNED NOT NULL,
        `amount` decimal(10,2) NOT NULL,
        `method` enum('gopay','credit_card','bank_transfer','cash') NOT NULL,
        `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
        `transaction_id` varchar(100) DEFAULT NULL,
        `payment_details` text,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `payments_booking_id_foreign` (`booking_id`),
        CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create ratings table
    echo "Creating ratings table...\n";
    $pdo->exec("CREATE TABLE `ratings` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `booking_id` bigint(20) UNSIGNED NOT NULL,
        `user_id` bigint(20) UNSIGNED NOT NULL,
        `driver_id` bigint(20) UNSIGNED NOT NULL,
        `rating` decimal(3,2) NOT NULL,
        `comment` text,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `ratings_booking_id_foreign` (`booking_id`),
        KEY `ratings_user_id_foreign` (`user_id`),
        KEY `ratings_driver_id_foreign` (`driver_id`),
        CONSTRAINT `ratings_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
        CONSTRAINT `ratings_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE CASCADE,
        CONSTRAINT `ratings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create maintenance table
    echo "Creating maintenance table...\n";
    $pdo->exec("CREATE TABLE `maintenance` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `ambulance_id` bigint(20) UNSIGNED NOT NULL,
        `maintenance_date` date NOT NULL,
        `description` text NOT NULL,
        `status` enum('scheduled','in_progress','completed') DEFAULT 'scheduled',
        `cost` decimal(10,2) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `maintenance_ambulance_id_foreign` (`ambulance_id`),
        CONSTRAINT `maintenance_ambulance_id_foreign` FOREIGN KEY (`ambulance_id`) REFERENCES `ambulances` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Create session and caches tables (required by Laravel)
    echo "Creating Laravel system tables...\n";
    $pdo->exec("CREATE TABLE `cache` (
        `key` VARCHAR(255) NOT NULL,
        `value` MEDIUMTEXT NOT NULL,
        `expiration` INT NOT NULL,
        PRIMARY KEY (`key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    $pdo->exec("CREATE TABLE `jobs` (
        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        `queue` varchar(255) NOT NULL,
        `payload` longtext NOT NULL,
        `attempts` tinyint(3) UNSIGNED NOT NULL,
        `reserved_at` int(10) UNSIGNED DEFAULT NULL,
        `available_at` int(10) UNSIGNED NOT NULL,
        `created_at` int(10) UNSIGNED NOT NULL,
        PRIMARY KEY (`id`),
        KEY `jobs_queue_index` (`queue`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Insert seed data - Admin account
    echo "Adding admin user...\n";
    $hashedPassword = password_hash('password123', PASSWORD_DEFAULT);
    $now = date('Y-m-d H:i:s');
    $pdo->exec("INSERT INTO `admins` 
        (`name`, `email`, `phone`, `password`, `created_at`, `updated_at`) 
        VALUES 
        ('Admin Utama', 'admin@ambulance-portal.com', '081122334455', '{$hashedPassword}', '{$now}', '{$now}')");
    
    echo "\nDatabase setup completed successfully!\n";
    echo "You can now login as admin with:\n";
    echo "Email: admin@ambulance-portal.com\n";
    echo "Password: password123\n";
    
} catch (PDOException $e) {
    die("Database Error: " . $e->getMessage() . "\n");
}
