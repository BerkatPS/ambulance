import React, { Fragment, useState } from 'react';
import { Dialog, Transition, Disclosure } from '@headlessui/react';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

// Navigation items grouped by category
const navigationItems = [
    {
        category: 'Umum',
        items: [
            {
                name: 'Dashboard',
                href: route('admin.dashboard'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                )
            }
        ]
    },
    {
        category: 'Operasional',
        items: [
            {
                name: 'Pemesanan',
                href: route('admin.bookings.index'),
                badge: { text: '8', color: 'blue' },
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )
            },
            {
                name: 'Darurat',
                href: route('admin.bookings.emergency'),
                badge: { text: '2', color: 'red' },
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                )
            },
            {
                name: 'Pengemudi',
                href: route('admin.drivers.index'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                )
            },
            {
                name: 'Ambulans',
                href: route('admin.ambulances.index'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                )
            },
            {
                name: 'Pemeliharaan',
                href: route('admin.maintenance'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )
            }
        ]
    },
    {
        category: 'Pengguna',
        items: [
            {
                name: 'Pengguna',
                href: route('admin.users.index'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )
            }
        ]
    },
    {
        category: 'Keuangan',
        items: [
            {
                name: 'Pembayaran',
                href: route('admin.payments.index'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                )
            }
        ]
    },
    {
        category: 'Umpan Balik',
        items: [
            {
                name: 'Penilaian',
                href: route('admin.ratings.index'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                )
            }
        ]
    },
    {
        category: 'Sistem',
        items: [
            {
                name: 'Notifikasi',
                // href: route('admin.notifications.index'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                )
            },
            {
                name: 'Profil',
                href: route('admin.profile'),
                badge: null,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            }
        ]
    }
];

// Badge component
function Badge({ text, color }) {
    const colorMap = {
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        purple: 'bg-purple-100 text-purple-800',
        gray: 'bg-gray-100 text-gray-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        pink: 'bg-pink-100 text-pink-800',
    };

    return (
        <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[color] || colorMap.gray}`}>
            {text}
        </span>
    );
}

function AdminSidebar({ sidebarOpen, setSidebarOpen, user }) {
    const { url } = usePage();

    const isActive = (href) => {
        return url.startsWith(href);
    };

    return (
        <>
            {/* Mobile sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex z-40">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="flex-shrink-0 flex items-center px-4">
                                        <ApplicationLogo className="h-8 w-auto" />
                                    </div>
                                    <nav className="mt-5 flex-1 px-2 space-y-1">
                                        {navigationItems.map((category) => (
                                            <div key={category.category} className="py-2">
                                                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.category}</h3>
                                                <div className="mt-1 space-y-1">
                                                    {category.items.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className={`${
                                                                isActive(item.href)
                                                                    ? 'bg-primary-50 text-primary-700'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                                                        >
                                                            <span className={`${
                                                                isActive(item.href)
                                                                    ? 'text-primary-600'
                                                                    : 'text-gray-400 group-hover:text-gray-500'
                                                            } mr-3 flex-shrink-0`}>
                                                                {item.icon}
                                                            </span>
                                                            {item.name}
                                                            {item.badge && <Badge text={item.badge.text} color={item.badge.color} />}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                    <div className="flex-shrink-0 group block">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100">
                                                    <span className="font-medium text-primary-600">{user.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                                                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Admin</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <ApplicationLogo className="h-8 w-auto" />
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {navigationItems.map((category) => (
                                <div key={category.category} className="py-2">
                                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.category}</h3>
                                    <div className="mt-1 space-y-1">
                                        {category.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`${
                                                    isActive(item.href)
                                                        ? 'bg-primary-50 text-primary-700'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                                            >
                                                <span className={`${
                                                    isActive(item.href)
                                                        ? 'text-primary-600'
                                                        : 'text-gray-400 group-hover:text-gray-500'
                                                } mr-3 flex-shrink-0`}>
                                                    {item.icon}
                                                </span>
                                                {item.name}
                                                {item.badge && <Badge text={item.badge.text} color={item.badge.color} />}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <Link href={route('admin.profile')} className="flex-shrink-0 w-full group block">
                            <div className="flex items-center">
                                <div>
                                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100">
                                        <span className="font-medium text-primary-600">{user.name.charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Administrator</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminSidebar;
