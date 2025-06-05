import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatDate } from '@/Utils/formatters';
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
    UserCircleIcon,
    PhoneIcon,
    ReceiptRefundIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    ClipboardDocumentCheckIcon,
    BanknotesIcon,
    ArrowLeftIcon,
    ChatBubbleLeftEllipsisIcon,
    BuildingOffice2Icon,
    StarIcon, CreditCardIcon, CheckIcon
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import EmergencyPaymentReminder from '@/Components/EmergencyPaymentReminder';
import PaymentReminderNotificationListener from '@/Components/PaymentReminderNotificationListener';
import { confirmAlert, successToast, errorToast } from '@/Utils/SweetAlert';
import {XMarkIcon} from "@heroicons/react/20/solid";
import {UserIcon} from "@heroicons/react/24/solid";

export default function BookingShow({ auth, booking, notifications = [], unreadCount = 0 }) {
    const { errors } = usePage().props;
    const [timeLeft, setTimeLeft] = useState(null);

    const { post, processing } = useForm();

    useEffect(() => {
        if (booking.status === 'pending' && booking.created_at && !booking.payment?.paid_at) {
            const calculateTimeRemaining = () => {
                const createdDate = new Date(booking.created_at);
                const expiryDate = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000); // 24 jam
                const now = new Date();

                if (now >= expiryDate) {
                    setTimeLeft({
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                        expired: true
                    });
                    return;
                }

                const diff = expiryDate - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft({
                    hours,
                    minutes,
                    seconds,
                    expired: false
                });
            };

            calculateTimeRemaining();
            const timer = setInterval(calculateTimeRemaining, 1000);

            return () => clearInterval(timer);
        }
    }, [booking]);

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get payment status text
    const getPaymentStatus = (status) => {
        switch (status) {
            case 'paid':
                return 'Lunas';
            case 'pending':
                return 'Menunggu Pembayaran';
            case 'expired':
                return 'Kedaluwarsa';
            case 'failed':
                return 'Gagal';
            default:
                return status;
        }
    };

    // Get payment status color
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'text-green-700';
            case 'pending':
                return 'text-yellow-700';
            case 'expired':
                return 'text-red-700';
            case 'failed':
                return 'text-red-700';
            default:
                return 'text-gray-700';
        }
    };

    const handleCancelBooking = () => {
        confirmAlert(
            'Batalkan Pemesanan?',
            'Anda yakin ingin membatalkan pemesanan ambulans ini? Tindakan ini tidak dapat dibatalkan.',
            'Ya, Batalkan',
            'Tidak, Kembali'
        ).then((result) => {
            if (result.isConfirmed) {
                // Jalankan proses pembatalan dengan metode POST (bukan DELETE)
                post(route('user.bookings.cancel', booking.id), {
                    onSuccess: () => {
                        successToast('Pemesanan ambulans berhasil dibatalkan');
                    },
                    onError: (errors) => {
                        console.error('Cancel booking error:', errors);
                        errorToast('Gagal membatalkan pemesanan. Silakan coba lagi.');
                    }
                });
            }
        });
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
                return <ExclamationTriangleIcon className="w-5 h-5" />;
            case 'confirmed':
                return <InformationCircleIcon className="w-6 h-6" />;
            case 'dispatched':
                return <TruckIcon className="w-5 h-5" />;
            case 'in_progress':
                return <ClockIcon className="w-5 h-5" />;
            case 'completed':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'cancelled':
                return <XCircleIcon className="w-5 h-5" />;
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

    const needsPayment = booking.payment && booking.payment.status !== 'paid';
    const canCancel = ['pending', 'confirmed'].includes(booking.status);
    const canRate = booking.status === 'completed' && !booking.has_rating;

    // Helper function to format date
    const formatDate = (dateString, options = {}) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const format = options.format || 'full';

        if (format === 'time') {
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Helper for ambulance status label
    const getAmbulanceStatusLabel = (status) => {
        const labels = {
            'available': 'Tersedia',
            'busy': 'Sibuk',
            'maintenance': 'Dalam Perawatan',
            'out_of_service': 'Tidak Beroperasi'
        };
        return labels[status] || status;
    };

    // Helper for ambulance status color
    const getAmbulanceStatusColor = (status) => {
        const colors = {
            'available': 'bg-green-100 text-green-800',
            'busy': 'bg-yellow-100 text-yellow-800',
            'maintenance': 'bg-orange-100 text-orange-800',
            'out_of_service': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Function to get tracking status content based on booking status
    const getTrackingStatusContent = () => {
        const trackingStatuses = [
            { key: 'pending', label: 'Menunggu Pembayaran', description: 'Menunggu pembayaran untuk mengkonfirmasi pemesanan' },
            { key: 'confirmed', label: 'Dikonfirmasi', description: 'Pemesanan telah dikonfirmasi dan menunggu pengiriman ambulans' },
            { key: 'dispatched', label: 'Ambulans Dikirim', description: 'Ambulans sedang dalam perjalanan ke lokasi penjemputan' },
            { key: 'in_progress', label: 'Dalam Proses', description: 'Ambulans sedang dalam perjalanan ke tujuan' },
            { key: 'completed', label: 'Selesai', description: 'Layanan ambulans telah selesai' },
            { key: 'cancelled', label: 'Dibatalkan', description: 'Pemesanan telah dibatalkan' }
        ];

        // Find the current status index
        const currentIndex = trackingStatuses.findIndex(item => item.key === booking.status);
        if (currentIndex === -1) return null; // Status tidak valid

        return (
            <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Status Pemesanan</div>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {trackingStatuses.map((item, index) => {
                        // Skip cancelled status if current status is not cancelled
                        if (item.key === 'cancelled' && booking.status !== 'cancelled') return null;

                        // Don't show completed and later statuses if status is cancelled
                        if (booking.status === 'cancelled' && item.key !== 'cancelled' && index >= trackingStatuses.findIndex(s => s.key === 'completed')) return null;

                        // Calculate if this step is active, completed, or pending
                        const isActive = item.key === booking.status;
                        const isCompleted = index < currentIndex;

                        let lineClass = 'h-1 w-full';
                        let dotClass = 'h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0';
                        let textClass = 'text-xs font-medium';

                        if (isCompleted) {
                            lineClass += ' bg-primary-500';
                            dotClass += ' bg-primary-500 text-white';
                            textClass += ' text-primary-600';
                        } else if (isActive) {
                            lineClass += ' bg-gray-200';
                            dotClass += ' bg-primary-500 text-white';
                            textClass += ' text-primary-600 font-bold';
                        } else {
                            lineClass += ' bg-gray-200';
                            dotClass += ' bg-gray-200';
                            textClass += ' text-gray-500';
                        }

                        // Special case for cancelled
                        if (item.key === 'cancelled') {
                            dotClass = 'h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500 text-white';
                            textClass = 'text-xs font-medium text-red-600 font-bold';
                        }

                        return (
                            <div key={item.key} className="flex flex-col items-center flex-1">
                                <div className="flex items-center w-full">
                                    <div className={dotClass}>
                                        {isCompleted && <CheckIcon className="h-3 w-3 text-white" />}
                                        {isActive && booking.status !== 'cancelled' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        {item.key === 'cancelled' && <XMarkIcon className="h-3 w-3 text-white" />}
                                    </div>
                                    {index < trackingStatuses.length - 1 && index !== currentIndex - 1 && booking.status !== 'cancelled' && (
                                        <div className={lineClass}></div>
                                    )}
                                </div>
                                <div className="text-center mt-1">
                                    <div className={textClass}>
                                        {item.label}
                                    </div>
                                    {isActive && (
                                        <div className="text-xs text-gray-500 mt-1 max-w-[150px]">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            notifications={notifications}
            unreadCount={unreadCount}
        >
            <Head title={`Detail Pemesanan #${booking.booking_code}`} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href={route('user.bookings.index')} className="text-gray-600 hover:text-gray-800">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Detail Pemesanan #{booking.booking_code}</h1>
                    </div>

                    {/* Tombol aksi di desktop */}
                    <div className="hidden md:flex md:space-x-3">
                        {canCancel && (
                            <DangerButton
                                className="text-sm"
                                onClick={handleCancelBooking}
                                disabled={processing}
                            >
                                Batalkan Pemesanan
                            </DangerButton>
                        )}

                        {booking.status === 'completed' && booking.payment && !booking.payment.paid_at && (
                            <PrimaryButton
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                onClick={() => window.location.href = route('bookings.fullpayment', booking.id)}
                            >
                                <CreditCardIcon className="w-5 h-5 mr-2" />
                                Bayar Sekarang
                            </PrimaryButton>
                        )}

                        {canRate && (
                            <PrimaryButton
                                className="text-sm"
                                onClick={() => window.location.href = route('user.create.rating', booking.id)}
                            >
                                <StarIcon className="w-5 h-5 mr-1" /> Beri Rating
                            </PrimaryButton>
                        )}
                    </div>
                </div>

                {/* Status indicators */}
                <div className="mt-3 flex items-center space-x-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${getTypeBadgeClass(booking.type)}`}>
                        {getTypeLabel(booking.type)}
                    </span>
                </div>
            </div>

            {/* Alert untuk booking pending */}
            {booking.status === 'pending' && booking.type === 'regular' && !booking.payment?.paid_at && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <span className="font-medium">Perhatian!</span> Pemesanan ini perlu dibayar dalam {' '}
                                {timeLeft ? (
                                    <span className="font-semibold">
                                        {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                    </span>
                                ) : '24 jam'} {' '}
                                atau akan dibatalkan otomatis.
                            </p>
                            {booking.payment && (
                                <div className="mt-2">
                                    <PrimaryButton
                                        className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400"
                                        onClick={() => window.location.href = route('bookings.fullpayment', booking.id)}
                                    >
                                        <CreditCardIcon className="w-4 h-4 mr-2" />
                                        Bayar Sekarang
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Booking Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient and Contact Information */}
                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Informasi Pasien & Kontak
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Pasien</h4>
                                    <p className="text-gray-900">{booking.patient_name}</p>
                                    {booking.patient_age && (
                                        <p className="text-gray-600 mt-1">Usia: {booking.patient_age} tahun</p>
                                    )}
                                    {booking.condition_notes && (
                                        <div className="mt-2">
                                            <h5 className="text-xs font-medium text-gray-500 mb-1">Kondisi Pasien:</h5>
                                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                                                {booking.condition_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Kontak Darurat</h4>
                                    <p className="text-gray-900">{booking.contact_name}</p>
                                    <p className="text-gray-600 mt-1">
                                        <a href={`tel:${booking.contact_phone}`} className="flex items-center text-primary-600 hover:text-primary-800">
                                            <PhoneIcon className="h-4 w-4 mr-1" />
                                            {booking.contact_phone}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Informasi Lokasi
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-500">Alamat Penjemputan</h4>
                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <p className="text-gray-900 flex items-start">
                                            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <span className="flex-1">{booking.pickup_address}</span>
                                        </p>
                                        {booking.pickup_lat && booking.pickup_lng && (
                                            <div className="text-xs text-gray-500 mt-1 pl-7">
                                                Koordinat: {typeof booking.pickup_lat === 'number' ? booking.pickup_lat.toFixed(6) : booking.pickup_lat}, {typeof booking.pickup_lng === 'number' ? booking.pickup_lng.toFixed(6) : booking.pickup_lng}
                                            </div>
                                        )}
                                        {booking.pickup_time && (
                                            <div className="text-xs text-gray-500 mt-1 pl-7 flex items-center">
                                                <ClockIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                Waktu Penjemputan: {formatDate(booking.pickup_time)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Alamat Tujuan</h4>
                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <p className="text-gray-900 flex items-start">
                                            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <span className="flex-1">{booking.destination_address}</span>
                                        </p>
                                        {booking.destination_lat && booking.destination_lng && (
                                            <div className="text-xs text-gray-500 mt-1 pl-7">
                                                Koordinat: {typeof booking.destination_lat === 'number' ? booking.destination_lat.toFixed(6) : booking.destination_lat}, {typeof booking.destination_lng === 'number' ? booking.destination_lng.toFixed(6) : booking.destination_lng}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Catatan Tambahan</h4>
                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <p className="text-gray-700">{booking.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Ambulance Information (if assigned) */}
                    {booking.ambulance && (
                        <div className="bg-white shadow-sm sm:rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <TruckIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    Informasi Ambulans
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Detail Ambulans</h4>
                                        <p className="flex items-center text-gray-900">
                                            <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            {booking.ambulance?.vehicle_code || 'N/A'} - {booking.ambulance?.license_plate || 'N/A'}
                                        </p>
                                        {booking.ambulance?.status && (
                                            <p className="mt-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAmbulanceStatusColor(booking.ambulance.status)}`}>
                                                    {getAmbulanceStatusLabel(booking.ambulance.status)}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {booking.driver && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Detail Pengemudi</h4>
                                            <p className="flex items-center text-gray-900">
                                                <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                {booking.driver.name}
                                            </p>
                                            {booking.driver.phone && (
                                                <p className="flex items-center text-gray-900 mt-1">
                                                    <a href={`tel:${booking.driver.phone}`} className="flex items-center text-primary-600 hover:text-primary-800">
                                                        <PhoneIcon className="h-4 w-4 mr-1" />
                                                        {booking.driver.phone}
                                                    </a>
                                                </p>
                                            )}
                                            {booking.driver.rating && (
                                                <p className="flex items-center text-gray-900 mt-1">
                                                    <StarIcon className="h-5 w-5 mr-2 text-yellow-400" />
                                                    {booking.driver.rating} / 5.0
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Information */}
                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <BanknotesIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Informasi Pembayaran
                            </h3>

                            {/* Emergency Payment Reminder for real-time notifications */}
                            {booking.isEmergencyPaymentDue && (
                                <EmergencyPaymentReminder
                                    booking={booking}
                                    reminderInterval={booking.paymentReminderInterval || 5000}
                                    isEmergencyPaymentDue={booking.isEmergencyPaymentDue}
                                />
                            )}

                            {booking.payment ? (
                                <div className="space-y-3">
                                    <div className={`mb-4 p-3 rounded-md ${booking.payment.paid_at ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                        <div className="flex items-center">
                                            {booking.payment.paid_at ? (
                                                <CheckCircleIcon className="h-5 w-5 text-success mr-2" />
                                            ) : (
                                                <ExclamationTriangleIcon className="h-5 w-5 text-warning mr-2" />
                                            )}
                                            <span className={`text-sm font-medium ${booking.payment.paid_at ? 'text-green-700' : 'text-yellow-700'}`}>
                                                {getPaymentStatus(booking.payment.status)}
                                            </span>
                                        </div>

                                        {/* Countdown Timer - Tampilkan hanya jika belum dibayar */}
                                        {!booking.payment.paid_at && booking.status === 'pending' && timeLeft && (
                                            <div className="mt-3">
                                                <div className="text-xs text-yellow-700 font-medium mb-2 flex items-center">
                                                    <ClockIcon className="h-4 w-4 mr-1 text-yellow-600" />
                                                    Batas waktu pembayaran:
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="bg-white p-2 rounded-md shadow-sm border border-yellow-100">
                                                        <div className="text-lg font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</div>
                                                        <div className="text-xs text-gray-500">Jam</div>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-md shadow-sm border border-yellow-100">
                                                        <div className="text-lg font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                                        <div className="text-xs text-gray-500">Menit</div>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-md shadow-sm border border-yellow-100">
                                                        <div className="text-lg font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                                        <div className="text-xs text-gray-500">Detik</div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md border border-yellow-100">
                                                    {timeLeft.expired
                                                        ? <div className="flex items-center"><XCircleIcon className="h-4 w-4 mr-1 text-danger" /> Batas waktu pembayaran telah berakhir. Pemesanan akan otomatis dibatalkan.</div>
                                                        : <div className="flex items-center"><InformationCircleIcon className="h-4 w-4 mr-1 text-warning" /> Pemesanan akan otomatis dibatalkan jika tidak dibayar dalam waktu tersisa.</div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-gray-500">Total</p>
                                                <p className="font-medium text-gray-900">{formatRupiah(booking.total_amount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Status</p>
                                                <p className={getPaymentStatusColor(booking.payment.status)}>
                                                    {getPaymentStatus(booking.payment.status)}
                                                </p>
                                            </div>

                                            {booking.type === 'scheduled' && (
                                            <>
                                                <div>
                                                    <p className="text-gray-500">Uang Muka (30%)</p>
                                                    <p className="font-medium text-gray-900">{formatRupiah(booking.downpayment_amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Pelunasan</p>
                                                    <p className="font-medium text-gray-900">{formatRupiah(booking.total_amount - booking.downpayment_amount)}</p>
                                                </div>
                                            </>
                                            )}

                                            {booking.type === 'emergency' && (
                                            <div className="col-span-2">
                                                <p className="text-gray-500">Jenis Pembayaran</p>
                                                <div className="flex items-center">
                                                    <p className="font-medium text-gray-900">Pembayaran Penuh</p>
                                                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                                        Darurat
                                                    </span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {/* Show appropriate payment buttons based on booking type and status */}
                                        {booking.payment.status !== 'paid' && (
                                            <>
                                                {booking.type === 'scheduled' && booking.payment.payment_type === 'downpayment' && (
                                                    <Link href={route('bookings.downpayment', booking.id)} className="w-full">
                                                        <PrimaryButton className="w-full justify-center">
                                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                                            Bayar Uang Muka
                                                        </PrimaryButton>
                                                    </Link>
                                                )}
                                                {booking.type === 'scheduled' && booking.payment.payment_type === 'final_payment' && (
                                                    <Link href={route('bookings.final-payment', booking.id)} className="w-full">
                                                        <PrimaryButton className="w-full justify-center">
                                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                                            Bayar Pelunasan
                                                        </PrimaryButton>
                                                    </Link>
                                                )}
                                                {booking.type === 'emergency' && (
                                                    <Link href={route('bookings.fullpayment', booking.id)} className="w-full">
                                                        <PrimaryButton className="w-full justify-center">
                                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                                            Bayar Layanan Darurat
                                                        </PrimaryButton>
                                                    </Link>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">Informasi pembayaran belum tersedia</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white shadow-sm sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Tindakan
                            </h3>

                            <div className="space-y-3">
                                {canCancel && (
                                    <button
                                        onClick={handleCancelBooking}
                                        disabled={processing}
                                        className="w-full"
                                        type="button"
                                    >
                                        <DangerButton className="w-full justify-center transition duration-150 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed">
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
                                                    <XCircleIcon className="h-5 w-5 mr-2" />
                                                    Batalkan Pemesanan
                                                </>
                                            )}
                                        </DangerButton>
                                    </button>
                                )}

                                {booking.status === 'completed' && canRate && (
                                    <Link href={route('user.create.rating', {id: booking.id})}>
                                        <PrimaryButton className="w-full justify-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                            <StarIcon className="h-5 w-5 mr-2" />
                                            Beri Penilaian
                                        </PrimaryButton>
                                    </Link>
                                )}

                                {booking.status === 'completed' && booking.has_rating && (
                                    <Link href={route('ratings.show', { rating: booking.rating_id })}>
                                        <SecondaryButton className="w-full justify-center">
                                            <StarIcon className="h-5 w-5 mr-2" />
                                            Lihat Penilaian
                                        </SecondaryButton>
                                    </Link>
                                )}

                                <Link href={route('support.create', { booking_id: booking.id })}>
                                    <SecondaryButton className="w-full justify-center">
                                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" />
                                        Hubungi Dukungan
                                    </SecondaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
