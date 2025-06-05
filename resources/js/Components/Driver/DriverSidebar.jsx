import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import {
    HomeIcon,
    CalendarIcon,
    ClockIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    StarIcon,
    PhoneIcon,
    BellIcon,
    TruckIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    WrenchScrewdriverIcon
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
                href: route('driver.dashboard'),
                icon: <HomeIcon className="h-5 w-5" />
            }
        ]
    },
    {
        category: 'Pemesanan',
        items: [
            {
                name: 'Pemesanan Aktif',
                href: route('driver.bookings.index'),
                icon: <CalendarIcon className="h-5 w-5" />
            },
            {
                name: 'Riwayat Pemesanan',
                href: route('driver.bookings.history'),
                icon: <ClockIcon className="h-5 w-5" />
            }
        ]
    },
    {
        category: 'Performa',
        items: [
            {
                name: 'Penilaian & Ulasan',
                href: route('driver.ratings.index'),
                icon: <StarIcon className="h-5 w-5" />
            },
        ]
    },
    {
        category: 'Akun',
        items: [
            {
                name: 'Profil Saya',
                href: route('driver.profile.edit'),
                matchRoute: 'driver.profile.*',
                icon: <UserCircleIcon className="h-5 w-5" />
            },
            // {
            //     name: 'Notifikasi',
            //     href: route('driver.notifications.index'),
            //     icon: <BellIcon className="h-5 w-5" />
            // }
        ]
    }
];

// Fungsi untuk mendapatkan item navigasi kendaraan jika driver memiliki ambulance
const getVehicleNavigation = (ambulanceId) => {
    if (!ambulanceId) return null;

    return {
        category: 'Informasi Kendaraan',
        items: [
            {
                name: 'Status Ambulans',
                href: route('driver.dashboard'), // Ganti dengan route ambulans jika tersedia
                matchRoute: 'driver.ambulance',
                icon: <TruckIcon className="h-5 w-5" />
            },
            {
                name: 'Pemeliharaan',
                href: route('driver.dashboard'), // Ganti dengan route pemeliharaan jika tersedia
                matchRoute: 'driver.maintenance',
                icon: <WrenchScrewdriverIcon className="h-5 w-5" />
            }
        ]
    };
};

export default function DriverSidebar({ driver, open, setOpen, onEmergencyClick }) {
    const { url } = usePage();

    // Check if the link is active
    const isActive = (href, matchRoute) => {
        if (matchRoute && route().current(matchRoute)) {
            return true;
        }
        return url.startsWith(href);
    };

    // Get navigation items including vehicle if driver has ambulance
    const allNavigationItems = [...navigationItems];
    const vehicleNavigation = getVehicleNavigation(driver?.ambulance_id);
    if (vehicleNavigation) {
        allNavigationItems.push(vehicleNavigation);
    }

    return (
        <>
            {/* Mobile sidebar */}
            <Transition
                show={open}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <MobileSidebar
                    driver={driver}
                    setOpen={setOpen}
                    navigationItems={allNavigationItems}
                    isActive={isActive}
                    onEmergencyClick={onEmergencyClick}
                />
            </Transition>

            {/* Desktop sidebar */}
            <DesktopSidebar
                driver={driver}
                navigationItems={allNavigationItems}
                isActive={isActive}
                onEmergencyClick={onEmergencyClick}
            />
        </>
    );
}

function MobileSidebar({ driver, setOpen, navigationItems, isActive, onEmergencyClick }) {
    return (
        <div className="relative h-full bg-white flex flex-col overflow-y-auto border-r border-slate-200">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-3 h-16 border-b border-slate-200">
                <Link href="/">
                    <ApplicationLogo className="block h-9 w-auto" />
                </Link>
                <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded text-slate-500 hover:text-slate-600 hover:bg-slate-100"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
                <nav className="space-y-1">
                    {navigationItems.map((category, index) => (
                        <div key={index} className={index > 0 ? "pt-2 mt-2 border-t border-slate-200" : ""}>
                            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                {category.category}
                            </h3>
                            {category.items.map((item, itemIndex) => (
                                <Link
                                    key={itemIndex}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                                        isActive(item.href, item.matchRoute)
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                                    }`}
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="mr-3 flex-shrink-0">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}

                    {/* Emergency button in sidebar for mobile */}
                    <div className="pt-2 mt-2 border-t border-slate-200">
                        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Darurat
                        </h3>
                        <button
                            onClick={() => {
                                setOpen(false);
                                onEmergencyClick();
                            }}
                            className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            <PhoneIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                            Panggilan Darurat
                        </button>
                    </div>
                </nav>
            </div>

            {/* Sidebar footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                            {driver?.name?.charAt(0) || 'D'}
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700">{driver?.name || 'Driver'}</p>
                        <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                driver?.status === 'available' ? 'bg-success-50 text-success-700' :
                                driver?.status === 'busy' ? 'bg-danger-50 text-danger-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                                {driver?.status === 'available' ? 'Tersedia' :
                                 driver?.status === 'busy' ? 'Sibuk' :
                                 driver?.status === 'off' ? 'Tidak Aktif' : 'Tidak Diketahui'}
                            </span>
                            <Link
                                href={route('driver.logout')}
                                method="post"
                                as="button"
                                className="text-xs text-slate-500 hover:text-primary-600 flex items-center"
                            >
                                Keluar
                                <ArrowRightOnRectangleIcon className="ml-1 h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesktopSidebar({ driver, navigationItems, isActive, onEmergencyClick }) {
    return (
        <div className="hidden lg:flex lg:flex-col lg:h-screen overflow-y-auto bg-white border-r border-slate-200">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-3 h-16 border-b border-slate-200">
                <Link href="/">
                    <ApplicationLogo className="block h-9 w-auto" />
                </Link>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
                <nav className="space-y-1">
                    {navigationItems.map((category, index) => (
                        <div key={index} className={index > 0 ? "pt-2 mt-2 border-t border-slate-200" : ""}>
                            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                {category.category}
                            </h3>
                            {category.items.map((item, itemIndex) => (
                                <Link
                                    key={itemIndex}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                                        isActive(item.href, item.matchRoute)
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                                    }`}
                                >
                                    <span className="mr-3 flex-shrink-0">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}

                    {/* Emergency button in sidebar */}
                    <div className="pt-2 mt-2 border-t border-slate-200">
                        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Darurat
                        </h3>
                        <button
                            onClick={onEmergencyClick}
                            className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            <PhoneIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                            Panggilan Darurat
                        </button>
                    </div>
                </nav>
            </div>

            {/* Sidebar footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                            {driver?.name?.charAt(0) || 'D'}
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700">{driver?.name || 'Driver'}</p>
                        <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                driver?.status === 'available' ? 'bg-success-50 text-success-700' :
                                driver?.status === 'busy' ? 'bg-danger-50 text-danger-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                                {driver?.status === 'available' ? 'Tersedia' :
                                 driver?.status === 'busy' ? 'Sibuk' :
                                 driver?.status === 'off' ? 'Tidak Aktif' : 'Tidak Diketahui'}
                            </span>
                            <Link
                                href={route('driver.logout')}
                                method="post"
                                as="button"
                                className="text-xs text-slate-500 hover:text-primary-600 flex items-center"
                            >
                                Keluar
                                <ArrowRightOnRectangleIcon className="ml-1 h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
