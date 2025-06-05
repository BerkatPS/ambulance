import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatRupiah } from '@/utils';
import PaymentMethodSelector from '@/Components/Payment/PaymentMethodSelector';
import { ClockIcon, CreditCardIcon, ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function FinalPayment({ auth, booking, payment, paymentMethods, deadline }) {
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
        post(route('bookings.final-payment.process', booking.id));
    };

    const timeRemaining = () => {
        const now = new Date();
        const finalDeadline = new Date(deadline);
        const diffMs = finalDeadline - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffMs <= 0) {
            return 'Expired';
        }

        if (diffDays > 0) {
            return `${diffDays}d ${diffHrs}h remaining`;
        }

        return `${diffHrs}h remaining`;
    };

    const finalAmount = booking.total_amount - booking.downpayment_amount;

    return (
        <UserDashboardLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Final Payment</h1>
                    <Link href={route('bookings.show', booking.id)}>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Booking
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Final Payment" />

            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        Booking #{booking.booking_code}
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {timeRemaining()}
                    </span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                        Payment Details
                    </h3>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Booking Amount:</span>
                        <span>{formatRupiah(booking.total_amount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Down Payment Paid (30%):</span>
                        <span>{formatRupiah(booking.downpayment_amount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-800">Remaining Amount Due:</span>
                        <span className="font-semibold">{formatRupiah(finalAmount)}</span>
                    </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700 font-medium">Payment Deadline:</p>
                            <p className="text-sm text-blue-700">Final Payment must be completed by: {deadline}</p>
                            <p className="text-sm text-blue-700 mt-1">
                                Your scheduled ambulance arrival is set for: {new Date(booking.scheduled_time).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                        Select Payment Method
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
                        Complete Final Payment {selectedMethod && `(${formatRupiah(finalAmount)})`}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="flex items-center justify-center text-sm text-gray-500">
                        <InformationCircleIcon className="h-4 w-4 mr-1" />
                        Payment must be completed before your scheduled service
                    </p>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
