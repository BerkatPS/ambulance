import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import {
    CalendarIcon,
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    TruckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    StarIcon,
    CheckCircleIcon,
    UserCircleIcon,
    ExclamationTriangleIcon,
    BanknotesIcon,
    DocumentTextIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, booking, availableAmbulances, availableDrivers, statuses }) {
    const [isAssigningAmbulance, setIsAssigningAmbulance] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        ambulance_id: '',
        driver_id: '',
    });

    const { data: statusData, setData: setStatusData, put: putStatus, processing: processingStatus, errors: statusErrors } = useForm({
        status: booking.status,
        cancel_reason: '',
    });

    const handleAmbulanceAssignment = (e) => {
        e.preventDefault();
        post(route('admin.bookings.assign', booking.id), {
            onSuccess: () => {
                reset();
                setIsAssigningAmbulance(false);
            }
        });
    };

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        putStatus(route('admin.bookings.update-status', booking.id), {
            onSuccess: () => {
                setIsChangingStatus(false);
            }
        });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            dispatched: 'bg-purple-100 text-purple-800',
            arrived: 'bg-indigo-100 text-indigo-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };

        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    // Get priority badge class
    const getPriorityBadgeClass = (priority) => {
        const classes = {
            critical: 'bg-red-100 text-red-800',
            urgent: 'bg-orange-100 text-orange-800',
            normal: 'bg-blue-100 text-blue-800',
        };

        return classes[priority] || 'bg-gray-100 text-gray-800';
    };

    // Translate status
    const translateStatus = (status) => {
        return statuses[status] || status;
    };

    // Translate priority
    const translatePriority = (priority) => {
        const translations = {
            'critical': 'Kritis',
            'urgent': 'Mendesak',
            'normal': 'Normal',
        };
        
        return translations[priority] || priority;
    };

    // Translate booking type
    const translateBookingType = (type) => {
        const translations = {
            'standard': 'Standar',
            'emergency': 'Darurat',
            'scheduled': 'Terjadwal',
        };
        
        return translations[type] || type;
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'N/A';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AdminDashboardLayout user={auth.user} title="Detail Pemesanan">
            <Head title={`Detail Pemesanan #${booking.id}`} />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Detail Pemesanan #{booking.id}</h1>
                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                    {translateStatus(booking.status)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(booking.priority)}`}>
                                    {translatePriority(booking.priority)}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {translateBookingType(booking.type)}
                                </span>
                                <span className="text-sm text-gray-500">Dibuat pada {formatDate(booking.created_at)}</span>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
                            <Link
                                href={route('admin.bookings.index')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Kembali ke Daftar
                            </Link>
                            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={() => setIsChangingStatus(true)}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    Perbarui Status
                                </button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button
                                    type="button"
                                    onClick={() => setIsAssigningAmbulance(true)}
                                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    {booking.ambulance_id ? 'Ganti Ambulans' : 'Tugaskan Ambulans'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Customer and Patient Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    Informasi Pelanggan & Pasien
                                </h3>
                            </div>
                            <div className="p-5 sm:p-6 lg:p-8">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Nama Pelanggan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.user?.name || 'N/A'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Email Pelanggan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.user?.email || 'N/A'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Nama Pasien</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.patient_name}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Usia Pasien</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.patient_age ? `${booking.patient_age} tahun` : 'N/A'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Nama Kontak</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.contact_name}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Telepon Kontak</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.contact_phone}</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Catatan Kondisi</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.condition_notes || 'Tidak ada catatan'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    Informasi Lokasi
                                </h3>
                            </div>
                            <div className="p-5 sm:p-6 lg:p-8">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Alamat Penjemputan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.pickup_address}</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Alamat Tujuan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.destination_address}</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Waktu Penjemputan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {booking.type === 'scheduled' 
                                                ? formatDate(booking.scheduled_at) 
                                                : (booking.requested_at ? formatDate(booking.requested_at) : 'Segera')}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Catatan Tambahan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{booking.notes || 'Tidak ada catatan'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Assigned Ambulance & Driver Section */}
                        {booking.ambulance && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                        <TruckIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Ambulans & Pengemudi yang Ditugaskan
                                    </h3>
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Ambulans</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{booking.ambulance.license_plate} ({booking.ambulance.vehicle_code})</dd>
                                        </div>
                                        {booking.driver && (
                                            <>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Pengemudi</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{booking.driver.name}</dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Kontak</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{booking.driver.phone}</dd>
                                                </div>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        )}

                        {/* Payment Information */}
                        {booking.payment && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                        <BanknotesIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Informasi Pembayaran
                                    </h3>
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Jumlah</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(booking.payment.amount)}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    booking.payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {translateStatus(booking.payment.status)}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Tanggal Pembayaran</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(booking.payment.paid_at)}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Metode</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{booking.payment.payment_method}</dd>
                                        </div>
                                    </dl>
                                    {booking.payment.status === 'paid' && (
                                        <div className="mt-6 flex items-center">
                                            <Link 
                                                href={route('payments.receipt', booking.payment.id)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                target="_blank"
                                            >
                                                <DocumentTextIcon className="h-4 w-4 mr-1.5" />
                                                Lihat Kwitansi
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Rating Information */}
                        {booking.rating && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                        <StarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Penilaian Pelanggan
                                    </h3>
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Penilaian Layanan</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            className={`h-5 w-5 ${
                                                                i < booking.rating.service_rating ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {booking.rating.service_rating}/5
                                                    </span>
                                                </div>
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Penilaian Pengemudi</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            className={`h-5 w-5 ${
                                                                i < booking.rating.driver_rating ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {booking.rating.driver_rating}/5
                                                    </span>
                                                </div>
                                            </dd>
                                        </div>
                                        {booking.rating.feedback && (
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Umpan Balik</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{booking.rating.feedback}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Assign Ambulance Modal */}
                    {isAssigningAmbulance && (
                        <div className="fixed inset-0 overflow-y-auto z-50">
                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <form onSubmit={handleAmbulanceAssignment}>
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                        {booking.ambulance_id ? 'Ganti Ambulans' : 'Tugaskan Ambulans'}
                                                    </h3>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Pilih ambulans dan pengemudi yang akan ditugaskan untuk pemesanan ini.
                                                        </p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label htmlFor="ambulance_id" className="block text-sm font-medium text-gray-700">
                                                            Ambulans
                                                        </label>
                                                        <select
                                                            id="ambulance_id"
                                                            name="ambulance_id"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                            value={data.ambulance_id}
                                                            onChange={e => setData('ambulance_id', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Pilih Ambulans</option>
                                                            {availableAmbulances.map(ambulance => (
                                                                <option key={ambulance.id} value={ambulance.id}>
                                                                    {ambulance.license_plate} - {ambulance.vehicle_code} - {ambulance.ambulance_type?.name || 'Unknown Type'}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.ambulance_id && <p className="mt-1 text-sm text-red-600">{errors.ambulance_id}</p>}
                                                    </div>
                                                    
                                                    <div className="mt-4">
                                                        <label htmlFor="driver_id" className="block text-sm font-medium text-gray-700">
                                                            Pengemudi
                                                        </label>
                                                        <select
                                                            id="driver_id"
                                                            name="driver_id"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                            value={data.driver_id}
                                                            onChange={e => setData('driver_id', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Pilih Pengemudi</option>
                                                            {availableDrivers.map(driver => (
                                                                <option key={driver.id} value={driver.id}>
                                                                    {driver.name} - {driver.phone}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.driver_id && <p className="mt-1 text-sm text-red-600">{errors.driver_id}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                disabled={processing}
                                            >
                                                {processing ? 'Memproses...' : 'Tugaskan'}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={() => setIsAssigningAmbulance(false)}
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Status Modal */}
                    {isChangingStatus && (
                        <div className="fixed inset-0 overflow-y-auto z-50">
                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <form onSubmit={handleStatusUpdate}>
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                        Perbarui Status Pemesanan
                                                    </h3>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Pilih status baru untuk pemesanan ini.
                                                        </p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                            Status
                                                        </label>
                                                        <select
                                                            id="status"
                                                            name="status"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                            value={statusData.status}
                                                            onChange={e => setStatusData('status', e.target.value)}
                                                            required
                                                        >
                                                            {Object.entries(statuses).map(([value, label]) => (
                                                                <option key={value} value={value}>
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {statusErrors.status && <p className="mt-1 text-sm text-red-600">{statusErrors.status}</p>}
                                                    </div>
                                                    {statusData.status === 'cancelled' && (
                                                        <div className="mt-4">
                                                            <label htmlFor="cancel_reason" className="block text-sm font-medium text-gray-700">
                                                                Alasan Pembatalan
                                                            </label>
                                                            <textarea
                                                                id="cancel_reason"
                                                                name="cancel_reason"
                                                                className="mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                                value={statusData.cancel_reason}
                                                                onChange={e => setStatusData('cancel_reason', e.target.value)}
                                                                required
                                                                rows={3}
                                                            />
                                                            {statusErrors.cancel_reason && <p className="mt-1 text-sm text-red-600">{statusErrors.cancel_reason}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                disabled={processingStatus}
                                            >
                                                {processingStatus ? 'Memproses...' : 'Perbarui Status'}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={() => setIsChangingStatus(false)}
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Timeline */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Timeline Status
                            </h3>
                        </div>
                        <div className="p-5 sm:p-6 lg:p-8">
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    <li>
                                        <div className="relative pb-8">
                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${booking.status === 'pending' ? 'bg-yellow-500' : 'bg-yellow-100'}`}>
                                                        <CheckCircleIcon className={`h-5 w-5 ${booking.status === 'pending' ? 'text-white' : 'text-yellow-500'}`} aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Pemesanan dibuat</p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {formatDate(booking.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    
                                    <li>
                                        <div className="relative pb-8">
                                            {['pending', 'confirmed'].includes(booking.status) && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${booking.status === 'confirmed' ? 'bg-blue-500' : (['dispatched', 'arrived', 'completed'].includes(booking.status) ? 'bg-blue-100' : 'bg-gray-100')}`}>
                                                        <CheckCircleIcon className={`h-5 w-5 ${booking.status === 'confirmed' ? 'text-white' : (['dispatched', 'arrived', 'completed'].includes(booking.status) ? 'text-blue-500' : 'text-gray-500')}`} aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Pemesanan dikonfirmasi</p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {['confirmed', 'dispatched', 'arrived', 'completed'].includes(booking.status) ? formatDate(booking.updated_at) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    
                                    <li>
                                        <div className="relative pb-8">
                                            {['pending', 'confirmed', 'dispatched'].includes(booking.status) && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${booking.status === 'dispatched' ? 'bg-purple-500' : (['arrived', 'completed'].includes(booking.status) ? 'bg-purple-100' : 'bg-gray-100')}`}>
                                                        <TruckIcon className={`h-5 w-5 ${booking.status === 'dispatched' ? 'text-white' : (['arrived', 'completed'].includes(booking.status) ? 'text-purple-500' : 'text-gray-500')}`} aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ambulans dikirim</p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {booking.dispatched_at ? formatDate(booking.dispatched_at) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    
                                    <li>
                                        <div className="relative pb-8">
                                            {['pending', 'confirmed', 'dispatched', 'arrived'].includes(booking.status) && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${booking.status === 'arrived' ? 'bg-indigo-500' : (booking.status === 'completed' ? 'bg-indigo-100' : 'bg-gray-100')}`}>
                                                        <MapPinIcon className={`h-5 w-5 ${booking.status === 'arrived' ? 'text-white' : (booking.status === 'completed' ? 'text-indigo-500' : 'text-gray-500')}`} aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Tiba di lokasi penjemputan</p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {booking.arrived_at ? formatDate(booking.arrived_at) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    
                                    <li>
                                        <div className="relative">
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${booking.status === 'completed' ? 'bg-green-500' : 'bg-gray-100'}`}>
                                                        <CheckCircleIcon className={`h-5 w-5 ${booking.status === 'completed' ? 'text-white' : 'text-gray-500'}`} aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Pemesanan selesai</p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {booking.completed_at ? formatDate(booking.completed_at) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    
                                    {booking.status === 'cancelled' && (
                                        <li>
                                            <div className="relative">
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-red-500">
                                                            <ExclamationTriangleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Pemesanan dibatalkan</p>
                                                            {booking.cancel_reason && (
                                                                <p className="text-sm text-red-500 mt-1">Alasan: {booking.cancel_reason}</p>
                                                            )}
                                                        </div>
                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                            {formatDate(booking.updated_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
