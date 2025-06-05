import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    TrashIcon,
    ArrowsUpDownIcon,
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function UsersIndex({ auth, users, filters, filterOptions }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    
    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.users.index', { search: searchTerm });
    };
    
    // Handle sort change
    const handleSortChange = (column) => {
        const newSortBy = column;
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        window.location.href = route('admin.users.index', {
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
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800'
        };
        
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Handle user delete
    const handleDelete = (userId, userName) => {
        Swal.fire({
            title: 'Hapus Pengguna?',
            html: `Apakah Anda yakin ingin menghapus pengguna <strong>${userName}</strong>?<br>Tindakan ini tidak dapat dibatalkan.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.users.destroy', userId), {
                    onSuccess: () => {
                        Swal.fire(
                            'Terhapus!',
                            'Pengguna berhasil dihapus.',
                            'success'
                        );
                    },
                    onError: (errors) => {
                        Swal.fire(
                            'Gagal!',
                            errors.error || 'Terjadi kesalahan saat menghapus pengguna.',
                            'error'
                        );
                    }
                });
            }
        });
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Kelola Pengguna">
            <Head title="Kelola Pengguna" />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Pengguna</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Daftar semua pengguna termasuk nama, informasi kontak, dan status saat ini.
                            </p>
                        </div>
                    </div>
                    
                    {/* Search and filters */}
                    <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-5 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <form onSubmit={handleSearch} className="sm:max-w-xs w-full">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search"
                                            name="search"
                                            className="block w-full rounded-md border-0 py-2 pl-10 pr-3.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                                            placeholder="Cari nama, telepon..."
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </form>
                                
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        onClick={() => setFilterOpen(!filterOpen)}
                                    >
                                        <FunnelIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        Filter
                                    </button>
                                </div>
                            </div>
                            
                            {filterOpen && (
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label htmlFor="filter-status" className="block text-sm font-medium leading-6 text-gray-900">
                                            Status
                                        </label>
                                        <select
                                            id="filter-status"
                                            name="status"
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
                                            defaultValue={filters.status || ''}
                                            onChange={(e) => {
                                                window.location.href = route('admin.users.index', {
                                                    ...filters,
                                                    status: e.target.value,
                                                    page: 1
                                                });
                                            }}
                                        >
                                            <option value="">Semua Status</option>
                                            {Array.isArray(filterOptions.statuses) && filterOptions.statuses.map((status) => (
                                                <option key={String(status)} value={status}>
                                                    {status === 'active' ? 'Aktif' : status === 'inactive' ? 'Tidak Aktif' : 'Ditangguhkan'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="filter-city" className="block text-sm font-medium leading-6 text-gray-900">
                                            Kota
                                        </label>
                                        <select
                                            id="filter-city"
                                            name="city"
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
                                            defaultValue={filters.city || ''}
                                            onChange={(e) => {
                                                window.location.href = route('admin.users.index', {
                                                    ...filters,
                                                    city: e.target.value,
                                                    page: 1
                                                });
                                            }}
                                        >
                                            <option value="">Semua Kota</option>
                                            {Array.isArray(filterOptions.cities) && filterOptions.cities.map((city) => {
                                                // Check if city is an object with label/value or just a string
                                                const cityValue = typeof city === 'object' ? city.value : city;
                                                const cityLabel = typeof city === 'object' ? city.label : city;
                                                return (
                                                    <option key={String(cityValue)} value={cityValue}>
                                                        {cityLabel}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => window.location.href = route('admin.users.index')}
                                        >
                                            Reset Filter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8 cursor-pointer"
                                            onClick={() => handleSortChange('name')}
                                        >
                                            <div className="group flex items-center gap-x-2">
                                                Nama
                                                <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {getSortIcon('name')}
                                                </span>
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSortChange('phone')}
                                        >
                                            <div className="group flex items-center gap-x-2">
                                                Telepon
                                                <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {getSortIcon('phone')}
                                                </span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Alamat
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSortChange('city')}
                                        >
                                            <div className="group flex items-center gap-x-2">
                                                Kota
                                                <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {getSortIcon('city')}
                                                </span>
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSortChange('status')}
                                        >
                                            <div className="group flex items-center gap-x-2">
                                                Status
                                                <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {getSortIcon('status')}
                                                </span>
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                            onClick={() => handleSortChange('created_at')}
                                        >
                                            <div className="group flex items-center gap-x-2">
                                                Terdaftar
                                                <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {getSortIcon('created_at')}
                                                </span>
                                            </div>
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-4 px-4 text-center text-sm text-gray-500">
                                                Tidak ada data pengguna yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {user.phone}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                    {user.address}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {user.city}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                                                        {user.status === 'active' ? 'Aktif' : user.status === 'inactive' ? 'Tidak Aktif' : 'Ditangguhkan'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('admin.users.show', user.id)}
                                                            className="text-gray-500 hover:text-primary-600"
                                                            title="Lihat Detail"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                            <span className="sr-only">Lihat</span>
                                                        </Link>
                                                        
                                                        <button
                                                            type="button"
                                                            className="text-gray-500 hover:text-red-600"
                                                            onClick={() => handleDelete(user.id, user.name)}
                                                            title="Hapus Pengguna"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                            <span className="sr-only">Hapus</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Pagination */}
                    {users.data.length > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {users.prev_page_url ? (
                                    <a
                                        href={users.prev_page_url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </a>
                                ) : (
                                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                                        Previous
                                    </span>
                                )}
                                
                                {users.next_page_url ? (
                                    <a
                                        href={users.next_page_url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </a>
                                ) : (
                                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                                        Next
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{users.from}</span> ke <span className="font-medium">{users.to}</span> dari <span className="font-medium">{users.total}</span> pengguna
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {users.links.map((link, index) => {
                                            if (link.label === '&laquo; Previous') {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                                                            link.url
                                                                ? 'text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                        aria-disabled={!link.url}
                                                        tabIndex={link.url ? 0 : -1}
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                                    </a>
                                                );
                                            } else if (link.label === 'Next &raquo;') {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                                                            link.url
                                                                ? 'text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                        aria-disabled={!link.url}
                                                        tabIndex={link.url ? 0 : -1}
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                                    </a>
                                                );
                                            } else {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                            link.active
                                                                ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                                                : link.url
                                                                ? 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                        aria-current={link.active ? 'page' : undefined}
                                                        aria-disabled={!link.url}
                                                        tabIndex={link.url ? 0 : -1}
                                                    >
                                                        {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                                    </a>
                                                );
                                            }
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
