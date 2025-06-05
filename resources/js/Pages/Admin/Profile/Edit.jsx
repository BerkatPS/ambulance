import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import NotificationToast from '@/Components/NotificationToast';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { 
    UserCircleIcon,
    KeyIcon,
    BellIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ProfileEdit({ auth, notifications, status }) {
    const user = auth.user;
    const [photoPreview, setPhotoPreview] = useState(null);
    const photoInput = useRef(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [showNotification, setShowNotification] = useState(!!status);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
        photo: null,
    });
    
    const updateProfileInformation = (e) => {
        e.preventDefault();
        post(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowNotification(true);
            },
        });
    };
    
    const updatePassword = (e) => {
        e.preventDefault();
        post(route('admin.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
                setShowNotification(true);
            },
        });
    };
    
    const selectNewPhoto = () => {
        photoInput.current.click();
    };
    
    const updatePhotoPreview = () => {
        const photo = photoInput.current.files[0];
        
        if (!photo) return;
        
        setData('photo', photo);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        
        reader.readAsDataURL(photo);
    };
    
    const tabs = [
        { name: 'Profil', href: '#profile', icon: UserCircleIcon, id: 'profile' },
        { name: 'Kata Sandi', href: '#password', icon: KeyIcon, id: 'password' },
        { name: 'Notifikasi', href: '#notifications', icon: BellIcon, id: 'notifications' },
        { name: 'Keamanan', href: '#security', icon: ShieldCheckIcon, id: 'security' },
    ];
    
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
    
    return (
        <AdminDashboardLayout
            title="Profil Admin"
            user={auth.user}
            notifications={notifications}
        >
            <Head title="Profil Admin" />
            
            {/* Success Notification */}
            <NotificationToast
                show={showNotification}
                type="success"
                title="Berhasil!"
                message={status || "Profil berhasil diperbarui"}
                onClose={() => setShowNotification(false)}
            />
            
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola pengaturan dan preferensi akun Anda.
                    </p>
                </div>
                
                {/* Profile tabs */}
                <div className="border-b border-slate-100">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a
                                key={tab.name}
                                href={tab.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleTabClick(tab.id);
                                }}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                                    ${activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                <tab.icon 
                                    className={`mr-2 h-5 w-5 ${
                                        activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                                    }`} 
                                    aria-hidden="true" 
                                />
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>
                
                {/* Tab content */}
                <div className="space-y-6">
                    {/* Profile Information */}
                    {activeTab === 'profile' && (
                        <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6 lg:p-8">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Profil</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Informasi dasar untuk akun Anda.
                                        </p>
                                    </div>
                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <form onSubmit={updateProfileInformation}>
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            {photoPreview ? (
                                                                <img
                                                                    src={photoPreview}
                                                                    className="h-16 w-16 rounded-full object-cover"
                                                                    alt="Profile"
                                                                />
                                                            ) : user.profile_photo_url ? (
                                                                <img
                                                                    src={user.profile_photo_url}
                                                                    className="h-16 w-16 rounded-full object-cover"
                                                                    alt="Profile"
                                                                />
                                                            ) : (
                                                                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                                                                    <UserCircleIcon className="h-10 w-10 text-primary-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                            onClick={selectNewPhoto}
                                                        >
                                                            Ubah Foto
                                                        </button>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            ref={photoInput}
                                                            onChange={updatePhotoPreview}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="col-span-6 sm:col-span-4">
                                                    <InputLabel htmlFor="name" value="Nama" />
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <TextInput
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            className="block w-full pl-10"
                                                            autoComplete="name"
                                                            onChange={(e) => setData('name', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <InputError message={errors.name} className="mt-2" />
                                                </div>
                                                
                                                <div className="col-span-6 sm:col-span-4">
                                                    <InputLabel htmlFor="email" value="Email" />
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <TextInput
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            className="block w-full pl-10"
                                                            autoComplete="email"
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <InputError message={errors.email} className="mt-2" />
                                                </div>
                                                
                                                <div className="col-span-6 sm:col-span-4">
                                                    <InputLabel htmlFor="phone" value="Nomor Telepon" />
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <TextInput
                                                            id="phone"
                                                            type="text"
                                                            value={data.phone}
                                                            className="block w-full pl-10"
                                                            autoComplete="tel"
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                        />
                                                    </div>
                                                    <InputError message={errors.phone} className="mt-2" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end mt-6">
                                                <PrimaryButton
                                                    className="ml-4"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6 lg:p-8">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Ubah Kata Sandi</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Pastikan akun Anda menggunakan kata sandi yang kuat untuk keamanan.
                                        </p>
                                    </div>
                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <form onSubmit={updatePassword}>
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-4">
                                                    <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" />
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <KeyIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <TextInput
                                                            id="current_password"
                                                            type="password"
                                                            value={data.current_password}
                                                            className="block w-full pl-10"
                                                            autoComplete="current-password"
                                                            onChange={(e) => setData('current_password', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <InputError message={errors.current_password} className="mt-2" />
                                                </div>
                                                
                                                <div className="col-span-6 sm:col-span-4">
                                                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <KeyIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <TextInput
                                                            id="password"
                                                            type="password"
                                                            value={data.password}
                                                            className="block w-full pl-10"
                                                            autoComplete="new-password"
                                                            onChange={(e) => setData('password', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <InputError message={errors.password} className="mt-2" />
                                                </div>
                                                
                                                <div className="col-span-6 sm:col-span-4">
                                                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi" />
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <KeyIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <TextInput
                                                            id="password_confirmation"
                                                            type="password"
                                                            value={data.password_confirmation}
                                                            className="block w-full pl-10"
                                                            autoComplete="new-password"
                                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end mt-6">
                                                <PrimaryButton
                                                    className="ml-4"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6 lg:p-8">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Pengaturan Notifikasi</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Tentukan bagaimana Anda ingin menerima notifikasi.
                                        </p>
                                    </div>
                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <form>
                                            <div className="space-y-6">
                                                <fieldset>
                                                    <legend className="text-base font-medium text-gray-900">Email</legend>
                                                    <div className="mt-4 space-y-4">
                                                        <div className="flex items-start">
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    id="new_bookings"
                                                                    name="new_bookings"
                                                                    type="checkbox"
                                                                    defaultChecked
                                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                                />
                                                            </div>
                                                            <div className="ml-3 text-sm">
                                                                <label htmlFor="new_bookings" className="font-medium text-gray-700">Pemesanan Baru</label>
                                                                <p className="text-gray-500">Dapatkan notifikasi saat ada pemesanan ambulans baru.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    id="emergency_bookings"
                                                                    name="emergency_bookings"
                                                                    type="checkbox"
                                                                    defaultChecked
                                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                                />
                                                            </div>
                                                            <div className="ml-3 text-sm">
                                                                <label htmlFor="emergency_bookings" className="font-medium text-gray-700">Pemesanan Darurat</label>
                                                                <p className="text-gray-500">Dapatkan notifikasi untuk pemesanan dengan prioritas darurat.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    id="cancelled_bookings"
                                                                    name="cancelled_bookings"
                                                                    type="checkbox"
                                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                                />
                                                            </div>
                                                            <div className="ml-3 text-sm">
                                                                <label htmlFor="cancelled_bookings" className="font-medium text-gray-700">Pembatalan</label>
                                                                <p className="text-gray-500">Dapatkan notifikasi saat pemesanan dibatalkan.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                
                                                <fieldset>
                                                    <legend className="text-base font-medium text-gray-900">SMS</legend>
                                                    <div className="mt-4 space-y-4">
                                                        <div className="flex items-start">
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    id="sms_emergency"
                                                                    name="sms_emergency"
                                                                    type="checkbox"
                                                                    defaultChecked
                                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                                />
                                                            </div>
                                                            <div className="ml-3 text-sm">
                                                                <label htmlFor="sms_emergency" className="font-medium text-gray-700">Hanya Darurat</label>
                                                                <p className="text-gray-500">Terima SMS hanya untuk pemesanan darurat.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                
                                                <div className="flex justify-end">
                                                    <PrimaryButton
                                                        type="button"
                                                        className="ml-4"
                                                        onClick={() => setShowNotification(true)}
                                                    >
                                                        Simpan Preferensi
                                                    </PrimaryButton>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100">
                            <div className="p-5 sm:p-6 lg:p-8">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Keamanan Akun</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Kelola pengaturan keamanan untuk melindungi akun Anda.
                                        </p>
                                    </div>
                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <div className="space-y-6">
                                            <div className="bg-green-50 p-4 rounded-md">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-green-800">Akun Anda aman</h3>
                                                        <div className="mt-2 text-sm text-green-700">
                                                            <p>Akun Anda memiliki kata sandi yang kuat dan aktivitas masuk normal.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <fieldset>
                                                <legend className="text-base font-medium text-gray-900">Login Dua Faktor</legend>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-start">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                id="two_factor"
                                                                name="two_factor"
                                                                type="checkbox"
                                                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label htmlFor="two_factor" className="font-medium text-gray-700">Aktifkan Autentikasi Dua Faktor</label>
                                                            <p className="text-gray-500">Tingkatkan keamanan akun Anda dengan lapisan verifikasi tambahan.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            
                                            <div className="border-t border-gray-200 pt-6">
                                                <h3 className="text-base font-medium text-gray-900">Sesi Login</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Perangkat dan lokasi tempat Anda telah masuk ke akun Anda.
                                                </p>
                                                
                                                <div className="mt-4">
                                                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-3">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">Chrome di MacOS</p>
                                                                <p className="text-xs text-gray-500">Jakarta, Indonesia - Aktif Sekarang</p>
                                                            </div>
                                                            <div>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Saat Ini
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                    >
                                                        Keluar Dari Semua Sesi Lain
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end">
                                                <PrimaryButton
                                                    type="button"
                                                    className="ml-4"
                                                    onClick={() => setShowNotification(true)}
                                                >
                                                    Simpan Pengaturan
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
