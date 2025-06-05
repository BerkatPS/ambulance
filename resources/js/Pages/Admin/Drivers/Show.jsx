import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    UserCircleIcon,
    IdentificationIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    TruckIcon,
    MapPinIcon,
    DocumentTextIcon,
    ClockIcon,
    StarIcon
} from '@heroicons/react/24/outline';

export default function DriverShow({ auth, driver, recentBookings, stats }) {
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Format time
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Format datetime
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    // Get status badge class
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            available: 'bg-green-100 text-green-800',
            busy: 'bg-blue-100 text-blue-800',
            off: 'bg-slate-100 text-slate-800'
        };
        
        return statusClasses[status] || 'bg-slate-100 text-slate-800';
    };
    
    // Status management forms
    const availableForm = useForm({});
    const busyForm = useForm({});
    const offForm = useForm({});
    
    const handleSetAvailable = (e) => {
        e.preventDefault();
        availableForm.post(route('admin.drivers.set-available', driver.id));
    };
    
    const handleSetBusy = (e) => {
        e.preventDefault();
        busyForm.post(route('admin.drivers.set-busy', driver.id));
    };
    
    const handleSetOff = (e) => {
        e.preventDefault();
        offForm.post(route('admin.drivers.set-off', driver.id));
    };
    
    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Pengemudi</h2>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.drivers.edit', driver.id)}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('admin.drivers.index')}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Pengemudi - ${driver.name}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3 space-y-6">
                            {/* Breadcrumbs */}
                            <nav className="flex mb-5" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link href={route('admin.dashboard')} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <ChevronRightIcon className="w-3 h-3 text-gray-400 mx-1" />
                                            <Link href={route('admin.drivers.index')} className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2">
                                                Pengemudi
                                            </Link>
                                        </div>
                                    </li>
                                    <li aria-current="page">
                                        <div className="flex items-center">
                                            <ChevronRightIcon className="w-3 h-3 text-gray-400 mx-1" />
                                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                                {driver.name}
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                            
                            {/* Driver Info */}
                            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                                <div className="px-4 py-6 sm:px-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                                            <UserCircleIcon className="h-10 w-10 text-gray-600" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900">{driver.name}</h3>
                                            <div className="mt-1 flex items-center">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeClass(driver.status)}`}>
                                                    {driver.status === 'available' ? 'Tersedia' : 
                                                     driver.status === 'busy' ? 'Sibuk' : 'Tidak Bertugas'}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">ID Pegawai: {driver.employee_id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <IdentificationIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Nomor Lisensi
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{driver.license_number}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Tanggal Kadaluarsa Lisensi
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(driver.license_expiry)}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Telepon
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{driver.phone}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Email
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{driver.email || 'Tidak ada'}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Tanggal Bergabung
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(driver.hire_date)}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Gaji Pokok
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(driver.base_salary)}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <TruckIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                Ambulans
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {driver.ambulance ? (
                                                    <Link 
                                                        href={route('admin.ambulances.show', driver.ambulance.id)} 
                                                        className="text-primary-600 hover:text-primary-900 flex items-center"
                                                    >
                                                        {driver.ambulance.registration_number} - {driver.ambulance.model}
                                                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-500">Tidak ada ambulans yang ditugaskan</span>
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {/* Status management card */}
                            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 mt-5">
                                <div className="p-5 sm:p-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Pengaturan Status</h3>
                                    <div className="mt-2 grid grid-cols-3 gap-3">
                                        <button
                                            onClick={handleSetAvailable}
                                            disabled={driver.status === 'available' || availableForm.processing}
                                            className={`w-full inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                                                driver.status === 'available' 
                                                    ? 'bg-green-50 text-green-700 ring-green-600/20 cursor-default' 
                                                    : 'bg-white text-gray-900 ring-gray-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {availableForm.processing ? 'Memproses...' : 'Tersedia'}
                                        </button>
                                        <button
                                            onClick={handleSetBusy}
                                            disabled={driver.status === 'busy' || busyForm.processing}
                                            className={`w-full inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                                                driver.status === 'busy' 
                                                    ? 'bg-blue-50 text-blue-700 ring-blue-600/20 cursor-default' 
                                                    : 'bg-white text-gray-900 ring-gray-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {busyForm.processing ? 'Memproses...' : 'Sibuk'}
                                        </button>
                                        <button
                                            onClick={handleSetOff}
                                            disabled={driver.status === 'off' || offForm.processing}
                                            className={`w-full inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                                                driver.status === 'off' 
                                                    ? 'bg-slate-50 text-slate-700 ring-slate-600/20 cursor-default' 
                                                    : 'bg-white text-gray-900 ring-gray-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {offForm.processing ? 'Memproses...' : 'Tidak Bertugas'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/3 space-y-6">
                            {/* Driver Statistics */}
                            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                                <div className="p-5 sm:p-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Statistik Pengemudi</h3>
                                    <dl className="mt-5 grid grid-cols-2 gap-5">
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-inset ring-gray-200 sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Pemesanan</dt>
                                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.totalBookings}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-inset ring-gray-200 sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Pemesanan Selesai</dt>
                                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.completedBookings}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-inset ring-gray-200 sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Rating</dt>
                                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                                {typeof stats.rating === 'number' ? stats.rating.toFixed(1) : '0.0'} <span className="text-lg text-yellow-500">★</span>
                                            </dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-inset ring-gray-200 sm:p-6">
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Perjalanan</dt>
                                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.totalTrips || 0}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Bookings */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                        <div className="p-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Pemesanan Terbaru</h3>
                            {recentBookings && recentBookings.length > 0 ? (
                                <div className="mt-6 flow-root">
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">No. Pemesanan</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pasien</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                            <span className="sr-only">Aksi</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {recentBookings.map((booking) => (
                                                        <tr key={booking.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{booking.booking_number || `#${booking.id}`}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {booking.user ? booking.user.name : (booking.patient_name || 'N/A')}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(booking.created_at)}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getBookingStatusClass(booking.status)}`}>
                                                                    {getBookingStatusLabel(booking.status)}
                                                                </span>
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                <Link
                                                                    href={route('admin.bookings.show', booking.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                >
                                                                    Detail<span className="sr-only">, {booking.booking_number || `#${booking.id}`}</span>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    Tidak ada pemesanan terbaru
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}

function getBookingStatusClass(status) {
    const statusClasses = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'accepted': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800',
        'cancelled': 'bg-gray-100 text-gray-800',
        'completed': 'bg-blue-100 text-blue-800'
    };
    
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

function getBookingStatusLabel(status) {
    const statusLabels = {
        'pending': 'Menunggu',
        'accepted': 'Diterima',
        'rejected': 'Ditolak',
        'cancelled': 'Dibatalkan',
        'completed': 'Selesai'
    };
    
    return statusLabels[status] || 'Tidak diketahui';
}
