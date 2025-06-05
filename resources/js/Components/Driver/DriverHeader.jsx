import React, { Fragment, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Transition, Menu } from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useToast } from '@/Hooks/useToast';

export default function DriverHeader({ driver, setSidebarOpen, title, notifications = [], unreadCount = 0 }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    
    // Use centralized notifications system
    const { 
        notifications: globalNotifications, 
        unreadCount: globalUnreadCount, 
        fetchNotifications, 
        markAsRead 
    } = useToast();

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications('driver');
    }, []);

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

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'booking_created':
            case 'booking_assigned':
            case 'booking_updated':
                return 'bg-blue-100 text-blue-600';
            case 'maintenance':
            case 'schedule_change':
                return 'bg-orange-100 text-orange-600';
            case 'emergency':
            case 'emergency_booking':
                return 'bg-red-100 text-red-600';
            case 'payment_complete':
            case 'payment_confirmed':
                return 'bg-green-100 text-green-600';
            case 'payment_reminder':
            case 'payment_expired':
                return 'bg-amber-100 text-amber-600';
            case 'system':
                return 'bg-purple-100 text-purple-600';
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
            markAsRead(id, 'driver');
            setNotificationsOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    {/* Left: Hamburger menu and title (mobile) */}
                    <div className="flex">
                        <button
                            type="button"
                            className="text-slate-500 hover:text-slate-600 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="ml-4 lg:ml-0 flex items-center">
                            <h1 className="text-lg md:text-xl font-medium text-slate-800">
                                {title || 'Dashboard Driver'}
                            </h1>
                        </div>
                    </div>

                    {/* Right: Search, Notifications, Profile */}
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            {searchOpen ? (
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 text-slate-400 hover:text-slate-500 focus:outline-none"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </button>
                            )}
                            <Transition
                                show={searchOpen}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-10 origin-top-right">
                                    <div className="p-4">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Cari..."
                                                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                            <button
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setSearchOpen(false)}
                                            >
                                                <XMarkIcon className="h-5 w-5 text-slate-400 hover:text-slate-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                type="button"
                                className="p-2 text-slate-400 hover:text-slate-500 focus:outline-none relative"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                            >
                                <span className="sr-only">Lihat notifikasi</span>
                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                {globalUnreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {globalUnreadCount > 9 ? '9+' : globalUnreadCount}
                                    </span>
                                )}
                            </button>

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
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 origin-top-right">
                                    <div className="py-2 px-4 border-b border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-medium text-gray-900">Notifikasi</h3>
                                            {globalUnreadCount > 0 && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {globalUnreadCount} baru
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="max-h-60 overflow-y-auto">
                                        {globalNotifications.length === 0 ? (
                                            <div className="py-4 px-4 text-center text-sm text-gray-500">
                                                Tidak ada notifikasi
                                            </div>
                                        ) : (
                                            <div>
                                                {globalNotifications.map((notification) => {
                                                    const notifData = parseNotificationData(notification);
                                                    return (
                                                        <button
                                                            key={notification.id}
                                                            className={`w-full text-left block px-4 py-3 hover:bg-gray-50 ${
                                                                !notification.read ? 'bg-blue-50' : ''
                                                            }`}
                                                            onClick={() => handleNotificationClick(notification.id)}
                                                        >
                                                            <div className="flex items-start">
                                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getNotificationIcon(notification.type)} flex items-center justify-center`}>
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                </div>
                                                                <div className="ml-3 flex-1">
                                                                    <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
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
                                    
                                    <div className="py-2 px-4 border-t border-gray-100 text-center">
                                        <Link
                                            href="/driver/notifications"
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
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white overflow-hidden">
                                        {driver?.profile_photo_url ? (
                                            <img src={driver.profile_photo_url} alt={driver.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-medium">{driver?.name?.charAt(0).toUpperCase() || 'D'}</span>
                                        )}
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
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/driver/profile"
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
                                                href="/driver/settings"
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
