import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatCurrency } from '@/Utils/formatters';
import { 
    CreditCardIcon, 
    ArrowLeftIcon, 
    BanknotesIcon, 
    DevicePhoneMobileIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Pay({ auth, payment }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [transactionId, setTransactionId] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        payment_method: '',
        transaction_id: '',
    });

    const paymentMethods = [
        { 
            id: 'credit_card', 
            name: 'Kartu Kredit/Debit', 
            icon: <CreditCardIcon className="w-8 h-8 text-blue-500" />,
            description: 'Bayar dengan kartu kredit atau debit dari bank manapun'
        },
        { 
            id: 'bank_transfer', 
            name: 'Transfer Bank', 
            icon: <BanknotesIcon className="w-8 h-8 text-green-500" />,
            description: 'Transfer dari rekening bank anda ke rekening kami'
        },
        { 
            id: 'e_wallet', 
            name: 'E-Wallet', 
            icon: <DevicePhoneMobileIcon className="w-8 h-8 text-purple-500" />,
            description: 'Bayar dengan GoPay, OVO, Dana, atau LinkAja'
        }
    ];

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        setData('payment_method', method.id);
    };

    const handleTransactionIdChange = (e) => {
        setTransactionId(e.target.value);
        setData('transaction_id', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.process', payment.id));
    };

    return (
        <UserDashboardLayout user={auth.user}>
            <Head title="Proses Pembayaran" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <Link href={route('payments.show', payment.id)} className="text-gray-500 hover:text-gray-700 mr-2">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </Link>
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Proses Pembayaran
                                </h2>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">Invoice #{payment.reference_number}</h3>
                                        <p className="text-sm text-gray-500">
                                            {payment.payment_type === 'downpayment' ? 'Uang Muka' : 'Pembayaran Akhir'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">{formatCurrency(payment.amount)}</p>
                                        <p className="text-sm text-gray-500">
                                            Jatuh tempo: {new Date(payment.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-800 mb-3">Pilih Metode Pembayaran</h3>
                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => (
                                            <div 
                                                key={method.id}
                                                className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                                                    selectedMethod && selectedMethod.id === method.id 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                                onClick={() => handleMethodSelect(method)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="mr-3">
                                                            {method.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{method.name}</h4>
                                                            <p className="text-sm text-gray-500">{method.description}</p>
                                                        </div>
                                                    </div>
                                                    {selectedMethod && selectedMethod.id === method.id && (
                                                        <ChevronRightIcon className="w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.payment_method && (
                                        <div className="text-red-500 mt-1 text-sm">{errors.payment_method}</div>
                                    )}
                                </div>

                                {selectedMethod && (
                                    <div className="mb-6">
                                        <h3 className="font-medium text-gray-800 mb-3">Informasi Pembayaran</h3>
                                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                                            <p className="text-sm text-yellow-800">
                                                <span className="font-medium">Petunjuk:</span> Lakukan pembayaran sesuai dengan metode yang Anda pilih,
                                                kemudian masukkan ID transaksi/referensi yang Anda dapatkan dari bank atau layanan pembayaran.
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                ID Transaksi / Nomor Referensi
                                            </label>
                                            <input
                                                type="text"
                                                id="transaction_id"
                                                value={transactionId}
                                                onChange={handleTransactionIdChange}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Masukkan ID transaksi/referensi"
                                            />
                                            {errors.transaction_id && (
                                                <div className="text-red-500 mt-1 text-sm">{errors.transaction_id}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Link 
                                        href={route('payments.show', payment.id)}
                                        className="bg-gray-100 py-2 px-4 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-200 transition-colors"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton type="submit" disabled={processing || !selectedMethod || !transactionId}>
                                        Konfirmasi Pembayaran
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
