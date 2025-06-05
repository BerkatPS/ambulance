#!/bin/bash

# Make sure we're in the project directory
cd "$(dirname "$0")"

# Create a backup of the original .env file
cp .env .env.backup

# Update the broadcast driver to pusher
sed -i '' 's/BROADCAST_DRIVER=log/BROADCAST_DRIVER=pusher/g' .env

echo "Environment file updated successfully. A backup was created at .env.backup"
echo "The BROADCAST_DRIVER has been changed from 'log' to 'pusher'"
