import React from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Receipt({ payment, user }) {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'N/A';
        return new Intl.NumberFormat('id-ID').format(parseFloat(amount));
    };

    // Add safety checks for undefined user and payment
    if (!payment) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                <h1 className="text-2xl font-medium text-gray-800">Data pembayaran tidak tersedia</h1>
                <p className="mt-2 text-gray-600">Informasi pembayaran yang diminta tidak dapat ditemukan.</p>
            </div>
        );
    }

    return (
        <>
            <Head title="Kwitansi Pembayaran" />

            <div className="min-h-screen bg-gray-100 print:bg-white py-6 flex flex-col justify-center sm:py-12 print:py-0">
                <div className="relative py-3 sm:max-w-3xl sm:mx-auto print:max-w-full print:mx-0 print:w-full">
                    {/* Print/Download Controls - Hidden when printing */}
                    <div className="fixed top-4 right-4 flex space-x-2 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <PrinterIcon className="w-4 h-4 mr-2" />
                            Cetak
                        </button>
                        <button
                            onClick={handlePrint} 
                            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                            Download PDF
                        </button>
                    </div>

                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-16 print:shadow-none print:p-0 print:m-0">
                        {/* Receipt Header */}
                        <div className="flex justify-between items-start border-b pb-8 mb-8">
                            <div>
                                <ApplicationLogo className="w-20 h-20" />
                                <div className="mt-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Ambulance Portal</h2>
                                    <p className="text-gray-600">Jl. Kesehatan No. 123</p>
                                    <p className="text-gray-600">Jakarta, Indonesia 12345</p>
                                    <p className="text-gray-600">Telepon: (021) 555-7890</p>
                                    <p className="text-gray-600">Email: info@ambulanceportal.com</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <h1 className="text-3xl font-extrabold text-gray-800">KWITANSI</h1>
                                <div className="mt-4 text-gray-600">
                                    <p><span className="font-medium">Nomor Kwitansi:</span> R-{payment.id.toString().padStart(6, '0')}</p>
                                    <p><span className="font-medium">Tanggal:</span> {formatDate(payment.paid_at || payment.created_at)}</p>
                                    <p><span className="font-medium">ID Pembayaran:</span> {payment.id}</p>
                                    {payment.transaction_id && (
                                        <p><span className="font-medium">ID Transaksi:</span> {payment.transaction_id}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pelanggan</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600"><span className="font-medium">Nama:</span> {user?.name || 'N/A'}</p>
                                    <p className="text-gray-600"><span className="font-medium">Telepon:</span> {user?.phone || 'N/A'}</p>
                                    {user?.address && (
                                        <p className="text-gray-600"><span className="font-medium">Alamat:</span> {user.address}</p>
                                    )}
                                </div>
                                <div>
                                    {(user?.city || user?.postal_code) && (
                                        <div>
                                            <p className="font-medium text-gray-600">Lokasi:</p>
                                            <p className="text-gray-600">
                                                {user.city && <span>{user.city}</span>}
                                                {user.city && user.postal_code && <span>, </span>}
                                                {user.postal_code && <span>{user.postal_code}</span>}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Pembayaran</h3>
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Deskripsi</th>
                                        <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">ID Booking</th>
                                        <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Metode Pembayaran</th>
                                        <th scope="col" className="py-3.5 px-3 text-right text-sm font-semibold text-gray-900">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                            Layanan Ambulans
                                            {payment.booking && payment.booking.type && (
                                                <span className="block text-gray-500">
                                                    Layanan {payment.booking.type === 'emergency' ? 'Darurat' : 'Terjadwal'}
                                                </span>
                                            )}
                                            {payment.payment_type && (
                                                <span className="block text-gray-500">
                                                    {payment.payment_type === 'downpayment' && 'Uang Muka'}
                                                    {payment.payment_type === 'fullpayment' && 'Pembayaran Penuh'}
                                                    {payment.payment_type === 'finalpayment' && 'Pembayaran Akhir'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                            {payment.booking && payment.booking.booking_code ? 
                                                payment.booking.booking_code : `#${payment.booking_id}`}
                                        </td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                            {payment.payment_method ? 
                                                (payment.payment_method === 'credit_card' ? 'Kartu Kredit' : 
                                                 payment.payment_method === 'debit_card' ? 'Kartu Debit' : 
                                                 payment.payment_method === 'cash' ? 'Tunai' : 
                                                 payment.payment_method === 'bank_transfer' ? 'Transfer Bank' :
                                                 payment.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) 
                                                : 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900 text-right font-medium">
                                            Rp {formatCurrency(payment.amount)}
                                        </td>
                                    </tr>
                                    {payment.tax > 0 && (
                                        <tr>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900" colSpan="3">
                                                Pajak
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900 text-right font-medium">
                                                Rp {formatCurrency(payment.tax)}
                                            </td>
                                        </tr>
                                    )}
                                    {payment.discount > 0 && (
                                        <tr>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900" colSpan="3">
                                                Diskon
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900 text-right font-medium">
                                                -Rp {formatCurrency(payment.discount)}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th scope="row" colSpan="3" className="pl-4 pr-3 pt-6 text-right text-sm font-semibold text-gray-900">Total</th>
                                        <td className="pl-3 pr-4 pt-6 text-right text-sm font-semibold text-gray-900">Rp {formatCurrency(payment.amount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Booking Information (if available) */}
                        {payment.booking && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pemesanan</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600"><span className="font-medium">Lokasi Jemput:</span> {payment.booking.pickup_location || payment.booking.pickup_address || 'N/A'}</p>
                                            <p className="text-gray-600"><span className="font-medium">Lokasi Tujuan:</span> {payment.booking.dropoff_location || payment.booking.destination_address || 'N/A'}</p>
                                            <p className="text-gray-600"><span className="font-medium">Tanggal Pemesanan:</span> {formatDate(payment.booking.booking_time || payment.booking.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600"><span className="font-medium">Status:</span> {payment.booking.status || 'N/A'}</p>
                                            <p className="text-gray-600"><span className="font-medium">Driver:</span> {payment.booking.driver?.name || 'Belum ditentukan'}</p>
                                            <p className="text-gray-600"><span className="font-medium">Ambulans:</span> {payment.booking.ambulance?.vehicle_code || 'Belum ditentukan'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Status */}
                        <div className="mb-8 flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-block p-4 rounded-full bg-green-100 text-green-700 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-xl font-bold text-green-700">Pembayaran Selesai</p>
                                <p className="text-sm text-gray-500">Terima kasih atas pembayaran Anda</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t pt-8 text-center text-gray-500 text-sm">
                            <p>Ini adalah kwitansi resmi untuk pembayaran Anda. Harap simpan sebagai bukti pembayaran.</p>
                            <p className="mt-2">Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami di support@ambulanceportal.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
