import React from 'react';
import { useNotification } from '@/Contexts/NotificationContext';
import { BellIcon } from '@heroicons/react/24/outline';

export default function TestNotificationButton({ className = '' }) {
    const notification = useNotification();
    
    const handleTestNotification = () => {
        notification.success(
            'Test Notification', 
            'This is a test notification with sound effect.', 
            { playSound: true }
        );
    };
    
    return (
        <button
            onClick={handleTestNotification}
            className={`inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${className}`}
        >
            <BellIcon className="w-5 h-5 mr-2" />
            Test Notification
        </button>
    );
}
