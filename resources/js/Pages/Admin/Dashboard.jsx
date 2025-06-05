import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    TruckIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    StarIcon,
    ExclamationTriangleIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

// Import our new AdminDashboardLayout instead of the old AdminLayout
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function Dashboard({ auth, stats, notifications, recentActivity, emergencyCalls }) {
    // Format currency to IDR
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Dashboard cards data
    const cards = [
        {
            title: 'Total Pemesanan',
            value: stats.totalBookings,
            change: '+8%',
            changeType: 'increase',
            icon: <CalendarIcon className="h-6 w-6 text-primary-600" />,
            bgColor: 'bg-primary-50',
            textColor: 'text-primary-700',
            link: route('admin.bookings.index')
        },
        {
            title: 'Pemesanan Aktif',
            value: stats.activeBookings,
            change: '+2',
            changeType: 'increase',
            icon: <ClipboardDocumentCheckIcon className="h-6 w-6 text-amber-600" />,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            link: route('admin.bookings.index', { status: 'active' })
        },
        {
            title: 'Ambulans Tersedia',
            value: `${stats.availableAmbulances}/${stats.totalAmbulances}`,
            change: '-2',
            changeType: 'decrease',
            icon: <TruckIcon className="h-6 w-6 text-red-600" />,
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            link: route('admin.ambulances.index')
        },
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.totalRevenue),
            change: `+${stats.revenueGrowth}%`,
            changeType: 'increase',
            icon: <CurrencyDollarIcon className="h-6 w-6 text-green-600" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            link: route('admin.payments.index')
        },
        {
            title: 'Pengemudi Aktif',
            value: `${stats.activeDrivers}/${stats.totalDrivers}`,
            change: '+3',
            changeType: 'increase',
            icon: <UserGroupIcon className="h-6 w-6 text-blue-600" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            link: route('admin.drivers.index')
        },
        {
            title: 'Penilaian Pelanggan',
            value: stats.averageRating,
            change: '+0.2',
            changeType: 'increase',
            icon: <StarIcon className="h-6 w-6 text-amber-600" />,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            link: route('admin.ratings.index')
        },
    ];

    // Gunakan recentActivity dari controller atau data default jika tidak ada
    const activityData = recentActivity || [
        {
            id: 1,
            type: 'booking_created',
            description: 'Pemesanan baru #1234 dibuat',
            time: '10 menit yang lalu',
            user: 'John Doe'
        },
        {
            id: 2,
            type: 'payment_received',
            description: 'Pembayaran diterima untuk pemesanan #1230',
            time: '25 menit yang lalu',
            user: 'Sarah Johnson'
        },
        {
            id: 3,
            type: 'booking_completed',
            description: 'Pemesanan #1225 selesai',
            time: '1 jam yang lalu',
            user: 'Pengemudi: Ahmad Suherman'
        },
        {
            id: 4,
            type: 'rating_received',
            description: 'Penilaian bintang 5 baru diterima',
            time: '2 jam yang lalu',
            user: 'Maria Garcia'
        },
        {
            id: 5,
            type: 'ambulance_maintenance',
            description: 'Ambulans #A-123 dijadwalkan untuk pemeliharaan',
            time: '3 jam yang lalu',
            user: 'Admin: Budi Santoso'
        }
    ];

    // Gunakan emergencyCalls dari controller atau data default jika tidak ada
    const emergencyData = emergencyCalls || [
        {
            id: 'E-4589',
            address: 'Jl. Sudirman No. 45, Jakarta Pusat',
            status: 'pending'
        },
        {
            id: 'E-4587',
            address: 'Jl. Gajah Mada No. 12, Jakarta Barat',
            status: 'assigned'
        },
        {
            id: 'E-4586',
            address: 'Jl. Kemang Raya No. 10, Jakarta Selatan',
            status: 'completed'
        }
    ];

    return (
        <AdminDashboardLayout
            user={auth.user}
            title="Dashboard"
            notifications={notifications}
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Ikhtisar metrik dan aktivitas layanan ambulans Anda.
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow transition-shadow duration-300"
                        >
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md ${card.bgColor} p-3`}>
                                        {card.icon}
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {card.title}
                                            </dt>
                                            <dd>
                                                <div className="text-xl font-medium text-gray-900">
                                                    {card.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-5 py-3 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <Link
                                            href={card.link}
                                            className="font-medium text-primary-600 hover:text-primary-700"
                                        >
                                            Lihat semua
                                        </Link>
                                    </div>
                                    <div className={`flex items-center text-sm ${
                                        card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {card.changeType === 'increase' ? (
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        )}
                                        {card.change}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity and Emergency Calls */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Activity */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                        <div className="p-5 sm:p-6 border-b border-slate-100">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Aktivitas Terbaru</h3>
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {activityData.map((activity, index) => (
                                        <li key={activity.id}>
                                            <div className="relative pb-8">
                                                {index !== activityData.length - 1 ? (
                                                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></span>
                                                ) : null}
                                                <div className="relative flex items-start space-x-3">
                                                    <div className="relative">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                                            activity.type === 'booking_created' ? 'bg-blue-100 text-blue-600' :
                                                            activity.type === 'payment_received' ? 'bg-green-100 text-green-600' :
                                                            activity.type === 'booking_completed' ? 'bg-primary-100 text-primary-600' :
                                                            activity.type === 'rating_received' ? 'bg-yellow-100 text-yellow-600' :
                                                            'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {activity.type === 'booking_created' && (
                                                                <CalendarIcon className="h-6 w-6" />
                                                            )}
                                                            {activity.type === 'payment_received' && (
                                                                <CurrencyDollarIcon className="h-6 w-6" />
                                                            )}
                                                            {activity.type === 'booking_completed' && (
                                                                <ClipboardDocumentCheckIcon className="h-6 w-6" />
                                                            )}
                                                            {activity.type === 'rating_received' && (
                                                                <StarIcon className="h-6 w-6" />
                                                            )}
                                                            {activity.type === 'ambulance_maintenance' && (
                                                                <TruckIcon className="h-6 w-6" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div>
                                                            <p className="text-sm text-gray-500">{activity.user}</p>
                                                            <p className="mt-0.5 text-sm text-gray-500">{activity.time}</p>
                                                        </div>
                                                        <div className="mt-2 text-sm text-gray-700">
                                                            <p>{activity.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6">
                                <Link
                                    // href={route('admin.notifications.index')}
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                    Lihat semua aktivitas <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Calls */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                        <div className="p-5 sm:p-6 border-b border-slate-100">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Panggilan Darurat</h3>
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="divide-y divide-slate-200">
                                {emergencyData.map((emergency, index) => (
                                    <div key={index} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                                emergency.status === 'pending' ? 'bg-red-100 text-red-600' :
                                                emergency.status === 'assigned' ? 'bg-orange-100 text-orange-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                                {emergency.status === 'pending' && (
                                                    <ExclamationTriangleIcon className="h-6 w-6" />
                                                )}
                                                {emergency.status === 'assigned' && (
                                                    <ExclamationTriangleIcon className="h-6 w-6" />
                                                )}
                                                {emergency.status === 'completed' && (
                                                    <CheckIcon className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">ID Darurat: #{emergency.id}</p>
                                                <p className="text-sm text-gray-500">{emergency.address}</p>
                                            </div>
                                        </div>
                                        {emergency.status === 'pending' ? (
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Tanggapi Sekarang
                                            </button>
                                        ) : (
                                            <div className="text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    emergency.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {emergency.status === 'assigned' ? 'Pengemudi Ditugaskan' : 'Selesai'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.bookings.emergency')}
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                    Lihat semua panggilan darurat <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
