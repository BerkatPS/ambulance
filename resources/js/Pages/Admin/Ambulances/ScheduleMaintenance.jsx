import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { 
    WrenchIcon,
    ArrowLeftIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    UserIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function ScheduleMaintenance({ auth, ambulance, notifications }) {
    const { data, setData, post, processing, errors } = useForm({
        maintenance_type: '',
        description: '',
        start_date: '',
        end_date: '',
        cost: '',
        technician_name: '',
        notes: ''
    });

    const maintenanceTypes = [
        { value: 'routine', label: 'Servis Rutin' },
        { value: 'repair', label: 'Perbaikan' },
        { value: 'inspection', label: 'Inspeksi Keamanan' },
        { value: 'equipment', label: 'Pembaruan Peralatan' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.ambulances.schedule-maintenance', ambulance.id));
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            notifications={notifications}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Jadwalkan Pemeliharaan Ambulans
                    </h2>
                    <Link
                        href={route('admin.ambulances.show', ambulance.id)}
                        className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Jadwalkan Pemeliharaan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100">
                        <div className="p-5 sm:p-6 lg:p-8">
                            {/* Ambulance Info Card */}
                            <div className="mb-8 bg-slate-50 rounded-xl p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <WrenchIcon className="w-5 h-5 mr-2 text-primary-600" />
                                    Detail Ambulans
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Kode Kendaraan</div>
                                        <div className="mt-1 text-base font-semibold">{ambulance.vehicle_code}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Nomor Registrasi</div>
                                        <div className="mt-1 text-base font-semibold">{ambulance.registration_number}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Plat Nomor</div>
                                        <div className="mt-1 text-base font-semibold">{ambulance.license_plate}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Model</div>
                                        <div className="mt-1 text-base font-semibold">{ambulance.model} ({ambulance.year})</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Tipe Ambulans</div>
                                        <div className="mt-1 text-base font-semibold">{ambulance.ambulanceType?.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Stasiun</div>
                                        <div className="mt-1 text-base font-semibold">{ambulance.ambulanceStation?.name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Maintenance Form */}
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                                    <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-primary-600" />
                                    Detail Pemeliharaan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <InputLabel htmlFor="maintenance_type" value="Tipe Pemeliharaan" />
                                        <SelectInput
                                            id="maintenance_type"
                                            className="mt-1 block w-full"
                                            options={maintenanceTypes}
                                            value={data.maintenance_type}
                                            onChange={(e) => setData('maintenance_type', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.maintenance_type} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="technician_name" value="Nama Teknisi" />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <TextInput
                                                id="technician_name"
                                                type="text"
                                                className="pl-10 block w-full"
                                                value={data.technician_name}
                                                onChange={(e) => setData('technician_name', e.target.value)}
                                                placeholder="Nama teknisi atau vendor"
                                            />
                                        </div>
                                        <InputError message={errors.technician_name} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <InputLabel htmlFor="description" value="Deskripsi Pemeliharaan" />
                                    <TextArea
                                        id="description"
                                        className="mt-1 block w-full"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Tanggal Mulai" />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <TextInput
                                                id="start_date"
                                                type="date"
                                                className="pl-10 block w-full"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="end_date" value="Perkiraan Tanggal Selesai" />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <TextInput
                                                id="end_date"
                                                type="date"
                                                className="pl-10 block w-full"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.end_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="cost" value="Perkiraan Biaya (Rp)" />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <TextInput
                                                id="cost"
                                                type="number"
                                                className="pl-10 block w-full"
                                                value={data.cost}
                                                onChange={(e) => setData('cost', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <InputError message={errors.cost} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <InputLabel htmlFor="notes" value="Catatan Tambahan" />
                                    <TextArea
                                        id="notes"
                                        className="mt-1 block w-full"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-8">
                                    <Link
                                        href={route('admin.ambulances.show', ambulance.id)}
                                        className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white rounded-md border border-gray-300 mr-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Batalkan
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Jadwalkan Pemeliharaan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
