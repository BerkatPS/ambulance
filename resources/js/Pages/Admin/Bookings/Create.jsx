import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function Create({ auth, ambulanceTypes, users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        patient_name: '',
        pickup_address: '',
        destination_address: '',
        pickup_datetime: '',
        contact_phone: '',
        ambulance_type: '',
        medical_notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.bookings.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AdminDashboardLayout user={auth.user} title="Create Booking">
            <Head title="Create Booking" />
            
            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Create New Booking</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Fill in the details below to create a new booking in the system.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Link
                                href={route('admin.bookings.index')}
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
                                        {/* User Selection */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                                User
                                            </label>
                                            <select
                                                id="user_id"
                                                name="user_id"
                                                value={data.user_id}
                                                onChange={e => setData('user_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                            >
                                                <option value="">Select User (Optional)</option>
                                                {users && users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.phone})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.user_id && (
                                                <p className="mt-2 text-sm text-red-600" id="user-id-error">
                                                    {errors.user_id}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Patient Name */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700">
                                                Patient Name
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="patient_name"
                                                    id="patient_name"
                                                    value={data.patient_name}
                                                    onChange={e => setData('patient_name', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.patient_name 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Full patient name"
                                                    aria-invalid={errors.patient_name ? 'true' : 'false'}
                                                    aria-describedby={errors.patient_name ? "patient-name-error" : ""}
                                                />
                                                {errors.patient_name && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.patient_name && (
                                                <p className="mt-2 text-sm text-red-600" id="patient-name-error">
                                                    {errors.patient_name}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Contact Phone */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                                                Contact Phone
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="contact_phone"
                                                    id="contact_phone"
                                                    value={data.contact_phone}
                                                    onChange={e => setData('contact_phone', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.contact_phone 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="e.g. 081234567890"
                                                />
                                                {errors.contact_phone && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.contact_phone && (
                                                <p className="mt-2 text-sm text-red-600" id="contact-phone-error">
                                                    {errors.contact_phone}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Ambulance Type */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="ambulance_type" className="block text-sm font-medium text-gray-700">
                                                Ambulance Type
                                            </label>
                                            <select
                                                id="ambulance_type"
                                                name="ambulance_type"
                                                value={data.ambulance_type}
                                                onChange={e => setData('ambulance_type', e.target.value)}
                                                className={`mt-1 block w-full rounded-md ${
                                                    errors.ambulance_type 
                                                        ? 'border-red-300 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                } py-2 px-3 shadow-sm sm:text-sm`}
                                            >
                                                <option value="">Select Ambulance Type</option>
                                                {ambulanceTypes && Object.entries(ambulanceTypes).map(([value, label]) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ambulance_type && (
                                                <p className="mt-2 text-sm text-red-600" id="ambulance-type-error">
                                                    {errors.ambulance_type}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Pickup Date & Time */}
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="pickup_datetime" className="block text-sm font-medium text-gray-700">
                                                Pickup Date & Time
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="datetime-local"
                                                    name="pickup_datetime"
                                                    id="pickup_datetime"
                                                    value={data.pickup_datetime}
                                                    onChange={e => setData('pickup_datetime', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.pickup_datetime 
                                                            ? 'border-red-300 pr-10 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                />
                                                {errors.pickup_datetime && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.pickup_datetime && (
                                                <p className="mt-2 text-sm text-red-600" id="pickup-datetime-error">
                                                    {errors.pickup_datetime}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Pickup Address */}
                                        <div className="col-span-6">
                                            <label htmlFor="pickup_address" className="block text-sm font-medium text-gray-700">
                                                Pickup Address
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="pickup_address"
                                                    id="pickup_address"
                                                    value={data.pickup_address}
                                                    onChange={e => setData('pickup_address', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.pickup_address 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Enter full pickup address"
                                                />
                                                {errors.pickup_address && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.pickup_address && (
                                                <p className="mt-2 text-sm text-red-600" id="pickup-address-error">
                                                    {errors.pickup_address}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Destination Address */}
                                        <div className="col-span-6">
                                            <label htmlFor="destination_address" className="block text-sm font-medium text-gray-700">
                                                Destination Address
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="destination_address"
                                                    id="destination_address"
                                                    value={data.destination_address}
                                                    onChange={e => setData('destination_address', e.target.value)}
                                                    className={`block w-full rounded-md ${
                                                        errors.destination_address 
                                                            ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                                    } sm:text-sm`}
                                                    placeholder="Enter full destination address"
                                                />
                                                {errors.destination_address && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.destination_address && (
                                                <p className="mt-2 text-sm text-red-600" id="destination-address-error">
                                                    {errors.destination_address}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Medical Notes */}
                                        <div className="col-span-6">
                                            <label htmlFor="medical_notes" className="block text-sm font-medium text-gray-700">
                                                Medical Notes (Optional)
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="medical_notes"
                                                    name="medical_notes"
                                                    rows={3}
                                                    value={data.medical_notes}
                                                    onChange={e => setData('medical_notes', e.target.value)}
                                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Any relevant medical information or special requirements"
                                                />
                                            </div>
                                            {errors.medical_notes && (
                                                <p className="mt-2 text-sm text-red-600" id="medical-notes-error">
                                                    {errors.medical_notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mr-3"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    >
                                        {processing ? 'Creating...' : 'Create Booking'}
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
