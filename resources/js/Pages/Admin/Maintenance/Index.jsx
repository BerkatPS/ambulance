import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowsUpDownIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    WrenchScrewdriverIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function MaintenanceIndex({ auth, maintenances, filters, filterOptions }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    
    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.maintenance.index', { search: searchTerm });
    };
    
    // Handle sort change
    const handleSortChange = (column) => {
        const newSortBy = column;
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        window.location.href = route('admin.maintenance.index', {
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
        if (!amount) return 'Rp0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
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
        const statusLabels = {
            'scheduled': 'Terjadwal',
            'in_progress': 'Dalam Proses',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        
        return statusLabels[status] || status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Format maintenance type
    const formatMaintenanceType = (type) => {
        const typeLabels = {
            'service': 'Servis Rutin',
            'repair': 'Perbaikan',
            'routine': 'Servis Rutin',
            'inspection': 'Inspeksi',
            'equipment': 'Peralatan'
        };
        
        return typeLabels[type] || type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Perawatan & Perbaikan">
            <Head title="Perawatan & Perbaikan" />
            
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
                                        <span className="ml-4 text-gray-500 font-medium">Perawatan & Perbaikan</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Perawatan & Perbaikan</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Daftar semua catatan perawatan dan perbaikan untuk ambulans, termasuk perawatan terjadwal, perbaikan, dan inspeksi.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Link
                                href={route('admin.maintenance.create')}
                                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                            >
                                Tambah Catatan Perawatan
                            </Link>
                        </div>
                    </div>
                    
                    {/* Search and filters */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                            <form onSubmit={handleSearch}>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                        placeholder="Cari berdasarkan deskripsi atau vendor..."
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 hover:text-primary-800"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="w-full md:w-1/2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
                                Filter
                            </button>
                        </div>
                    </div>
                    
                    {/* Filter panel */}
                    {filterOpen && (
                        <div className="mt-4 rounded-xl bg-white p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-100">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="filter-status"
                                        name="status"
                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.status || ''}
                                    >
                                        <option value="">Semua Status</option>
                                        {filterOptions.statuses.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700">
                                        Jenis Perawatan
                                    </label>
                                    <select
                                        id="filter-type"
                                        name="maintenance_type"
                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.maintenance_type || ''}
                                    >
                                        <option value="">Semua Jenis</option>
                                        {filterOptions.maintenanceTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="filter-ambulance" className="block text-sm font-medium text-gray-700">
                                        Ambulans
                                    </label>
                                    <select
                                        id="filter-ambulance"
                                        name="ambulance_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.ambulance_id || ''}
                                    >
                                        <option value="">Semua Ambulans</option>
                                        {filterOptions.ambulances.map(ambulance => (
                                            <option key={ambulance.value} value={ambulance.value}>
                                                {ambulance.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="filter-start-date" className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        id="filter-start-date"
                                        name="start_date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.start_date || ''}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="filter-end-date" className="block text-sm font-medium text-gray-700">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        id="filter-end-date"
                                        name="end_date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        defaultValue={filters?.end_date || ''}
                                    />
                                </div>
                                
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                        onClick={() => {
                                            // Collect all filter values and redirect
                                            const status = document.getElementById('filter-status').value;
                                            const maintenanceType = document.getElementById('filter-type').value;
                                            const ambulanceId = document.getElementById('filter-ambulance').value;
                                            const startDate = document.getElementById('filter-start-date').value;
                                            const endDate = document.getElementById('filter-end-date').value;
                                            
                                            window.location.href = route('admin.maintenance.index', {
                                                search: searchTerm,
                                                status,
                                                maintenance_type: maintenanceType,
                                                ambulance_id: ambulanceId,
                                                start_date: startDate,
                                                end_date: endDate,
                                                sort_by: filters.sort_by,
                                                sort_order: filters.sort_order,
                                                per_page: filters.per_page
                                            });
                                        }}
                                    >
                                        Terapkan Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Maintenance records table */}
                    <div className="mt-6 flow-root">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow-sm border border-slate-100 rounded-xl">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    scope="col" 
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                                                    onClick={() => handleSortChange('id')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        ID
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('id')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('ambulance_id')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Ambulans
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('ambulance_id')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('type')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Jenis
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('type')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('service_date')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Tanggal Mulai
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('service_date')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('status')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Status
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('status')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('cost')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Biaya
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('cost')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Aksi</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {maintenances && maintenances.data && maintenances.data.length > 0 ? (
                                                maintenances.data.map((record) => (
                                                    <tr key={record.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {record.maintenance_code || `#${record.id}`}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.ambulance ? (
                                                                <Link
                                                                    href={route('admin.ambulances.show', record.ambulance.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                >
                                                                    {record.ambulance.vehicle_code} - {record.ambulance.license_plate}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-gray-400">Tidak Ada</span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {formatMaintenanceType(record.type || record.maintenance_type)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {formatDate(record.service_date || record.start_date)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                                                                {formatStatusLabel(record.status)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {formatCurrency(record.cost)}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('admin.maintenance.show', record.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <EyeIcon className="h-5 w-5" />
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.maintenance.edit', record.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                    title="Edit"
                                                                >
                                                                    <PencilSquareIcon className="h-5 w-5" />
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Hapus"
                                                                    onClick={() => {
                                                                        if (confirm('Apakah Anda yakin ingin menghapus catatan perawatan ini?')) {
                                                                            // Submit a form to delete the maintenance record
                                                                            const form = document.createElement('form');
                                                                            form.method = 'POST';
                                                                            form.action = route('admin.maintenance.destroy', record.id);
                                                                            
                                                                            const methodInput = document.createElement('input');
                                                                            methodInput.type = 'hidden';
                                                                            methodInput.name = '_method';
                                                                            methodInput.value = 'DELETE';
                                                                            form.appendChild(methodInput);
                                                                            
                                                                            const tokenInput = document.createElement('input');
                                                                            tokenInput.type = 'hidden';
                                                                            tokenInput.name = '_token';
                                                                            tokenInput.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                                                                            form.appendChild(tokenInput);
                                                                            
                                                                            document.body.appendChild(form);
                                                                            form.submit();
                                                                        }
                                                                    }}
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        Tidak ada catatan perawatan yang ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Pagination */}
                    {maintenances && maintenances.links && maintenances.links.length > 3 && (
                        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 sm:px-6 border-t border-gray-200">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {maintenances.prev_page_url ? (
                                    <a
                                        href={maintenances.prev_page_url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Sebelumnya
                                    </a>
                                ) : (
                                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
                                        Sebelumnya
                                    </span>
                                )}
                                
                                {maintenances.next_page_url ? (
                                    <a
                                        href={maintenances.next_page_url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Berikutnya
                                    </a>
                                ) : (
                                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
                                        Berikutnya
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{maintenances.from}</span> sampai <span className="font-medium">{maintenances.to}</span> dari{' '}
                                        <span className="font-medium">{maintenances.total}</span> catatan perawatan
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {maintenances.links.map((link, index) => {
                                            // Skip the "Next &raquo;" and "&laquo; Previous" links
                                            if (index === 0 || index === maintenances.links.length - 1) {
                                                return null;
                                            }
                                            
                                            // Handle regular page links
                                            return (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                        link.active
                                                            ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
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
