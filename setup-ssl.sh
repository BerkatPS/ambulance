#!/bin/bash

# SSL Certificate Setup Script for Ambulance Portal
# This script helps set up SSL certificates using Let's Encrypt

set -e

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${BLUE}[$(date +"%Y-%m-%d %H:%M:%S")]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date +"%Y-%m-%d %H:%M:%S")]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +"%Y-%m-%d %H:%M:%S")]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +"%Y-%m-%d %H:%M:%S")]${NC} $1"
}

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    print_error "This script must be run as root"
    exit 1
fi

# Set the working directory to the script's location
cd "$(dirname "$0")"

# Create SSL directory if it doesn't exist
mkdir -p ./nginx/ssl

# Function to generate self-signed certificate
generate_self_signed() {
    print_message "Generating self-signed SSL certificate..."
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./nginx/ssl/ambulance-portal.key \
        -out ./nginx/ssl/ambulance-portal.crt \
        -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Ambulance Portal/OU=IT/CN=18.136.126.65"
    
    print_success "Self-signed SSL certificate generated successfully"
    print_warning "This is a self-signed certificate and will show security warnings in browsers"
    print_warning "For production use, consider using Let's Encrypt for a valid SSL certificate"
}

# Function to set up Let's Encrypt certificate
setup_letsencrypt() {
    print_message "Setting up Let's Encrypt SSL certificate..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        print_message "Installing Certbot..."
        apt-get update
        apt-get install -y certbot
    fi
    
    # Stop Nginx if it's running to free up port 80
    if docker-compose ps | grep -q "webserver"; then
        print_message "Stopping Nginx temporarily..."
        docker-compose stop webserver
    fi
    
    # Get the certificate
    print_message "Obtaining SSL certificate from Let's Encrypt..."
    certbot certonly --standalone \
        --preferred-challenges http \
        --agree-tos \
        --email admin@example.com \
        -d 18.136.126.65
    
    # Copy certificates to Nginx SSL directory
    cp /etc/letsencrypt/live/18.136.126.65/fullchain.pem ./nginx/ssl/ambulance-portal.crt
    cp /etc/letsencrypt/live/18.136.126.65/privkey.pem ./nginx/ssl/ambulance-portal.key
    
    # Set up auto-renewal cron job
    if ! crontab -l | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/18.136.126.65/fullchain.pem /path/to/ambulance-portal/nginx/ssl/ambulance-portal.crt && cp /etc/letsencrypt/live/18.136.126.65/privkey.pem /path/to/ambulance-portal/nginx/ssl/ambulance-portal.key && docker-compose restart webserver") | crontab -
        print_success "Let's Encrypt auto-renewal cron job added"
    fi
    
    # Restart Nginx
    print_message "Restarting Nginx..."
    docker-compose start webserver
    
    print_success "Let's Encrypt SSL certificate set up successfully"
}

# Main menu
echo -e "\n${GREEN}=== SSL Certificate Setup for Ambulance Portal ===${NC}\n"
echo "1. Generate self-signed certificate (for development/testing)"
echo "2. Set up Let's Encrypt certificate (for production)"
echo -e "\nPlease select an option (1-2): "
read -r option

case $option in
    1)
        generate_self_signed
        ;;
    2)
        setup_letsencrypt
        ;;
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

print_success "SSL certificate setup completed!"
print_message "Restart the application with: docker-compose restart webserver"