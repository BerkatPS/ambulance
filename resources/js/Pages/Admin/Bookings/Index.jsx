import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PencilSquareIcon,
    EyeIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from "@/Layouts/AdminDashboardLayout";
import NotificationToast from '@/Components/NotificationToast';

export default function BookingsIndex({ auth, bookings, filters, ambulanceTypes, statuses, notifications, status }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(!!status);

    // Status colors
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        dispatched: 'bg-indigo-100 text-indigo-800',
        arrived: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    // Priority colors
    const priorityColors = {
        critical: 'bg-red-100 text-red-800',
        urgent: 'bg-orange-100 text-orange-800',
        normal: 'bg-blue-100 text-blue-800'
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format status labels
    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Menunggu',
            confirmed: 'Dikonfirmasi',
            dispatched: 'Dikirim',
            arrived: 'Tiba di Lokasi',
            completed: 'Selesai',
            cancelled: 'Dibatalkan'
        };

        return labels[status] || status;
    };

    // Format booking type
    const getBookingTypeLabel = (type) => {
        const labels = {
            standard: 'Standar',
            emergency: 'Darurat',
            scheduled: 'Terjadwal'
        };

        return labels[type] || type;
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.bookings.index', { search: searchTerm });
    };

    return (
        <AdminDashboardLayout
            title="Kelola Pemesanan"
            user={auth.user}
            notifications={notifications}
        >
            <Head title="Kelola Pemesanan" />

            {/* Success Notification */}
            <NotificationToast
                show={showNotification}
                type="success"
                title="Berhasil!"
                message={status || "Operasi pemesanan berhasil dilakukan"}
                onClose={() => setShowNotification(false)}
            />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-slate-900">Pemesanan</h1>
                            <p className="mt-2 text-sm text-slate-700">
                                Daftar semua pemesanan ambulans termasuk ID, pasien, status, dan informasi lainnya.
                            </p>
                        </div>

                    </div>

                    {/* Search and filters */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                            <form onSubmit={handleSearch}>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                        placeholder="Cari pemesanan berdasarkan ID, nama pasien, atau kontak..."
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 hover:text-primary-800"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="w-full md:w-1/2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2 text-slate-400" aria-hidden="true" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Filter panel */}
                    {filterOpen && (
                        <div className="mt-4 sm:rounded-xl bg-white p-5 shadow-sm border border-slate-100">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label htmlFor="filter-status" className="block text-sm font-medium text-slate-700">
                                        Status
                                    </label>
                                    <select
                                        id="filter-status"
                                        name="status"
                                        className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.status || ''}
                                    >
                                        <option value="">Semua Status</option>
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="filter-type" className="block text-sm font-medium text-slate-700">
                                        Tipe Pemesanan
                                    </label>
                                    <select
                                        id="filter-type"
                                        name="type"
                                        className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.type || ''}
                                    >
                                        <option value="">Semua Tipe</option>
                                        <option value="standard">Standar</option>
                                        <option value="emergency">Darurat</option>
                                        <option value="scheduled">Terjadwal</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="filter-priority" className="block text-sm font-medium text-slate-700">
                                        Prioritas
                                    </label>
                                    <select
                                        id="filter-priority"
                                        name="priority"
                                        className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.priority || ''}
                                    >
                                        <option value="">Semua Prioritas</option>
                                        <option value="critical">Kritis</option>
                                        <option value="urgent">Penting</option>
                                        <option value="normal">Normal</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="filter-date-from" className="block text-sm font-medium text-slate-700">
                                        Tanggal Dari
                                    </label>
                                    <input
                                        type="date"
                                        id="filter-date-from"
                                        name="date_from"
                                        className="mt-1 block w-full rounded-md border-slate-300 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.date_from || ''}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="filter-date-to" className="block text-sm font-medium text-slate-700">
                                        Tanggal Sampai
                                    </label>
                                    <input
                                        type="date"
                                        id="filter-date-to"
                                        name="date_to"
                                        className="mt-1 block w-full rounded-md border-slate-300 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.date_to || ''}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                        onClick={() => {
                                            // Collect all filter values and redirect
                                            const status = document.getElementById('filter-status').value;
                                            const type = document.getElementById('filter-type').value;
                                            const priority = document.getElementById('filter-priority').value;
                                            const dateFrom = document.getElementById('filter-date-from').value;
                                            const dateTo = document.getElementById('filter-date-to').value;

                                            window.location.href = route('admin.bookings.index', {
                                                search: searchTerm,
                                                status,
                                                type,
                                                priority,
                                                date_from: dateFrom,
                                                date_to: dateTo
                                            });
                                        }}
                                    >
                                        Terapkan Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bookings table */}
                    <div className="mt-6 flow-root">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow-sm sm:rounded-xl border border-slate-100">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                    Pasien
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                    Tipe
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                    Tanggal
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                    Total
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Aksi</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {bookings && bookings.data && bookings.data.length > 0 ? (
                                                bookings.data.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-slate-50">
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                                            #{booking.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                            <div>
                                                                <div className="font-medium text-slate-900">{booking.patient_name}</div>
                                                                <div className="text-slate-500">{booking.contact_phone}</div>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                            <div>
                                                                <div>{getBookingTypeLabel(booking.type)}</div>
                                                                {booking.priority && (
                                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${priorityColors[booking.priority] || 'bg-slate-100 text-slate-800'}`}>
                                                                        {booking.priority === 'critical' ? 'Kritis' :
                                                                         booking.priority === 'urgent' ? 'Penting' : 'Normal'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                            {booking.type === 'scheduled'
                                                                ? formatDate(booking.scheduled_at)
                                                                : formatDate(booking.requested_at)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[booking.status] || 'bg-slate-100 text-slate-800'}`}>
                                                                {getStatusLabel(booking.status)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                            Rp {parseFloat(booking.total_amount).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('admin.bookings.show', booking.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                    title="Lihat"
                                                                >
                                                                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                                                    <span className="sr-only">Lihat {booking.id}</span>
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.bookings.show', booking.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    title="Edit"
                                                                >
                                                                    <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                                                                    <span className="sr-only">Edit {booking.id}</span>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 text-center">
                                                        Tidak ada pemesanan yang ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    {bookings && bookings.meta && bookings.meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:rounded-xl shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a
                                    href={bookings.links.prev || '#'}
                                    className={`relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 ${!bookings.links.prev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                                >
                                    Sebelumnya
                                </a>
                                <a
                                    href={bookings.links.next || '#'}
                                    className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 ${!bookings.links.next ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                                >
                                    Berikutnya
                                </a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-700">
                                        Menampilkan <span className="font-medium">{bookings.meta.from}</span> sampai <span className="font-medium">{bookings.meta.to}</span> dari <span className="font-medium">{bookings.meta.total}</span> pemesanan
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {bookings.links.map((link, index) => {
                                            if (link.label === "&laquo; Previous") {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span className="sr-only">Sebelumnya</span>
                                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                                    </a>
                                                );
                                            } else if (link.label === "Next &raquo;") {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span className="sr-only">Berikutnya</span>
                                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                                    </a>
                                                );
                                            } else {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                            link.active
                                                                ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                                                : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
                                                        }`}
                                                    >
                                                        {link.label}
                                                    </a>
                                                );
                                            }
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
