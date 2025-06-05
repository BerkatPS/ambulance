import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Echo from 'laravel-echo';
import NotificationToast from '@/Components/NotificationToast';

export function useToast() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load notifications from localStorage on component mount
    useEffect(() => {
        const storedNotifications = localStorage.getItem('app_notifications');
        if (storedNotifications) {
            try {
                const parsedNotifications = JSON.parse(storedNotifications);
                setNotifications(parsedNotifications);
                setUnreadCount(parsedNotifications.filter(n => !n.read).length);
            } catch (error) {
                console.error('Error parsing stored notifications:', error);
            }
        }
        
        // Set up real-time notification listener
        setupNotificationListener();
        
        return () => {
            // Clean up event listeners when component unmounts
            if (window.Echo) {
                window.Echo.leave('notifications');
            }
        };
    }, []);
    
    // Set up Laravel Echo for real-time notifications
    const setupNotificationListener = () => {
        // Make sure we don't initialize Echo multiple times
        if (!window.Echo && window.Pusher) {
            try {
                window.Echo = new Echo({
                    broadcaster: 'pusher',
                    key: '02b73a24f2e637f86d74', // Using the key from .env
                    cluster: 'ap1', // Using the cluster from .env
                    forceTLS: true
                });
                
                // Get user ID from the page
                const userId = window.userId || document.querySelector('meta[name="user-id"]')?.content;
                
                if (userId) {
                    // Listen for user notifications
                    window.Echo.private(`user.notifications.${userId}`)
                        .listen('NotificationSent', (e) => {
                            console.log('New notification received:', e);
                            addNotification(e.notification);
                        });
                        
                    // Optionally also listen for admin notifications
                    if (window.userRole === 'admin') {
                        window.Echo.private(`admin.notifications.${userId}`)
                            .listen('NotificationSent', (e) => {
                                addNotification(e.notification);
                            });
                    }
                    
                    // Optionally also listen for driver notifications
                    if (window.userRole === 'driver') {
                        window.Echo.private(`driver.notifications.${userId}`)
                            .listen('NotificationSent', (e) => {
                                addNotification(e.notification);
                            });
                    }
                }
            } catch (error) {
                console.error('Error setting up Echo:', error);
            }
        }
    };

    // Function to fetch notifications from the server
    const fetchNotifications = async (userType = 'user') => {
        try {
            let endpoint;
            
            // Determine the correct endpoint based on user type
            if (userType === 'admin') {
                endpoint = '/admin/notifications';
            } else if (userType === 'driver') {
                endpoint = '/driver/notifications';
            } else {
                endpoint = '/user/notifications';
            }
            
            const response = await axios.get(endpoint);
            
            if (response.data && response.data.notifications) {
                // Store notifications in localStorage
                localStorage.setItem('app_notifications', JSON.stringify(response.data.notifications));
                
                // Update state
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.notifications.filter(n => !n.read).length);
                
                return response.data.notifications;
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    };

    // Function to mark notification as read
    const markAsRead = async (id, userType = 'user') => {
        try {
            let endpoint;
            
            // Determine the correct endpoint based on user type
            if (userType === 'admin') {
                endpoint = `/admin/notifications/${id}/read`;
            } else if (userType === 'driver') {
                endpoint = `/driver/notifications/${id}/read`;
            } else {
                endpoint = `/user/notifications/${id}/read`;
            }
            
            await axios.post(endpoint);
            
            // Update local storage and state
            const updatedNotifications = notifications.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            );
            
            localStorage.setItem('app_notifications', JSON.stringify(updatedNotifications));
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Function to add a new notification (mostly for client-side generated notifications)
    const addNotification = (notification) => {
        const updatedNotifications = [notification, ...notifications];
        localStorage.setItem('app_notifications', JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(n => !n.read).length);
        
        // Show a toast for the new notification
        showToast({
            title: notification.title || 'Notifikasi Baru',
            message: notification.message || notification.data?.message || 'Anda memiliki notifikasi baru',
            type: notification.type || 'info'
        });
    };

    // Enhanced toast function using NotificationToast component
    const showToast = ({ title, message, type = 'default', duration = 5000, actions = [], referenceId = null, actionText = null, actionUrl = null }) => {
        return toast.custom(
            (t) => (
                <NotificationToast
                    type={type}
                    title={title}
                    message={message}
                    show={t.visible}
                    closeToast={() => toast.dismiss(t.id)}
                    autoClose={true}
                    duration={duration}
                    playSound={true}
                    actionText={actionText}
                    actionUrl={actionUrl}
                    referenceId={referenceId}
                />
            ),
            { duration }
        );
    };
    
    // Success toast shorthand
    const success = (message, title = 'Berhasil', options = {}) => {
        return showToast({
            type: 'success',
            title,
            message,
            ...options
        });
    };
    
    // Error toast shorthand
    const error = (message, title = 'Error', options = {}) => {
        return showToast({
            type: 'error',
            title,
            message,
            ...options
        });
    };
    
    // Warning toast shorthand
    const warning = (message, title = 'Peringatan', options = {}) => {
        return showToast({
            type: 'warning',
            title,
            message,
            ...options
        });
    };
    
    // Info toast shorthand
    const info = (message, title = 'Informasi', options = {}) => {
        return showToast({
            type: 'info',
            title,
            message,
            ...options
        });
    };

    return {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        addNotification,
        showToast,
        success,
        error,
        warning,
        info,
        // For compatibility with older code using toast.success etc.
        toast: {
            success,
            error,
            warning,
            info,
            custom: showToast
        }
    };
}
