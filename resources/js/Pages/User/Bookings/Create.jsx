import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import {
    MapPinIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    BellAlertIcon
} from '@heroicons/react/24/outline';

export default function CreateBooking({ auth, ambulanceTypes = [], notifications = [], unreadCount = 0 }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'scheduled',
        pickup_address: '',
        pickup_lat: '',
        pickup_lng: '',
        destination_address: '',
        destination_lat: '',
        destination_lng: '',
        scheduled_at: '',
        patient_name: auth?.user?.name || '',
        patient_age: '',
        contact_name: auth?.user?.name || '',
        contact_phone: auth?.user?.phone || '',
        notes: '',
        condition_notes: '',
        priority: 'normal',
    });

    const [isEmergency, setIsEmergency] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting booking data:', data); // Debug log

        // Set condition notes from notes if not explicitly provided
        if (!data.condition_notes && data.notes) {
            setData('condition_notes', data.notes);
        }
        
        post(route('user.bookings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Booking created successfully'); // Debug log
                reset();
            },
            onError: (errors) => {
                console.error('Booking creation errors:', errors); // Debug log
            }
        });
    };

    const handleEmergencyToggle = () => {
        const newEmergencyState = !isEmergency;
        setIsEmergency(newEmergencyState);
        setData('priority', newEmergencyState ? 'urgent' : 'normal');

        if (newEmergencyState) {
            setData('type', 'emergency');
        } else {
            setData('type', 'scheduled');
        }
    };

    return (
        <UserDashboardLayout
            title="Buat Pemesanan Ambulans"
            notifications={notifications}
            unreadCount={unreadCount}
        >
            <Head title="Buat Pemesanan Ambulans" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Buat Pemesanan Ambulans</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Isi formulir di bawah ini untuk memesan ambulans. Pastikan data yang Anda masukkan sudah benar.
                                </p>
                            </div>

                            {/* Emergency toggle */}
                            <div className="mb-6 bg-yellow-50 p-4 border border-yellow-200 rounded-md">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Kondisi Darurat?</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>Aktifkan mode darurat jika Anda membutuhkan ambulans segera.</p>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                                    isEmergency
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                                                }`}
                                                onClick={handleEmergencyToggle}
                                            >
                                                <BellAlertIcon className="mr-2 h-4 w-4" />
                                                {isEmergency ? 'Mode Darurat Aktif' : 'Aktifkan Mode Darurat'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Patient Information */}
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Pasien</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="patient_name" value="Nama Pasien" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="patient_name"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.patient_name}
                                                    onChange={(e) => setData('patient_name', e.target.value)}
                                                    placeholder="Masukkan nama pasien"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.patient_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="patient_age" value="Umur Pasien" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="patient_age"
                                                    type="number"
                                                    className="block w-full pl-10"
                                                    value={data.patient_age}
                                                    onChange={(e) => setData('patient_age', e.target.value)}
                                                    placeholder="Umur pasien"
                                                />
                                            </div>
                                            <InputError message={errors.patient_age} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Kontak</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="contact_name" value="Nama Kontak" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="contact_name"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.contact_name}
                                                    onChange={(e) => setData('contact_name', e.target.value)}
                                                    placeholder="Nama kontak yang bisa dihubungi"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.contact_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="contact_phone" value="Nomor Telepon Pasien/Pendamping" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="contact_phone"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.contact_phone}
                                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                                    placeholder="Contoh: 08123456789"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.contact_phone} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Lokasi</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="pickup_address" value="Alamat Penjemputan" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="pickup_address"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.pickup_address}
                                                    onChange={(e) => setData('pickup_address', e.target.value)}
                                                    placeholder="Masukkan alamat penjemputan lengkap"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.pickup_address} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="destination_address" value="Alamat Tujuan" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="destination_address"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.destination_address}
                                                    onChange={(e) => setData('destination_address', e.target.value)}
                                                    placeholder="Masukkan alamat tujuan lengkap"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.destination_address} className="mt-2" />
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={() => setShowMap(!showMap)}
                                            >
                                                {showMap ? 'Sembunyikan Peta' : 'Tampilkan Peta'}
                                            </button>
                                        </div>

                                        {showMap && (
                                            <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden h-64 bg-gray-100">
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <p>Peta akan ditampilkan di sini</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Pemesanan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {!isEmergency && (
                                            <div>
                                                <InputLabel htmlFor="scheduled_at" value="Tanggal & Waktu Pemesanan" />
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <ClockIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <TextInput
                                                        id="scheduled_at"
                                                        type="datetime-local"
                                                        className="block w-full pl-10"
                                                        value={data.scheduled_at}
                                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                                        min={new Date().toISOString().slice(0, 16)}
                                                        required={!isEmergency}
                                                    />
                                                </div>
                                                <InputError message={errors.scheduled_at} className="mt-2" />
                                            </div>
                                        )}

                                        <div>
                                            <div className="px-4 py-3 bg-blue-50 rounded-md border border-blue-200">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <TruckIcon className="h-5 w-5 text-blue-500" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-blue-800">Pencocokan Ambulans Otomatis</h3>
                                                        <div className="mt-1 text-sm text-blue-700">
                                                            <p>
                                                                Sistem akan secara otomatis mencarikan ambulans yang tersedia untuk pemesanan Anda.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel htmlFor="notes" value="Catatan Tambahan" />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Tambahkan informasi penting tentang pasien (kondisi, kebutuhan khusus, dll)"
                                            />
                                        </div>
                                        <InputError message={errors.notes} className="mt-2" />
                                    </div>
                                </div>

                                {isEmergency && (
                                    <div className="bg-red-50 p-4 border border-red-200 rounded-md">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">Perhatian - Mode Darurat Aktif</h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <p>
                                                        Dengan mengirimkan formulir ini, Anda menyatakan bahwa ada situasi darurat yang membutuhkan ambulans segera.
                                                        Pemesanan darurat akan diproses dengan prioritas tinggi.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end">
                                    <PrimaryButton type="submit" className="ml-4" disabled={processing}>
                                        {processing ? 'Memproses...' : 'Buat Pemesanan'}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Display any global form errors */}
                            {errors.error && (
                                <div className="mt-4 bg-red-50 p-4 border border-red-200 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Terjadi kesalahan</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{errors.error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
