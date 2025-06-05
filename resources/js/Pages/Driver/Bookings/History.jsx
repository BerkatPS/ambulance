import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DriverDashboardLayout from '@/Layouts/DriverDashboardLayout';
import { 
    CalendarIcon, 
    ClockIcon, 
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    ArrowPathIcon,
    FunnelIcon,
    XCircleIcon,
    CurrencyDollarIcon,
    TruckIcon,
    BanknotesIcon,
    StarIcon,
    EyeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/Components/Common/Pagination';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import moment from 'moment';

export default function BookingHistory({ bookings, filters, driver, driverAmbulance, urgencyOptions, statusOptions, perPageOptions, currentPerPage }) {
    const [searchParams, setSearchParams] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        urgency: filters.urgency || '',
        per_page: currentPerPage || 10,
    });
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak ditentukan';
        
        try {
            return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Error format tanggal';
        }
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
    };
    
    const formatTimeAgo = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).fromNow();
    };
    
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'Rp 0';
        
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };
    
    const getBookingStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Menunggu
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Dikonfirmasi
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <TruckIcon className="h-3 w-3 mr-1" />
                        Dalam Perjalanan
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Selesai
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        Dibatalkan
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Tidak Diketahui
                    </span>
                );
        }
    };
    
    const getBookingTypeBadge = (type) => {
        switch (type) {
            case 'emergency':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Darurat
                    </span>
                );
            case 'scheduled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Terjadwal
                    </span>
                );
            case 'non_emergency':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Non-Darurat
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Umum
                    </span>
                );
        }
    };
    
    const getPaymentStatusBadge = (payment) => {
        if (!payment) return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Belum Ada Pembayaran
            </span>
        );
        
        switch (payment.status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Lunas
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Menunggu Pembayaran
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        Gagal
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Status Tidak Diketahui
                    </span>
                );
        }
    };
    
    const handleFilterChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };
    
    const resetFilters = () => {
        setSearchParams({
            status: '',
            date_from: '',
            date_to: '',
            urgency: '',
            per_page: 10,
        });
    };
    
    const applyFilters = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        queryParams.append('history', '1');
        
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });
        
        window.location.href = `${route('driver.bookings.history')}?${queryParams.toString()}`;
    };

    return (
        <DriverDashboardLayout
            title="Riwayat Pemesanan"
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Riwayat Pemesanan</h2>
                    <div className="mt-3 sm:mt-0">
                        <Link 
                            href={route('driver.bookings.index')}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Lihat Pemesanan Aktif
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Riwayat Pemesanan" />
            
            <div className="space-y-6">
                {/* Driver Ambulance Info */}
                {driverAmbulance && (
                    <div className="text-sm text-gray-500 bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center">
                            <TruckIcon className="h-4 w-4 mr-1 text-gray-500" />
                            <span>Ambulans: {driverAmbulance.vehicle_code} ({driverAmbulance.license_plate})</span>
                        </div>
                    </div>
                )}
                
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                        <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-base font-medium text-gray-900">Filter Riwayat Pemesanan</h3>
                    </div>
                    <div className="px-5 py-4">
                        <form onSubmit={applyFilters}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={searchParams.status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    >
                                        <option value="">Semua Status</option>
                                        {Object.entries(statusOptions || {}).filter(([value]) => 
                                            ['completed', 'cancelled'].includes(value)
                                        ).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Tingkat Urgensi</label>
                                    <select
                                        id="urgency"
                                        name="urgency"
                                        value={searchParams.urgency}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    >
                                        <option value="">Semua Urgensi</option>
                                        {Object.entries(urgencyOptions || {}).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                                    <input
                                        type="date"
                                        id="date_from"
                                        name="date_from"
                                        value={searchParams.date_from}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        id="date_to"
                                        name="date_to"
                                        value={searchParams.date_to}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="per_page" className="block text-sm font-medium text-gray-700">Tampilkan</label>
                                    <select
                                        id="per_page"
                                        name="per_page"
                                        value={searchParams.per_page}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    >
                                        {(perPageOptions || [5, 10, 25, 50]).map((option) => (
                                            <option key={option} value={option}>{option} per halaman</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-end sm:space-x-3">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mb-2 sm:mb-0 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    Reset Filter
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    Terapkan Filter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Bookings List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-base font-medium text-gray-900">Daftar Riwayat Pemesanan</h3>
                        <span className="text-sm text-gray-500">
                            Total: {bookings.total} pemesanan
                        </span>
                    </div>
                    
                    {bookings.data.length > 0 ? (
                        <div>
                            <div className="hidden sm:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pemesanan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Lokasi
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pelanggan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pembayaran
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.data.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${
                                                                booking.urgency === 'emergency' ? 'bg-red-100' : 
                                                                booking.urgency === 'urgent' ? 'bg-orange-100' : 'bg-blue-100'
                                                            } flex items-center justify-center`}>
                                                                <TruckIcon className={`h-6 w-6 ${
                                                                    booking.urgency === 'emergency' ? 'text-red-600' : 
                                                                    booking.urgency === 'urgent' ? 'text-orange-600' : 'text-primary-600'
                                                                }`} />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    #{booking.booking_number || booking.id}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {getBookingTypeBadge(booking.urgency)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                                            <span className="font-medium">Dari:</span> {booking.pickup_location}
                                                            {booking.pickup_region && <span className="text-xs text-gray-500 ml-1">({booking.pickup_region.name})</span>}
                                                        </div>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            <span className="font-medium">Ke:</span> {booking.destination}
                                                            {booking.destination_region && <span className="text-xs text-gray-500 ml-1">({booking.destination_region.name})</span>}
                                                        </div>
                                                        {booking.distance && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Jarak: {booking.distance} km
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {booking.user && (
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                                                    {booking.user.name?.charAt(0) || 'U'}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {booking.user.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {booking.user.phone}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {formatDateShort(booking.created_at)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatTimeAgo(booking.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getBookingStatusBadge(booking.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getPaymentStatusBadge(booking.payment)}
                                                        {booking.payment && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {formatCurrency(booking.payment.amount)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link 
                                                            href={route('driver.bookings.show', booking.id)} 
                                                            className="inline-flex items-center text-primary-600 hover:text-primary-900"
                                                        >
                                                            <EyeIcon className="h-4 w-4 mr-1" />
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            {/* Mobile view */}
                            <div className="sm:hidden">
                                <div className="divide-y divide-gray-200">
                                    {bookings.data.map((booking) => (
                                        <div key={booking.id} className="px-5 py-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <div className={`p-2 rounded-md ${
                                                            booking.urgency === 'emergency' ? 'bg-red-100' : 
                                                            booking.urgency === 'urgent' ? 'bg-orange-100' : 'bg-blue-100'
                                                        } flex items-center justify-center`}>
                                                            <CalendarIcon className={`h-5 w-5 ${
                                                                booking.urgency === 'emergency' ? 'text-red-500' : 
                                                                booking.urgency === 'urgent' ? 'text-orange-500' : 'text-primary-500'
                                                            }`} />
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium text-gray-900">#{booking.booking_number || booking.id}</span>
                                                            <span className="ml-2">{getBookingStatusBadge(booking.status)}</span>
                                                        </div>
                                                        <div className="mt-1 text-sm text-gray-500">
                                                            <p className="flex items-start mb-1">
                                                                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                                <span className="truncate">{booking.pickup_location}</span>
                                                            </p>
                                                            <p className="flex items-start">
                                                                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                                <span className="truncate">{booking.destination}</span>
                                                            </p>
                                                        </div>
                                                        {booking.user && (
                                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                                <UserIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                                                                <span>{booking.user.name}</span>
                                                            </div>
                                                        )}
                                                        <div className="mt-1 flex items-center text-xs text-gray-500">
                                                            <ClockIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                                                            <span>{formatTimeAgo(booking.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-2">
                                                    <Link 
                                                        href={route('driver.bookings.show', booking.id)} 
                                                        className="inline-flex items-center text-primary-600 hover:text-primary-900"
                                                    >
                                                        <ChevronRightIcon className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        
                            {/* Pagination */}
                            <div className="px-5 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Menampilkan {bookings.from || 0} sampai {bookings.to || 0} dari {bookings.total} pemesanan
                                    </div>
                                    <Pagination links={bookings.links} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada riwayat pemesanan</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Pemesanan yang telah selesai atau dibatalkan akan muncul di sini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DriverDashboardLayout>
    );
}
