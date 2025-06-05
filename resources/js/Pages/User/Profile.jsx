import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import UserDashboardLayout from "@/Layouts/UserDashboardLayout.jsx";
import {
    CalendarIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    IdentificationIcon,
    ClockIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Profile({ auth, user, bookingsCount, lastBooking, notifications = [], unreadCount = 0 }) {
    // Format date to Indonesian format
    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak ditentukan';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Error format tanggal';
        }
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profil</h2>}
            notifications={notifications}
            unreadCount={unreadCount}
        >
            <Head title="Profil" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Informasi Profil</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Informasi pribadi dan detail akun Anda.
                                </p>
                            </div>
                            <Link href={route('profile.edit')}>
                                <PrimaryButton className="bg-primary-600 hover:bg-primary-700">Edit Profil</PrimaryButton>
                            </Link>
                        </div>

                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        Nama Lengkap
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        Alamat Email
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        Nomor Telepon
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.phone || '-'}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        Anggota Sejak
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {formatDate(user.created_at)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Aktivitas Pemesanan</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Ringkasan aktivitas pemesanan Anda.
                                </p>
                            </div>
                            <Link href={route('bookings.history')}>
                                <PrimaryButton className="bg-primary-600 hover:bg-primary-700">Lihat Semua Pemesanan</PrimaryButton>
                            </Link>
                        </div>

                        <div className="mt-6">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                    Total Pemesanan
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {bookingsCount || 0} pemesanan
                                </dd>
                            </div>

                            {lastBooking && (
                                <>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-100">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Pemesanan Terakhir</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            <div className="rounded-lg bg-gray-50 p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Pemesanan #{lastBooking.id}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {lastBooking.type === 'emergency' ? 'Darurat' :
                                                             lastBooking.type === 'scheduled' ? 'Terjadwal' : 'Non-Darurat'} •
                                                            {formatDate(lastBooking.booking_time)}
                                                        </p>

                                                        <div className="mt-3 flex items-start">
                                                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                                                            <p className="text-xs text-gray-600">
                                                                <span className="block font-medium">Alamat Penjemputan:</span>
                                                                {lastBooking.pickup_address}
                                                            </p>
                                                        </div>

                                                        <div className="mt-2 flex items-start">
                                                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                                                            <p className="text-xs text-gray-600">
                                                                <span className="block font-medium">Alamat Tujuan:</span>
                                                                {lastBooking.destination_address}
                                                            </p>
                                                        </div>

                                                        <div className="mt-3">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                lastBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                lastBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                lastBooking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                lastBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                lastBooking.status === 'assigned' ? 'bg-indigo-100 text-indigo-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {lastBooking.status === 'pending' && 'Menunggu'}
                                                                {lastBooking.status === 'confirmed' && 'Dikonfirmasi'}
                                                                {lastBooking.status === 'assigned' && 'Ditugaskan'}
                                                                {lastBooking.status === 'in_progress' && 'Dalam Perjalanan'}
                                                                {lastBooking.status === 'completed' && 'Selesai'}
                                                                {lastBooking.status === 'cancelled' && 'Dibatalkan'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={route('user.bookings.show', lastBooking.id)}
                                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                                                    >
                                                        Lihat Detail
                                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </dd>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
