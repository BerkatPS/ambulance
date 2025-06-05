import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    ArrowsUpDownIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    CreditCardIcon,
    CalendarIcon,
    XMarkIcon,
    BanknotesIcon,
    UserIcon
} from '@heroicons/react/24/outline';

export default function PaymentsIndex({ auth, payments, filters, filterOptions }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterForm, setFilterForm] = useState({
        status: filters?.status || '',
        method: filters?.method || '',
        payment_type: filters?.payment_type || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
        min_amount: filters?.min_amount || '',
        max_amount: filters?.max_amount || '',
    });
    
    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.payments.index', { 
            ...filters, 
            search: searchTerm 
        });
    };
    
    // Handle filter form changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterForm({
            ...filterForm,
            [name]: value
        });
    };
    
    // Apply filters
    const applyFilters = (e) => {
        e.preventDefault();
        window.location.href = route('admin.payments.index', {
            ...filters,
            ...filterForm,
            page: 1 // Reset to first page when filtering
        });
    };
    
    // Reset filters
    const resetFilters = () => {
        setFilterForm({
            status: '',
            method: '',
            payment_type: '',
            start_date: '',
            end_date: '',
            min_amount: '',
            max_amount: '',
        });
        window.location.href = route('admin.payments.index', {
            search: filters.search,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order
        });
    };
    
    // Handle sort change
    const handleSortChange = (column) => {
        const newSortBy = column;
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        window.location.href = route('admin.payments.index', {
            ...filters,
            sort_by: newSortBy,
            sort_order: newSortOrder
        });
    };
    
    // Get sort icon
    const getSortIcon = (column) => {
        if (filters.sort_by !== column) {
            return <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />;
        }
        
        return filters.sort_order === 'asc' 
            ? <ArrowUpIcon className="h-4 w-4 text-gray-700" />
            : <ArrowDownIcon className="h-4 w-4 text-gray-700" />;
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
    
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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
    
    // Format payment status for display
    const formatPaymentStatus = (status) => {
        const statuses = {
            pending: 'Menunggu Pembayaran',
            paid: 'Sudah Dibayar',
            failed: 'Gagal',
            expired: 'Kedaluwarsa'
        };
        
        return statuses[status] || status;
    };
    
    // Format payment method for display
    const formatPaymentMethod = (method) => {
        const methods = {
            qris: 'QRIS',
            va_bca: 'Virtual Account BCA',
            va_mandiri: 'Virtual Account Mandiri',
            va_bri: 'Virtual Account BRI',
            va_bni: 'Virtual Account BNI',
            gopay: 'GoPay'
        };
        
        return methods[method] || method;
    };
    
    // Format payment type for display
    const formatPaymentType = (type) => {
        const types = {
            downpayment: 'Uang Muka',
            full_payment: 'Pembayaran Penuh'
        };
        
        return types[type] || type;
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Transaksi Pembayaran">
            <Head title="Transaksi Pembayaran" />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <CreditCardIcon className="h-6 w-6 mr-2 text-primary-600" />
                                Pembayaran
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Daftar semua transaksi pembayaran dalam sistem
                            </p>
                        </div>
                    </div>
                    
                    {/* Search and filters */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-5 sm:p-6 lg:p-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-1/2">
                                    <form onSubmit={handleSearch}>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="search"
                                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                placeholder="Cari ID transaksi atau nomor booking..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                >
                                                    Cari
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="w-full md:w-1/2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setFilterOpen(!filterOpen)}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    >
                                        <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        Filter
                                        {Object.values(filterForm).some(value => value !== '') && (
                                            <span className="ml-1 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                                Aktif
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Advanced filters */}
                            {filterOpen && (
                                <div className="mt-4 border-t pt-4">
                                    <form onSubmit={applyFilters}>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                    Status
                                                </label>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                    value={filterForm.status}
                                                    onChange={handleFilterChange}
                                                >
                                                    <option value="">Semua Status</option>
                                                    {filterOptions.statuses.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                                                    Metode Pembayaran
                                                </label>
                                                <select
                                                    id="method"
                                                    name="method"
                                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                    value={filterForm.method}
                                                    onChange={handleFilterChange}
                                                >
                                                    <option value="">Semua Metode</option>
                                                    {filterOptions.methods.map((method) => (
                                                        <option key={method.value} value={method.value}>
                                                            {method.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                                                    Tipe Pembayaran
                                                </label>
                                                <select
                                                    id="payment_type"
                                                    name="payment_type"
                                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                    value={filterForm.payment_type}
                                                    onChange={handleFilterChange}
                                                >
                                                    <option value="">Semua Tipe</option>
                                                    {filterOptions.paymentTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                                    Tanggal Mulai
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="start_date"
                                                        id="start_date"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        value={filterForm.start_date}
                                                        onChange={handleFilterChange}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                                    Tanggal Akhir
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="end_date"
                                                        id="end_date"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        value={filterForm.end_date}
                                                        onChange={handleFilterChange}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700">
                                                    Jumlah Minimal
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="number"
                                                        name="min_amount"
                                                        id="min_amount"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="Rp"
                                                        value={filterForm.min_amount}
                                                        onChange={handleFilterChange}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700">
                                                    Jumlah Maksimal
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="number"
                                                        name="max_amount"
                                                        id="max_amount"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="Rp"
                                                        value={filterForm.max_amount}
                                                        onChange={handleFilterChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                            >
                                                <XMarkIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Reset
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                            >
                                                Terapkan Filter
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Payments table */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('transaction_id')}
                                        >
                                            <div className="flex items-center">
                                                ID Transaksi
                                                <span className="ml-2">
                                                    {getSortIcon('transaction_id')}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('created_at')}
                                        >
                                            <div className="flex items-center">
                                                Tanggal
                                                <span className="ml-2">
                                                    {getSortIcon('created_at')}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            <div className="flex items-center">
                                                Booking
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('method')}
                                        >
                                            <div className="flex items-center">
                                                Metode
                                                <span className="ml-2">
                                                    {getSortIcon('method')}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('amount')}
                                        >
                                            <div className="flex items-center">
                                                Jumlah
                                                <span className="ml-2">
                                                    {getSortIcon('amount')}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                <span className="ml-2">
                                                    {getSortIcon('status')}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.data.length > 0 ? (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {payment.transaction_id || `#${payment.id}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span>{formatDate(payment.created_at)}</span>
                                                        {payment.paid_at && (
                                                            <span className="text-xs text-gray-400">
                                                                Dibayar: {formatDate(payment.paid_at)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.booking ? (
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={route('admin.bookings.show', payment.booking.id)}
                                                                className="text-primary-600 hover:text-primary-900"
                                                            >
                                                                {payment.booking.booking_number || `#${payment.booking.id}`}
                                                            </Link>
                                                            <span className="text-xs text-gray-400">
                                                                {payment.booking.user?.name || payment.booking.passenger_name || 'N/A'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatPaymentMethod(payment.method)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                                                        {formatPaymentStatus(payment.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.payments.show', payment.id)}
                                                        className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                                                    >
                                                        <EyeIcon className="h-4 w-4 mr-1" />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                                                Tidak ada data pembayaran yang sesuai dengan filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Pagination */}
                    {payments.links && payments.links.length > 3 && (
                        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {payments.prev_page_url ? (
                                    <Link
                                        href={payments.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Sebelumnya
                                    </Link>
                                ) : (
                                    <button disabled className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-50 cursor-not-allowed">
                                        Sebelumnya
                                    </button>
                                )}
                                
                                {payments.next_page_url ? (
                                    <Link
                                        href={payments.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Berikutnya
                                    </Link>
                                ) : (
                                    <button disabled className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-50 cursor-not-allowed">
                                        Berikutnya
                                    </button>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{payments.from || 0}</span> sampai <span className="font-medium">{payments.to || 0}</span> dari <span className="font-medium">{payments.total}</span> pembayaran
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {/* First Page */}
                                        {payments.current_page > 1 && (
                                            <Link
                                                href={route('admin.payments.index', {...filters, page: 1})}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">First</span>
                                                &laquo;&laquo;
                                            </Link>
                                        )}
                                        
                                        {/* Previous Page */}
                                        {payments.prev_page_url ? (
                                            <Link
                                                href={payments.prev_page_url}
                                                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Previous</span>
                                                &laquo;
                                            </Link>
                                        ) : (
                                            <span className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                <span className="sr-only">Previous</span>
                                                &laquo;
                                            </span>
                                        )}
                                        
                                        {/* Page Numbers */}
                                        {Array.from({ length: payments.last_page }, (_, i) => i + 1)
                                            .filter(page => 
                                                page === 1 || 
                                                page === payments.last_page || 
                                                (page >= payments.current_page - 1 && page <= payments.current_page + 1)
                                            )
                                            .map((page, index, array) => {
                                                const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                                                
                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsis && (
                                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                ...
                                                            </span>
                                                        )}
                                                        
                                                        <Link
                                                            href={route('admin.payments.index', {...filters, page})}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                page === payments.current_page
                                                                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' 
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                            aria-current={page === payments.current_page ? 'page' : undefined}
                                                        >
                                                            {page}
                                                        </Link>
                                                    </React.Fragment>
                                                );
                                            })
                                        }
                                        
                                        {/* Next Page */}
                                        {payments.next_page_url ? (
                                            <Link
                                                href={payments.next_page_url}
                                                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Next</span>
                                                &raquo;
                                            </Link>
                                        ) : (
                                            <span className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                <span className="sr-only">Next</span>
                                                &raquo;
                                            </span>
                                        )}
                                        
                                        {/* Last Page */}
                                        {payments.current_page < payments.last_page && (
                                            <Link
                                                href={route('admin.payments.index', {...filters, page: payments.last_page})}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Last</span>
                                                &raquo;&raquo;
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
