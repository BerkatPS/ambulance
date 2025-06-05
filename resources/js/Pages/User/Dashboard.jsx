import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    CalendarIcon,
    StarIcon,
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    MapPinIcon,
    ArrowRightIcon,
    XCircleIcon,
    DocumentCheckIcon,
    ClockIcon as ClockIconSolid,
    BanknotesIcon,
    PlusCircleIcon,
    ExclamationTriangleIcon,
    FireIcon,
    BellAlertIcon,
    ChartBarIcon,
    UserIcon,
    PhoneIcon,
    EyeIcon,
    CreditCardIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import EmergencyPaymentReminder from '@/Components/EmergencyPaymentReminder';
import PaymentReminderNotificationListener from '@/Components/PaymentReminderNotificationListener';

export default function Dashboard({
    auth,
    bookings = [],
    activeBookings = [],
    pendingPayments = [],
    bookingsNeedingRating = 0,
    hasEmergencyPaymentsDue = false,
    stats = {},
    recentPaymentHistory = [],
    notifications = [],
    unreadCount = 0
}) {
    // Status icon display helper
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-600" />;
            case 'confirmed':
            case 'assigned':
                return <DocumentCheckIcon className="h-5 w-5 text-blue-600" />;
            case 'dispatched':
                return <TruckIcon className="h-5 w-5 text-blue-600" />;
            case 'arrived':
                return <MapPinIcon className="h-5 w-5 text-green-600" />;
            case 'enroute':
                return <ClockIconSolid className="h-5 w-5 text-blue-600" />;
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5 text-red-600" />;
            default:
                return <ExclamationCircleIcon className="h-5 w-5 text-gray-600" />;
        }
    };

    // Status color helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
            case 'assigned':
                return 'bg-blue-100 text-blue-800';
            case 'dispatched':
                return 'bg-indigo-100 text-indigo-800';
            case 'arrived':
                return 'bg-teal-100 text-teal-800';
            case 'enroute':
                return 'bg-cyan-100 text-cyan-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Payment status color helper
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Booking type badge helper
    const getBookingTypeBadge = (type) => {
        if (type === 'emergency') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                    <FireIcon className="h-3 w-3 mr-1" />
                    Darurat
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Terjadwal
            </span>
        );
    };

    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID').format(amount || 0);
    };

    // Check if payment reminder is needed
    const hasEmergencyBookingsNeedingPayment = bookings.some(booking =>
        booking.type === 'emergency' &&
        booking.status === 'completed' &&
        booking.isEmergencyPaymentDue
    );

    return (
        <UserDashboardLayout
            title="Dashboard"
            notifications={notifications}
            unreadCount={unreadCount}
        >
            <Head title="Dashboard" />

            {/* Payment reminder components for real-time notification */}
            {hasEmergencyPaymentsDue && (
                <>
                    <PaymentReminderNotificationListener />
                </>
            )}

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl font-heading mb-2">
                            Selamat Datang, {auth?.user?.name || 'Pengguna'}
                        </h1>
                        <p className="text-gray-600 max-w-3xl">
                            Pantau status pemesanan ambulans Anda, lihat riwayat perjalanan, dan kelola pembayaran dari satu tempat yang mudah.
                        </p>
                    </div>

                    {/* Quick Action Buttons - Mobile Friendly */}
                    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:space-x-4">
                        <Link
                            href={route('user.bookings.create')}
                            className="inline-flex items-center justify-center px-4 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl shadow-sm text-sm font-medium transition-colors"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            <span>Pesan Ambulans</span>
                        </Link>

                        <Link
                            href={route('user.bookings.index')}
                            className="inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm text-sm font-medium transition-colors"
                        >
                            <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                            <span>Pemesanan Saya</span>
                        </Link>

                        <Link
                            href={route('user.payments.index')}
                            className="inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm text-sm font-medium transition-colors"
                        >
                            <BanknotesIcon className="h-5 w-5 mr-2 text-primary" />
                            <span>Pembayaran</span>
                        </Link>

                        <Link
                            href={route('profile.edit')}
                            className="inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm text-sm font-medium transition-colors"
                        >
                            <UserIcon className="h-5 w-5 mr-2 text-primary" />
                            <span>Profil Saya</span>
                        </Link>
                    </div>

                    {/* Stats Cards - Responsive Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {/* Total Bookings Stats */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-primary rounded-lg p-3">
                                        <CalendarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Pemesanan</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">{stats.totalBookings || 0}</div>
                                                <div className="flex space-x-2 text-xs text-gray-500">
                                                    <span>{stats.completedBookings || 0} selesai</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span>{stats.emergencyBookings || 0} darurat</span>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm">
                                    <Link href={route('user.bookings.index')} className="font-medium text-primary hover:text-primary-700 flex items-center">
                                        Lihat semua pemesanan
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Total Payments Stats */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-secondary rounded-lg p-3">
                                        <BanknotesIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Pembayaran</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    Rp {formatCurrency(stats.totalPayments)}
                                                </div>
                                                {pendingPayments.length > 0 && (
                                                    <div className="text-xs text-amber-600 font-medium">
                                                        {pendingPayments.length} pembayaran tertunda
                                                    </div>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm">
                                    <Link href={route('user.payments.index')} className="font-medium text-secondary hover:text-secondary-700 flex items-center">
                                        Lihat semua pembayaran
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Rating Stats */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-accent rounded-lg p-3">
                                        <StarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Rating Rata-rata</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">{stats.averageRating || '0.0'}</div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <StarIcon
                                                                key={star}
                                                                className={`h-3.5 w-3.5 ${parseFloat(stats.averageRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="ml-1">({stats.totalRatings || 0} ulasan)</span>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm">
                                    {bookingsNeedingRating > 0 ? (
                                        <Link href={route('user.bookings.index', { filter: 'needs-rating' })} className="font-medium text-accent hover:text-accent-700 flex items-center">
                                            Beri rating ({bookingsNeedingRating})
                                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <span className="text-gray-500">Semua rating lengkap</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Emergency Stats */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-red-500 rounded-lg p-3">
                                        <FireIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Layanan Darurat</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">{stats.emergencyBookings || 0}</div>
                                                <div className="text-xs text-gray-500">
                                                    <span>Permintaan darurat</span>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm">
                                    <Link href={route('user.bookings.create', { type: 'emergency' })} className="font-medium text-red-600 hover:text-red-800 flex items-center">
                                        Permintaan darurat baru
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Bookings Section */}
                    {activeBookings.length > 0 && (
                        <div className="bg-blue-50 overflow-hidden shadow-sm rounded-xl border border-blue-100 mb-8">
                            <div className="px-5 py-4 sm:px-6 border-b border-blue-100 bg-blue-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
                                        <h3 className="text-base font-medium text-blue-800">Pemesanan Aktif</h3>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium">
                                        {activeBookings.length} aktif
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200 bg-white">
                                {activeBookings.map((booking) => (
                                    <div key={booking.id} className="p-5 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="sm:flex sm:items-center sm:justify-between">
                                            <div className="mb-4 sm:mb-0">
                                                <div className="flex items-center mb-2">
                                                    {getBookingTypeBadge(booking.type)}
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Booking #{booking.id}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-3">
                                                    <div className="flex items-start text-sm text-gray-500">
                                                        <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                        <span className="truncate max-w-[200px] sm:max-w-xs">{booking.pickup_address}</span>
                                                    </div>
                                                    <div className="flex items-start text-sm text-gray-500">
                                                        <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                        <span>{booking.booking_time}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center mt-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {getStatusIcon(booking.status)}
                                                        <span className="ml-1 capitalize">{booking.status}</span>
                                                    </span>

                                                    {booking.driver && (
                                                        <span className="ml-3 inline-flex items-center text-xs text-gray-500">
                                                            <UserIcon className="mr-1 h-4 w-4 text-gray-400" />
                                                            Driver: {booking.driver?.name || "Belum ditugaskan"}
                                                        </span>
                                                    )}

                                                    {booking.ambulance && (
                                                        <span className="ml-3 inline-flex items-center text-xs text-gray-500">
                                                            <TruckIcon className="mr-1 h-4 w-4 text-gray-400" />
                                                            {booking.ambulance?.vehicle_code || ""}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:items-end">
                                                <Link
                                                    href={route('user.bookings.show', booking.id)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    <EyeIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                    Lihat Detail
                                                </Link>
                                                {booking.status === 'pending' && booking.type === 'scheduled' && (
                                                    <button
                                                        type="button"
                                                        className="mt-2 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        onClick={() => showCancelModal(booking.id)}
                                                    >
                                                        <XCircleIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                        Batalkan
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm text-center">
                                    <Link href={route('user.bookings.index')} className="font-medium text-primary hover:text-primary-700 flex items-center justify-center">
                                        Lihat semua pemesanan aktif
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Emergency Payment Alert - Improved UI */}
                    {hasEmergencyBookingsNeedingPayment && (
                        <div className="mb-8 bg-red-50 rounded-xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-5 py-4 sm:px-6 border-b border-red-100 bg-red-50">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                                    <h3 className="text-base font-medium text-red-800">Pembayaran Darurat Tertunda</h3>
                                </div>
                            </div>
                            <div className="p-5 sm:p-6">
                                <p className="text-sm text-red-700 mb-4">
                                    Anda memiliki pembayaran untuk layanan ambulans darurat yang perlu diselesaikan.
                                    Pembayaran harus dilunasi dalam waktu <strong>7 hari</strong> setelah layanan selesai untuk menghindari denda keterlambatan.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route('user.bookings.index', { filter: 'emergency' })}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <CreditCardIcon className="mr-2 h-5 w-5" />
                                        Bayar Sekarang
                                    </Link>
                                    <Link
                                        href={route('user.dashboard')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Opsi Pembayaran
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending Payments Section */}
                    {pendingPayments.length > 0 && (
                        <div className="bg-amber-50 overflow-hidden shadow-sm rounded-xl border border-amber-100 mb-8">
                            <div className="px-5 py-4 sm:px-6 border-b border-amber-100 bg-amber-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BanknotesIcon className="h-5 w-5 text-amber-600 mr-2" />
                                        <h3 className="text-base font-medium text-amber-800">Pembayaran Tertunda</h3>
                                    </div>
                                    <span className="bg-amber-100 text-amber-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium">
                                        {pendingPayments.length} pembayaran
                                    </span>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200 bg-white">
                                {pendingPayments.map((payment) => (
                                    <div key={payment.id} className="p-5 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="sm:flex sm:items-center sm:justify-between">
                                            <div className="mb-4 sm:mb-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                                                        {payment.status}
                                                    </span>

                                                    {payment.booking && getBookingTypeBadge(payment.booking.type)}

                                                    {payment.is_approaching_deadline && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <ClockIcon className="mr-1 h-3 w-3" />
                                                            Segera jatuh tempo
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm font-medium text-gray-900">
                                                    {payment.booking ? `Booking #${payment.booking.id}` : "Pembayaran"} -
                                                    <span className="font-bold"> Rp {formatCurrency(payment.amount)}</span>
                                                </p>

                                                <div className="mt-2 grid grid-cols-1 gap-y-1 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <ClockIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                        <span>Dibuat: {payment.formatted_created_at}</span>
                                                    </div>

                                                    {payment.due_date && (
                                                        <div className="flex items-center">
                                                            <CalendarIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                            <span className={payment.is_approaching_deadline ? "text-red-600 font-medium" : ""}>
                                                                Jatuh tempo: {payment.due_date}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:items-end">
                                                <Link
                                                    href={route('payments.show', payment.id)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    <CreditCardIcon className="mr-2 h-5 w-5" />
                                                    Bayar Sekarang
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm text-center">
                                    <Link
                                        href={route('user.payments.index')}
                                        className="font-medium text-primary hover:text-primary-700 flex items-center justify-center"
                                    >
                                        Lihat semua pembayaran
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Bookings */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100 mb-8">
                        <div className="px-5 py-4 sm:px-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                                    <h3 className="text-base font-medium text-gray-900">Pemesanan Terbaru</h3>
                                </div>
                                {bookings.length > 0 && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {bookings.length} pemesanan
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            {bookings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipe
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pembayaran
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rating
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Aksi</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {getBookingTypeBadge(booking.type)}
                                                            <span className="text-sm font-medium text-gray-900 ml-1">
                                                                #{booking.id}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {booking.type === 'scheduled'
                                                                ? booking.formatted_scheduled_at
                                                                : booking.formatted_requested_at}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {getStatusIcon(booking.status)}
                                                            <span className="ml-1 capitalize">{booking.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {booking.payment ? (
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                                                                {booking.payment.status === 'paid' ? (
                                                                    <CheckCircleIcon className="mr-1 h-3 w-3" />
                                                                ) : booking.payment.status === 'pending' ? (
                                                                    <ClockIcon className="mr-1 h-3 w-3" />
                                                                ) : (
                                                                    <XCircleIcon className="mr-1 h-3 w-3" />
                                                                )}
                                                                {booking.payment.status}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-500">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {booking.status === 'completed' ? (
                                                            booking.has_rating ? (
                                                                <div className="flex items-center">
                                                                    <StarIcon className="h-4 w-4 text-yellow-400" />
                                                                    <span className="ml-1 text-xs font-medium">{booking.rating ? booking.rating.overall : '-'}/5</span>
                                                                </div>
                                                            ) : (
                                                                <Link
                                                                    href={route('user.bookings.rate', booking.id)}
                                                                    className="inline-flex items-center text-xs font-medium text-primary hover:text-primary-700"
                                                                >
                                                                    <StarIcon className="mr-1 h-3 w-3" />
                                                                    Beri Rating
                                                                </Link>
                                                            )
                                                        ) : (
                                                            <span className="text-xs text-gray-500">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route('user.bookings.show', booking.id)}
                                                            className="text-primary hover:text-primary-700"
                                                        >
                                                            Detail
                                                        </Link>

                                                        {booking.type === 'emergency' &&
                                                         booking.status === 'completed' &&
                                                         booking.isEmergencyPaymentDue && (
                                                            <Link
                                                                href={route('bookings.fullpayment', booking.id)}
                                                                className="ml-3 text-primary hover:text-primary-700"
                                                            >
                                                                Bayar
                                                            </Link>
                                                        )}

                                                        {booking.status === 'completed' && !booking.has_rating && (
                                                            <Link
                                                                href={route('user.create.rating', {id: booking.id})}
                                                                className="ml-3 text-primary hover:text-primary-700"
                                                            >
                                                                Beri Rating
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pemesanan</h3>
                                    <p className="mt-1 text-sm text-gray-500">Mulai pesan ambulans untuk kebutuhan Anda.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('user.bookings.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                                            Pesan Ambulans
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {bookings.length > 0 && (
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                <div className="text-sm text-center">
                                    <Link
                                        href={route('user.bookings.index')}
                                        className="font-medium text-primary hover:text-primary-700 flex items-center justify-center"
                                    >
                                        Lihat semua riwayat pemesanan
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
