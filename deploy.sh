#!/bin/bash

# Ambulance Portal Deployment Script
# This script automates the deployment process for the Ambulance Portal application
# on a VPS with IP 18.136.126.65

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

# Step 1: Update system packages
print_message "Step 1: Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Step 2: Install required packages
print_message "Step 2: Installing required packages..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    unzip \
    openssl

# Step 3: Install Docker if not already installed
print_message "Step 3: Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_success "Docker installed successfully"
else
    print_warning "Docker is already installed"
fi

# Step 4: Install Docker Compose if not already installed
print_message "Step 4: Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_warning "Docker Compose is already installed"
fi

# Step 5: Create SSL certificates directory
print_message "Step 5: Creating SSL certificates directory..."
mkdir -p ./nginx/ssl

# Step 6: Generate self-signed SSL certificate (or use Let's Encrypt)
print_message "Step 6: Generating SSL certificates..."
if [ ! -f ./nginx/ssl/ambulance-portal.crt ]; then
    # Generate self-signed certificate
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./nginx/ssl/ambulance-portal.key \
        -out ./nginx/ssl/ambulance-portal.crt \
        -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Ambulance Portal/OU=IT/CN=18.136.126.65"
    
    print_success "Self-signed SSL certificate generated"
    print_warning "For production, consider using Let's Encrypt for a valid SSL certificate"
else
    print_warning "SSL certificate already exists"
fi

# Step 7: Create necessary directories
print_message "Step 7: Creating necessary directories..."
mkdir -p ./nginx/logs
mkdir -p ./mysql/backup
mkdir -p ./mysql/init

# Step 8: Set proper permissions
print_message "Step 8: Setting proper permissions..."
chmod +x ./wait-for-db.sh

# Step 9: Create .env file from example if it doesn't exist
print_message "Step 9: Creating .env file..."
if [ ! -f ./.env ]; then
    cp ./.env.example ./.env
    
    # Generate Laravel application key
    APP_KEY=$(openssl rand -base64 32)
    # Replace APP_KEY in .env file
    sed -i "s/APP_KEY=/APP_KEY=base64:$APP_KEY/" ./.env
    
    print_success ".env file created with a new APP_KEY"
else
    print_warning ".env file already exists"
fi

# Step 10: Pull/Build Docker images
print_message "Step 10: Building Docker images..."
docker-compose build --no-cache

# Step 11: Start the application
print_message "Step 11: Starting the application..."
docker-compose down
docker-compose up -d

# Step 12: Check if all containers are running
print_message "Step 12: Checking container status..."
sleep 10
if docker-compose ps | grep -q "Exit"; then
    print_error "Some containers failed to start. Please check the logs."
    docker-compose logs
    exit 1
else
    print_success "All containers are running!"
fi

# Step 13: Setup database backup cron job
print_message "Step 13: Setting up database backup cron job..."
cat > /tmp/db-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backup"
DATETIME=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="ambulance_portal_$DATETIME.sql"

# Create backup
docker exec ambulance_db mysqldump -u root -ppassword ambulance_portal > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Remove backups older than 7 days
find "$BACKUP_DIR" -name "ambulance_portal_*.sql.gz" -type f -mtime +7 -delete
EOF

chmod +x /tmp/db-backup.sh
mv /tmp/db-backup.sh /usr/local/bin/db-backup.sh

# Add cron job for daily backup at 2 AM
if ! crontab -l | grep -q "db-backup.sh"; then
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/db-backup.sh") | crontab -
    print_success "Database backup cron job added"
else
    print_warning "Database backup cron job already exists"
fi

# Step 14: Display application information
print_message "Step 14: Displaying application information..."
echo -e "\n${GREEN}=== Ambulance Portal Deployment Complete ===${NC}"
echo -e "\n${BLUE}Application URLs:${NC}"
echo -e "HTTP: http://18.136.126.65 (redirects to HTTPS)"
echo -e "HTTPS: https://18.136.126.65"
echo -e "\n${BLUE}Database Information:${NC}"
echo -e "Host: 127.0.0.1"
echo -e "Port: 3306"
echo -e "Database: ambulance_portal"
echo -e "Username: laravel_user"
echo -e "Password: Check your .env file"

echo -e "\n${BLUE}Useful Commands:${NC}"
echo -e "View logs: docker-compose logs -f"
echo -e "Restart services: docker-compose restart"
echo -e "Stop application: docker-compose down"
echo -e "Start application: docker-compose up -d"

print_success "Deployment completed successfully!"