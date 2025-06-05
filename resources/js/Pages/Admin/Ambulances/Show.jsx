import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    TruckIcon,
    IdentificationIcon,
    CalendarIcon,
    ClockIcon,
    DocumentTextIcon,
    CogIcon,
    MapPinIcon,
    UserIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function AmbulanceShow({ auth, ambulance, bookings, maintenanceRecords }) {
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Format time
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
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
    
    // Get status badge class
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            available: 'bg-green-100 text-green-800',
            on_duty: 'bg-blue-100 text-blue-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            out_of_service: 'bg-slate-100 text-slate-800'
        };
        
        return statusClasses[status] || 'bg-slate-100 text-slate-800';
    };
    
    // Get booking status badge class
    const getBookingStatusBadgeClass = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            dispatched: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-indigo-100 text-indigo-800'
        };
        
        return statusClasses[status] || 'bg-slate-100 text-slate-800';
    };
    
    const activateForm = useForm({});
    const deactivateForm = useForm({});
    
    const handleActivate = (e) => {
        e.preventDefault();
        activateForm.post(route('admin.ambulances.activate', ambulance.id));
    };
    
    const handleDeactivate = (e) => {
        e.preventDefault();
        deactivateForm.post(route('admin.ambulances.deactivate', ambulance.id));
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title={`Ambulans: ${ambulance.registration_number}`}>
            <Head title={`Ambulans: ${ambulance.registration_number}`} />
            
            <div className="space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <div>
                                <Link 
                                    href={route('admin.dashboard')} 
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                                <Link 
                                    href={route('admin.ambulances.index')} 
                                    className="ml-4 text-slate-400 hover:text-slate-500"
                                >
                                    Ambulans
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                                <span className="ml-4 text-slate-500 font-medium">{ambulance.registration_number}</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{ambulance.registration_number}</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            {ambulance.model} {ambulance.year && `(${ambulance.year})`} - {ambulance.ambulance_type?.name}
                        </p>
                    </div>
                    <div className="mt-4 flex space-x-3 sm:mt-0">
                        <Link
                            href={route('admin.ambulances.edit', ambulance.id)}
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                            Edit Ambulans
                        </Link>
                        <Link
                            href={route('admin.ambulances.schedule-maintenance', ambulance.id)}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Jadwalkan Pemeliharaan
                        </Link>
                        <Link
                            href={route('admin.ambulances.index')}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Ambulance Information */}
                    <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Informasi Ambulans</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail dan spesifikasi kendaraan.</p>
                            </div>
                            <div className="border-t border-slate-200">
                                <dl>
                                    <div className="bg-slate-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <IdentificationIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Nomor Registrasi
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ambulance.registration_number}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Model
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {ambulance.model}
                                            {ambulance.year && <span className="text-sm text-gray-500 ml-2">({ambulance.year})</span>}
                                        </dd>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <CogIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Tipe Ambulans
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {ambulance.ambulance_type?.name || 'N/A'}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Stasiun Ambulans
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {ambulance.ambulance_station?.name || 'Belum Ditetapkan'}
                                            {ambulance.ambulance_station?.address && (
                                                <p className="mt-1 text-sm text-gray-500">{ambulance.ambulance_station.address}</p>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Status
                                        </dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(ambulance.status)}`}>
                                                {ambulance.status === 'available' && 'Tersedia'}
                                                {ambulance.status === 'on_duty' && 'Sedang Bertugas'}
                                                {ambulance.status === 'maintenance' && 'Dalam Pemeliharaan'}
                                                {ambulance.status === 'out_of_service' && 'Tidak Aktif'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Pemeliharaan Terakhir
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {formatDate(ambulance.last_maintenance_date)}
                                        </dd>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Pemeliharaan Berikutnya
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {formatDate(ambulance.next_maintenance_date)}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Catatan
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {ambulance.notes || 'Tidak ada catatan'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                    
                    {/* Side Sections */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Status Card */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Status Saat Ini</h3>
                                <div className="mt-4 flex items-center">
                                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(ambulance.status)}`}>
                                        {ambulance.status === 'available' && 'Tersedia'}
                                        {ambulance.status === 'on_duty' && 'Sedang Bertugas'}
                                        {ambulance.status === 'maintenance' && 'Dalam Pemeliharaan'}
                                        {ambulance.status === 'out_of_service' && 'Tidak Aktif'}
                                    </span>
                                </div>
                                {ambulance.status === 'maintenance' && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>Sedang dalam jadwal pemeliharaan</p>
                                        {ambulance.maintenance_notes && (
                                            <p className="mt-1 italic">{ambulance.maintenance_notes}</p>
                                        )}
                                    </div>
                                )}
                                {ambulance.status === 'on_duty' && ambulance.current_booking && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>Sedang dalam penugasan</p>
                                        <Link
                                            href={route('admin.bookings.show', ambulance.current_booking.id)}
                                            className="mt-1 text-primary-600 hover:text-primary-800"
                                        >
                                            Lihat detail penugasan
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                            <div className="p-5 sm:p-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Aksi Cepat</h3>
                                <div className="mt-4 space-y-3">
                                    <Link
                                        href={route('admin.ambulances.edit', ambulance.id)}
                                        className="w-full inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50"
                                    >
                                        Edit Ambulans
                                    </Link>
                                    <Link
                                        href={route('admin.ambulances.schedule-maintenance', ambulance.id)}
                                        className="w-full inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50"
                                    >
                                        Jadwalkan Pemeliharaan
                                    </Link>
                                    {ambulance.status === 'maintenance' && (
                                        <Link
                                            href={route('admin.ambulances.complete-maintenance', ambulance.id)}
                                            className="w-full inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50"
                                        >
                                            Selesaikan Pemeliharaan
                                        </Link>
                                    )}
                                    {ambulance.status === 'out_of_service' && (
                                        <button
                                            onClick={handleActivate}
                                            disabled={activateForm.processing}
                                            className="w-full inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50 focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                        >
                                            {activateForm.processing ? 'Mengaktifkan...' : 'Aktifkan Ambulans'}
                                        </button>
                                    )}
                                    {ambulance.status === 'available' && (
                                        <button
                                            onClick={handleDeactivate}
                                            disabled={deactivateForm.processing}
                                            className="w-full inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50 focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                        >
                                            {deactivateForm.processing ? 'Menonaktifkan...' : 'Nonaktifkan Ambulans'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent Bookings */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="p-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Pemesanan Terkini</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Riwayat pemesanan yang menggunakan ambulans ini.</p>
                    </div>
                    <div className="border-t border-slate-200">
                        {bookings && bookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dari</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tujuan</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {bookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-slate-50">
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                    {booking.booking_number}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatDate(booking.booking_date)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {booking.pickup_location}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {booking.destination}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBookingStatusBadgeClass(booking.status)}`}>
                                                        {booking.status_label}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        href={route('admin.bookings.show', booking.id)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Lihat<span className="sr-only">, booking {booking.id}</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 sm:p-6 text-center text-sm text-gray-500">
                                Belum ada pemesanan untuk ambulans ini.
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Maintenance History */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="p-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Riwayat Pemeliharaan</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Daftar pemeliharaan yang telah dilakukan.</p>
                    </div>
                    <div className="border-t border-slate-200">
                        {maintenanceRecords && maintenanceRecords.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Jenis</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teknisi</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deskripsi</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Biaya</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {maintenanceRecords.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50">
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatDate(record.maintenance_date)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {record.maintenance_type}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {record.technician_name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    {record.description}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    Rp {new Intl.NumberFormat('id-ID').format(record.cost)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 sm:p-6 text-center text-sm text-gray-500">
                                Belum ada riwayat pemeliharaan untuk ambulans ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
