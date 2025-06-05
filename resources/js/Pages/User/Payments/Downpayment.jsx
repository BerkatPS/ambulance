import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatRupiah } from '@/utils';
import PaymentMethodSelector from '@/Components/Payment/PaymentMethodSelector';
import { ClockIcon, CreditCardIcon, ArrowLeftIcon, InformationCircleIcon, BanknotesIcon, ReceiptPercentIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Downpayment({ auth, booking, payment, paymentMethods, deadlines }) {
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
        console.log('Selected payment method:', method.code); // Debug untuk memastikan nilai tersimpan
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Periksa apakah payment_method sudah dipilih
        if (!data.payment_method) {
            alert('Silahkan pilih metode pembayaran terlebih dahulu');
            return;
        }

        console.log('Form submitted with payment method:', data.payment_method);

        // Kembali menggunakan post dari Inertia untuk mengirim form
        // Ini akan otomatis menyertakan CSRF token
        post(route('bookings.downpayment.process', booking.id), {
            payment_method: data.payment_method
        });
    };

    const timeRemaining = () => {
        const now = new Date();
        const deadline = new Date(deadlines.downpayment);
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
                    <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                        <BanknotesIcon className="h-6 w-6 mr-2 text-primary-600" />
                        Pembayaran Uang Muka
                    </h1>
                    <Link href={route('user.bookings.show', booking.id)}>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Kembali ke Pemesanan
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Pembayaran Uang Muka" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-5 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <ReceiptPercentIcon className="h-5 w-5 mr-2 text-primary-600" />
                            Pemesanan #{booking.booking_code}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Tanggal: {new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 self-start sm:self-auto">
                        <ClockIcon className="h-4 w-4 mr-1.5" />
                        {timeRemaining()}
                    </span>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="mb-8 bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                        <BanknotesIcon className="h-5 w-5 mr-2 text-primary-600" />
                        Rincian Pembayaran
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Biaya Pemesanan:</span>
                            <span className="font-semibold text-gray-900">{formatRupiah(booking.total_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Uang Muka (30%):</span>
                            <span className="font-semibold text-primary-600">{formatRupiah(booking.downpayment_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                            <span className="text-gray-600">Sisa Pembayaran:</span>
                            <span className="text-gray-900">{formatRupiah(booking.total_amount - booking.downpayment_amount)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary-50 border-l-4 border-primary-400 p-4 mb-8 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-primary-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-primary-700 font-medium">Batas Waktu Pembayaran:</p>
                            <p className="text-sm text-primary-700">Uang Muka: {new Date(deadlines.downpayment).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-sm text-primary-700">Pelunasan: {new Date(deadlines.fullPayment).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <CreditCardIcon className="h-5 w-5 mr-2 text-primary-600" />
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
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errors.payment_method}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <button
                        type="submit"
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                            !selectedMethod || processing
                            ? 'bg-primary-300 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                        }`}
                        disabled={!selectedMethod || processing}
                    >
                        <CreditCardIcon className="h-5 w-5 mr-2" />
                        {processing ? 'Memproses...' : `Bayar Uang Muka ${selectedMethod ? `(${formatRupiah(booking.downpayment_amount)})` : ''}`}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <p className="flex items-center justify-center text-sm text-gray-500">
                        <InformationCircleIcon className="h-4 w-4 mr-1.5" />
                        Uang muka harus diselesaikan dalam waktu 24 jam untuk mengkonfirmasi pemesanan Anda
                    </p>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
