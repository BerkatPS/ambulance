import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import { Transition, Popover, Menu } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { BellIcon, CheckCircleIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useToast } from '@/Hooks/useToast';
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import axios from 'axios';

export default function UserHeader({ user, setSidebarOpen, notifications = [] }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { success, error } = useToast();

    // Load notifications from localStorage and props
    useEffect(() => {
        try {
            // Load from localStorage for consistent data across page navigation
            const savedNotifications = localStorage.getItem('userNotifications');
            if (savedNotifications) {
                const parsedNotifications = JSON.parse(savedNotifications);
                // Filter out old notifications (older than 24 hours)
                const recentNotifications = parsedNotifications.filter(notification => {
                    const notifTime = new Date(notification.created_at || Date.now());
                    const currentTime = new Date();
                    const hoursDiff = (currentTime - notifTime) / (1000 * 60 * 60);
                    return hoursDiff < 24;
                });
                
                // Combine with server-provided notifications if available
                if (notifications && notifications.length > 0) {
                    // Create a map of existing notification IDs
                    const existingIds = new Set(recentNotifications.map(n => n.id));
                    
                    // Add server notifications that aren't already in localStorage
                    notifications.forEach(notification => {
                        if (!existingIds.has(notification.id)) {
                            recentNotifications.push(notification);
                        }
                    });
                    
                    // Sort by created_at (newest first)
                    recentNotifications.sort((a, b) => {
                        const dateA = new Date(a.created_at || 0);
                        const dateB = new Date(b.created_at || 0);
                        return dateB - dateA;
                    });
                    
                    // Update localStorage with the combined list
                    localStorage.setItem('userNotifications', JSON.stringify(recentNotifications));
                }
                
                setLocalNotifications(recentNotifications);
                
                // Calculate unread count
                const unread = recentNotifications.filter(n => !n.read_at).length;
                setUnreadCount(unread);
            } else if (notifications && notifications.length > 0) {
                // If no localStorage data but server provided notifications
                setLocalNotifications(notifications);
                const unread = notifications.filter(n => !n.read_at).length;
                setUnreadCount(unread);
                
                // Save to localStorage
                localStorage.setItem('userNotifications', JSON.stringify(notifications));
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }, [notifications]);

    // Listen for window storage events to sync notifications across tabs
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'userNotifications') {
                try {
                    const updatedNotifications = JSON.parse(event.newValue || '[]');
                    setLocalNotifications(updatedNotifications);
                    const unread = updatedNotifications.filter(n => !n.read_at).length;
                    setUnreadCount(unread);
                } catch (error) {
                    console.error('Error parsing notifications from storage event:', error);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (id) => {
        try {
            // Update locally first for immediate UI feedback
            setLocalNotifications(prev => {
                const updated = prev.map(notification => {
                    if (notification.id === id && !notification.read_at) {
                        return { ...notification, read_at: new Date().toISOString() };
                    }
                    return notification;
                });
                
                // Update localStorage
                localStorage.setItem('userNotifications', JSON.stringify(updated));
                
                // Calculate new unread count
                const unread = updated.filter(n => !n.read_at).length;
                setUnreadCount(unread);
                
                return updated;
            });
            
            // Then update on server
            await axios.post(route('user.notifications.mark-read', id));
        } catch (err) {
            console.error('Error marking notification as read:', err);
            error('Gagal menandai notifikasi sebagai telah dibaca');
        }
    }, [error]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            // Update locally first
            setLocalNotifications(prev => {
                const currentTime = new Date().toISOString();
                const updated = prev.map(notification => {
                    if (!notification.read_at) {
                        return { ...notification, read_at: currentTime };
                    }
                    return notification;
                });
                
                // Update localStorage
                localStorage.setItem('userNotifications', JSON.stringify(updated));
                
                // Set unread count to 0
                setUnreadCount(0);
                
                return updated;
            });
            
            // Then update on server
            await axios.post(route('user.notifications.mark-all-read'));
            success('Semua notifikasi telah dibaca');
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            error('Gagal menandai semua notifikasi sebagai telah dibaca');
        }
    }, [success, error]);

    // Delete notification
    const deleteNotification = useCallback(async (id) => {
        try {
            // Update locally first
            setLocalNotifications(prev => {
                const updated = prev.filter(notification => notification.id !== id);
                
                // Update localStorage
                localStorage.setItem('userNotifications', JSON.stringify(updated));
                
                // Recalculate unread count
                const unread = updated.filter(n => !n.read_at).length;
                setUnreadCount(unread);
                
                return updated;
            });
            
            // Then delete on server
            await axios.delete(route('user.notifications.destroy', id));
        } catch (err) {
            console.error('Error deleting notification:', err);
            error('Gagal menghapus notifikasi');
        }
    }, [error]);

    const formatNotificationDate = (date) => {
        if (!date) return '';

        const notificationDate = new Date(date);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - notificationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Hari ini';
        } else if (diffDays === 1) {
            return 'Kemarin';
        } else {
            return notificationDate.toLocaleDateString('id-ID');
        }
    };

    const formatNotificationTime = (date) => {
        if (!date) return '';
        const notificationDate = new Date(date);
        return notificationDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    // Get notification icon class based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'booking_created':
            case 'booking_confirmed':
            case 'booking_updated':
                return 'bg-blue-100 text-blue-600';
            case 'driver_assigned':
            case 'driver_arrived':
                return 'bg-purple-100 text-purple-600';
            case 'emergency':
                return 'bg-red-100 text-red-600';
            case 'payment_reminder':
            case 'payment_successful':
                return 'bg-green-100 text-green-600';
            case 'rating_reminder':
                return 'bg-yellow-100 text-yellow-600';
            case 'system':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    // Parse notification data (for handling both object and string JSON formats)
    const parseNotificationData = (notification) => {
        let data = notification.data;

        // Handle string data (JSON)
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse notification data', e);
            }
        }

        return data;
    };

    // Mark a notification as read when clicked
    const handleNotificationClick = (id) => {
        if (id) {
            markAsRead(id);
            setNotificationsOpen(false);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Mobile menu button */}
                        <div className="-ml-2 mr-2 flex items-center lg:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>

                    </div>

                    <div className="flex items-center">
                        {/* Search */}
                        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                            <div className="max-w-lg w-full lg:max-w-xs">
                                <label htmlFor="search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="search"
                                        name="search"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="Cari..."
                                        type="search"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notifications dropdown */}
                        <div className="ml-4 flex items-center">
                            <button
                                type="button"
                                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                            >
                                <span className="sr-only">View notifications</span>
                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications panel */}
                            <Transition
                                show={notificationsOpen}
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" style={{ top: "64px" }}>
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Notifikasi</h3>
                                            {unreadCount > 0 && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {unreadCount} baru
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-60 overflow-y-auto">
                                        {localNotifications.length === 0 ? (
                                            <div className="px-4 py-6 text-sm text-gray-500 text-center">
                                                Tidak ada notifikasi
                                            </div>
                                        ) : (
                                            <div>
                                                {localNotifications.map((notification) => {
                                                    const notifData = parseNotificationData(notification);
                                                    return (
                                                        <button
                                                            key={notification.id}
                                                            className={`w-full text-left block px-4 py-3 hover:bg-gray-50 ${
                                                                !notification.read_at ? 'bg-blue-50' : ''
                                                            }`}
                                                            onClick={() => handleNotificationClick(notification.id)}
                                                        >
                                                            <div className="flex items-start">
                                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getNotificationIcon(notification.type)} flex items-center justify-center`}>
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                </div>
                                                                <div className="ml-3 flex-1">
                                                                    <p className={`text-sm ${!notification.read_at ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                                                        {notification.title || notifData?.title || 'Notifikasi Baru'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {notification.message || notifData?.message || 'Anda memiliki notifikasi baru'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {formatNotificationDate(notification.created_at)} {formatNotificationTime(notification.created_at)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                                        <Link
                                            href="/user/notifications"
                                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                                            onClick={() => setNotificationsOpen(false)}
                                        >
                                            Lihat semua notifikasi
                                        </Link>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        {/* Profile dropdown */}
                        <Menu as="div" className="ml-4 relative flex-shrink-0">
                            <div>
                                <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/user/profile"
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } block px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <div className="flex items-center">
                                                    <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                    Profil
                                                </div>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/user/settings"
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } block px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <div className="flex items-center">
                                                    <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                    Pengaturan
                                                </div>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <div className="flex items-center">
                                                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                    Keluar
                                                </div>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
}
