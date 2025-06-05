import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import storage from '@/Utils/storage';
import UserDashboardLayout from "@/Layouts/UserDashboardLayout.jsx";
import {
    BellIcon,
    ShieldCheckIcon,
    MoonIcon,
    EnvelopeIcon,
    PhoneIcon,
    DevicePhoneMobileIcon,
    CreditCardIcon,
    ClockIcon,
    LanguageIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Settings({ auth, settings, notifications = [], unreadCount = 0 }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        notifications_email: settings?.notifications_email ?? true,
        notifications_sms: settings?.notifications_sms ?? true,
        notifications_push: settings?.notifications_push ?? true,
        save_payment_methods: settings?.save_payment_methods ?? false,
        save_booking_history: settings?.save_booking_history ?? true,
        dark_mode: settings?.dark_mode ?? false,
        language: settings?.language ?? 'id',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save settings to backend
        post(route('profile.settings.update'), {
            onSuccess: () => {
                // Also save to local storage for client-side use
                storage.settingsStorage.setTheme(data.dark_mode);
                storage.settingsStorage.setLanguage(data.language);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            },
        });
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Akun</h2>}
            notifications={notifications}
            unreadCount={unreadCount}
        >
            <Head title="Pengaturan Akun" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl">
                        <header className="flex items-start mb-6">
                            <div className="p-2 mr-4 rounded-full bg-primary-100 text-primary-600">
                                <BellIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Preferensi Notifikasi</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Kelola bagaimana kami menghubungi Anda terkait pemesanan dan akun Anda.
                                </p>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <Checkbox
                                            id="notifications_email"
                                            checked={data.notifications_email}
                                            onChange={(e) => setData('notifications_email', e.target.checked)}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <div className="flex items-center">
                                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <InputLabel htmlFor="notifications_email" value="Notifikasi Email" className="font-medium text-gray-900" />
                                        </div>
                                        <p className="text-gray-500 mt-1">Terima pembaruan dan pengingat pemesanan melalui email</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <Checkbox
                                            id="notifications_sms"
                                            checked={data.notifications_sms}
                                            onChange={(e) => setData('notifications_sms', e.target.checked)}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <div className="flex items-center">
                                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <InputLabel htmlFor="notifications_sms" value="Notifikasi SMS" className="font-medium text-gray-900" />
                                        </div>
                                        <p className="text-gray-500 mt-1">Terima pembaruan dan pengingat pemesanan melalui SMS</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <Checkbox
                                            id="notifications_push"
                                            checked={data.notifications_push}
                                            onChange={(e) => setData('notifications_push', e.target.checked)}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <div className="flex items-center">
                                            <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <InputLabel htmlFor="notifications_push" value="Notifikasi Push" className="font-medium text-gray-900" />
                                        </div>
                                        <p className="text-gray-500 mt-1">Terima pembaruan real-time melalui notifikasi browser</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-start mb-6">
                                    <div className="p-2 mr-4 rounded-full bg-secondary-100 text-secondary-600">
                                        <ShieldCheckIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Pengaturan Privasi</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Kelola bagaimana data Anda disimpan dan digunakan.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="save_payment_methods"
                                                checked={data.save_payment_methods}
                                                onChange={(e) => setData('save_payment_methods', e.target.checked)}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <div className="flex items-center">
                                                <CreditCardIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <InputLabel htmlFor="save_payment_methods" value="Simpan Metode Pembayaran" className="font-medium text-gray-900" />
                                            </div>
                                            <p className="text-gray-500 mt-1">Simpan informasi pembayaran dengan aman untuk pembayaran lebih cepat</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="save_booking_history"
                                                checked={data.save_booking_history}
                                                onChange={(e) => setData('save_booking_history', e.target.checked)}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <InputLabel htmlFor="save_booking_history" value="Simpan Riwayat Pemesanan" className="font-medium text-gray-900" />
                                            </div>
                                            <p className="text-gray-500 mt-1">Simpan catatan pemesanan sebelumnya untuk pemesanan ulang yang lebih mudah</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-start mb-6">
                                    <div className="p-2 mr-4 rounded-full bg-accent-100 text-accent-600">
                                        <MoonIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Tampilan</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Sesuaikan tampilan aplikasi sesuai preferensi Anda.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <Checkbox
                                                id="dark_mode"
                                                checked={data.dark_mode}
                                                onChange={(e) => setData('dark_mode', e.target.checked)}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <div className="flex items-center">
                                                <MoonIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <InputLabel htmlFor="dark_mode" value="Mode Gelap" className="font-medium text-gray-900" />
                                            </div>
                                            <p className="text-gray-500 mt-1">Gunakan tema gelap untuk aplikasi</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-2">
                                            <LanguageIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <InputLabel htmlFor="language" value="Bahasa" className="font-medium text-gray-900" />
                                        </div>
                                        <select
                                            id="language"
                                            name="language"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            value={data.language}
                                            onChange={(e) => setData('language', e.target.value)}
                                        >
                                            <option value="id">Bahasa Indonesia</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton
                                    disabled={processing}
                                    className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                                >
                                    Simpan Pengaturan
                                </PrimaryButton>

                                {showSuccess && (
                                    <div className="flex items-center text-sm text-green-600">
                                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                                        <span>Pengaturan berhasil disimpan.</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
