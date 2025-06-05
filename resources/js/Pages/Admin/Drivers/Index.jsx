import React, { useState, Fragment } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { Dialog, Transition } from '@headlessui/react';
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
    TruckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function DriversIndex({ auth, drivers, filters, filterOptions }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        ambulance_id: '',
    });
    
    // Handle opening the assign modal
    const openAssignModal = (driver) => {
        setSelectedDriver(driver);
        setData({
            ambulance_id: '',
        });
        setAssignModalOpen(true);
    };
    
    // Handle ambulance assignment
    const handleAssignAmbulance = (e) => {
        e.preventDefault();
        
        post(route('admin.drivers.assign-ambulance', { driver: selectedDriver.id }), {
            onSuccess: () => {
                setAssignModalOpen(false);
                reset();
            },
        });
    };
    
    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.drivers.index', { search: searchTerm });
    };
    
    // Handle sort change
    const handleSortChange = (column) => {
        const newSortBy = column;
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        window.location.href = route('admin.drivers.index', {
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
            busy: 'bg-blue-100 text-blue-800',
            off: 'bg-gray-100 text-gray-800'
        };
        
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    // Translate status
    const getStatusLabel = (status) => {
        const labels = {
            'available': 'TERSEDIA',
            'busy': 'SIBUK',
            'off': 'NONAKTIF'
        };
        
        return labels[status] || status.replace('_', ' ').toUpperCase();
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Kelola Pengemudi">
            <Head title="Kelola Pengemudi" />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Pengemudi</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Daftar semua pengemudi termasuk nama, informasi kontak, dan status saat ini.
                            </p>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <Link
                                href={route('admin.drivers.create')}
                                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                Tambah Pengemudi
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
                                        placeholder="Cari pengemudi berdasarkan nama, nomor SIM, atau telepon..."
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
                                        <option value="available">Tersedia</option>
                                        <option value="busy">Sibuk</option>
                                        <option value="off">Nonaktif</option>
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
                                            <option key={ambulance.id} value={ambulance.id}>
                                                {ambulance.vehicle_code} - {ambulance.license_plate} {ambulance.model ? ` (${ambulance.model})` : ''}
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
                                            const ambulanceId = document.getElementById('filter-ambulance').value;
                                            
                                            window.location.href = route('admin.drivers.index', {
                                                search: searchTerm,
                                                status,
                                                ambulance_id: ambulanceId,
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
                    
                    {/* Drivers table */}
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
                                                    onClick={() => handleSortChange('name')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Pengemudi
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('name')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('license_number')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        SIM
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('license_number')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Kontak
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Ambulans
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
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Aksi</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {drivers.data.length > 0 ? (
                                                drivers.data.map((driver) => (
                                                    <tr key={driver.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {driver.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {driver.license_number}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <div>{driver.phone}</div>
                                                            {driver.email && <div className="text-xs">{driver.email}</div>}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {driver.ambulance ? (
                                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                                    {driver.ambulance.registration_number} - {driver.ambulance.model}
                                                                </span>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-gray-400">Belum ditugaskan</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openAssignModal(driver)}
                                                                        className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10 hover:bg-primary-100"
                                                                        title="Tugaskan Ambulans"
                                                                    >
                                                                        <TruckIcon className="h-3 w-3 mr-1" />
                                                                        Tugaskan
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(driver.status)}`}>
                                                                {getStatusLabel(driver.status)}
                                                            </span>
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('admin.drivers.show', driver.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <EyeIcon className="h-5 w-5" />
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.drivers.edit', driver.id)}
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
                                                                        if (confirm('Apakah Anda yakin ingin menghapus pengemudi ini?')) {
                                                                            // Submit a form to delete the driver
                                                                            const form = document.createElement('form');
                                                                            form.method = 'POST';
                                                                            form.action = route('admin.drivers.destroy', driver.id);
                                                                            
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
                                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        Tidak ada pengemudi yang ditemukan.
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
                    {drivers.links && drivers.links.length > 3 && (
                        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {drivers.prev_page_url ? (
                                    <a
                                        href={drivers.prev_page_url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Sebelumnya
                                    </a>
                                ) : (
                                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
                                        Sebelumnya
                                    </span>
                                )}
                                
                                {drivers.next_page_url ? (
                                    <a
                                        href={drivers.next_page_url}
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
                                        Menampilkan <span className="font-medium">{drivers.from}</span> sampai <span className="font-medium">{drivers.to}</span> dari <span className="font-medium">{drivers.total}</span> pengemudi
                                    </p>
                                </div>
                                
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <Link
                                            href={drivers.prev_page_url || '#'}
                                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${!drivers.prev_page_url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <span className="sr-only">Sebelumnya</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </Link>
                                        
                                        {/* Current page indicator */}
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                            Halaman {drivers.current_page} dari {drivers.last_page}
                                        </span>
                                        
                                        <Link
                                            href={drivers.next_page_url || '#'}
                                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${!drivers.next_page_url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <span className="sr-only">Berikutnya</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </Link>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Ambulance Assignment Modal */}
            <Transition.Root show={assignModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setAssignModalOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                            onClick={() => setAssignModalOpen(false)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <TruckIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Tugaskan Ambulans
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Pilih ambulans untuk ditugaskan kepada <span className="font-medium">{selectedDriver?.name}</span>. 
                                                    Ini akan mengubah status pengemudi menjadi 'Tersedia' dan status ambulans menjadi 'Ditugaskan'.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <form onSubmit={handleAssignAmbulance} className="mt-5 sm:mt-4">
                                        <div className="mb-4">
                                            <label htmlFor="ambulance_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Pilih Ambulans
                                            </label>
                                            <select
                                                id="ambulance_id"
                                                name="ambulance_id"
                                                value={data.ambulance_id}
                                                onChange={e => setData('ambulance_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                required
                                            >
                                                <option value="">-- Pilih Ambulans --</option>
                                                {filterOptions.ambulances.map(ambulance => (
                                                    <option key={ambulance.id} value={ambulance.id}>
                                                        {ambulance.vehicle_code} - {ambulance.license_plate} {ambulance.model ? ` (${ambulance.model})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ambulance_id && (
                                                <p className="mt-2 text-sm text-red-600">{errors.ambulance_id}</p>
                                            )}
                                        </div>
                                        
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                                            >
                                                {processing ? 'Menyimpan...' : 'Tugaskan'}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setAssignModalOpen(false)}
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </AdminDashboardLayout>
    );
}
