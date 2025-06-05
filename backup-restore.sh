#!/bin/bash

# Database Backup and Restore Script for Ambulance Portal
# This script helps manage database backups and restoration

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

# Create backup directory if it doesn't exist
mkdir -p ./mysql/backup

# Function to create a database backup
create_backup() {
    print_message "Creating database backup..."
    
    # Get current date and time for the backup filename
    DATETIME=$(date +"%Y%m%d-%H%M%S")
    BACKUP_FILE="ambulance_portal_$DATETIME.sql"
    
    # Create the backup
    docker exec ambulance_db mysqldump -u root -p${MYSQL_ROOT_PASSWORD:-password} ambulance_portal > "./mysql/backup/$BACKUP_FILE"
    
    # Compress the backup
    gzip "./mysql/backup/$BACKUP_FILE"
    
    print_success "Backup created: ./mysql/backup/$BACKUP_FILE.gz"
}

# Function to list available backups
list_backups() {
    print_message "Available backups:"
    
    # Check if there are any backups
    if [ -z "$(ls -A ./mysql/backup 2>/dev/null)" ]; then
        print_warning "No backups found"
        return
    fi
    
    # List backups with numbers
    ls -lt ./mysql/backup | grep -v "^total" | awk '{print $9}' | grep -v "^$" | nl -w2 -s". "
}

# Function to restore a database backup
restore_backup() {
    # List available backups
    list_backups
    
    # Check if there are any backups
    if [ -z "$(ls -A ./mysql/backup 2>/dev/null)" ]; then
        return
    fi
    
    # Ask user to select a backup
    echo -e "\nEnter the number of the backup to restore (or 0 to cancel): "
    read -r selection
    
    # Cancel if user selects 0
    if [ "$selection" -eq 0 ]; then
        print_message "Restore cancelled"
        return
    fi
    
    # Get the selected backup file
    BACKUP_FILE=$(ls -lt ./mysql/backup | grep -v "^total" | awk '{print $9}' | grep -v "^$" | sed -n "${selection}p")
    
    # Check if the backup file exists
    if [ -z "$BACKUP_FILE" ]; then
        print_error "Invalid selection"
        return
    fi
    
    print_message "Restoring from backup: $BACKUP_FILE"
    
    # Confirm restoration
    echo -e "${YELLOW}WARNING: This will overwrite the current database. Are you sure? (y/n)${NC}"
    read -r confirm
    
    if [ "$confirm" != "y" ]; then
        print_message "Restore cancelled"
        return
    fi
    
    # Decompress if the backup is compressed
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        print_message "Decompressing backup..."
        gunzip -c "./mysql/backup/$BACKUP_FILE" > "./mysql/backup/temp_restore.sql"
        RESTORE_FILE="./mysql/backup/temp_restore.sql"
    else
        RESTORE_FILE="./mysql/backup/$BACKUP_FILE"
    fi
    
    # Restore the database
    print_message "Restoring database..."
    cat "$RESTORE_FILE" | docker exec -i ambulance_db mysql -u root -p${MYSQL_ROOT_PASSWORD:-password} ambulance_portal
    
    # Clean up temporary file if it was created
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        rm "$RESTORE_FILE"
    fi
    
    print_success "Database restored successfully"
}

# Function to clean up old backups
cleanup_backups() {
    print_message "Cleaning up old backups..."
    
    echo -e "Enter the number of days to keep backups (older backups will be deleted): "
    read -r days
    
    if ! [[ "$days" =~ ^[0-9]+$ ]]; then
        print_error "Invalid input. Please enter a number."
        return
    fi
    
    # Confirm cleanup
    echo -e "${YELLOW}WARNING: This will delete backups older than $days days. Are you sure? (y/n)${NC}"
    read -r confirm
    
    if [ "$confirm" != "y" ]; then
        print_message "Cleanup cancelled"
        return
    fi
    
    # Delete old backups
    find "./mysql/backup" -name "ambulance_portal_*.sql*" -type f -mtime +"$days" -delete
    
    print_success "Old backups cleaned up"
}

# Main menu
while true; do
    echo -e "\n${GREEN}=== Database Backup and Restore for Ambulance Portal ===${NC}\n"
    echo "1. Create a new backup"
    echo "2. List available backups"
    echo "3. Restore from backup"
    echo "4. Clean up old backups"
    echo "5. Exit"
    echo -e "\nPlease select an option (1-5): "
    read -r option
    
    case $option in
        1)
            create_backup
            ;;
        2)
            list_backups
            ;;
        3)
            restore_backup
            ;;
        4)
            cleanup_backups
            ;;
        5)
            print_message "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option selected"
            ;;
    esac
    
    echo -e "\nPress Enter to continue..."
    read -r
done