import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    WrenchScrewdriverIcon,
    TruckIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    UserIcon,
    ClipboardDocumentCheckIcon,
    PencilSquareIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function MaintenanceShow({ auth, maintenance }) {
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
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    // Maintenance status badge styling
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            scheduled: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Format status label
    const formatStatusLabel = (status) => {
        if (!status) return 'Unknown';
        
        const statusLabels = {
            scheduled: 'Dijadwalkan',
            in_progress: 'Sedang Berlangsung',
            completed: 'Selesai',
            cancelled: 'Dibatalkan'
        };
        
        return statusLabels[status] || status;
    };
    
    // Format maintenance type
    const formatMaintenanceType = (type) => {
        if (!type) return 'Unknown';
        
        const typeLabels = {
            service: 'Servis Rutin',
            repair: 'Perbaikan',
            routine: 'Pemeliharaan Rutin',
            inspection: 'Inspeksi',
            equipment: 'Perbaikan Peralatan'
        };
        
        return typeLabels[type] || type;
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title={`Detail Perawatan #${maintenance.id}`}>
            <Head title={`Detail Perawatan #${maintenance.id}`} />
            
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
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <Link 
                                            href={route('admin.maintenance.index')} 
                                            className="ml-4 text-gray-400 hover:text-primary-600"
                                        >
                                            Perawatan & Perbaikan
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <span className="ml-4 text-gray-500 font-medium">#{maintenance.id}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                                            <WrenchScrewdriverIcon className="h-10 w-10 text-primary-600" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h1 className="text-2xl font-semibold leading-7 text-gray-900 sm:tracking-tight">
                                        Perawatan & Perbaikan #{maintenance.id}
                                    </h1>
                                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <TruckIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            {maintenance.ambulance?.vehicle_code || 'Unknown'} - {maintenance.ambulance?.license_plate || 'Unknown'}
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            {formatDate(maintenance.start_date)}
                                        </div>
                                        <div className="mt-2 flex items-center text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(maintenance.status)}`}>
                                                {formatStatusLabel(maintenance.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                            <Link
                                href={route('admin.maintenance.index')}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                <ArrowLeftIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Kembali
                            </Link>
                            <Link
                                href={route('admin.maintenance.edit', maintenance.id)}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                <PencilSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Edit
                            </Link>
                            {maintenance.status === 'scheduled' && (
                                <Link
                                    href={route('admin.maintenance.start', maintenance.id)}
                                    method="post"
                                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    Mulai Perawatan
                                </Link>
                            )}
                            {maintenance.status === 'in_progress' && (
                                <Link
                                    href={route('admin.maintenance.complete', maintenance.id)}
                                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    <ClipboardDocumentCheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                    Selesaikan
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Maintenance Details */}
                        <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden p-5 sm:p-6 lg:p-8">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Detail Perawatan</h3>
                            
                            <div className="border-t border-gray-200 pt-4">
                                <dl className="divide-y divide-gray-200">
                                    {maintenance.maintenance_code && (
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Kode Perawatan</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {maintenance.maintenance_code}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Jenis Perawatan</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {formatMaintenanceType(maintenance.maintenance_type)}
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {maintenance.description}
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1 sm:col-span-2 sm:mt-0">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(maintenance.status)}`}>
                                                {formatStatusLabel(maintenance.status)}
                                            </span>
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Tanggal Mulai</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {formatDate(maintenance.start_date)}
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Tanggal Selesai</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {maintenance.end_date ? formatDate(maintenance.end_date) : 'Belum selesai'}
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Biaya</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {maintenance.cost ? formatCurrency(maintenance.cost) : 'Belum ada data'}
                                        </dd>
                                    </div>
                                    {maintenance.technician_name && (
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Teknisi</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {maintenance.technician_name}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                        
                        {/* Ambulance Details & Notes */}
                        <div className="space-y-6">
                            {/* Ambulance Details */}
                            <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden p-5 sm:p-6 lg:p-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Detail Ambulans</h3>
                                
                                <div className="border-t border-gray-200 pt-4">
                                    <dl className="divide-y divide-gray-200">
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Kode Kendaraan</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {maintenance.ambulance?.vehicle_code || 'N/A'}
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Plat Nomor</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {maintenance.ambulance?.license_plate || 'N/A'}
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Status Ambulans</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {maintenance.ambulance?.status || 'N/A'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {/* Notes */}
                            {maintenance.notes && (
                                <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden p-5 sm:p-6 lg:p-8">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Catatan Tambahan</h3>
                                    
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="prose max-w-none text-sm text-gray-900">
                                            <p>{maintenance.notes}</p>
                                        </div>
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
