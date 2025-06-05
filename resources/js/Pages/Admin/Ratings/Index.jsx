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
    StarIcon,
    CalendarIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function RatingsIndex({ auth, ratings, filters, filterOptions }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterForm, setFilterForm] = useState({
        stars: filters?.stars || '',
        driver_rating: filters?.driver_rating || '',
        ambulance_rating: filters?.ambulance_rating || '',
        service_rating: filters?.service_rating || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });
    
    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('admin.ratings.index', { 
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
        window.location.href = route('admin.ratings.index', {
            ...filters,
            ...filterForm
        });
    };
    
    // Reset filters
    const resetFilters = () => {
        setFilterForm({
            stars: '',
            driver_rating: '',
            ambulance_rating: '',
            service_rating: '',
            start_date: '',
            end_date: '',
        });
        
        window.location.href = route('admin.ratings.index', {
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
            per_page: filters.per_page
        });
    };
    
    // Handle sort change
    const handleSortChange = (column) => {
        const newSortBy = column;
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        window.location.href = route('admin.ratings.index', {
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
    
    // Render star rating
    const renderStars = (rating) => {
        if (rating === undefined || rating === null) {
            return <span className="text-sm text-gray-400">Belum ada penilaian</span>;
        }
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />);
            } else {
                stars.push(<StarIcon key={i} className="h-5 w-5 text-gray-300" />);
            }
        }
        
        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Penilaian Pengguna">
            <Head title="Penilaian Pengguna" />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Penilaian</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Daftar semua penilaian dan ulasan pengguna untuk layanan ambulans.
                            </p>
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
                                        placeholder="Cari berdasarkan komentar pengguna..."
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
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 border border-slate-100">
                            <form onSubmit={applyFilters}>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label htmlFor="stars" className="block text-sm font-medium text-gray-700">
                                            Penilaian Keseluruhan
                                        </label>
                                        <select
                                            id="stars"
                                            name="stars"
                                            value={filterForm.stars}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        >
                                            <option value="">Semua Penilaian</option>
                                            {filterOptions.ratingOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="driver_rating" className="block text-sm font-medium text-gray-700">
                                            Penilaian Pengemudi
                                        </label>
                                        <select
                                            id="driver_rating"
                                            name="driver_rating"
                                            value={filterForm.driver_rating}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        >
                                            <option value="">Semua Penilaian</option>
                                            {filterOptions.ratingOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="ambulance_rating" className="block text-sm font-medium text-gray-700">
                                            Penilaian Kendaraan
                                        </label>
                                        <select
                                            id="ambulance_rating"
                                            name="ambulance_rating"
                                            value={filterForm.ambulance_rating}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        >
                                            <option value="">Semua Penilaian</option>
                                            {filterOptions.ratingOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="service_rating" className="block text-sm font-medium text-gray-700">
                                            Penilaian Pelayanan
                                        </label>
                                        <select
                                            id="service_rating"
                                            name="service_rating"
                                            value={filterForm.service_rating}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        >
                                            <option value="">Semua Penilaian</option>
                                            {filterOptions.ratingOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                            Tanggal Mulai
                                        </label>
                                        <input
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            value={filterForm.start_date}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                            Tanggal Akhir
                                        </label>
                                        <input
                                            type="date"
                                            id="end_date"
                                            name="end_date"
                                            value={filterForm.end_date}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    
                                    <div className="lg:col-span-3 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                        >
                                            <XMarkIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            Reset Filter
                                        </button>
                                        
                                        <button
                                            type="submit"
                                            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                        >
                                            Terapkan Filter
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* Ratings table */}
                    <div className="mt-6 flow-root">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow-sm rounded-xl border border-slate-100">
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
                                                    onClick={() => handleSortChange('user.name')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Pengguna
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('user.name')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('overall')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Penilaian
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('overall')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Komentar
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                                    onClick={() => handleSortChange('created_at')}
                                                >
                                                    <div className="group inline-flex items-center">
                                                        Tanggal
                                                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                            {getSortIcon('created_at')}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Status
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Tindakan</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {ratings.data.length > 0 ? (
                                                ratings.data.map((rating) => (
                                                    <tr key={rating.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            #{rating.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {rating.user ? (
                                                                <Link
                                                                    href={route('admin.users.show', rating.user.id)}
                                                                    className="text-primary-600 hover:text-primary-900"
                                                                >
                                                                    {rating.user.name}
                                                                </Link>
                                                            ) : (
                                                                'Anonim'
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {renderStars(rating.overall)}
                                                        </td>
                                                        <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                            {rating.comment || <span className="text-gray-400 italic">Tidak ada komentar</span>}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {formatDate(rating.created_at)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                rating.admin_response ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {rating.admin_response ? 'Ditanggapi' : 'Belum Ditanggapi'}
                                                            </span>
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <Link
                                                                href={route('admin.ratings.show', rating.id)}
                                                                className="text-primary-600 hover:text-primary-900"
                                                                title="Lihat Detail"
                                                            >
                                                                <EyeIcon className="h-5 w-5" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        Tidak ada penilaian ditemukan.
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
                    {ratings.links && ratings.links.length > 3 && (
                        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {ratings.prev_page_url ? (
                                    <a
                                        href={ratings.prev_page_url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Sebelumnya
                                    </a>
                                ) : (
                                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
                                        Sebelumnya
                                    </span>
                                )}
                                
                                {ratings.next_page_url ? (
                                    <a
                                        href={ratings.next_page_url}
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
                                        Menampilkan <span className="font-medium">{ratings.from}</span> sampai{' '}
                                        <span className="font-medium">{ratings.to}</span> dari{' '}
                                        <span className="font-medium">{ratings.total}</span> hasil
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {ratings.links.map((link, index) => {
                                            // Skip the "previous" and "next" links as we'll create custom ones
                                            if (index === 0 || index === ratings.links.length - 1) {
                                                return null;
                                            }
                                            
                                            if (link.url === null) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            
                                            return (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
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
