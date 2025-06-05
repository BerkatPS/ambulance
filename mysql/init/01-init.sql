-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ambulance_portal;

-- Grant privileges to laravel_user
GRANT ALL PRIVILEGES ON ambulance_portal.* TO 'laravel_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;