import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Hooks/useToast';

/**
 * NotificationListener component that listens for real-time notifications
 * and handles new notification events for different user types
 * 
 * @param {Object} props Component props
 * @param {string} props.userType The type of user ('user', 'driver', or 'admin')
 * @param {string} props.channelName The channel name to listen to (optional - will be auto-generated if not provided)
 * @param {Object} props.user The authenticated user object
 * @param {Function} props.onNewNotification Optional callback when a new notification is received
 */
export default function NotificationListener({ userType, channelName, user, onNewNotification }) {
    const { success } = useToast();
    const [connectionStatus, setConnectionStatus] = useState('initializing');
    
    useEffect(() => {
        if (!window.Echo || !user) {
            console.warn('Echo or user not available for notifications');
            return;
        }
        
        // Create channel name in the correct format for Laravel's channel definition
        const userId = user.id;
        const formattedChannelName = channelName || `${userType}.notifications.${userId}`;
        
        console.log(`[${userType}] Subscribing to channel:`, formattedChannelName);
        
        let channel;
        
        try {
            // Set up private channel
            channel = window.Echo.private(formattedChannelName);
            
            // Monitor connection status
            channel.listen('.connection.established', () => {
                console.log(`[${userType}] Successfully connected to channel:`, formattedChannelName);
                setConnectionStatus('connected');
            });
            
            // Listen for notification events
            channel.listen('.notification.received', (event) => {
                console.log(`[${userType}] New notification received:`, event);
                
                try {
                    // Show toast notification
                    if (event.notification && event.notification.data) {
                        let data = event.notification.data;
                        
                        // Parse data if it's a string
                        if (typeof data === 'string') {
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                console.error(`[${userType}] Error parsing notification data:`, e);
                                data = { 
                                    title: 'Notifikasi Baru', 
                                    message: 'Anda menerima notifikasi baru' 
                                };
                            }
                        }
                        
                        // Set default values if data properties are missing
                        const title = data.title || 'Notifikasi Baru';
                        const message = data.message || data.content || 'Anda menerima notifikasi baru';
                        
                        success(title, {
                            description: message
                        });
                        
                        // If a callback is provided, call it
                        if (typeof onNewNotification === 'function') {
                            onNewNotification(event.notification);
                        }
                        
                        // Reload the notification list if we're on the notifications page
                        const currentPath = window.location.pathname;
                        if (currentPath.includes(`/${userType}/notifications`)) {
                            router.reload({ only: ['notifications', 'unreadCount'] });
                        }
                    }
                } catch (error) {
                    console.error(`[${userType}] Error handling notification:`, error);
                }
            });
            
            // Handle connection errors
            channel.error((error) => {
                console.error(`[${userType}] Channel error:`, error);
                setConnectionStatus('error');
            });
            
        } catch (error) {
            console.error(`[${userType}] Failed to initialize channel:`, error);
            setConnectionStatus('error');
        }
        
        // Cleanup function to remove event listeners when component unmounts
        return () => {
            if (channel) {
                try {
                    channel.stopListening('.notification.received');
                    window.Echo.leave(formattedChannelName);
                    console.log(`[${userType}] Unsubscribed from channel:`, formattedChannelName);
                } catch (error) {
                    console.error(`[${userType}] Error during cleanup:`, error);
                }
            }
        };
    }, [user, channelName, userType, onNewNotification]);
    
    // This component doesn't render anything visual
    return null;
}
