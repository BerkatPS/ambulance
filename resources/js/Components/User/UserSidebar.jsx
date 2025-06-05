import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    UserGroupIcon,
    PhoneIcon,
    BellIcon,
    WrenchScrewdriverIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";

// Navigation menu structure
const navigationItems = [
    {
        category: 'Utama',
        items: [
            {
                name: 'Dashboard',
                href: route('user.dashboard'),
                icon: <HomeIcon className="h-5 w-5" />
            }
        ]
    },
    {
        category: 'Layanan',
        items: [
            {
                name: 'Buat Pemesanan',
                href: route('user.bookings.create'),
                icon: <ClipboardDocumentListIcon className="h-5 w-5" />
            },
            {
                name: 'Pemesanan Aktif',
                href: route('user.bookings.active'),
                icon: <ClipboardDocumentListIcon className="h-5 w-5" />
            },
            {
                name: 'Riwayat Pemesanan',
                href: route('user.bookings.history'),
                icon: <ClockIcon className="h-5 w-5" />
            },
            {
                name: 'Pembayaran',
                href: route('user.payments.index'),
                icon: <ClipboardDocumentListIcon className="h-5 w-5" />
            },
            {
                name: 'Penilaian',
                href: route('user.ratings.index'),
                icon: <ClipboardDocumentListIcon className="h-5 w-5" />
            }
        ]
    },
    {
        category: 'Dukungan',
        items: [
            {
                name: 'Bantuan',
                href: route('support'),
                icon: <UserGroupIcon className="h-5 w-5" />
            }
        ]
    },
    // {
    //     category: 'Akun',
    //     items: [
    //         {
    //             name: 'Profil',
    //             href: route('profile'),
    //             icon: <UserIcon className="h-5 w-5" />
    //         },
    //         {
    //             name: 'Kontak Darurat',
    //             href: route('profile.emergency-contacts'),
    //             icon: <PhoneIcon className="h-5 w-5" />
    //         },
    //         {
    //             name: 'Notifikasi',
    //             href: route('notifications.index'),
    //             icon: <BellIcon className="h-5 w-5" />
    //         }
    //     ]
    // }
];

export default function UserSidebar({ user, open, setOpen, onEmergencyClick }) {
    const { url } = usePage();

    // Check if the link is active
    const isActive = (href) => {
        return url.startsWith(href);
    };

    return (
        <>
            {/* Mobile sidebar overlay */}
            <Transition
                show={open}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                {/* Overlay */}
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden" onClick={() => setOpen(false)} />
            </Transition>

            {/* Sidebar component for mobile */}
            <Transition
                show={open}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                className="lg:hidden"
            >
                <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl flex flex-col h-full">
                    <MobileSidebar user={user} setOpen={setOpen} onEmergencyClick={onEmergencyClick} />
                </div>
            </Transition>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
                <DesktopSidebar user={user} onEmergencyClick={onEmergencyClick} />
            </div>
        </>
    );
}

function MobileSidebar({ user, setOpen, onEmergencyClick }) {
    const { url } = usePage();

    // Check if the link is active
    const isActive = (href) => {
        return url.startsWith(href);
    };

    return (
        <>
            {/* Top header with logo and close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <Link href={route('user.dashboard')} className="flex-shrink-0 flex items-center">
                        <ApplicationLogo/>
                        <span className="ml-2 text-lg font-bold text-gray-900">Portal Ambulans</span>
                    </Link>
                </div>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => setOpen(false)}
                >
                    <span className="sr-only">Tutup sidebar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>

            {/* User profile */}
            <div className="pt-4 pb-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-lg">
                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium text-gray-800 truncate max-w-[180px]">
                            {user?.name || 'Pengguna'}
                        </div>
                        <div className="text-sm font-medium text-gray-500 truncate max-w-[180px]">
                            {user?.email || 'user@example.com'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency call button */}
            <div className="px-4 py-4">
                <button
                    type="button"
                    onClick={onEmergencyClick}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                >
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    Panggilan Darurat
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
                <nav className="px-3 pt-3 pb-5 space-y-6">
                    {navigationItems.map((section) => (
                        <div key={section.category}>
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.category}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                                active
                                                    ? 'bg-primary-50 text-primary-700'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className={`mr-3 ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-600'}`}>
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Logout button */}
            <div className="mt-auto border-t border-gray-200">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">Keluar</span>
                </Link>
            </div>
        </>
    );
}

function DesktopSidebar({ user, onEmergencyClick }) {
    const { url } = usePage();

    // Check if the link is active
    const isActive = (href) => {
        return url.startsWith(href);
    };

    return (
        <>
            {/* Logo */}
            <div className="flex items-center px-6 mb-6">
                <Link href={route('user.dashboard')} className="flex-shrink-0 flex items-center">
                    <ApplicationLogo/>
                    <span className="ml-2 text-lg font-bold text-gray-900">Portal Ambulans</span>
                </Link>
            </div>

            {/* User profile */}
            <div className="px-6 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-lg">
                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                    <div className="ml-3 truncate">
                        <div className="text-sm font-medium text-gray-800 truncate">
                            {user?.name || 'Pengguna'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {user?.email || 'user@example.com'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency call button */}
            <div className="px-6 mb-6">
                <button
                    type="button"
                    onClick={onEmergencyClick}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                >
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    Panggilan Darurat
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3">
                <nav className="space-y-6">
                    {navigationItems.map((section) => (
                        <div key={section.category}>
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.category}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                                active
                                                    ? 'bg-primary-50 text-primary-700'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className={`mr-3 ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-600'}`}>
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Logout button */}
            <div className="mt-auto border-t border-gray-200 mx-3 pt-3 pb-2">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                    <span>Keluar</span>
                </Link>
            </div>

            {/* App version */}
            <div className="px-6 py-2 text-xs text-center text-gray-400">
                Versi 1.0.0
            </div>
        </>
    );
}
