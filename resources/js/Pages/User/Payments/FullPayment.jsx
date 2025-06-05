import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatRupiah } from '@/utils';
import PaymentMethodSelector from '@/Components/Payment/PaymentMethodSelector';
import { ClockIcon, CreditCardIcon, ArrowLeftIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function FullPayment({ auth, booking, payment, paymentMethods, deadlines }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        payment_method: '',
    });

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedMethod(null);
        setData('payment_method', '');
    };

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        setData('payment_method', method.code);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if payment method is selected
        if (!data.payment_method) {
            alert('Silahkan pilih metode pembayaran terlebih dahulu');
            return;
        }

        // Submit form using Inertia post
        post(route('bookings.fullpayment.process', booking.id), {
            payment_method: data.payment_method
        });
    };

    const timeRemaining = () => {
        if (!deadlines || !deadlines.fullPayment) {
            return 'Segera bayar';
        }

        const now = new Date();
        const deadline = new Date(deadlines.fullPayment);
        const diffMs = deadline - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffMs <= 0) {
            return 'Kadaluarsa';
        }

        return `${diffHrs} jam ${diffMins} menit tersisa`;
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Pembayaran Penuh (Layanan Darurat)</h1>
                    <Link href={route('user.bookings.show', booking.id)}>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Kembali ke Pemesanan
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Pembayaran Penuh - Layanan Darurat" />

            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        Pemesanan #{booking.booking_code}
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {timeRemaining()}
                    </span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Emergency Alert */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">Pembayaran Layanan Darurat</p>
                            <p className="text-sm text-red-700">
                                Ini adalah pembayaran untuk layanan ambulans darurat yang telah selesai.
                                Mohon segera selesaikan pembayaran untuk layanan yang telah Anda terima.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                        Rincian Pembayaran
                    </h3>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Biaya Layanan Darurat:</span>
                        <span className="font-semibold">{formatRupiah(booking.total_amount)}</span>
                    </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700 font-medium">Batas Waktu Pembayaran:</p>
                            <p className="text-sm text-blue-700">
                                {deadlines && deadlines.fullPayment ? deadlines.fullPayment : '7 hari sejak layanan selesai'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                        Pilih Metode Pembayaran
                    </h3>
                    <PaymentMethodSelector
                        paymentMethods={paymentMethods}
                        selectedCategory={selectedCategory}
                        selectedMethod={selectedMethod}
                        onCategorySelect={handleCategorySelect}
                        onMethodSelect={handleMethodSelect}
                    />
                </div>

                {errors.payment_method && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errors.payment_method}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <button
                        type="submit"
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            !selectedMethod || processing
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                        disabled={!selectedMethod || processing}
                    >
                        <CreditCardIcon className="h-5 w-5 mr-2" />
                        {processing ? 'Memproses...' : `Bayar Penuh ${selectedMethod ? `(${formatRupiah(booking.total_amount)})` : ''}`}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="flex items-center justify-center text-sm text-gray-500">
                        <InformationCircleIcon className="h-4 w-4 mr-1" />
                        Mohon selesaikan pembayaran untuk layanan ambulans darurat yang telah Anda gunakan
                    </p>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
