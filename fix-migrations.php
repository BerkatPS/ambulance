<?php

// Direct database connection script to fix migration issues
// This bypasses Laravel's URL generator issues

// Get database configuration from .env
$env = parse_ini_file('.env');

// Database connection parameters
$host = $env['DB_HOST'] ?? 'localhost';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? 'laravel';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

try {
    // Connect to database
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database`");
    $pdo->exec("USE `$database`");
    
    // Drop existing tables for fresh migration
    echo "Dropping existing tables...\n";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
    foreach ($tables as $table) {
        $pdo->exec("DROP TABLE `$table`");
        echo "Dropped table: $table\n";
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
    
    // Create tables needed for the application
    echo "Creating new tables...\n";
    
    // Users table
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
    echo "Created users table\n";
    
    // Admins table
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
    echo "Created admins table\n";
    
    // Insert sample admin
    $hashedPassword = password_hash('password123', PASSWORD_DEFAULT);
    $now = date('Y-m-d H:i:s');
    $pdo->exec("INSERT INTO `admins` (
        `name`, `email`, `phone`, `password`, `created_at`, `updated_at`
    ) VALUES (
        'Admin Utama', 'admin@ambulance-portal.com', '081122334455', 
        '$hashedPassword', '$now', '$now'
    )");
    echo "Added sample admin user\n";
    
    // Add more tables as needed
    
    echo "Migration completed successfully!\n";
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage() . "\n");
}
