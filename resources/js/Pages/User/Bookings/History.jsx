import { useState, Fragment } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import Pagination from '@/Components/Common/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import NotificationToast from '@/Components/NotificationToast';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    AdjustmentsHorizontalIcon,
    FunnelIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { Transition } from '@headlessui/react';

export default function BookingsHistory({ auth, bookings, filters = {}, filterOptions, notifications = [], unreadCount = 0, status }) {
    const [filterValues, setFilterValues] = useState({
        status: filters.status || '',
        type: filters.type || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const [showFilters, setShowFilters] = useState(false);
    const [showNotification, setShowNotification] = useState(!!status);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterValues({
            ...filterValues,
            [name]: value,
        });
    };

    const resetFilters = () => {
        setFilterValues({
            status: '',
            type: '',
            start_date: '',
            end_date: '',
        });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();

        Object.entries(filterValues).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        window.location.href = `${route('user.bookings.history')}?${queryParams.toString()}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed':
                return 'Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="w-4 h-4" />;
            case 'cancelled':
                return <XCircleIcon className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'emergency':
                return 'bg-red-100 text-red-800';
            case 'scheduled':
                return 'bg-green-100 text-green-800';
            case 'standard':
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'emergency':
                return 'Darurat';
            case 'scheduled':
                return 'Terjadwal';
            case 'standard':
            default:
                return 'Standar';
        }
    };

    const hasActiveFilters = () => {
        return Object.values(filterValues).some(value => value !== '');
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            notifications={notifications}
            unreadCount={unreadCount}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 sm:mb-0">Riwayat Pemesanan</h2>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            Filter
                            {hasActiveFilters() && (
                                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-600 rounded-full">
                                    {Object.values(filterValues).filter(v => v !== '').length}
                                </span>
                            )}
                        </button>
                        <Link href={route('user.bookings.create')}>
                            <PrimaryButton className="w-full sm:w-auto justify-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                Pesan Ambulans Baru
                            </PrimaryButton>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Riwayat Pemesanan" />

            {/* Success Notification */}
            <NotificationToast
                show={showNotification}
                type="success"
                title="Berhasil!"
                message={status || "Data pemesanan telah diperbarui"}
                onClose={() => setShowNotification(false)}
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <Transition
                        show={showFilters}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 -translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-1"
                    >
                        <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden mb-6 border border-slate-100">
                            <div className="p-5 sm:p-6 lg:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-slate-900">Filter Riwayat Pemesanan</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="text-slate-400 hover:text-slate-500"
                                    >
                                        <span className="sr-only">Tutup</span>
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <form onSubmit={applyFilters} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={filterValues.status}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Semua Status</option>
                                                {filterOptions.statuses.map((status) => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-slate-700">
                                                Tipe Pemesanan
                                            </label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={filterValues.type}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Semua Tipe</option>
                                                {filterOptions.types.map((type) => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="start_date" className="block text-sm font-medium text-slate-700">
                                                Tanggal Mulai
                                            </label>
                                            <input
                                                type="date"
                                                id="start_date"
                                                name="start_date"
                                                value={filterValues.start_date}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="end_date" className="block text-sm font-medium text-slate-700">
                                                Tanggal Akhir
                                            </label>
                                            <input
                                                type="date"
                                                id="end_date"
                                                name="end_date"
                                                value={filterValues.end_date}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                                            Reset
                                        </button>
                                        <PrimaryButton type="submit">
                                            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                            Terapkan Filter
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Transition>

                    {/* Content */}
                    <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100 overflow-hidden">
                        <div className="p-5 sm:p-6 lg:p-8">
                            {bookings.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <DocumentTextIcon className="w-12 h-12 text-slate-300 mx-auto" />
                                    <h3 className="mt-2 text-sm font-semibold text-slate-900">Tidak Ada Riwayat Pemesanan</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Anda belum memiliki riwayat pemesanan ambulans saat ini.
                                    </p>
                                    <div className="mt-6">
                                        <Link href={route('user.bookings.create')}>
                                            <PrimaryButton>
                                                Pesan Ambulans Sekarang
                                            </PrimaryButton>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden overflow-x-auto">
                                        <div className="grid gap-6">
                                            {bookings.data.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="relative bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="p-4 sm:p-5 flex flex-col space-y-4">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                            <div className="flex items-center">
                                                                <h3 className="text-lg font-medium text-slate-900">
                                                                    Pemesanan #{booking.booking_code}
                                                                </h3>
                                                                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(booking.type)}`}>
                                                                    {getTypeLabel(booking.type)}
                                                                </span>
                                                            </div>
                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                                                {getStatusIcon(booking.status)}
                                                                <span className="ml-1">{getStatusLabel(booking.status)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                            <div className="flex items-start">
                                                                <CalendarIcon className="flex-shrink-0 h-5 w-5 text-slate-400 mr-2" />
                                                                <div>
                                                                    <p className="font-medium text-slate-700">Tanggal</p>
                                                                    <p className="text-slate-500">
                                                                        {formatDate(booking.booking_time || booking.created_at)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start">
                                                                <MapPinIcon className="flex-shrink-0 h-5 w-5 text-slate-400 mr-2" />
                                                                <div>
                                                                    <p className="font-medium text-slate-700">Lokasi</p>
                                                                    <p className="text-slate-500">
                                                                        {booking.pickup_location?.substring(0, 40)}{booking.pickup_location?.length > 40 ? '...' : ''}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start">
                                                                <CurrencyDollarIcon className="flex-shrink-0 h-5 w-5 text-slate-400 mr-2" />
                                                                <div>
                                                                    <p className="font-medium text-slate-700">Biaya</p>
                                                                    <p className="text-slate-500">
                                                                        {booking.payment?.amount
                                                                            ? formatCurrency(booking.payment.amount)
                                                                            : 'Tidak tersedia'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start">
                                                                <ClockIcon className="flex-shrink-0 h-5 w-5 text-slate-400 mr-2" />
                                                                <div>
                                                                    <p className="font-medium text-slate-700">Durasi</p>
                                                                    <p className="text-slate-500">
                                                                        {booking.completed_at && booking.started_at
                                                                            ? `${Math.round((new Date(booking.completed_at) - new Date(booking.started_at)) / 60000)} menit`
                                                                            : 'Tidak tersedia'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border-t border-slate-100 pt-4 flex items-center justify-end">
                                                            <Link
                                                                href={route('user.bookings.show', booking.id)}
                                                                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                            >
                                                                <DocumentTextIcon className="h-4 w-4 mr-2" />
                                                                Detail Pemesanan
                                                                <ChevronRightIcon className="ml-1 h-4 w-4" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {bookings.links && bookings.links.length > 3 && (
                                        <div className="mt-4">
                                            <Pagination links={bookings.links} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
