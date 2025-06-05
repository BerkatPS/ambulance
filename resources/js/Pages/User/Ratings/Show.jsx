import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeftIcon, StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function RatingShow({ auth, rating }) {
    const renderStars = (score) => {
        return [...Array(5)].map((_, i) => (
            <span key={i}>
                {i < score ? (
                    <StarIconSolid className="h-5 w-5 text-yellow-400" />
                ) : (
                    <StarIconOutline className="h-5 w-5 text-gray-300" />
                )}
            </span>
        ));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak Tersedia';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
        } catch (e) {
            return 'Tidak Tersedia';
        }
    };
    
    // Use the pre-formatted date or default to N/A
    const ratingDate = rating.formatted_date || formatDate(rating.created_at) || 'Tidak Tersedia';
    
    // Ensure rated user data is available or provide defaults
    const ratedUserName = rating.ratedUser?.name || 'Informasi pengguna tidak tersedia';
    const ratedUserEmail = rating.ratedUser?.email || 'Tidak Tersedia';
    
    // Ensure booking data is available or provide defaults
    const bookingDate = rating.booking ? formatDate(rating.booking.scheduled_at) : 'Tidak Tersedia';
    const pickupAddress = rating.booking?.pickup_address || 'Alamat tidak tersedia';
    const destinationAddress = rating.booking?.destination_address || 'Alamat tidak tersedia';
    const bookingStatus = rating.booking?.status || 'Tidak Tersedia';
    const bookingType = rating.booking?.type || 'Standar';
    const vehicleInfo = rating.booking?.ambulance?.vehicle_code || 'Belum ditugaskan';

    return (
        <UserDashboardLayout
            auth={auth}
            header={
                <div className="flex items-center">
                    <StarIconSolid className="h-6 w-6 text-primary-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Detail Penilaian</h2>
                </div>
            }
        >
            <Head title="Detail Penilaian" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route('user.ratings.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        Kembali ke Penilaian
                    </Link>
                </div>

                {/* Main Rating Card */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Penilaian untuk Booking #{rating.booking?.booking_code || rating.booking_id}
                        </h3>
                    </div>

                    <div className="p-6">
                        {/* Rating Summary */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center mr-2">
                                        {renderStars(rating.overall || 0)}
                                    </div>
                                    <span className="text-lg font-semibold">{rating.overall || 0}/5</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Detailed Rating Categories */}
                                    {rating.detailed_ratings && rating.detailed_ratings.map((item, index) => (
                                        item.name !== 'Overall' && item.value > 0 && (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">{item.name}</span>
                                                <div className="flex items-center">
                                                    {renderStars(item.value)}
                                                    <span className="ml-2 text-sm font-medium">{item.value}/5</span>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="mb-4 pb-4 border-b border-gray-100">
                                    <h4 className="text-lg font-medium text-gray-800 mb-3">Informasi Penilaian</h4>
                                    <dl className="grid grid-cols-1 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Tanggal Penilaian:</dt>
                                            <dd className="text-gray-800">{ratingDate}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Kategori:</dt>
                                            <dd className="text-gray-800">{rating.category || 'Umum'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-3">Informasi Pengguna</h4>
                                    <dl className="grid grid-cols-1 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Nama Pengguna:</dt>
                                            <dd className="text-gray-800">{ratedUserName}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Email:</dt>
                                            <dd className="text-gray-800">{ratedUserEmail}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">Komentar Anda</h4>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                {rating.comment ? (
                                    <p className="text-gray-700 whitespace-pre-line">{rating.comment}</p>
                                ) : (
                                    <p className="text-gray-500 italic">Tidak ada komentar untuk penilaian ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Details Card */}
                {rating.booking && (
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Detail Booking
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-6">
                                        <h4 className="text-lg font-medium text-gray-800 mb-3">Informasi Perjalanan</h4>
                                        <dl className="grid grid-cols-1 gap-3 text-sm">
                                            <div>
                                                <dt className="font-medium text-gray-500 mb-1">Lokasi Penjemputan:</dt>
                                                <dd className="text-gray-800 bg-gray-50 p-2 rounded border border-gray-100">
                                                    {pickupAddress}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="font-medium text-gray-500 mb-1">Tujuan:</dt>
                                                <dd className="text-gray-800 bg-gray-50 p-2 rounded border border-gray-100">
                                                    {destinationAddress}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="font-medium text-gray-500">Tanggal Terjadwal:</dt>
                                                <dd className="text-gray-800">{bookingDate}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-3">Informasi Booking</h4>
                                    <dl className="grid grid-cols-1 gap-3 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">ID Booking:</dt>
                                            <dd className="text-gray-800">#{rating.booking?.booking_code || rating.booking_id}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Jenis Layanan:</dt>
                                            <dd className="text-gray-800 capitalize">{bookingType}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Kode Kendaraan:</dt>
                                            <dd className="text-gray-800">{vehicleInfo}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Status:</dt>
                                            <dd>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                                    {bookingStatus}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
}
