#!/bin/bash
# Script to download authentic ambulance siren sounds for the ambulance-portal application

# Create the directory if it doesn't exist
mkdir -p /Users/berkatsaragih/PhpstormProjects/ambulance-portal/public/sounds

# Download a variety of ambulance siren sounds
echo "Downloading authentic ambulance siren sounds..."

# Primary ambulance siren (European style)
curl -L "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" -o /Users/berkatsaragih/PhpstormProjects/ambulance-portal/public/sounds/ambulance-siren-eu.mp3

# US style ambulance siren 
curl -L "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3" -o /Users/berkatsaragih/PhpstormProjects/ambulance-portal/public/sounds/ambulance-siren-us.mp3

# Short emergency beep sound for notifications
curl -L "https://assets.mixkit.co/active_storage/sfx/1310/1310-preview.mp3" -o /Users/berkatsaragih/PhpstormProjects/ambulance-portal/public/sounds/emergency-alert.mp3

# Download a notification sound for general app alerts
curl -L "https://assets.mixkit.co/active_storage/sfx/922/922-preview.mp3" -o /Users/berkatsaragih/PhpstormProjects/ambulance-portal/public/sounds/notification.mp3

echo "All ambulance sounds have been downloaded successfully!"
echo "Available sounds:"
echo "- ambulance-siren-eu.mp3 (European style ambulance)"
echo "- ambulance-siren-us.mp3 (US style ambulance)"
echo "- emergency-alert.mp3 (Short emergency beep)"
echo "- notification.mp3 (General notification sound)"
