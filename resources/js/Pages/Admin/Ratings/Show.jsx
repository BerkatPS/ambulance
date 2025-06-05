import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    StarIcon,
    UserIcon,
    TruckIcon,
    CalendarIcon,
    ChatBubbleLeftRightIcon,
    FlagIcon,
    CheckCircleIcon,
    XMarkIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function RatingShow({ auth, rating }) {
    const [responseOpen, setResponseOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        admin_response: '',
    });
    
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
    
    // Render star rating
    const renderStars = (ratingValue) => {
        if (ratingValue === undefined || ratingValue === null) {
            return <span className="text-sm text-gray-400">Belum ada penilaian</span>;
        }
        
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<StarIconSolid key={i} className="h-6 w-6 text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<StarIconSolid key={i} className="h-6 w-6 text-yellow-400" />);
            } else {
                stars.push(<StarIcon key={i} className="h-6 w-6 text-gray-300" />);
            }
        }
        
        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-2 text-lg font-medium text-gray-900">{ratingValue.toFixed(1)}</span>
            </div>
        );
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.ratings.store-response', rating.id), {
            onSuccess: () => {
                reset();
                setResponseOpen(false);
            },
        });
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title={`Penilaian #${rating.id}`}>
            <Head title={`Penilaian #${rating.id}`} />
            
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
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <Link 
                                            href={route('admin.ratings.index')} 
                                            className="ml-4 text-gray-400 hover:text-gray-500"
                                        >
                                            Penilaian
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <span className="ml-4 text-gray-500 font-medium">Penilaian #{rating.id}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Detail Penilaian</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Tampilan detail penilaian dan umpan balik pengguna
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <Link
                                href={route('admin.ratings.index')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Kembali ke Daftar Penilaian
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Rating Details */}
                        <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                            {/* Rating Overview Card */}
                            <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-100">
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Ringkasan Penilaian</h2>
                                            <p className="mt-1 text-sm text-gray-500">Penilaian dikirimkan pada {formatDate(rating.created_at)}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            {renderStars(rating.overall)}
                                        </div>
                                    </div>
                                    
                                    {rating.comment && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium text-gray-500">Komentar Pengguna</h3>
                                            <div className="mt-2 rounded-md bg-gray-50 p-4">
                                                <p className="whitespace-pre-line text-sm text-gray-700">{rating.comment}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Rating Details */}
                            <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-100">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Informasi Penilaian</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail tentang pengguna, pengemudi, dan layanan yang dinilai.</p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Pengguna
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {rating.user ? (
                                                    <Link
                                                        href={route('admin.users.show', rating.user.id)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        {rating.user.name}
                                                    </Link>
                                                ) : (
                                                    'Pengguna Anonim'
                                                )}
                                            </dd>
                                        </div>
                                        {rating.booking && rating.booking.ambulance && rating.booking.ambulance.driver && (
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                                    <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                    Pengemudi
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    <Link
                                                        href={route('admin.drivers.show', rating.booking.ambulance.driver.id)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        {rating.booking.ambulance.driver.name}
                                                    </Link>
                                                </dd>
                                            </div>
                                        )}
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                Tanggal Penilaian
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {formatDateTime(rating.created_at)}
                                            </dd>
                                        </div>
                                        {rating.booking && (
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Pemesanan Terkait</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    <Link
                                                        href={route('admin.bookings.show', rating.booking.id)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Pemesanan #{rating.booking.id}
                                                    </Link>
                                                    {rating.booking.pickup_datetime && (
                                                        <span className="ml-2 text-gray-500">
                                                            ({formatDate(rating.booking.pickup_datetime)})
                                                        </span>
                                                    )}
                                                </dd>
                                            </div>
                                        )}
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Penilaian Terperinci</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">Ketepatan Waktu:</span>
                                                        <div className="mt-1 flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <StarIconSolid
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < rating.punctuality ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                            <span className="ml-2 text-sm">{rating.punctuality}/5</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">Kondisi Kendaraan:</span>
                                                        <div className="mt-1 flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <StarIconSolid
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < rating.vehicle_condition ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                            <span className="ml-2 text-sm">{rating.vehicle_condition}/5</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">Pelayanan:</span>
                                                        <div className="mt-1 flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <StarIconSolid
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < rating.service ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                            <span className="ml-2 text-sm">{rating.service}/5</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">Keseluruhan:</span>
                                                        <div className="mt-1 flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <StarIconSolid
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < rating.overall ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                            <span className="ml-2 text-sm">{rating.overall}/5</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {/* Admin Response Section */}
                            {rating.admin_response ? (
                                <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-100">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">Tanggapan Admin</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Tanggapan resmi terhadap ulasan pengguna ini.</p>
                                    </div>
                                    <div className="border-t border-gray-200 p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Tanggapan dari Admin
                                                </div>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <p className="whitespace-pre-line">{rating.admin_response}</p>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Ditanggapi pada {formatDate(rating.admin_response_date)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : responseOpen ? (
                                <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-100">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">Beri Tanggapan</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Berikan tanggapan resmi atas ulasan ini.</p>
                                    </div>
                                    <div className="border-t border-gray-200 p-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="admin_response" className="block text-sm font-medium text-gray-700">
                                                    Tanggapan Anda
                                                </label>
                                                <textarea
                                                    id="admin_response"
                                                    name="admin_response"
                                                    rows={4}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Tulis tanggapan anda di sini..."
                                                    value={data.admin_response}
                                                    onChange={e => setData('admin_response', e.target.value)}
                                                    required
                                                />
                                                {errors.admin_response && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.admin_response}</p>
                                                )}
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                    onClick={() => setResponseOpen(false)}
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Memproses...' : 'Kirim Tanggapan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        
                        {/* Sidebar Actions and Info */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Rating Actions */}
                            <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-100">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Tindakan</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Tindakan administratif untuk penilaian ini.</p>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5">
                                    <div className="space-y-3">
                                        {!rating.admin_response && !responseOpen && (
                                            <button
                                                type="button"
                                                className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                                onClick={() => setResponseOpen(true)}
                                            >
                                                <span className="flex items-center justify-center">
                                                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                    Tanggapi Ulasan
                                                </span>
                                            </button>
                                        )}
                                        
                                        <Link
                                            href={route('admin.users.show', rating.user?.id || 0)}
                                            className="w-full flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                                            disabled={!rating.user}
                                        >
                                            <UserIcon className="h-5 w-5 mr-2" />
                                            Lihat Profil Pengguna
                                        </Link>
                                        
                                        <Link
                                            href={route('admin.ratings.index')}
                                            className="w-full flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                                        >
                                            <StarIcon className="h-5 w-5 mr-2" />
                                            Semua Penilaian
                                        </Link>
                                        
                                        <Link
                                            href={route('admin.ratings.destroy', rating.id)}
                                            method="delete"
                                            as="button"
                                            className="w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 flex items-center justify-center"
                                            onClick={(e) => {
                                                if (!confirm('Apakah Anda yakin ingin menghapus penilaian ini? Tindakan ini tidak dapat dibatalkan.')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <XMarkIcon className="h-5 w-5 mr-2" />
                                            Hapus Penilaian
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Rating Stats Card */}
                            <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-100">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Statistik Penilaian</h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Status Tanggapan</dt>
                                            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    rating.admin_response ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {rating.admin_response ? 'Sudah Ditanggapi' : 'Belum Ditanggapi'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Skor Rata-rata</dt>
                                            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                                <div className="flex items-center">
                                                    <StarIconSolid className="h-5 w-5 text-yellow-400" />
                                                    <span className="ml-1.5 font-medium">
                                                        {((rating.punctuality + rating.vehicle_condition + rating.service + rating.overall) / 4).toFixed(1)}
                                                    </span>
                                                    <span className="ml-1 text-gray-500">(rata-rata semua kategori)</span>
                                                </div>
                                            </dd>
                                        </div>
                                        
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Waktu Tanggapan</dt>
                                            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                                {rating.admin_response_date ? (
                                                    <span>{formatDate(rating.admin_response_date)}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Belum ada tanggapan</span>
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
