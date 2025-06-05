import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { isValidEmail, isValidPhone } from '@/Utils/validators';
import UserDashboardLayout from "@/Layouts/UserDashboardLayout.jsx";
import { 
    UserIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Edit({ auth, user, notifications = [], unreadCount = 0 }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            },
        });
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Profil</h2>}
            notifications={notifications}
            unreadCount={unreadCount}
        >
            <Head title="Edit Profil" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl">
                        <div className="max-w-xl">
                            <header className="flex items-start mb-6">
                                <div className="p-2 mr-4 rounded-full bg-primary-100 text-primary-600">
                                    <UserIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">Informasi Profil</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Perbarui informasi profil dan alamat email akun Anda.
                                    </p>
                                </div>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <div className="flex items-center mb-1">
                                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <InputLabel htmlFor="name" value="Nama" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div>
                                    <div className="flex items-center mb-1">
                                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <InputLabel htmlFor="email" value="Email" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div>
                                    <div className="flex items-center mb-1">
                                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <InputLabel htmlFor="phone" value="Nomor Telepon" />
                                    </div>
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        className="mt-1 block w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                        autoComplete="tel"
                                    />
                                    <InputError className="mt-2" message={errors.phone} />
                                </div>

                                <div>
                                    <div className="flex items-center mb-1">
                                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <InputLabel htmlFor="address" value="Alamat" />
                                    </div>
                                    <TextArea
                                        id="address"
                                        className="mt-1 block w-full"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                    />
                                    <InputError className="mt-2" message={errors.address} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton
                                        className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                                        disabled={processing}
                                    >
                                        Simpan Perubahan
                                    </PrimaryButton>

                                    {showSuccess && (
                                        <div className="flex items-center text-sm text-green-600">
                                            <CheckCircleIcon className="h-5 w-5 mr-1" />
                                            <span>Profil berhasil diperbarui.</span>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
