import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function MaintenanceCreate({ auth, ambulances, maintenanceTypes }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        ambulance_id: '',
        maintenance_type: '',
        description: '',
        start_date: '',
        end_date: '',
        cost: '',
        technician_name: '',
        notes: '',
        update_ambulance_status: true,
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.maintenance.store'), {
            onSuccess: () => reset()
        });
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Tambah Perawatan & Perbaikan">
            <Head title="Tambah Perawatan & Perbaikan" />
            
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
                                            className="text-gray-400 hover:text-primary-600"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <Link 
                                            href={route('admin.maintenance.index')} 
                                            className="ml-4 text-gray-400 hover:text-primary-600"
                                        >
                                            Perawatan & Perbaikan
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <span className="ml-4 text-gray-500 font-medium">Tambah Baru</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-semibold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                                Tambah Perawatan & Perbaikan Baru
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Lengkapi formulir di bawah untuk menambahkan catatan perawatan atau perbaikan baru.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-5 sm:p-6 lg:p-8">
                                <div className="space-y-8 divide-y divide-gray-200">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Umum</h3>
                                        
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            <div className="sm:col-span-3">
                                                <label htmlFor="ambulance_id" className="block text-sm font-medium text-gray-700">
                                                    Ambulans
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="ambulance_id"
                                                        name="ambulance_id"
                                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                        value={data.ambulance_id}
                                                        onChange={(e) => setData('ambulance_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Pilih ambulans</option>
                                                        {ambulances.map((ambulance) => (
                                                            <option key={ambulance.value} value={ambulance.value}>
                                                                {ambulance.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.ambulance_id && <div className="mt-1 text-sm text-red-600">{errors.ambulance_id}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-3">
                                                <label htmlFor="maintenance_type" className="block text-sm font-medium text-gray-700">
                                                    Jenis Pemeliharaan
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="maintenance_type"
                                                        name="maintenance_type"
                                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                        value={data.maintenance_type}
                                                        onChange={(e) => setData('maintenance_type', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Pilih jenis pemeliharaan</option>
                                                        <option value="service">Servis Rutin</option>
                                                        <option value="repair">Perbaikan</option>
                                                    </select>
                                                </div>
                                                {errors.maintenance_type && <div className="mt-1 text-sm text-red-600">{errors.maintenance_type}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-6">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                    Deskripsi
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={3}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="Deskripsi detail pemeliharaan atau perbaikan"
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Berikan deskripsi detail tentang kebutuhan pemeliharaan atau masalah yang perlu diperbaiki.
                                                </p>
                                                {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-3">
                                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                                    Tanggal Mulai
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="start_date"
                                                        id="start_date"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {errors.start_date && <div className="mt-1 text-sm text-red-600">{errors.start_date}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-3">
                                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                                    Tanggal Selesai
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="end_date"
                                                        id="end_date"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        value={data.end_date}
                                                        onChange={(e) => setData('end_date', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {errors.end_date && <div className="mt-1 text-sm text-red-600">{errors.end_date}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-3">
                                                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                                                    Biaya (Rp)
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="number"
                                                        name="cost"
                                                        id="cost"
                                                        min="0"
                                                        step="1000"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="0"
                                                        value={data.cost}
                                                        onChange={(e) => setData('cost', e.target.value)}
                                                    />
                                                </div>
                                                {errors.cost && <div className="mt-1 text-sm text-red-600">{errors.cost}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-3">
                                                <label htmlFor="technician_name" className="block text-sm font-medium text-gray-700">
                                                    Nama Teknisi
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="technician_name"
                                                        id="technician_name"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="Nama teknisi yang melakukan pemeliharaan"
                                                        value={data.technician_name}
                                                        onChange={(e) => setData('technician_name', e.target.value)}
                                                    />
                                                </div>
                                                {errors.technician_name && <div className="mt-1 text-sm text-red-600">{errors.technician_name}</div>}
                                            </div>
                                            
                                            <div className="sm:col-span-6">
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                    Catatan Tambahan
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={3}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="Informasi tambahan atau instruksi khusus"
                                                        value={data.notes}
                                                        onChange={(e) => setData('notes', e.target.value)}
                                                    />
                                                </div>
                                                {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Jadwal & Biaya</h3>
                                        
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            
                                            <div className="sm:col-span-6">
                                                <div className="flex items-start">
                                                    <div className="flex h-5 items-center">
                                                        <input
                                                            id="update_ambulance_status"
                                                            name="update_ambulance_status"
                                                            type="checkbox"
                                                            checked={data.update_ambulance_status}
                                                            onChange={(e) => setData('update_ambulance_status', e.target.checked)}
                                                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor="update_ambulance_status" className="font-medium text-gray-700">
                                                            Ubah status ambulans menjadi "maintenance"
                                                        </label>
                                                        <p className="text-gray-500">
                                                            Centang ini jika ambulans tidak akan tersedia selama proses perawatan.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <Link
                                    href={route('admin.maintenance.index')}
                                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
