import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DriverDashboardLayout from '@/Layouts/DriverDashboardLayout';
import { 
    StarIcon, 
    ClockIcon, 
    UserIcon,
    SparklesIcon,
    TruckIcon,
    CalendarIcon,
    FunnelIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/Components/Common/Pagination';

export default function RatingsIndex({ ratings, summary, filters }) {
    const [searchParams, setSearchParams] = useState({
        rating: filters.rating || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak ditentukan';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Tanggal tidak valid';
            
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Kesalahan format tanggal';
        }
    };
    
    const handleFilterChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };
    
    const resetFilters = () => {
        setSearchParams({
            rating: '',
            date_from: '',
            date_to: '',
        });
    };
    
    const applyFilters = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });
        
        window.location.href = `${route('driver.ratings.index')}?${queryParams.toString()}`;
    };
    
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => (
            <StarIcon 
                key={index}
                className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };
    
    const getCategoryLabel = (category) => {
        switch(category) {
            case 'punctuality':
                return 'Ketepatan Waktu';
            case 'service':
                return 'Pelayanan';
            case 'vehicle_condition':
                return 'Kondisi Kendaraan';
            default:
                return 'Keseluruhan';
        }
    };
    
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'punctuality':
                return <ClockIcon className="h-5 w-5 text-blue-500" />;
            case 'service':
                return <SparklesIcon className="h-5 w-5 text-purple-500" />;
            case 'vehicle_condition':
                return <TruckIcon className="h-5 w-5 text-green-500" />;
            default:
                return <StarIcon className="h-5 w-5 text-yellow-500" />;
        }
    };

    return (
        <DriverDashboardLayout
            title="Penilaian & Ulasan"
            header={
                <div className="flex items-center">
                    <StarIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Penilaian & Ulasan</h2>
                </div>
            }
        >
            <Head title="Penilaian & Ulasan" />
            
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 sm:rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 mr-4">
                                <StarIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rating Keseluruhan</p>
                                <div className="flex items-baseline">
                                    {Number.isNaN(Number(summary.average_overall)) ? (
                                        <p className="text-2xl font-bold text-gray-900">N/A</p>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">{Number(summary.average_overall).toFixed(1)}</p>
                                    )}
                                    <p className="ml-1 text-sm text-gray-600">/ 5</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex">
                            {Number.isNaN(Number(summary.average_overall)) ? (
                                <p className="text-gray-500">Belum ada penilaian.</p>
                            ) : (
                                renderStars(Math.round(Number(summary.average_overall)))
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 sm:rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 mr-4">
                                <ClockIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ketepatan Waktu</p>
                                <div className="flex items-baseline">
                                    {Number.isNaN(Number(summary.average_punctuality)) ? (
                                        <p className="text-2xl font-bold text-gray-900">N/A</p>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">{Number(summary.average_punctuality).toFixed(1)}</p>
                                    )}
                                    <p className="ml-1 text-sm text-gray-600">/ 5</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex">
                            {Number.isNaN(Number(summary.average_punctuality)) ? (
                                <p className="text-gray-500">Belum ada penilaian.</p>
                            ) : (
                                renderStars(Math.round(Number(summary.average_punctuality)))
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 sm:rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 mr-4">
                                <SparklesIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pelayanan</p>
                                <div className="flex items-baseline">
                                    {Number.isNaN(Number(summary.average_service)) ? (
                                        <p className="text-2xl font-bold text-gray-900">N/A</p>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">{Number(summary.average_service).toFixed(1)}</p>
                                    )}
                                    <p className="ml-1 text-sm text-gray-600">/ 5</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex">
                            {Number.isNaN(Number(summary.average_service)) ? (
                                <p className="text-gray-500">Belum ada penilaian.</p>
                            ) : (
                                renderStars(Math.round(Number(summary.average_service)))
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 sm:rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 mr-4">
                                <TruckIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Kondisi Kendaraan</p>
                                <div className="flex items-baseline">
                                    {Number.isNaN(Number(summary.average_vehicle)) ? (
                                        <p className="text-2xl font-bold text-gray-900">N/A</p>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">{Number(summary.average_vehicle).toFixed(1)}</p>
                                    )}
                                    <p className="ml-1 text-sm text-gray-600">/ 5</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex">
                            {Number.isNaN(Number(summary.average_vehicle)) ? (
                                <p className="text-gray-500">Belum ada penilaian.</p>
                            ) : (
                                renderStars(Math.round(Number(summary.average_vehicle)))
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Filters */}
                <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden border border-slate-100">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                        <FunnelIcon className="h-5 w-5 text-primary-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Filter Ulasan</h3>
                    </div>
                    <div className="px-6 py-4">
                        <form onSubmit={applyFilters}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                                    <select
                                        id="rating"
                                        name="rating"
                                        value={searchParams.rating}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    >
                                        <option value="">Semua Rating</option>
                                        <option value="5">5 Bintang</option>
                                        <option value="4">4 Bintang</option>
                                        <option value="3">3 Bintang</option>
                                        <option value="2">2 Bintang</option>
                                        <option value="1">1 Bintang</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                                    <input
                                        type="date"
                                        id="date_from"
                                        name="date_from"
                                        value={searchParams.date_from}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        id="date_to"
                                        name="date_to"
                                        value={searchParams.date_to}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <XCircleIcon className="h-4 w-4 mr-1.5" />
                                    Atur Ulang
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-1.5" />
                                    Terapkan Filter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Reviews List */}
                <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden border border-slate-100">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Semua Ulasan</h3>
                    </div>
                    
                    {ratings.data.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {ratings.data.map((rating) => (
                                <div key={rating.id} className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-gray-500" />
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {rating.user?.name || 'Anonim'}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(rating.created_at)}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-1 flex">
                                                {renderStars(rating.overall)}
                                            </div>
                                            
                                            <div className="mt-3 text-sm text-gray-700">
                                                <p>{rating.comment || 'Tidak ada komentar.'}</p>
                                            </div>
                                            
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center">
                                                        <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-700">Ketepatan Waktu</span>
                                                    </div>
                                                    <div className="mt-1 flex">
                                                        {renderStars(rating.punctuality)}
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center">
                                                        <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-700">Pelayanan</span>
                                                    </div>
                                                    <div className="mt-1 flex">
                                                        {renderStars(rating.service)}
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center">
                                                        <TruckIcon className="h-5 w-5 text-green-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-700">Kondisi Kendaraan</span>
                                                    </div>
                                                    <div className="mt-1 flex">
                                                        {renderStars(rating.vehicle_condition)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 text-sm">
                                                <p className="text-gray-500 flex items-center">
                                                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                                                    Pemesanan #{rating.booking.id} pada {formatDate(rating.booking.completed_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Belum ada ulasan untuk ditampilkan.</p>
                        </div>
                    )}
                    
                    {ratings.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination links={ratings.links} />
                        </div>
                    )}
                </div>
            </div>
        </DriverDashboardLayout>
    );
}
