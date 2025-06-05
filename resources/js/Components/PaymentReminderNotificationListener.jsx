import React, { useEffect, useState } from 'react';
import { useToast } from '@/Hooks/useToast';

export default function PaymentReminderNotificationListener({ user, booking }) {
    const { showToast } = useToast();
    const [notificationsReceived, setNotificationsReceived] = useState(0);
    
    useEffect(() => {
        // Only setup listener if we have a valid booking that needs payment
        if (!booking || !booking.isEmergencyPaymentDue || !user) {
            return;
        }
        
        // Subscribe to the private user channel for real-time notifications
        const channel = window.Echo.private(`App.Models.User.${user.id}`);
        
        // Listen for notification broadcasts
        channel.notification((notification) => {
            // Only process payment reminder notifications related to this booking
            if (notification.type === 'App\\Notifications\\PaymentReminderNotification' && 
                notification.booking_id === booking.id &&
                notification.is_realtime_reminder) {
                
                // Show a toast notification
                showToast({
                    title: 'Pengingat Pembayaran Darurat',
                    message: 'Anda memiliki tagihan pembayaran untuk layanan ambulans darurat yang menunggu pembayaran.',
                    type: 'warning',
                    duration: 10000, // Show for 10 seconds
                    actions: [
                        {
                            label: 'Bayar Sekarang',
                            onClick: () => {
                                window.location.href = notification.payment_url;
                            }
                        }
                    ]
                });
                
                // Play sound alert (optional)
                const audio = new Audio('/sounds/notification-alert.mp3');
                audio.play().catch(error => console.error('Failed to play notification sound:', error));
                
                // Update counter to track notifications received
                setNotificationsReceived(prev => prev + 1);
            }
        });
        
        // Cleanup subscription when component unmounts
        return () => {
            channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
        };
    }, [booking, user]);
    
    // This component doesn't render anything visually
    return null;
}
