import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { formatDateDisplay } from '@/Utils/dateHelpers';
import { useToast } from '@/Hooks/useToast';

// Admin menu items with routes
const adminMenuItems = [
    { name: 'Dashboard', url: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Ambulans', url: '/admin/ambulances', icon: 'ambulance' },
    { name: 'Pemeliharaan', url: '/admin/maintenance', icon: 'maintenance' },
    { name: 'Pengemudi', url: '/admin/drivers', icon: 'driver' },
    { name: 'Pemesanan', url: '/admin/bookings', icon: 'booking' },
    { name: 'Pembayaran', url: '/admin/payments', icon: 'payment' },
    { name: 'Penilaian', url: '/admin/ratings', icon: 'rating' },
    { name: 'Pengguna', url: '/admin/users', icon: 'user' },
    { name: 'Lokasi', url: '/admin/locations', icon: 'location' },
    { name: 'Notifikasi', url: '/admin/notifications', icon: 'notification' },
];

export default function AdminHeader({ setSidebarOpen, onMenuButtonClick, title, user, notifications: propNotifications = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    
    // Use the centralized notification system
    const { 
        notifications, 
        unreadCount, 
        fetchNotifications, 
        markAsRead 
    } = useToast();

    const searchRef = useRef(null);
    const searchButtonRef = useRef(null);
    const mobileSearchRef = useRef(null);

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications('admin');
    }, []);

    // Focus search input when search is opened
    useEffect(() => {
        if (showSearch && searchRef.current) {
            setTimeout(() => {
                searchRef.current.focus();
            }, 10);
        }
    }, [showSearch]);

    // Focus mobile search input when mobile search is opened
    useEffect(() => {
        if (searchOpen && mobileSearchRef.current) {
            setTimeout(() => {
                mobileSearchRef.current.focus();
            }, 10);
        }
    }, [searchOpen]);

    // Handle search
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const term = searchTerm.toLowerCase();
        const results = adminMenuItems.filter(item =>
            item.name.toLowerCase().includes(term)
        );
        setSearchResults(results);
    }, [searchTerm]);

    const handleSearchIconClick = () => {
        setShowSearch(true);
    };

    const handleMobileSearchIconClick = () => {
        setSearchOpen(true);
    };

    // Helper function to get notification icon based on type
    const getNotificationIcon = (type) => {
        const iconClass = "h-8 w-8 rounded-full p-1.5";

        switch (type) {
            case 'App\\Notifications\\BookingCreated':
            case 'App\\Notifications\\BookingUpdated':
            case 'App\\Notifications\\BookingCancelled':
                return <div className={`${iconClass} bg-blue-100 text-blue-600`}><i className="fa-solid fa-calendar"></i></div>;
            case 'App\\Notifications\\PaymentReceived':
            case 'App\\Notifications\\PaymentConfirmed':
                return <div className={`${iconClass} bg-green-100 text-green-600`}><i className="fa-solid fa-credit-card"></i></div>;
            case 'App\\Notifications\\DriverAssigned':
                return <div className={`${iconClass} bg-purple-100 text-purple-600`}><i className="fa-solid fa-user"></i></div>;
            case 'App\\Notifications\\SystemNotification':
                return <div className={`${iconClass} bg-yellow-100 text-yellow-600`}><i className="fa-solid fa-cog"></i></div>;
            case 'App\\Notifications\\EmergencyAlert':
                return <div className={`${iconClass} bg-red-100 text-red-600`}><i className="fa-solid fa-exclamation-triangle"></i></div>;
            default:
                if (type.includes('Booking')) {
                    return <div className={`${iconClass} bg-blue-100 text-blue-600`}><i className="fa-solid fa-calendar"></i></div>;
                } else if (type.includes('Payment')) {
                    return <div className={`${iconClass} bg-green-100 text-green-600`}><i className="fa-solid fa-credit-card"></i></div>;
                } else if (type.includes('Driver')) {
                    return <div className={`${iconClass} bg-purple-100 text-purple-600`}><i className="fa-solid fa-user"></i></div>;
                } else if (type.includes('Emergency') || type.includes('Alert')) {
                    return <div className={`${iconClass} bg-red-100 text-red-600`}><i className="fa-solid fa-exclamation-triangle"></i></div>;
                }
                return <div className={`${iconClass} bg-slate-100 text-slate-600`}><i className="fa-solid fa-bell"></i></div>;
        }
    };

    // Function to handle clicking on a notification
    const handleNotificationClick = (id) => {
        if (!id) return;
        markAsRead(id, 'admin');
    };

    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
                onClick={onMenuButtonClick}
            >
                <span className="sr-only">Buka sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>

                <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Desktop search */}
                        <div className="relative">
                            <div className="hidden md:block relative">
                                {showSearch ? (
                                    <div className="absolute right-0 z-10">
                                        <form className="relative" onSubmit={(e) => e.preventDefault()}>
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MagnifyingGlassIcon
                                                    className="h-5 w-5 text-slate-400"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <input
                                                ref={searchRef}
                                                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                                                placeholder="Cari menu..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onBlur={() => {
                                                    if (searchTerm.trim() === '') {
                                                        setShowSearch(false);
                                                    }
                                                }}
                                            />
                                        </form>

                                        {/* Search results dropdown */}
                                        {searchTerm.trim() !== '' && (
                                            <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    {searchResults.length > 0 ? (
                                                        searchResults.map((result, index) => (
                                                            <Link
                                                                key={index}
                                                                href={result.url}
                                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                                onClick={() => {
                                                                    setShowSearch(false);
                                                                    setSearchTerm('');
                                                                }}
                                                            >
                                                                {result.name}
                                                            </Link>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-2 text-sm text-slate-500">
                                                            Tidak ada hasil ditemukan
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        ref={searchButtonRef}
                                        type="button"
                                        className="relative rounded-full p-1.5 text-slate-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        onClick={handleSearchIconClick}
                                    >
                                        <span className="sr-only">Cari</span>
                                        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile search icon */}
                        <button
                            type="button"
                            className="md:hidden rounded-full p-1.5 text-slate-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={handleMobileSearchIconClick}
                        >
                            <span className="sr-only">Cari</span>
                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Mobile search overlay */}
                        <div className="md:hidden">
                            <Transition show={searchOpen} as={Fragment}>
                                <div className="fixed inset-0 z-50">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
                                    </Transition.Child>

                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 sm:items-start">
                                            <div className="w-full max-w-md transform space-y-2 rounded-xl bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-lg font-medium text-slate-900">Cari</h2>
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                        onClick={() => setSearchOpen(false)}
                                                    >
                                                        <span className="sr-only">Tutup</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>

                                                <div className="relative mt-3">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                                    </div>
                                                    <input
                                                        ref={mobileSearchRef}
                                                        type="text"
                                                        className="block w-full rounded-md border-0 py-2 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm"
                                                        placeholder="Cari menu..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                {/* Search results */}
                                                {searchTerm.trim() !== '' && (
                                                    <div className="max-h-72 scroll-py-2 overflow-y-auto py-2">
                                                        {searchResults.length > 0 ? (
                                                            <ul className="-mx-2">
                                                                {searchResults.map((item, index) => (
                                                                    <li key={index}>
                                                                        <Link
                                                                            href={item.url}
                                                                            onClick={() => setSearchOpen(false)}
                                                                            className="flex cursor-default select-none items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                                        >
                                                                            {item.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <div className="py-14 px-6 text-center text-sm sm:px-14">
                                                                <p className="text-slate-900 font-semibold">Tidak ada hasil ditemukan</p>
                                                                <p className="text-slate-500 mt-2">Silakan coba dengan kata kunci lain.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </Transition>
                        </div>

                        {/* Notifications dropdown */}
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="relative flex rounded-full p-1.5 text-slate-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <span className="sr-only">Lihat notifikasi</span>
                                    <BellIcon className="h-5 w-5" aria-hidden="true" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                            {unreadCount}
                                        </span>
                                    )}
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
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-900">Notifikasi</p>
                                            {unreadCount > 0 && (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                    {unreadCount} baru
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="py-1 max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <Menu.Item key={notification.id}>
                                                    {({ active }) => (
                                                        <Link
                                                            href={notification.action_url || '#'}
                                                            onClick={() => handleNotificationClick(notification.id)}
                                                            className={`${
                                                                active ? 'bg-slate-100' : ''
                                                            } ${!notification.read ? 'bg-blue-50' : ''} block px-4 py-2 text-sm text-slate-700`}
                                                        >
                                                            <div className="flex items-start">
                                                                {getNotificationIcon(notification.type)}
                                                                <div className="ml-3 flex-1">
                                                                    <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                                        {notification.title || 'Notifikasi'}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                                        {notification.message || 'Anda memiliki notifikasi baru'}
                                                                    </p>
                                                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center">
                                                                        <ClockIcon className="h-3 w-3 mr-1" />
                                                                        {notification.time || formatDateDisplay(notification.created_at, 'id-ID')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                                Tidak ada notifikasi
                                            </div>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href={route('admin.notifications.index')}
                                                        className={`${
                                                            active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                                                        } block px-4 py-2 text-sm text-center font-medium`}
                                                    >
                                                        Lihat semua notifikasi
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    )}
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative">
                            <div>
                                <Menu.Button className="flex items-center gap-x-1 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                    <span className="sr-only">Buka menu pengguna</span>
                                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden lg:flex lg:items-center">
                                        <span className="ml-2 text-sm font-medium text-slate-700 leading-none" aria-hidden="true">
                                            {user?.name || 'User'}
                                        </span>
                                        <ChevronDownIcon className="ml-1 h-5 w-5 text-slate-400" aria-hidden="true" />
                                    </span>
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
                                            <a
                                                href="/admin/profile"
                                                className={`${
                                                    active ? 'bg-slate-100' : ''
                                                } group flex items-center px-4 py-2 text-sm text-slate-700`}
                                            >
                                                <UserIcon
                                                    className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500"
                                                    aria-hidden="true"
                                                />
                                                Profil
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="/admin/dashboard"
                                                className={`${
                                                    active ? 'bg-slate-100' : ''
                                                } group flex items-center px-4 py-2 text-sm text-slate-700`}
                                            >
                                                <Cog6ToothIcon
                                                    className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500"
                                                    aria-hidden="true"
                                                />
                                                Pengaturan
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                data={{ redirect_to: '/admin/login' }}
                                                as="button"
                                                className={`${
                                                    active ? 'bg-slate-100' : ''
                                                } group flex w-full items-center px-4 py-2 text-sm text-slate-700`}
                                            >
                                                <ArrowRightOnRectangleIcon
                                                    className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500"
                                                    aria-hidden="true"
                                                />
                                                Keluar
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    );
}
