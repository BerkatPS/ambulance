import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DriverDashboardLayout from '@/Layouts/DriverDashboardLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { UserCircleIcon, PhoneIcon, IdentificationIcon, CalendarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Edit({ driver, status }) {
    const [passwordFormStatus, setPasswordFormStatus] = useState(null);
    
    // Profile information form
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: driver.name,
        email: driver.email || '',
        phone: driver.phone,
        license_number: driver.license_number,
        license_expiry: driver.license_expiry ? new Date(driver.license_expiry).toISOString().split('T')[0] : '',
    });

    // Password update form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        patch(route('driver.profile.update'), {
            preserveScroll: true,
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('driver.profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setPasswordFormStatus('Password berhasil diperbarui.');
                passwordForm.reset();
            },
        });
    };

    return (
        <DriverDashboardLayout
            header={
                <div className="flex items-center">
                    <UserCircleIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Profil Driver</h2>
                </div>
            }
        >
            <Head title="Profil Driver" />

            <div className="space-y-6">
                <div className="bg-white sm:rounded-xl shadow-sm">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center mb-4">
                            <UserCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Informasi Profil</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 mb-5">
                            Perbarui informasi profil dan detail kontak akun Anda.
                        </p>

                        {status && (
                            <div className="mt-4 p-4 bg-green-50 rounded-md text-green-700 flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                <span>{status}</span>
                            </div>
                        )}

                        <form onSubmit={updateProfile} className="mt-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full pl-10"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="text-gray-400">@</span>
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full pl-10"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Nomor Telepon" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        className="mt-1 block w-full pl-10"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                        autoComplete="tel"
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            <div>
                                <InputLabel htmlFor="license_number" value="Nomor Lisensi" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="license_number"
                                        className="mt-1 block w-full pl-10"
                                        value={data.license_number}
                                        onChange={(e) => setData('license_number', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.license_number} />
                            </div>

                            <div>
                                <InputLabel htmlFor="license_expiry" value="Tanggal Kedaluwarsa Lisensi" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="license_expiry"
                                        type="date"
                                        className="mt-1 block w-full pl-10"
                                        value={data.license_expiry}
                                        onChange={(e) => setData('license_expiry', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.license_expiry} />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Simpan Profil</PrimaryButton>

                                {recentlySuccessful && (
                                    <div className="flex items-center text-sm text-green-600">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                                        Tersimpan.
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white sm:rounded-xl shadow-sm">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center mb-4">
                            <LockClosedIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 mb-5">
                            Pastikan akun Anda menggunakan password yang panjang dan acak untuk tetap aman.
                        </p>

                        {passwordFormStatus && (
                            <div className="mt-4 p-4 bg-green-50 rounded-md text-green-700 flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                <span>{passwordFormStatus}</span>
                            </div>
                        )}

                        <form onSubmit={updatePassword} className="mt-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="current_password" value="Password Saat Ini" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="current_password"
                                        type="password"
                                        className="mt-1 block w-full pl-10"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        autoComplete="current-password"
                                    />
                                </div>
                                <InputError className="mt-2" message={passwordForm.errors.current_password} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password Baru" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full pl-10"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <InputError className="mt-2" message={passwordForm.errors.password} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full pl-10"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <InputError className="mt-2" message={passwordForm.errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={passwordForm.processing}>Update Password</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
}
