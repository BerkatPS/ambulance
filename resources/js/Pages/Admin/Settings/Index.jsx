import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import NotificationToast from '@/Components/NotificationToast';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { 
    CogIcon,
    BellIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    UserIcon,
    ServerIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

export default function SettingsIndex({ auth, settings = {}, notifications, status }) {
    const [showNotification, setShowNotification] = useState(!!status);
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || 'Ambulance Portal',
        site_description: settings.site_description || 'Emergency medical transport service',
        contact_email: settings.contact_email || 'contact@ambulance-portal.com',
        contact_phone: settings.contact_phone || '+62 123 4567 890',
        emergency_phone: settings.emergency_phone || '119',
        base_currency: settings.base_currency || 'IDR',
        base_fee: settings.base_fee || 50000,
        fee_per_km: settings.fee_per_km || 5000,
        emergency_fee: settings.emergency_fee || 100000,
        notification_email: settings.notification_email ?? true,
        notification_sms: settings.notification_sms ?? true,
        notification_push: settings.notification_push ?? true,
        maintenance_mode: settings.maintenance_mode ?? false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData({
            ...data,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleToggleChange = (field, value) => {
        setData({
            ...data,
            [field]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowNotification(true);
            },
        });
    };

    const settingCategories = [
        {
            id: 'general',
            name: 'Pengaturan Umum',
            icon: <CogIcon className="h-6 w-6 text-primary-600" />,
            description: 'Informasi dasar tentang portal ambulans'
        },
        {
            id: 'notifications',
            name: 'Pengaturan Notifikasi',
            icon: <BellIcon className="h-6 w-6 text-amber-600" />,
            description: 'Konfigurasi cara pengguna menerima notifikasi'
        },
        {
            id: 'localization',
            name: 'Lokalisasi',
            icon: <GlobeAltIcon className="h-6 w-6 text-blue-600" />,
            description: 'Pengaturan bahasa dan regional'
        },
        {
            id: 'security',
            name: 'Pengaturan Keamanan',
            icon: <ShieldCheckIcon className="h-6 w-6 text-green-600" />,
            description: 'Konfigurasi opsi keamanan'
        },
        {
            id: 'payment',
            name: 'Pengaturan Pembayaran',
            icon: <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />,
            description: 'Konfigurasi metode dan tarif pembayaran'
        },
        {
            id: 'account',
            name: 'Pengaturan Akun',
            icon: <UserIcon className="h-6 w-6 text-purple-600" />,
            description: 'Pengaturan akun pengguna'
        },
        {
            id: 'system',
            name: 'Pengaturan Sistem',
            icon: <ServerIcon className="h-6 w-6 text-gray-600" />,
            description: 'Pemeliharaan dan kinerja sistem'
        }
    ];

    return (
        <AdminDashboardLayout
            title="Pengaturan"
            user={auth.user}
            notifications={notifications}
        >
            <Head title="Pengaturan" />
            
            {/* Success Notification */}
            <NotificationToast
                show={showNotification}
                type="success"
                title="Berhasil!"
                message={status || "Pengaturan berhasil diperbarui"}
                onClose={() => setShowNotification(false)}
            />

            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Konfigurasi pengaturan portal ambulans untuk mengoptimalkan sistem sesuai kebutuhan spesifik Anda.
                    </p>
                </div>

                {/* Settings Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {settingCategories.map((category) => (
                        <div 
                            key={category.id}
                            className="bg-white sm:rounded-xl border border-slate-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {category.icon}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                                    <div className="mt-3">
                                        <Link
                                            href={route(`admin.settings.${category.id}`)}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center"
                                        >
                                            Konfigurasi
                                            <ChevronRightIcon className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* General Settings Form */}
                <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100">
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <div className="flex items-center">
                            <CogIcon className="h-6 w-6 text-primary-600 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">Pengaturan Umum</h3>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="site_name" value="Nama Situs" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="site_name"
                                        name="site_name"
                                        value={data.site_name}
                                        className="block w-full pl-10"
                                        onChange={handleChange}
                                    />
                                </div>
                                <InputError message={errors.site_name} className="mt-2" />
                            </div>

                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="contact_email" value="Email Kontak" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="contact_email"
                                        name="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        className="block w-full pl-10"
                                        onChange={handleChange}
                                    />
                                </div>
                                <InputError message={errors.contact_email} className="mt-2" />
                            </div>

                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="contact_phone" value="Telepon Kontak" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="contact_phone"
                                        name="contact_phone"
                                        value={data.contact_phone}
                                        className="block w-full pl-10"
                                        onChange={handleChange}
                                    />
                                </div>
                                <InputError message={errors.contact_phone} className="mt-2" />
                            </div>

                            <div className="sm:col-span-3">
                                <InputLabel htmlFor="emergency_phone" value="Telepon Darurat" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-red-400" />
                                    </div>
                                    <TextInput
                                        id="emergency_phone"
                                        name="emergency_phone"
                                        value={data.emergency_phone}
                                        className="block w-full pl-10"
                                        onChange={handleChange}
                                    />
                                </div>
                                <InputError message={errors.emergency_phone} className="mt-2" />
                            </div>

                            <div className="sm:col-span-6">
                                <InputLabel htmlFor="site_description" value="Deskripsi Situs" />
                                <div className="mt-1">
                                    <textarea
                                        id="site_description"
                                        name="site_description"
                                        rows={3}
                                        value={data.site_description}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                                <InputError message={errors.site_description} className="mt-2" />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center">
                                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Pengaturan Biaya</h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Konfigurasikan struktur biaya untuk layanan ambulans.
                            </p>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="base_currency" value="Mata Uang" />
                                    <select
                                        id="base_currency"
                                        name="base_currency"
                                        value={data.base_currency}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                    >
                                        <option value="IDR">IDR - Rupiah Indonesia</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="SGD">SGD - Singapore Dollar</option>
                                        <option value="MYR">MYR - Malaysian Ringgit</option>
                                    </select>
                                    <InputError message={errors.base_currency} className="mt-2" />
                                </div>

                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="base_fee" value="Biaya Dasar" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                {data.base_currency === 'IDR' ? 'Rp' : '$'}
                                            </span>
                                        </div>
                                        <TextInput
                                            type="number"
                                            name="base_fee"
                                            id="base_fee"
                                            value={data.base_fee}
                                            className="block w-full pl-12"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <InputError message={errors.base_fee} className="mt-2" />
                                </div>

                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="fee_per_km" value="Biaya Per KM" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                {data.base_currency === 'IDR' ? 'Rp' : '$'}
                                            </span>
                                        </div>
                                        <TextInput
                                            type="number"
                                            name="fee_per_km"
                                            id="fee_per_km"
                                            value={data.fee_per_km}
                                            className="block w-full pl-12"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <InputError message={errors.fee_per_km} className="mt-2" />
                                </div>

                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="emergency_fee" value="Biaya Darurat" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                {data.base_currency === 'IDR' ? 'Rp' : '$'}
                                            </span>
                                        </div>
                                        <TextInput
                                            type="number"
                                            name="emergency_fee"
                                            id="emergency_fee"
                                            value={data.emergency_fee}
                                            className="block w-full pl-12"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <InputError message={errors.emergency_fee} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center">
                                <BellIcon className="h-6 w-6 text-amber-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Preferensi Notifikasi</h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Atur cara sistem mengirimkan notifikasi kepada pengguna.
                            </p>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm text-gray-700">Notifikasi Email</span>
                                    </div>
                                    <Switch
                                        checked={data.notification_email}
                                        onChange={(checked) => handleToggleChange('notification_email', checked)}
                                        className={`${
                                            data.notification_email ? 'bg-primary-600' : 'bg-gray-200'
                                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                    >
                                        <span
                                            className={`${
                                                data.notification_email ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                        />
                                    </Switch>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm text-gray-700">Notifikasi SMS</span>
                                    </div>
                                    <Switch
                                        checked={data.notification_sms}
                                        onChange={(checked) => handleToggleChange('notification_sms', checked)}
                                        className={`${
                                            data.notification_sms ? 'bg-primary-600' : 'bg-gray-200'
                                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                    >
                                        <span
                                            className={`${
                                                data.notification_sms ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                        />
                                    </Switch>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-sm text-gray-700">Notifikasi Push</span>
                                    </div>
                                    <Switch
                                        checked={data.notification_push}
                                        onChange={(checked) => handleToggleChange('notification_push', checked)}
                                        className={`${
                                            data.notification_push ? 'bg-primary-600' : 'bg-gray-200'
                                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                    >
                                        <span
                                            className={`${
                                                data.notification_push ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center">
                                <ServerIcon className="h-6 w-6 text-gray-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Mode Sistem</h3>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Mode Pemeliharaan</span>
                                        <p className="text-sm text-gray-500">
                                            Aktifkan mode ini saat melakukan pemeliharaan sistem.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.maintenance_mode}
                                        onChange={(checked) => handleToggleChange('maintenance_mode', checked)}
                                        className={`${
                                            data.maintenance_mode ? 'bg-red-600' : 'bg-gray-200'
                                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                                    >
                                        <span
                                            className={`${
                                                data.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <PrimaryButton
                                className="ml-3"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
