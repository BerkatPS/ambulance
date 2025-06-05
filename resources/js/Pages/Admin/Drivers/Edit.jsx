import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ExclamationCircleIcon, 
    ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { formatDateForInput } from '@/Utils/dateHelpers';

export default function DriverEdit({ auth, driver, availableAmbulances }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: driver.name || '',
        phone: driver.phone || '',
        email: driver.email || '',
        license_number: driver.license_number || '',
        license_expiry: driver.license_expiry ? formatDateForInput(driver.license_expiry) : '',
        address: driver.address || '',
        ambulance_id: driver.ambulance_id || '',
        status: driver.status || 'available',
        notes: driver.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.drivers.update', driver.id));
    };

    return (
        <AdminDashboardLayout user={auth.user} title={`Edit Driver: ${driver.name}`}>
            <Head title={`Edit Driver: ${driver.name}`} />
            
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
                                            className="text-gray-400 hover:text-gray-500"
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
                                            className="ml-4 text-gray-400 hover:text-gray-500"
                                        >
                                            Drivers
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <Link 
                                            href={route('admin.drivers.show', driver.id)} 
                                            className="ml-4 text-gray-400 hover:text-gray-500"
                                        >
                                            {driver.name}
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <span className="ml-4 text-gray-500 font-medium">Edit</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Edit Driver: {driver.name}</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Update driver information and assignments.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
                            <Link
                                href={route('admin.drivers.show', driver.id)}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                View Details
                            </Link>
                            <Link
                                href={route('admin.drivers.index')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Back to List
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <form onSubmit={handleSubmit}>
                            <div className="overflow-hidden shadow sm:rounded-md">
                                <div className="bg-white px-4 py-5 sm:p-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        {/* Personal Information */}
                                        <div className="col-span-6 border-b border-gray-200 pb-4">
                                            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                                        </div>
                                        
                                        {/* Name */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Full Name
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
                                                    placeholder="Enter full name"
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
                                        
                                        {/* Phone */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone Number
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
                                                    placeholder="e.g. 081234567890"
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
                                                Email Address (Optional)
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
                                                    placeholder="example@email.com"
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
                                                Address
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
                                                    placeholder="Full residential address"
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
                                            <h2 className="text-lg font-medium text-gray-900">Professional Information</h2>
                                        </div>
                                        
                                        {/* License Number */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                                                License Number
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
                                                    placeholder="Driver's license number"
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
                                                License Expiry Date
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
                                                <option value="available">Available</option>
                                                <option value="busy">Busy</option>
                                                <option value="off">Off</option>
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
                                                Assign Ambulance (Optional)
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
                                                <option value="">None</option>
                                                {availableAmbulances.map((ambulance) => (
                                                    <option key={ambulance.id} value={ambulance.id}>
                                                        {ambulance.vehicle_code} - {ambulance.license_plate}
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
                                                Additional Notes (Optional)
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows={3}
                                                    value={data.notes}
                                                    onChange={e => setData('notes', e.target.value)}
                                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Any additional information about the driver"
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
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
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
