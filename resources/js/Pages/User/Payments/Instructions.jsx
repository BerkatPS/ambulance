import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatRupiah } from '@/utils';
import {
    ArrowLeftIcon,
    ClockIcon,
    CheckCircleIcon,
    HashtagIcon,
    CurrencyDollarIcon,
    QrCodeIcon,
    InformationCircleIcon,
    DocumentDuplicateIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';

export default function Instructions({ auth, payment, booking, instructions, expiresAt }) {
    const [countdown, setCountdown] = useState('');
    const [copied, setCopied] = useState(false);
    const [statusChecking, setStatusChecking] = useState(false);
    const [checkCount, setCheckCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            updateCountdown();
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Check payment status automatically every 10 seconds, up to 10 times
        if (checkCount < 10) {
            const statusTimer = setTimeout(() => {
                checkPaymentStatus();
                setCheckCount(prevCount => prevCount + 1);
            }, 10000);

            return () => clearTimeout(statusTimer);
        }
    }, [checkCount]);

    const updateCountdown = () => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffMs = expiry - now;

        if (diffMs <= 0) {
            setCountdown('Kadaluarsa');
            return;
        }

        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

        setCountdown(`${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const checkPaymentStatus = () => {
        setStatusChecking(true);

        // Menggunakan fetch dengan method GET sesuai dengan route yang sudah diubah
        fetch(route('payments.check-status', payment.id), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Payment status check response:', data);
            if (data.status === 'paid') {
                // Tambahkan fallback URL jika redirectUrl tidak ada
                const redirectTarget = data.redirectUrl || route('user.bookings.show', booking.id);
                window.location.href = redirectTarget;
            }
            setStatusChecking(false);
        })
        .catch(error => {
            console.error('Error checking payment status:', error);
            setStatusChecking(false);
        });
    };

    const paymentType = payment.payment_type === 'downpayment' ? 'Uang Muka' : 'Pelunasan';

    return (
        <UserDashboardLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Instruksi Pembayaran {paymentType}</h1>
                    <Link href={route('user.bookings.show', booking.id)}>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Kembali ke Pemesanan
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title={`Instruksi Pembayaran ${paymentType}`} />

            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        Pemesanan #{booking.booking_code}
                    </h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        countdown === 'Kadaluarsa' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {countdown}
                    </span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                        Informasi Pembayaran
                    </h3>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Metode Pembayaran:</span>
                        <span>{payment.method}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Jumlah:</span>
                        <span className="font-semibold">{formatRupiah(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">ID Transaksi:</span>
                        <div className="flex items-center">
                            <span className="mr-2">{payment.transaction_id}</span>
                            <button
                                className="text-indigo-600 hover:text-indigo-800"
                                onClick={() => copyToClipboard(payment.transaction_id)}
                            >
                                <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {payment.va_number && (
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Nomor VA:</span>
                            <div className="flex items-center">
                                <span className="mr-2">{payment.va_number}</span>
                                <button
                                    className="text-indigo-600 hover:text-indigo-800"
                                    onClick={() => copyToClipboard(payment.va_number)}
                                >
                                    <DocumentDuplicateIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Kadaluarsa:</span>
                        <span>{new Date(expiresAt).toLocaleString()}</span>
                    </div>
                </div>

                {copied && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-green-700">Disalin ke clipboard!</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {instructions.title}
                    </h3>
                    <ul className="space-y-2">
                        {instructions.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-5 w-5 text-indigo-600 mr-2">
                                    {step.includes('Virtual Account') || step.includes('Nomor Rekening') ? (
                                        <HashtagIcon />
                                    ) : step.includes('jumlah') ? (
                                        <CurrencyDollarIcon />
                                    ) : (
                                        <CheckCircleIcon />
                                    )}
                                </span>
                                <span className="text-gray-700">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {instructions.qrCode && (
                    <div className="mb-6 text-center">
                        <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center justify-center">
                            <QrCodeIcon className="h-5 w-5 mr-1" />
                            Scan Kode QR
                        </h3>
                        <div className="p-4 border border-dashed border-gray-300 inline-block rounded bg-gray-50">
                            <img src={`data:image/png;base64,${instructions.qrCode}`} alt="Kode QR" className="max-w-[200px]" />
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        className={`flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                            statusChecking
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                        onClick={checkPaymentStatus}
                        disabled={statusChecking}
                    >
                        {statusChecking ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memeriksa...
                            </>
                        ) : (
                            <>
                                <CreditCardIcon className="h-4 w-4 mr-2" />
                                Saya Sudah Membayar
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="flex items-center justify-center text-sm text-gray-500">
                        <InformationCircleIcon className="h-4 w-4 mr-1" />
                        Setelah melakukan pembayaran, perlu beberapa menit untuk memperbarui status pemesanan Anda
                    </p>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
