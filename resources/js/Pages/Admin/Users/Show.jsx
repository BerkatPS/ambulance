import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    CreditCardIcon,
    ClockIcon,
    StarIcon
} from '@heroicons/react/24/outline';

export default function UserShow({ auth, user, bookings, payments }) {
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
    
    // Get booking status badge class
    const getBookingStatusBadgeClass = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            dispatched: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-indigo-100 text-indigo-800'
        };
        
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Translate booking status
    const translateBookingStatus = (status) => {
        const statusTranslations = {
            completed: 'SELESAI',
            cancelled: 'DIBATALKAN',
            dispatched: 'DIKIRIM',
            in_progress: 'DALAM PERJALANAN',
            pending: 'MENUNGGU',
            confirmed: 'DIKONFIRMASI'
        };
        
        return statusTranslations[status] || status.replace('_', ' ').toUpperCase();
    };
    
    // Translate ambulance type
    const translateAmbulanceType = (type) => {
        const typeTranslations = {
            basic: 'Dasar',
            advanced: 'Lanjutan',
            icu: 'ICU',
            neonatal: 'Neonatal',
            patient_transport: 'Transportasi Pasien'
        };
        
        return typeTranslations[type] || type;
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title={`Pengguna: ${user.name}`}>
            <Head title={`Pengguna: ${user.name}`} />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <div>
                                        <Link 
                                            href={route('admin.dashboard')} 
                                            className="text-gray-400 hover:text-primary-600"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <Link 
                                            href={route('admin.users.index')} 
                                            className="ml-4 text-gray-400 hover:text-primary-600"
                                        >
                                            Pengguna
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <span className="ml-4 text-gray-500 font-medium">{user.name}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Detail dan riwayat pengguna
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Kembali ke Daftar
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* User Information */}
                        <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Informasi Pengguna</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail pribadi dan informasi akun.</p>
                                </div>
                                <div>
                                    <dl>
                                        <div className="bg-gray-50 px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Nama Lengkap
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.name}</dd>
                                        </div>
                                        <div className="bg-white px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Email
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.email}</dd>
                                        </div>
                                        <div className="bg-gray-50 px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Nomor Telepon
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {user.phone || 'Belum disediakan'}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Terdaftar Pada
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {formatDate(user.created_at)}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Alamat Default
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {user.address || 'Tidak ada alamat default tersimpan'}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Status
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                                                    user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status === 'active' ? 'Aktif' : 
                                                     user.status === 'inactive' ? 'Tidak Aktif' : 
                                                     'Ditangguhkan'}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {/* Recent Bookings */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold leading-6 text-gray-900">Pemesanan Terbaru</h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Daftar pemesanan ambulans terbaru.</p>
                                        </div>
                                        <Link
                                            href={route('admin.bookings.index', { user_id: user.id })}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                        >
                                            Lihat Semua
                                        </Link>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ambulans
                                                </th>
                                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pembayaran
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings && bookings.length > 0 ? (
                                                bookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50">
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <Link
                                                                href={route('admin.bookings.show', booking.id)}
                                                                className="text-primary-600 hover:text-primary-900"
                                                            >
                                                                #{booking.id}
                                                            </Link>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDateTime(booking.created_at)}
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {booking.ambulance ? (
                                                                <span>{booking.ambulance.vehicle_code} ({translateAmbulanceType(booking.ambulance.type)})</span>
                                                            ) : (
                                                                <span className="text-gray-400">Belum ditugaskan</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${getBookingStatusBadgeClass(booking.status)}`}>
                                                                {translateBookingStatus(booking.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {booking.payment ? (
                                                                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
                                                                    booking.payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                                    booking.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {booking.payment.status === 'paid' ? 'LUNAS' : 
                                                                     booking.payment.status === 'pending' ? 'MENUNGGU' : 
                                                                     'GAGAL'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">Belum dibayar</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        Pengguna belum memiliki pemesanan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="space-y-6">
                            {/* User Stats */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Statistik Pengguna</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Ringkasan aktivitas pengguna.</p>
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <dl className="grid grid-cols-1 gap-5">
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border border-slate-100">
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Pemesanan</dt>
                                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{user.total_bookings || 0}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border border-slate-100">
                                            <dt className="truncate text-sm font-medium text-gray-500">Pemesanan Bulan Ini</dt>
                                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{user.monthly_bookings || 0}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border border-slate-100">
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Pembayaran</dt>
                                            <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{formatCurrency(user.total_payments || 0)}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border border-slate-100">
                                            <dt className="truncate text-sm font-medium text-gray-500">Rating Rata-Rata</dt>
                                            <dd className="mt-1 flex items-center">
                                                <span className="text-2xl font-semibold tracking-tight text-gray-900 mr-2">{user.average_rating ? user.average_rating.toFixed(1) : 'N/A'}</span>
                                                {user.average_rating && (
                                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {/* Payment Summary */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold leading-6 text-gray-900">Ringkasan Pembayaran</h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Status pembayaran terakhir.</p>
                                        </div>
                                        <Link
                                            href={route('admin.payments.index', { user_id: user.id })}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                        >
                                            Lihat Semua
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Lunas</span>
                                            <span className="font-semibold text-green-600">{formatCurrency(user.paid_payments || 0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Menunggu</span>
                                            <span className="font-semibold text-yellow-600">{formatCurrency(user.pending_payments || 0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Gagal</span>
                                            <span className="font-semibold text-red-600">{formatCurrency(user.failed_payments || 0)}</span>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-gray-200">
                                            <div className="flex justify-between items-center font-semibold">
                                                <span className="text-sm text-gray-900">Total Pembayaran</span>
                                                <span className="text-primary-600">{formatCurrency(user.total_payments || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
