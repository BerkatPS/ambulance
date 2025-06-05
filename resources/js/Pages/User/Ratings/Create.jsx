import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';

export default function CreateRating({ auth, booking = {}, driver = {} }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        booking_id: booking.id,
        driver_id: driver.id,
        rating: 0, // Match database field name
        comments: '', // Match database field name
        // Additional fields for display purposes only
        punctuality: 0,
        service: 0,
        vehicle_condition: 0,
    });

    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.ratings.store'), {
            onSuccess: () => reset(),
        });
    };

    // Rating descriptions in Indonesian
    const ratingDescriptions = {
        1: 'Buruk - Tidak memenuhi harapan',
        2: 'Cukup - Di bawah harapan',
        3: 'Baik - Memenuhi harapan',
        4: 'Sangat Baik - Di atas harapan',
        5: 'Luar Biasa - Melebihi harapan'
    };

    console.log("Form data:", data); // Debug data

    return (
        <UserDashboardLayout
            header={<h2 className="text-xl font-semibold text-gray-800 font-heading">Beri Penilaian</h2>}
        >
            <Head title="Beri Penilaian Driver" />

            <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="bg-white shadow-card rounded-xl overflow-hidden">
                    <div className="p-4 sm:p-6 md:p-8">
                        <div>
                            {/* Booking and Driver Info */}
                            <div className="bg-secondary-50 rounded-xl p-4 sm:p-6 mb-6">
                                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium text-gray-900 font-heading">Detail Pemesanan</h3>
                                        <p className="text-sm text-gray-600 font-body">Pemesanan #{booking.id}</p>
                                        <div className="space-y-1">
                                            <div className="flex items-start">
                                                <span className="text-sm font-medium text-gray-700 mr-2 min-w-[80px] inline-block">Penjemputan:</span>
                                                <span className="text-sm text-gray-600">{booking.pickup_address || 'Tidak ditentukan'}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-sm font-medium text-gray-700 mr-2 min-w-[80px] inline-block">Tujuan:</span>
                                                <span className="text-sm text-gray-600">{booking.destination_address || 'Tidak ditentukan'}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-sm font-medium text-gray-700 mr-2 min-w-[80px] inline-block">Waktu:</span>
                                                <span className="text-sm text-gray-600">{booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleString('id-ID', { 
                                                    day: 'numeric', 
                                                    month: 'long', 
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'Tidak terjadwal'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium text-gray-900 font-heading">Detail Driver</h3>
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center overflow-hidden border-2 border-secondary-200">
                                                {driver.avatar ? (
                                                    <img src={driver.avatar} alt={driver.name} className="h-12 w-12 rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-secondary-700 text-lg font-medium">{driver.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                                                <p className="text-sm text-gray-600">ID: {driver.id}</p>
                                                {driver.rating && (
                                                    <div className="flex items-center mt-1">
                                                        <StarIcon className="h-4 w-4 text-yellow-400" />
                                                        <span className="ml-1 text-sm text-gray-600">{driver.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Star Rating */}
                                <div className="bg-white p-4 rounded-lg">
                                    <label className="block text-base font-medium text-gray-800 mb-3 font-heading">
                                        Bagaimana penilaian Anda terhadap layanan ini?
                                    </label>
                                    <div className="flex space-x-2 justify-center sm:justify-start">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                className="focus:outline-none transition-transform transform hover:scale-110"
                                                onClick={() => setData('rating', rating)}
                                                onMouseEnter={() => setHoveredRating(rating)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                            >
                                                {rating <= (hoveredRating || data.rating) ? (
                                                    <StarIcon className="h-10 w-10 text-yellow-400" />
                                                ) : (
                                                    <StarOutlineIcon className="h-10 w-10 text-gray-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 font-body text-center sm:text-left">
                                        {data.rating > 0 ? ratingDescriptions[data.rating] : 'Silahkan pilih bintang untuk memberi penilaian'}
                                    </div>
                                    <InputError message={errors.rating} className="mt-2" />
                                </div>

                                {/* Rating Categories */}
                                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                    <h4 className="text-base font-medium text-gray-800 mb-4 font-heading">Penilaian Aspek Khusus</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 'punctuality', label: 'Ketepatan Waktu', description: 'Penilaian ketepatan waktu layanan ambulans' },
                                            { id: 'service', label: 'Kualitas Pelayanan', description: 'Penilaian keramahan dan profesionalisme driver' },
                                            { id: 'vehicle_condition', label: 'Kondisi Kendaraan', description: 'Penilaian kebersihan dan kondisi ambulans' },
                                        ].map((category) => (
                                            <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm">
                                                <div className="flex flex-col space-y-2">
                                                    <span className="text-sm font-medium text-gray-700">{category.label}</span>
                                                    <div className="flex justify-center">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={`${category.id}-${star}`}
                                                                type="button"
                                                                className="focus:outline-none transition-transform transform hover:scale-110"
                                                                onClick={() => setData(category.id, star)}
                                                            >
                                                                {star <= (data[category.id] || 0) ? (
                                                                    <StarIcon className="h-6 w-6 text-yellow-400" />
                                                                ) : (
                                                                    <StarOutlineIcon className="h-6 w-6 text-gray-300" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-500 text-center mt-1">{category.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                                    <label htmlFor="comments" className="block text-base font-medium text-gray-800 mb-2 font-heading">
                                        Komentar Tambahan (opsional)
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="comments"
                                            name="comments"
                                            rows={4}
                                            className="shadow-inner-sm focus:ring-primary-500 focus:border-primary-500 block w-full text-sm border-gray-300 rounded-lg"
                                            placeholder="Bagikan pengalaman Anda dengan driver..."
                                            value={data.comments}
                                            onChange={(e) => setData('comments', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.comments} className="mt-2" />
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                                    <div className="text-sm text-gray-500">
                                        {data.rating === 0 && (
                                            <p className="text-amber-600">* Penilaian bintang wajib diisi</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-150"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition ease-in-out duration-150"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600 mr-4">Penilaian berhasil dikirim.</p>
                                        </Transition>

                                        <PrimaryButton 
                                            className="px-6 py-3 text-base bg-primary-600 hover:bg-primary-700 focus:bg-primary-800 focus:ring-primary-500 shadow-button" 
                                            disabled={processing || data.rating === 0}
                                        >
                                            Kirim Penilaian
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
