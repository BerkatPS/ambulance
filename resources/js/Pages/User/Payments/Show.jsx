import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChevronLeftIcon,
    DocumentTextIcon,
    CreditCardIcon,
    ArrowDownTrayIcon,
    MapPinIcon,
    CalendarIcon,
    TruckIcon,
    CurrencyDollarIcon,
    UserIcon,
    PhoneIcon,
    ReceiptRefundIcon,
    BanknotesIcon,
    IdentificationIcon,
    BuildingOfficeIcon,
    ArrowPathIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { successToast, errorToast } from '@/Utils/SweetAlert';

export default function PaymentShow({ auth, payment, notifications = [], unreadCount = 0 }) {
    const [checking, setChecking] = useState(false);
    const { post, processing } = useForm();

    // Menentukan jenis pembayaran
    const isDownpayment = payment.payment_type === 'downpayment';
    const isFinalPayment = payment.payment_type === 'final_payment' || payment.payment_type === 'final';
    const isFullPayment = payment.payment_type === 'full_payment';
    const isEmergency = payment.booking?.type === 'emergency';

    // Tentukan apakah pembayaran bisa dilakukan berdasarkan status
    const canPayNow = payment.status === 'pending';

    // Tentukan apakah kita perlu menampilkan instruksi pembayaran
    const hasPaymentInstructions = payment.payment_code || payment.virtual_account || payment.qr_code;

    // Tentukan tombol pembayaran yang sesuai
    const getPaymentButtonLink = () => {
        console.log("Payment type:", payment.payment_type);
        console.log("Booking ID:", payment.booking_id);

        if (!payment.booking_id) {
            return route('payments.pay', payment.id);
        }

        if (isDownpayment) {
            return route('bookings.downpayment', payment.booking_id);
        } else if (isFinalPayment) {
            return route('bookings.final-payment', payment.booking_id);
        } else if (isFullPayment && isEmergency) {
            return route('bookings.fullpayment', payment.booking_id);
        } else {
            return route('payments.pay', payment.id);
        }
    };

    // Fungsi untuk memeriksa status pembayaran
    const checkPaymentStatus = () => {
        setChecking(true);
        post(route('payments.check-status', payment.id), {}, {
            onSuccess: () => {
                successToast('Status pembayaran berhasil diperbarui');
                setChecking(false);
            },
            onError: (errors) => {
                console.error('Check payment status error:', errors);
                errorToast('Gagal memeriksa status pembayaran');
                setChecking(false);
            }
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case 'pending':
                return <ClockIcon className="h-6 w-6 text-yellow-500" />;
            case 'failed':
                return <XCircleIcon className="h-6 w-6 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusTextClass = (status) => {
        switch (status) {
            case 'paid':
                return 'text-green-800 bg-green-100';
            case 'pending':
                return 'text-yellow-800 bg-yellow-100';
            case 'failed':
                return 'text-red-800 bg-red-100';
            default:
                return 'text-gray-800 bg-gray-100';
        }
    };

    const formatPaymentMethod = (method) => {
        if (!method) return 'N/A';

        const methodMap = {
            'qris': 'QRIS',
            'va_bca': 'Virtual Account BCA',
            'va_mandiri': 'Virtual Account Mandiri',
            'va_bri': 'Virtual Account BRI',
            'va_bni': 'Virtual Account BNI',
            'gopay': 'GoPay'
        };

        return methodMap[method] || method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: id });
    };

    const getPaymentTypeLabel = (type) => {
        switch (type) {
            case 'downpayment':
                return 'Uang Muka';
            case 'final_payment':
                return 'Pelunasan';
            case 'full_payment':
                return 'Pembayaran Penuh';
            default:
                return type;
        }
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            notifications={notifications}
            unreadCount={unreadCount}
            header={<h2 className="text-xl font-semibold text-gray-800">Detail Pembayaran</h2>}
        >
            <Head title="Detail Pembayaran" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Back navigation */}
                    <div className="flex items-center mb-2">
                        <Link
                            href={route('user.payments.index')}
                            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            Kembali ke Riwayat Pembayaran
                        </Link>
                    </div>

                    {/* Payment Status Banner */}
                    <div className={`${
                        payment.status === 'paid' ? 'bg-green-50 border-green-200' :
                        payment.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                    } border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between`}>
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className={`${
                                payment.status === 'paid' ? 'bg-green-100 text-green-600' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                            } p-3 rounded-full`}>
                                {getStatusIcon(payment.status)}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {payment.status === 'paid' ? 'Pembayaran Berhasil' :
                                    payment.status === 'pending' ? 'Menunggu Pembayaran' :
                                    'Pembayaran Gagal'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {payment.status === 'paid' ? 'Pembayaran Anda telah berhasil diproses.' :
                                    payment.status === 'pending' ? 'Silakan selesaikan pembayaran Anda.' :
                                    'Pembayaran Anda gagal. Silakan coba lagi.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                            {canPayNow && (
                                <PrimaryButton
                                    as="link"
                                    href={getPaymentButtonLink()}
                                    className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 w-full sm:w-auto justify-center"
                                >
                                    <CreditCardIcon className="h-4 w-4 mr-2" />
                                    {isDownpayment ? 'Bayar Uang Muka' :
                                     isFinalPayment ? 'Bayar Pelunasan' :
                                     isFullPayment && isEmergency ? 'Bayar Layanan Darurat' :
                                     'Bayar Sekarang'}
                                </PrimaryButton>
                            )}
                            {hasPaymentInstructions && payment.status === 'pending' && (
                                <SecondaryButton
                                    as="link"
                                    href={route('payments.instructions', payment.id)}
                                    className="w-full sm:w-auto justify-center"
                                >
                                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                                    Lihat Instruksi
                                </SecondaryButton>
                            )}
                            {payment.status === 'pending' && (
                                <SecondaryButton
                                    onClick={checkPaymentStatus}
                                    disabled={checking || processing}
                                    className="w-full sm:w-auto justify-center"
                                >
                                    {checking ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Memeriksa...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                                            Periksa Status
                                        </>
                                    )}
                                </SecondaryButton>
                            )}
                            {payment.status === 'paid' && (
                                <>
                                    <PrimaryButton
                                        href={route('payments.receipt', payment.id)}
                                        as="button"
                                        className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 w-full sm:w-auto justify-center"
                                        target="_blank"
                                    >
                                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                                        Lihat Kwitansi
                                    </PrimaryButton>
                                    <SecondaryButton
                                        as="link"
                                        href={route('payments.receipt', payment.id)}
                                        target="_blank"
                                        className="w-full sm:w-auto justify-center"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                        Unduh PDF
                                    </SecondaryButton>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Instructions Alert - if pending and has payment instructions */}
                    {payment.status === 'pending' && (hasPaymentInstructions || payment.expiry_time) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Informasi Pembayaran</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {payment.payment_code && (
                                                <li>Kode Pembayaran: <span className="font-medium">{payment.payment_code}</span></li>
                                            )}
                                            {payment.virtual_account && (
                                                <li>Nomor Virtual Account: <span className="font-medium">{payment.virtual_account}</span></li>
                                            )}
                                            {payment.expiry_time && (
                                                <li>Pembayaran Berakhir: <span className="font-medium">{formatDate(payment.expiry_time)}</span></li>
                                            )}
                                            <li>
                                                Untuk melihat instruksi pembayaran lengkap, silakan klik tombol
                                                <Link
                                                    href={route('payments.instructions', payment.id)}
                                                    className="ml-1 font-medium text-blue-700 underline"
                                                >
                                                    "Lihat Instruksi"
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment Information */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center">
                                <ReceiptRefundIcon className="h-5 w-5 mr-2 text-gray-500" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Informasi Pembayaran
                                </h3>
                            </div>

                            <div className="px-4 sm:px-6 py-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div>
                                        <dl className="space-y-5">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Nomor Referensi</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                    <IdentificationIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    {payment.transaction_id || payment.duitku_reference || `PAY-${payment.id}`}
                                                </dd>
                                            </div>

                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Tanggal Pembayaran</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatDate(payment.created_at)}
                                                </dd>
                                            </div>

                                            {payment.paid_at && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Tanggal Dibayar</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                        {formatDate(payment.paid_at)}
                                                    </dd>
                                                </div>
                                            )}

                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Jenis Pembayaran</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                    <BanknotesIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    {getPaymentTypeLabel(payment.payment_type)}
                                                    {isEmergency && <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Darurat</span>}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Right Column */}
                                    <div>
                                        <dl className="space-y-5">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Metode Pembayaran</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                    <CreditCardIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatPaymentMethod(payment.method)}
                                                </dd>
                                            </div>

                                            {payment.transaction_id && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">ID Transaksi</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                        <IdentificationIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                        {payment.transaction_id}
                                                    </dd>
                                                </div>
                                            )}

                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                <dd className="mt-1 flex items-center">
                                                    {getStatusIcon(payment.status)}
                                                    <span className={`ml-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusTextClass(payment.status)}`}>
                                                        {payment.status === 'paid' ? 'Lunas' :
                                                        payment.status === 'pending' ? 'Menunggu Pembayaran' :
                                                        payment.status === 'failed' ? 'Gagal' : payment.status}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Summary */}
                            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-base font-medium text-gray-900 flex items-center">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Total Pembayaran
                                    </h4>
                                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center">
                                <TruckIcon className="h-5 w-5 mr-2 text-gray-500" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Informasi Pemesanan
                                </h3>
                            </div>

                            <div className="px-4 sm:px-6 py-5">
                                {payment.booking ? (
                                    <dl className="space-y-5">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">ID Pemesanan</dt>
                                            <dd className="mt-1">
                                                <Link
                                                    href={route('user.bookings.show', payment.booking_id)}
                                                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                                >
                                                    <IdentificationIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    #{payment.booking.booking_code || payment.booking_id}
                                                </Link>
                                            </dd>
                                        </div>

                                        {payment.booking.type && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Jenis Pemesanan</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                    <TruckIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    {payment.booking.type === 'standard' ? 'Standar' :
                                                     payment.booking.type === 'emergency' ? 'Darurat' :
                                                     payment.booking.type === 'scheduled' ? 'Terjadwal' : payment.booking.type}
                                                </dd>
                                            </div>
                                        )}

                                        {payment.booking.status && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Status Pemesanan</dt>
                                                <dd className="mt-1 text-sm flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        payment.booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        payment.booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        payment.booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        payment.booking.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' :
                                                        payment.booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {payment.booking.status === 'completed' ? 'Selesai' :
                                                         payment.booking.status === 'cancelled' ? 'Dibatalkan' :
                                                         payment.booking.status === 'confirmed' ? 'Dikonfirmasi' :
                                                         payment.booking.status === 'in_progress' ? 'Dalam Perjalanan' :
                                                         payment.booking.status === 'pending' ? 'Menunggu' : payment.booking.status}
                                                    </span>
                                                </dd>
                                            </div>
                                        )}

                                        {payment.booking.scheduled_time && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Waktu Terjadwal</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatDate(payment.booking.scheduled_time)}
                                                </dd>
                                            </div>
                                        )}

                                        {payment.booking.pickup_address && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Lokasi Penjemputan</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex">
                                                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{payment.booking.pickup_address}</span>
                                                </dd>
                                            </div>
                                        )}

                                        {payment.booking.destination_address && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Lokasi Tujuan</dt>
                                                <dd className="mt-1 text-sm text-gray-900 flex">
                                                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{payment.booking.destination_address}</span>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                ) : (
                                    <div className="text-center py-5">
                                        <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">Informasi pemesanan tidak tersedia</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment details section */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Detail Pembayaran
                            </h3>

                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-indigo-100 rounded-full mr-3">
                                                <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Nomor Pembayaran</div>
                                                <div className="font-medium">{payment.invoice_number || `INV-${payment.id}`}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-indigo-100 rounded-full mr-3">
                                                <IdentificationIcon className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Jenis Pembayaran</div>
                                                <div className="font-medium">
                                                    {getPaymentTypeLabel(payment.payment_type)}
                                                    {isEmergency && <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Darurat</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-600">ID Pesanan</span>
                                        <span className="font-medium">#{payment.booking?.booking_code || 'N/A'}</span>
                                    </div>

                                    {isEmergency && (
                                        <div className="flex justify-between border-b border-gray-100 pb-3">
                                            <span className="text-gray-600">Jenis Layanan</span>
                                            <span className="font-medium flex items-center">
                                                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
                                                <span>Layanan Ambulans Darurat</span>
                                            </span>
                                        </div>
                                    )}

                                    {isDownpayment && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-100 pb-3">
                                                <span className="text-gray-600">Total Biaya Pemesanan</span>
                                                <span className="font-medium">{formatCurrency(payment.booking?.total_amount || 0)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-3">
                                                <span className="text-gray-600">Uang Muka (30%)</span>
                                                <span className="font-medium">{formatCurrency(payment.amount || 0)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-3">
                                                <span className="text-gray-600">Sisa Pembayaran</span>
                                                <span className="font-medium">{formatCurrency((payment.booking?.total_amount || 0) - (payment.amount || 0))}</span>
                                            </div>
                                        </>
                                    )}

                                    {(isFinalPayment || (!isDownpayment && !isFullPayment)) && (
                                        <div className="flex justify-between border-b border-gray-100 pb-3">
                                            <span className="text-gray-600">Total Pembayaran</span>
                                            <span className="font-medium">{formatCurrency(payment.amount || 0)}</span>
                                        </div>
                                    )}

                                    {isFullPayment && isEmergency && (
                                        <div className="flex justify-between border-b border-gray-100 pb-3">
                                            <span className="text-gray-600">Total Biaya Layanan Darurat</span>
                                            <span className="font-medium">{formatCurrency(payment.amount || 0)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-600">Status Pembayaran</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTextClass(payment.status)}`}>
                                            {payment.status === 'paid' ? 'Dibayar' :
                                             payment.status === 'pending' ? 'Menunggu Pembayaran' :
                                             payment.status === 'failed' ? 'Gagal' : payment.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
