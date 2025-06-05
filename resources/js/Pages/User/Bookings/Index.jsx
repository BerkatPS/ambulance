    import { useState, Fragment } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import Pagination from '@/Components/Common/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
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
    DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { Transition } from '@headlessui/react';
import { confirmAlert, successToast, errorToast } from '@/Utils/SweetAlert';

export default function BookingsIndex({ auth, bookings, filters, filterOptions, notifications = [], unreadCount = 0 }) {
    const [filterValues, setFilterValues] = useState({
        status: filters.status || '',
        type: filters.type || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const [showFilters, setShowFilters] = useState(false);

    const { delete: destroy, processing } = useForm();

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

        window.location.href = `${route('user.bookings.index')}?${queryParams.toString()}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'dispatched':
                return 'bg-purple-100 text-purple-800';
            case 'in_progress':
                return 'bg-indigo-100 text-indigo-800';
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
            case 'pending':
                return 'Menunggu Konfirmasi';
            case 'confirmed':
                return 'Dikonfirmasi';
            case 'dispatched':
                return 'Ambulans Dikirim';
            case 'in_progress':
                return 'Dalam Perjalanan';
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
            case 'pending':
                return <ExclamationTriangleIcon className="w-4 h-4" />;
            case 'confirmed':
                return <InformationCircleIcon className="w-4 h-4" />;
            case 'dispatched':
                return <TruckIcon className="w-4 h-4" />;
            case 'in_progress':
                return <ClockIcon className="w-4 h-4" />;
            case 'completed':
                return <CheckCircleIcon className="w-4 h-4" />;
            case 'cancelled':
                return <XCircleIcon className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getTypeBadgeClass = (type) => {
        return type === 'emergency'
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800';
    };

    const getTypeLabel = (type) => {
        return type === 'emergency' ? 'Darurat' : 'Terjadwal';
    };

    const hasActiveFilters = () => {
        return Object.values(filterValues).some(value => value !== '');
    };

    const handleCancelBooking = (bookingId) => {
        confirmAlert(
            'Batalkan Pemesanan?',
            'Anda yakin ingin membatalkan pemesanan ambulans ini? Tindakan ini tidak dapat dibatalkan.',
            'Ya, Batalkan',
            'Tidak, Kembali'
        ).then((result) => {
            if (result.isConfirmed) {
                // Proses pembatalan dengan metode DELETE
                destroy(route('user.bookings.cancel', bookingId), {
                    onSuccess: () => {
                        successToast('Pemesanan ambulans berhasil dibatalkan');
                    },
                    onError: () => {
                        errorToast('Gagal membatalkan pemesanan. Silakan coba lagi.');
                    }
                });
            }
        });
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            notifications={notifications}
            unreadCount={unreadCount}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Riwayat Pemesanan Ambulans</h2>

                </div>
            }
        >
            <Head title="Riwayat Pemesanan Ambulans" />

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
                        <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6 border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Filter Pemesanan</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Tutup</span>
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <form onSubmit={applyFilters} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={filterValues.status}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Semua Status</option>
                                                {filterOptions.statuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {getStatusLabel(status)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                                Tipe
                                            </label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={filterValues.type}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Semua Tipe</option>
                                                {filterOptions.types.map((type) => (
                                                    <option key={type} value={type}>
                                                        {getTypeLabel(type)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                                Tanggal Mulai
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="start_date"
                                                    id="start_date"
                                                    value={filterValues.start_date}
                                                    onChange={handleFilterChange}
                                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                                Tanggal Akhir
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="end_date"
                                                    id="end_date"
                                                    value={filterValues.end_date}
                                                    onChange={handleFilterChange}
                                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                            Terapkan Filter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Transition>

                    {/* Bookings List */}
                    <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-gray-200">
                        {bookings.data.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {bookings.data.map((booking) => (
                                    <div key={booking.id} className="p-4 sm:p-6 hover:bg-gray-50">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(booking.type)} mr-2`}>
                                                        {getTypeLabel(booking.type)}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)} mt-1 sm:mt-0`}>
                                                        {getStatusIcon(booking.status)}
                                                        <span className="ml-1">{getStatusLabel(booking.status)}</span>
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                    Pemesanan #{booking.reference_number}
                                                </h3>

                                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        <span>
                                                            {formatDate(booking.scheduled_at)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        <span>
                                                            {booking.pickup_location ? `${booking.pickup_location.substring(0, 30)}${booking.pickup_location.length > 30 ? '...' : ''}` : 'Lokasi tidak tersedia'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        <span className="flex items-center">
                                                            {booking.payment_status === 'paid' ? (
                                                                <><span className="inline-flex items-center justify-center w-2 h-2 mr-1.5 bg-success rounded-full"></span>Lunas</>
                                                            ) : (
                                                                <><span className="inline-flex items-center justify-center w-2 h-2 mr-1.5 bg-warning rounded-full"></span>Belum Lunas</>
                                                            )}
                                                            - {formatCurrency(booking.total_amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                                                <Link
                                                    href={route('user.bookings.show', booking.id)}
                                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
                                                >
                                                    <DocumentTextIcon className="mr-2 h-4 w-4" />
                                                    Detail
                                                </Link>
                                                {['pending', 'confirmed'].includes(booking.status) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        disabled={processing}
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed"
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Memproses...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircleIcon className="mr-2 h-4 w-4" />
                                                                Batalkan
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                    <TruckIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pemesanan</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Anda belum memiliki riwayat pemesanan ambulans.
                                </p>
                                <div className="mt-6">
                                    <Link href={route('user.bookings.create')}>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
                                        >
                                            <TruckIcon className="mr-2 h-5 w-5" />
                                            Pesan Ambulans Sekarang
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {bookings.data.length > 0 && (
                        <div className="mt-6">
                            <Pagination links={bookings.links} />
                        </div>
                    )}
                </div>
            </div>
        </UserDashboardLayout>
    );
}
