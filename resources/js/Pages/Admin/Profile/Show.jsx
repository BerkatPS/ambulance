import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import NotificationToast from '@/Components/NotificationToast';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Profile({ auth, admin, notifications, status }) {
    const [editing, setEditing] = useState(false);
    const [showNotification, setShowNotification] = useState(!!status);
    
    const { data, setData, errors, put, processing, reset } = useForm({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        put(route('admin.profile.update'), {
            onSuccess: () => {
                setEditing(false);
                reset('current_password', 'password', 'password_confirmation');
                setShowNotification(true);
            },
        });
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
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100">
                        <div className="p-5 sm:p-6 lg:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Profil Anda</h2>
                                <button 
                                    type="button"
                                    onClick={() => setEditing(!editing)}
                                    className={`px-4 py-2 ${editing ? 'bg-slate-200 text-slate-700' : 'bg-primary-600 text-white'} border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest ${editing ? 'hover:bg-slate-300' : 'hover:bg-primary-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition ease-in-out duration-150`}
                                >
                                    {editing ? 'Batal' : 'Edit Profil'}
                                </button>
                            </div>

                            {editing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nama" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    className="block w-full pl-10"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone" value="Telepon" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextInput
                                                    id="phone"
                                                    type="text"
                                                    className="block w-full pl-10"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                />
                                            </div>
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-gray-200 pt-6">
                                        <div className="flex items-center">
                                            <LockClosedIcon className="h-5 w-5 text-primary-600 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Ubah Kata Sandi</h3>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Biarkan kosong jika Anda tidak ingin mengubah kata sandi.</p>

                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            <div className="sm:col-span-6">
                                                <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" />
                                                <TextInput
                                                    id="current_password"
                                                    type="password"
                                                    className="mt-1 block w-full"
                                                    value={data.current_password}
                                                    onChange={(e) => setData('current_password', e.target.value)}
                                                />
                                                <InputError message={errors.current_password} className="mt-2" />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <InputLabel htmlFor="password" value="Kata Sandi Baru" />
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    className="mt-1 block w-full"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                />
                                                <InputError message={errors.password} className="mt-2" />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi Baru" />
                                                <TextInput
                                                    id="password_confirmation"
                                                    type="password"
                                                    className="mt-1 block w-full"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(false);
                                                reset();
                                            }}
                                            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            Batal
                                        </button>
                                        <PrimaryButton disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-white shadow-sm sm:rounded-xl border border-slate-100 overflow-hidden">
                                    <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-100">
                                        <div className="flex items-center">
                                            <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi Admin</h3>
                                        </div>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail informasi pribadi.</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{admin.name}</dd>
                                            </div>
                                            <div className="bg-slate-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Alamat Email</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{admin.email}</dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Nomor Telepon</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{admin.phone || 'Belum diatur'}</dd>
                                            </div>
                                            <div className="bg-slate-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Terakhir Login</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {admin.last_login_at ? new Date(admin.last_login_at).toLocaleString('id-ID', {
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'Tidak tersedia'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
