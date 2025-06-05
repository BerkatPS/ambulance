import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    ChevronRightIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function MaintenanceEdit({ auth, maintenance, ambulances }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        ambulance_id: maintenance.ambulance_id || '',
        maintenance_type: maintenance.maintenance_type || '',
        description: maintenance.description || '',
        scheduled_date: maintenance.scheduled_date || '',
        estimated_completion_date: maintenance.estimated_completion_date || '',
        completion_date: maintenance.completion_date || '',
        estimated_cost: maintenance.estimated_cost || '',
        cost: maintenance.cost || '',
        notes: maintenance.notes || '',
        service_provider: maintenance.service_provider || '',
        contact_person: maintenance.contact_person || '',
        contact_phone: maintenance.contact_phone || '',
        status: maintenance.status || 'scheduled',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.maintenance.update', maintenance.id));
    };
    
    return (
        <AdminDashboardLayout user={auth.user} title={`Edit Maintenance Record #${maintenance.id}`}>
            <Head title={`Edit Maintenance Record #${maintenance.id}`} />
            
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
                                            href={route('admin.maintenance.index')} 
                                            className="ml-4 text-gray-400 hover:text-gray-500"
                                        >
                                            Maintenance
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <Link 
                                            href={route('admin.maintenance.show', maintenance.id)} 
                                            className="ml-4 text-gray-400 hover:text-gray-500"
                                        >
                                            Record #{maintenance.id}
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
                    
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Edit Maintenance Record #{maintenance.id}
                            </h2>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                            <div className="space-y-8 divide-y divide-gray-200">
                                <div className="pt-8">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Maintenance Information</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Update details about the maintenance record.
                                        </p>
                                    </div>
                                    
                                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="ambulance_id" className="block text-sm font-medium text-gray-700">
                                                Ambulance
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
                                                    <option value="">Select an ambulance</option>
                                                    {ambulances.map((ambulance) => (
                                                        <option key={ambulance.id} value={ambulance.id}>
                                                            {ambulance.registration_number} - {ambulance.model}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.ambulance_id && <div className="mt-1 text-sm text-red-600">{errors.ambulance_id}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="maintenance_type" className="block text-sm font-medium text-gray-700">
                                                Maintenance Type
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
                                                    <option value="">Select maintenance type</option>
                                                    <option key="routine" value="routine">Routine Service</option>
                                                    <option key="repair" value="repair">Repair</option>
                                                    <option key="inspection" value="inspection">Inspection</option>
                                                    <option key="tire_replacement" value="tire_replacement">Tire Replacement</option>
                                                    <option key="oil_change" value="oil_change">Oil Change</option>
                                                    <option key="battery_replacement" value="battery_replacement">Battery Replacement</option>
                                                    <option key="engine_service" value="engine_service">Engine Service</option>
                                                    <option key="electrical" value="electrical">Electrical System</option>
                                                    <option key="body_work" value="body_work">Body Work</option>
                                                    <option key="other" value="other">Other</option>
                                                </select>
                                            </div>
                                            {errors.maintenance_type && <div className="mt-1 text-sm text-red-600">{errors.maintenance_type}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-6">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Detailed description of the maintenance or repair"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Provide a detailed description of the maintenance requirements or issues to be fixed.
                                            </p>
                                            {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
                                                Scheduled Date
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="date"
                                                    name="scheduled_date"
                                                    id="scheduled_date"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={data.scheduled_date}
                                                    onChange={(e) => setData('scheduled_date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.scheduled_date && <div className="mt-1 text-sm text-red-600">{errors.scheduled_date}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="estimated_completion_date" className="block text-sm font-medium text-gray-700">
                                                Estimated Completion Date
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="date"
                                                    name="estimated_completion_date"
                                                    id="estimated_completion_date"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={data.estimated_completion_date}
                                                    onChange={(e) => setData('estimated_completion_date', e.target.value)}
                                                />
                                            </div>
                                            {errors.estimated_completion_date && <div className="mt-1 text-sm text-red-600">{errors.estimated_completion_date}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700">
                                                Actual Completion Date
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="date"
                                                    name="completion_date"
                                                    id="completion_date"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={data.completion_date}
                                                    onChange={(e) => setData('completion_date', e.target.value)}
                                                />
                                            </div>
                                            {errors.completion_date && <div className="mt-1 text-sm text-red-600">{errors.completion_date}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="service_provider" className="block text-sm font-medium text-gray-700">
                                                Service Provider
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="service_provider"
                                                    id="service_provider"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Name of service company or mechanic"
                                                    value={data.service_provider}
                                                    onChange={(e) => setData('service_provider', e.target.value)}
                                                />
                                            </div>
                                            {errors.service_provider && <div className="mt-1 text-sm text-red-600">{errors.service_provider}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
                                                Contact Person
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="contact_person"
                                                    id="contact_person"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Name of the person to contact"
                                                    value={data.contact_person}
                                                    onChange={(e) => setData('contact_person', e.target.value)}
                                                />
                                            </div>
                                            {errors.contact_person && <div className="mt-1 text-sm text-red-600">{errors.contact_person}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                                                Contact Phone
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="contact_phone"
                                                    id="contact_phone"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Phone number"
                                                    value={data.contact_phone}
                                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                                />
                                            </div>
                                            {errors.contact_phone && <div className="mt-1 text-sm text-red-600">{errors.contact_phone}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="estimated_cost" className="block text-sm font-medium text-gray-700">
                                                Estimated Cost ($)
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="number"
                                                    name="estimated_cost"
                                                    id="estimated_cost"
                                                    min="0"
                                                    step="0.01"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="0.00"
                                                    value={data.estimated_cost}
                                                    onChange={(e) => setData('estimated_cost', e.target.value)}
                                                />
                                            </div>
                                            {errors.estimated_cost && <div className="mt-1 text-sm text-red-600">{errors.estimated_cost}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                                                Actual Cost ($)
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="number"
                                                    name="cost"
                                                    id="cost"
                                                    min="0"
                                                    step="0.01"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="0.00"
                                                    value={data.cost}
                                                    onChange={(e) => setData('cost', e.target.value)}
                                                />
                                            </div>
                                            {errors.cost && <div className="mt-1 text-sm text-red-600">{errors.cost}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-3">
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <div className="mt-1">
                                                <select
                                                    id="status"
                                                    name="status"
                                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    required
                                                >
                                                    <option value="scheduled">Scheduled</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="overdue">Overdue</option>
                                                </select>
                                            </div>
                                            {errors.status && <div className="mt-1 text-sm text-red-600">{errors.status}</div>}
                                        </div>
                                        
                                        <div className="sm:col-span-6">
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                Additional Notes
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows={3}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Any additional information or special instructions"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                />
                                            </div>
                                            {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-5">
                                <div className="flex justify-end">
                                    <Link
                                        href={route('admin.maintenance.show', maintenance.id)}
                                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
