import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CreditCardIcon,
    BanknotesIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    ArrowPathIcon,
    FunnelIcon,
    EyeIcon,
    ReceiptRefundIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '@/Utils/formatters';
import Pagination from '@/Components/Common/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PaymentHistory({ auth, payments, filters = {}, stats = {}, notifications = [], unreadCount = 0 }) {
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || '',
        method: filters.method || '',
        dateRange: ''
    });

    // Make sure payments.data exists before filtering
    const paymentsData = payments?.data || [];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'failed':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
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

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid':
                return 'Lunas';
            case 'pending':
                return 'Menunggu';
            case 'failed':
                return 'Gagal';
            default:
                return status;
        }
    };

    const getPaymentMethodLabel = (method) => {
        if (!method) return '-';

        switch (method) {
            case 'qris':
                return 'QRIS';
            case 'va_bca':
                return 'Virtual Account BCA';
            case 'va_mandiri':
                return 'Virtual Account Mandiri';
            case 'va_bri':
                return 'Virtual Account BRI';
            case 'va_bni':
                return 'Virtual Account BNI';
            case 'gopay':
                return 'GoPay';
            default:
                return method.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
        } catch (e) {
            return dateString;
        }
    };

    const applyFilters = (e) => {
        e.preventDefault();

        const queryParams = new URLSearchParams();
        if (localFilters.status) queryParams.append('status', localFilters.status);
        if (localFilters.method) queryParams.append('method', localFilters.method);
        if (localFilters.dateRange) queryParams.append('date_range', localFilters.dateRange);

        window.location.href = `${route('payments.index')}?${queryParams.toString()}`;
    };

    const resetFilters = () => {
        setLocalFilters({
            status: '',
            method: '',
            dateRange: ''
        });
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            notifications={notifications}
            unreadCount={unreadCount}
            header={
                <h2 className="text-xl font-semibold text-gray-800">Riwayat Pembayaran</h2>
            }
        >
            <Head title="Riwayat Pembayaran" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <CheckCircleIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Total Terbayar</h3>
                                    <p className="text-3xl font-bold text-gray-700">{formatCurrency(stats.totalPaid || 0)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <ClockIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Menunggu</h3>
                                    <p className="text-3xl font-bold text-gray-700">{formatCurrency(stats.totalPending || 0)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                                    <DocumentTextIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Total Faktur</h3>
                                    <p className="text-3xl font-bold text-gray-700">{stats.totalInvoices || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    Filter
                                </h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                                >
                                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                        <div className="px-4 sm:px-6 py-4">
                            <form onSubmit={applyFilters} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={localFilters.status}
                                            onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="paid">Lunas</option>
                                            <option value="pending">Menunggu</option>
                                            <option value="failed">Gagal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                                            Metode Pembayaran
                                        </label>
                                        <select
                                            id="method"
                                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={localFilters.method}
                                            onChange={(e) => setLocalFilters({ ...localFilters, method: e.target.value })}
                                        >
                                            <option value="">Semua Metode</option>
                                            <option value="qris">QRIS</option>
                                            <option value="va_bca">Virtual Account BCA</option>
                                            <option value="va_mandiri">Virtual Account Mandiri</option>
                                            <option value="va_bri">Virtual Account BRI</option>
                                            <option value="va_bni">Virtual Account BNI</option>
                                            <option value="gopay">GoPay</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                                            Rentang Tanggal
                                        </label>
                                        <select
                                            id="dateRange"
                                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={localFilters.dateRange}
                                            onChange={(e) => setLocalFilters({ ...localFilters, dateRange: e.target.value })}
                                        >
                                            <option value="">Semua Waktu</option>
                                            <option value="today">Hari Ini</option>
                                            <option value="week">Minggu Ini</option>
                                            <option value="month">Bulan Ini</option>
                                            <option value="year">Tahun Ini</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <PrimaryButton
                                        type="submit"
                                        className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                                    >
                                        <FunnelIcon className="h-4 w-4 mr-2" />
                                        Terapkan Filter
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Payment Table */}
                    <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <ReceiptRefundIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Catatan Pembayaran
                            </h3>
                        </div>

                        {paymentsData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaksi</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentsData.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-1">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {payment.transaction_id || payment.duitku_reference || '-'}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {payment.booking?.id ? `Booking #${payment.booking.id}` : '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(payment.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(payment.amount)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {payment.payment_type === 'downpayment' ? 'Uang Muka' : 'Pembayaran Penuh'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(payment.status)}
                                                        <span className={`ml-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusTextClass(payment.status)}`}>
                                                            {getStatusLabel(payment.status)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getPaymentMethodLabel(payment.method)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={route('payments.show', payment.id)}
                                                            className="text-primary-600 hover:text-primary-900 flex items-center"
                                                        >
                                                            <EyeIcon className="h-4 w-4 mr-1" />
                                                            Lihat
                                                        </Link>
                                                        {payment.receipt_url && (
                                                            <a
                                                                href={payment.receipt_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-600 hover:text-gray-900 flex items-center"
                                                            >
                                                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                                                Kuitansi
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                    <ReceiptRefundIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada catatan pembayaran</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Anda belum memiliki riwayat pembayaran.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {payments.links && payments.links.length > 3 && (
                            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <Pagination links={payments.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
