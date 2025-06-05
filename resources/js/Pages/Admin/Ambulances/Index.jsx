import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    EyeIcon,
    TrashIcon,
    ArrowsUpDownIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    TruckIcon
} from '@heroicons/react/24/outline';

export default function AmbulancesIndex({ auth, ambulances, filters, filterOptions }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    
    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.ambulances.index', { search: searchTerm });
    };
    
    // Handle sort change
    const handleSortChange = (column) => {
        const newSortBy = column;
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        window.location.href = route('admin.ambulances.index', {
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
    
    // Status badge styling
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            available: 'bg-green-100 text-green-800',
            on_duty: 'bg-blue-100 text-blue-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            inactive: 'bg-slate-100 text-slate-800'
        };
        
        return statusClasses[status] || 'bg-slate-100 text-slate-800';
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Kelola Ambulans">
            <Head title="Kelola Ambulans" />
            
            <div className="space-y-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h2 className="text-2xl font-bold text-gray-900">Ambulans</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Daftar semua ambulans termasuk detail kendaraan, status saat ini, dan lokasi penempatan.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link
                            href={route('admin.ambulances.create')}
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                            Tambah Ambulans
                        </Link>
                    </div>
                </div>
                
                {/* Search and filters */}
                <div className="flex flex-col md:flex-row gap-4">
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
                                    placeholder="Cari berdasarkan nomor registrasi, model, atau tipe..."
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
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50"
                        >
                            <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
                            Filter
                        </button>
                    </div>
                </div>
                
                {/* Filter panel */}
                {filterOpen && (
                    <div className="rounded-xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">
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
                                    Tipe Ambulans
                                </label>
                                <select
                                    id="filter-type"
                                    name="type_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                    defaultValue={filters?.type_id || ''}
                                >
                                    <option value="">Semua Tipe</option>
                                    {filterOptions.ambulanceTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="filter-station" className="block text-sm font-medium text-gray-700">
                                    Stasiun Ambulans
                                </label>
                                <select
                                    id="filter-station"
                                    name="station_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                    defaultValue={filters?.station_id || ''}
                                >
                                    <option value="">Semua Stasiun</option>
                                    {filterOptions.ambulanceStations.map(station => (
                                        <option key={station.id} value={station.id}>
                                            {station.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                    onClick={() => {
                                        // Collect all filter values and redirect
                                        const status = document.getElementById('filter-status').value;
                                        const typeId = document.getElementById('filter-type').value;
                                        const stationId = document.getElementById('filter-station').value;
                                        
                                        window.location.href = route('admin.ambulances.index', {
                                            search: searchTerm,
                                            status,
                                            type_id: typeId,
                                            station_id: stationId,
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
                
                {/* Ambulances table */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => handleSortChange('registration_number')}
                                    >
                                        <div className="group inline-flex items-center">
                                            Nomor Registrasi
                                            <span className="ml-2 flex-none rounded">
                                                {getSortIcon('registration_number')}
                                            </span>
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => handleSortChange('model')}
                                    >
                                        <div className="group inline-flex items-center">
                                            Model
                                            <span className="ml-2 flex-none rounded">
                                                {getSortIcon('model')}
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Tipe
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Stasiun
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => handleSortChange('status')}
                                    >
                                        <div className="group inline-flex items-center">
                                            Status
                                            <span className="ml-2 flex-none rounded">
                                                {getSortIcon('status')}
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Pemeliharaan Terakhir
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Pemeliharaan Berikutnya
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {ambulances.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-3 py-4 text-center text-sm text-gray-500">
                                            Tidak ada data ambulans ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    ambulances.data.map(ambulance => (
                                        <tr key={ambulance.id} className="hover:bg-slate-50">
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                <div className="font-medium">{ambulance.registration_number}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.model}
                                                {ambulance.year && <span className="text-xs text-gray-400 ml-1">({ambulance.year})</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.ambulance_type?.name || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.ambulance_station?.name || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(ambulance.status)}`}>
                                                    {ambulance.status === 'available' && 'Tersedia'}
                                                    {ambulance.status === 'on_duty' && 'Sedang Bertugas'}
                                                    {ambulance.status === 'maintenance' && 'Dalam Pemeliharaan'}
                                                    {ambulance.status === 'inactive' && 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatDate(ambulance.last_maintenance_date)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatDate(ambulance.next_maintenance_date)}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('admin.ambulances.show', ambulance.id)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                                        <span className="sr-only">Lihat {ambulance.registration_number}</span>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.ambulances.edit', ambulance.id)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                                                        <span className="sr-only">Edit {ambulance.registration_number}</span>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.ambulances.schedule-maintenance', ambulance.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <TruckIcon className="h-5 w-5" aria-hidden="true" />
                                                        <span className="sr-only">Jadwalkan Pemeliharaan</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {ambulances.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {ambulances.prev_page_url ? (
                                    <a
                                        href={ambulances.prev_page_url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50"
                                    >
                                        Sebelumnya
                                    </a>
                                ) : (
                                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                                        Sebelumnya
                                    </span>
                                )}
                                
                                {ambulances.next_page_url ? (
                                    <a
                                        href={ambulances.next_page_url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50"
                                    >
                                        Berikutnya
                                    </a>
                                ) : (
                                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                                        Berikutnya
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{ambulances.from}</span> sampai <span className="font-medium">{ambulances.to}</span> dari <span className="font-medium">{ambulances.total}</span> hasil
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {ambulances.links.map((link, i) => {
                                            if (link.url === null) {
                                                return (
                                                    <span
                                                        key={i}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 cursor-not-allowed bg-white"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    ></span>
                                                );
                                            }
                                            
                                            return (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                                                        link.active
                                                            ? 'bg-primary-50 border-primary-500 text-primary-600 z-10'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-slate-50'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                ></a>
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
