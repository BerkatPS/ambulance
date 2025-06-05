import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AmbulanceCreate({ auth, ambulanceTypes, ambulanceStations }) {
    // Set up form using Inertia's useForm
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        model: '',
        year: new Date().getFullYear(),
        ambulance_type_id: '',
        ambulance_station_id: '',
        status: 'available',
        last_maintenance_date: '',
        next_maintenance_date: '',
        equipment: '',
        notes: '',
    });
    
    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.ambulances.store'));
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title="Tambah Ambulans Baru">
            <Head title="Tambah Ambulans Baru" />
            
            <div className="space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <div>
                                <Link 
                                    href={route('admin.dashboard')} 
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                                <Link 
                                    href={route('admin.ambulances.index')} 
                                    className="ml-4 text-slate-400 hover:text-slate-500"
                                >
                                    Ambulans
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                                <span className="ml-4 text-slate-500 font-medium">Tambah Baru</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Tambah Ambulans Baru</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Tambahkan ambulans baru ke dalam sistem.
                        </p>
                    </div>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="shadow-sm rounded-xl border border-slate-100 overflow-hidden bg-white">
                        <div className="space-y-6 p-5 sm:p-6">
                            {/* Ambulance Information Section */}
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Kendaraan</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Masukkan detail dasar kendaraan ambulans.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Registration Number */}
                                <div>
                                    <InputLabel 
                                        htmlFor="registration_number" 
                                        value="Nomor Registrasi *" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="registration_number"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.registration_number}
                                        onChange={(e) => setData('registration_number', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.registration_number} className="mt-2" />
                                </div>
                                
                                {/* Model */}
                                <div>
                                    <InputLabel 
                                        htmlFor="model" 
                                        value="Model *" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="model"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.model} className="mt-2" />
                                </div>
                                
                                {/* Year */}
                                <div>
                                    <InputLabel 
                                        htmlFor="year" 
                                        value="Tahun Pembuatan" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="year"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                    />
                                    <InputError message={errors.year} className="mt-2" />
                                </div>
                                
                                {/* Ambulance Type */}
                                <div>
                                    <InputLabel 
                                        htmlFor="ambulance_type_id" 
                                        value="Tipe Ambulans *" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <select
                                        id="ambulance_type_id"
                                        name="ambulance_type_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.ambulance_type_id}
                                        onChange={(e) => setData('ambulance_type_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih tipe</option>
                                        {ambulanceTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.ambulance_type_id} className="mt-2" />
                                </div>
                                
                                {/* Ambulance Station */}
                                <div>
                                    <InputLabel 
                                        htmlFor="ambulance_station_id" 
                                        value="Stasiun Ambulans" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <select
                                        id="ambulance_station_id"
                                        name="ambulance_station_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.ambulance_station_id}
                                        onChange={(e) => setData('ambulance_station_id', e.target.value)}
                                    >
                                        <option value="">Pilih stasiun</option>
                                        {ambulanceStations.map((station) => (
                                            <option key={station.id} value={station.id}>
                                                {station.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.ambulance_station_id} className="mt-2" />
                                </div>
                                
                                {/* Status */}
                                <div>
                                    <InputLabel 
                                        htmlFor="status" 
                                        value="Status *" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <select
                                        id="status"
                                        name="status"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="available">Tersedia</option>
                                        <option value="maintenance">Dalam Pemeliharaan</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                
                                {/* Last Maintenance Date */}
                                <div>
                                    <InputLabel 
                                        htmlFor="last_maintenance_date" 
                                        value="Tanggal Pemeliharaan Terakhir" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="last_maintenance_date"
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.last_maintenance_date}
                                        onChange={(e) => setData('last_maintenance_date', e.target.value)}
                                    />
                                    <InputError message={errors.last_maintenance_date} className="mt-2" />
                                </div>
                                
                                {/* Next Maintenance Date */}
                                <div>
                                    <InputLabel 
                                        htmlFor="next_maintenance_date" 
                                        value="Tanggal Pemeliharaan Berikutnya" 
                                        className="block text-sm font-medium text-gray-700"
                                    />
                                    <TextInput
                                        id="next_maintenance_date"
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.next_maintenance_date}
                                        onChange={(e) => setData('next_maintenance_date', e.target.value)}
                                    />
                                    <InputError message={errors.next_maintenance_date} className="mt-2" />
                                </div>
                            </div>
                            
                            {/* Equipment */}
                            <div>
                                <InputLabel 
                                    htmlFor="equipment" 
                                    value="Perlengkapan & Peralatan (pisahkan dengan koma)" 
                                    className="block text-sm font-medium text-gray-700"
                                />
                                <textarea
                                    id="equipment"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    placeholder="Oksigen, Ventilator, Defibrilator, dll."
                                    value={data.equipment}
                                    onChange={(e) => setData('equipment', e.target.value)}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Daftar peralatan dan perlengkapan yang tersedia di ambulans ini.
                                </p>
                                <InputError message={errors.equipment} className="mt-2" />
                            </div>
                            
                            {/* Notes */}
                            <div>
                                <InputLabel 
                                    htmlFor="notes" 
                                    value="Catatan" 
                                    className="block text-sm font-medium text-gray-700"
                                />
                                <textarea
                                    id="notes"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    placeholder="Tambahkan catatan tentang ambulans ini"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Catatan tambahan tentang kondisi ambulans, pemeliharaan, atau informasi penting lainnya.
                                </p>
                                <InputError message={errors.notes} className="mt-2" />
                            </div>
                        </div>
                        
                        {/* Form Actions */}
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex justify-end space-x-3">
                            <Link
                                href={route('admin.ambulances.index')}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
}
