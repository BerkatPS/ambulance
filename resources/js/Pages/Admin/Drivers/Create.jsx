import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ExclamationCircleIcon, 
    ChevronRightIcon 
} from '@heroicons/react/24/outline';

export default function DriverCreate({ auth, availableAmbulances }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        employee_id: '',
        license_number: '',
        license_expiry: '',
        hire_date: '',
        base_salary: '',
        address: '',
        ambulance_id: '',
        status: 'available',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.drivers.store'));
    };

    return (
        <AdminDashboardLayout user={auth.user} title="Tambah Pengemudi Baru">
            <Head title="Tambah Pengemudi Baru" />
            
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
                                            href={route('admin.drivers.index')} 
                                            className="ml-4 text-gray-400 hover:text-primary-600"
                                        >
                                            Pengemudi
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
                    
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Tambah Pengemudi Baru</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Buat akun pengemudi baru dengan detail personal dan profesional.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Link
                                href={route('admin.drivers.index')}
                                className="inline-flex items-center rounded-md border border-slate-100 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Kembali ke Daftar
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <form onSubmit={handleSubmit}>
                            <div className="overflow-hidden rounded-xl shadow-sm border border-slate-100">
                                <div className="bg-white px-4 py-5 sm:p-6 lg:p-8">
                                    <div className="grid grid-cols-6 gap-6">
                                        {/* Personal Information */}
                                        <div className="col-span-6 border-b border-gray-200 pb-4">
                                            <h2 className="text-lg font-medium text-gray-900">Informasi Pribadi</h2>
                                        </div>
                                        
                                        {/* Name */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Nama Lengkap
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.name 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Masukkan nama lengkap"
                                                />
                                                {errors.name && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.name && (
                                                <p className="mt-2 text-sm text-red-600" id="name-error">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Employee ID */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                                                ID Karyawan
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="employee_id"
                                                    id="employee_id"
                                                    value={data.employee_id}
                                                    onChange={e => setData('employee_id', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.employee_id 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Masukkan ID karyawan"
                                                />
                                                {errors.employee_id && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.employee_id && (
                                                <p className="mt-2 text-sm text-red-600" id="employee-id-error">
                                                    {errors.employee_id}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Phone */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Nomor Telepon
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.phone 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="contoh: 081234567890"
                                                />
                                                {errors.phone && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-2 text-sm text-red-600" id="phone-error">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Email */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Alamat Email (Opsional)
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.email 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="contoh@email.com"
                                                />
                                                {errors.email && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600" id="email-error">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Address */}
                                        <div className="col-span-6">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Alamat
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    rows={3}
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.address 
                                                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Alamat tempat tinggal lengkap"
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="mt-2 text-sm text-red-600" id="address-error">
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Professional Information */}
                                        <div className="col-span-6 border-b border-gray-200 pb-4 mt-4">
                                            <h2 className="text-lg font-medium text-gray-900">Informasi Profesional</h2>
                                        </div>
                                        
                                        {/* License Number */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                                                Nomor SIM
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="license_number"
                                                    id="license_number"
                                                    value={data.license_number}
                                                    onChange={e => setData('license_number', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.license_number 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Nomor SIM pengemudi"
                                                />
                                                {errors.license_number && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.license_number && (
                                                <p className="mt-2 text-sm text-red-600" id="license-number-error">
                                                    {errors.license_number}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* License Expiry */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="license_expiry" className="block text-sm font-medium text-gray-700">
                                                Tanggal Kadaluarsa SIM
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="date"
                                                    name="license_expiry"
                                                    id="license_expiry"
                                                    value={data.license_expiry}
                                                    onChange={e => setData('license_expiry', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.license_expiry 
                                                            ? 'border-red-300 pr-10 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                />
                                                {errors.license_expiry && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.license_expiry && (
                                                <p className="mt-2 text-sm text-red-600" id="license-expiry-error">
                                                    {errors.license_expiry}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Hire Date */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
                                                Tanggal Bergabung
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="date"
                                                    name="hire_date"
                                                    id="hire_date"
                                                    value={data.hire_date}
                                                    onChange={e => setData('hire_date', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.hire_date 
                                                            ? 'border-red-300 pr-10 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                />
                                                {errors.hire_date && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.hire_date && (
                                                <p className="mt-2 text-sm text-red-600" id="hire-date-error">
                                                    {errors.hire_date}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Base Salary */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="base_salary" className="block text-sm font-medium text-gray-700">
                                                Gaji Pokok
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-gray-500 sm:text-sm">Rp</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="base_salary"
                                                    id="base_salary"
                                                    value={data.base_salary}
                                                    onChange={e => setData('base_salary', e.target.value)}
                                                    className={`block w-full rounded-md pl-12 ${
                                                        errors.base_salary 
                                                            ? 'border-red-300 pr-10 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="0"
                                                />
                                                {errors.base_salary && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.base_salary && (
                                                <p className="mt-2 text-sm text-red-600" id="base-salary-error">
                                                    {errors.base_salary}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Status */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className={`mt-1 block w-full rounded-md ${
                                                    errors.status 
                                                        ? 'border-red-300 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                } py-2 px-3 shadow-sm sm:text-sm`}
                                            >
                                                <option value="available">Tersedia</option>
                                                <option value="busy">Sibuk</option>
                                                <option value="off">Tidak Aktif</option>
                                            </select>
                                            {errors.status && (
                                                <p className="mt-2 text-sm text-red-600" id="status-error">
                                                    {errors.status}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Ambulance Assignment */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="ambulance_id" className="block text-sm font-medium text-gray-700">
                                                Penugasan Ambulans
                                            </label>
                                            <select
                                                id="ambulance_id"
                                                name="ambulance_id"
                                                value={data.ambulance_id}
                                                onChange={e => setData('ambulance_id', e.target.value)}
                                                className={`mt-1 block w-full rounded-md ${
                                                    errors.ambulance_id 
                                                        ? 'border-red-300 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                } py-2 px-3 shadow-sm sm:text-sm`}
                                            >
                                                <option value="">Pilih Ambulans</option>
                                                {availableAmbulances && availableAmbulances.map(ambulance => (
                                                    <option key={ambulance.id} value={ambulance.id}>
                                                        {ambulance.registration_number} - {ambulance.model}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ambulance_id && (
                                                <p className="mt-2 text-sm text-red-600" id="ambulance-id-error">
                                                    {errors.ambulance_id}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Notes */}
                                        <div className="col-span-6">
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                Catatan Tambahan (Opsional)
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows={3}
                                                    value={data.notes}
                                                    onChange={e => setData('notes', e.target.value)}
                                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Informasi tambahan tentang pengemudi"
                                                />
                                            </div>
                                            {errors.notes && (
                                                <p className="mt-2 text-sm text-red-600" id="notes-error">
                                                    {errors.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mr-3"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    >
                                        {processing ? 'Membuat...' : 'Buat Pengemudi'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
