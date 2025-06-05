import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Pagination from '@/Components/Common/Pagination';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function RatingsIndex({ auth, ratings }) {
    const [filterValue, setFilterValue] = useState('all');

    // Format date in Indonesian format
    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak tersedia';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
        } catch (e) {
            return 'Format tanggal tidak valid';
        }
    };

    const renderStars = (score) => {
        return [...Array(5)].map((_, i) => (
            <span key={i}>
                {i < score ? (
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                ) : (
                    <StarIconOutline className="h-4 w-4 text-gray-300" />
                )}
            </span>
        ));
    };

    // Filter ratings based on selected filter
    const filteredRatings = filterValue === 'all'
        ? ratings.data
        : ratings.data.filter(rating => {
            if (filterValue === 'high') return rating.overall >= 4;
            if (filterValue === 'low') return rating.overall < 3;
            return true;
        });

    return (
        <UserDashboardLayout
            auth={auth}
            header={
                <div className="flex items-center">
                    <StarIconSolid className="h-6 w-6 text-primary-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Penilaian Saya</h2>
                </div>
            }
        >
            <Head title="Penilaian Saya" />

            <div className="max-w-7xl mx-auto">
                {/* Filter Controls */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Filter Penilaian</h3>
                            <p className="text-sm text-gray-500">
                                Anda telah memberikan {ratings.total} penilaian
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterValue('all')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filterValue === 'all'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setFilterValue('high')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filterValue === 'high'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Penilaian Tinggi (4-5)
                            </button>
                            <button
                                onClick={() => setFilterValue('low')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filterValue === 'low'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Penilaian Rendah (1-2)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ratings List */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {filteredRatings.length === 0 ? (
                        <div className="p-6 text-center">
                            <StarIconOutline className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <h3 className="text-lg font-medium text-gray-900">Tidak ada penilaian</h3>
                            <p className="text-gray-500 mt-1">
                                {ratings.total === 0
                                    ? 'Anda belum memberikan penilaian apa pun.'
                                    : 'Tidak ada penilaian yang cocok dengan filter yang dipilih.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredRatings.map((rating) => (
                                <div key={rating.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-medium text-gray-900 mr-2">
                                                    Booking #{rating.booking?.booking_code || rating.booking_id}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                    {rating.service_type}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <span className="mr-2">Pengemudi: {rating.driver_name}</span>
                                                <span>•</span>
                                                <span className="mx-2">{formatDate(rating.trip_date)}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="flex mr-2">
                                                    {renderStars(rating.overall || 0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {rating.overall}/5
                                                </span>
                                            </div>

                                            {rating.comment && (
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {rating.comment}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                                            <Link
                                                href={route('user.ratings.show', rating.id)}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {ratings.total > 0 && (
                    <div className="mt-4">
                        <Pagination links={ratings.links} />
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
}
