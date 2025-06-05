import React, { createContext, useContext, useState } from 'react';
import NotificationToast from '@/Components/NotificationToast';

// Create the notification context
export const NotificationContext = createContext();

// Create a custom hook to use the notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    return context;
};

// Create the notification provider component
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    // Function to show a notification
    const showNotification = ({ type = 'info', title, message, duration = 5000, playSound = true }) => {
        const id = Date.now().toString();

        setNotifications(prev => [...prev, { id, type, title, message, duration, playSound }]);

        return id;
    };

    // Shorthand functions for different notification types
    const success = (title, message, options = {}) =>
        showNotification({ type: 'success', title, message, ...options });

    const error = (title, message, options = {}) =>
        showNotification({ type: 'error', title, message, ...options });

    const warning = (title, message, options = {}) =>
        showNotification({ type: 'warning', title, message, ...options });

    const info = (title, message, options = {}) =>
        showNotification({ type: 'info', title, message, ...options });

    // Function to dismiss a notification
    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    // Value to be provided by the context
    const contextValue = {
        showNotification,
        success,
        error,
        warning,
        info,
        dismissNotification
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}

            {/* Render notifications */}
            <div className="notification-container">
                {notifications.map(notification => (
                    <NotificationToast
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        message={notification.message}
                        show={true}
                        onClose={() => dismissNotification(notification.id)}
                        duration={notification.duration}
                        playSound={notification.playSound}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
}
