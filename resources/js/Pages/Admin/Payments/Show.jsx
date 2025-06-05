import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    CreditCardIcon,
    CalendarIcon,
    BanknotesIcon,
    DocumentTextIcon,
    UserIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function PaymentShow({ auth, payment, paymentMethod, paymentStatus, paymentType, formattedAmount, formattedTotalBookingAmount }) {
    const { data, setData, post, processing, errors } = useForm({
        status: payment.status,
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.payments.update', payment.id));
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Format datetime
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Payment status badge styling
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            expired: 'bg-gray-100 text-gray-800'
        };
        
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'failed':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'expired':
                return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title={`Detail Pembayaran #${payment.id}`}>
            <Head title={`Detail Pembayaran #${payment.id}`} />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <div>
                                        <Link 
                                            href={route('admin.dashboard')} 
                                            className="text-gray-400 hover:text-primary-600"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                        <Link
                                            href={route('admin.payments.index')}
                                            className="ml-4 text-gray-400 hover:text-primary-600"
                                        >
                                            Pembayaran
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                        <span className="ml-4 text-gray-700 font-medium">
                                            Detail Pembayaran #{payment.id}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    {/* Back button */}
                    <div className="mb-6">
                        <Link
                            href={route('admin.payments.index')}
                            className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Pembayaran
                        </Link>
                    </div>
                    
                    {/* Payment information */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                        <div className="p-5 sm:p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <CreditCardIcon className="h-6 w-6 mr-2 text-primary-600" />
                                    Detail Pembayaran
                                </h2>
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${getStatusBadgeClass(payment.status)}`}>
                                    {getStatusIcon(payment.status)}
                                    <span className="ml-1.5">{paymentStatus}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pembayaran</h3>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">ID Transaksi</dt>
                                            <dd className="text-sm font-medium text-gray-900">{payment.transaction_id}</dd>
                                        </div>
                                        {payment.duitku_reference && (
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Referensi Duitku</dt>
                                                <dd className="text-sm font-medium text-gray-900">{payment.duitku_reference}</dd>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Metode Pembayaran</dt>
                                            <dd className="text-sm font-medium text-gray-900">{paymentMethod}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Tipe Pembayaran</dt>
                                            <dd className="text-sm font-medium text-gray-900">{paymentType}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Jumlah</dt>
                                            <dd className="text-sm font-medium text-gray-900">{formattedAmount}</dd>
                                        </div>
                                        {payment.downpayment_percentage > 0 && (
                                            <>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-500">Persentase DP</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{payment.downpayment_percentage}%</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-gray-500">Total Harga Booking</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{formattedTotalBookingAmount}</dd>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Tanggal Dibuat</dt>
                                            <dd className="text-sm font-medium text-gray-900">{formatDateTime(payment.created_at)}</dd>
                                        </div>
                                        {payment.paid_at && (
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Tanggal Dibayar</dt>
                                                <dd className="text-sm font-medium text-gray-900">{formatDateTime(payment.paid_at)}</dd>
                                            </div>
                                        )}
                                        {payment.expires_at && (
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Kedaluwarsa Pada</dt>
                                                <dd className="text-sm font-medium text-gray-900">{formatDateTime(payment.expires_at)}</dd>
                                            </div>
                                        )}
                                        {payment.va_number && (
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Nomor Virtual Account</dt>
                                                <dd className="text-sm font-medium text-gray-900">{payment.va_number}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Booking</h3>
                                    {payment.booking ? (
                                        <dl className="space-y-3">
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Nomor Booking</dt>
                                                <dd className="text-sm font-medium text-gray-900">
                                                    <Link 
                                                        href={route('admin.bookings.show', payment.booking.id)}
                                                        className="text-primary-600 hover:text-primary-700"
                                                    >
                                                        {payment.booking.booking_number}
                                                    </Link>
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Penumpang</dt>
                                                <dd className="text-sm font-medium text-gray-900">
                                                    {payment.booking.passenger_name || (payment.booking.user && payment.booking.user.name) || 'N/A'}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Status Booking</dt>
                                                <dd className="text-sm font-medium text-gray-900">{payment.booking.status}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm font-medium text-gray-500">Waktu Booking</dt>
                                                <dd className="text-sm font-medium text-gray-900">{formatDateTime(payment.booking.booking_time)}</dd>
                                            </div>
                                        </dl>
                                    ) : (
                                        <p className="text-gray-500 italic">Data booking tidak ditemukan</p>
                                    )}
                                    
                                    {/* Update Payment Status Form */}
                                    {payment.status !== 'paid' && (
                                        <div className="mt-8 border-t pt-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Perbarui Status Pembayaran</h3>
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Status
                                                    </label>
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        value={data.status}
                                                        onChange={e => setData('status', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Dibayar</option>
                                                        <option value="failed">Gagal</option>
                                                        <option value="expired">Kedaluwarsa</option>
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Catatan
                                                    </label>
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={3}
                                                        value={data.notes}
                                                        onChange={e => setData('notes', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                        placeholder="Tambahkan catatan untuk update status pembayaran (opsional)"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                    
                                    {/* Generate Invoice Button (for paid payments) */}
                                    {payment.status === 'paid' && (
                                        <div className="mt-8 border-t pt-6">
                                            <Link
                                                href={route('admin.payments.invoice', payment.id)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            >
                                                <DocumentTextIcon className="mr-2 h-5 w-5" />
                                                Cetak Invoice
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Payment URLs & QR Code */}
                            {payment.status === 'pending' && (
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pembayaran</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {payment.payment_url && (
                                            <div>
                                                <h4 className="text-md font-medium text-gray-700 mb-2">URL Pembayaran</h4>
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <a 
                                                        href={payment.payment_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary-600 hover:text-primary-700 break-all"
                                                    >
                                                        {payment.payment_url}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {payment.qr_code && (
                                            <div>
                                                <h4 className="text-md font-medium text-gray-700 mb-2">QR Code</h4>
                                                <div className="p-3 bg-gray-50 rounded-lg flex justify-center">
                                                    <img 
                                                        src={payment.qr_code} 
                                                        alt="QR Code Pembayaran" 
                                                        className="max-h-48"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
