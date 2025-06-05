import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { 
    WrenchIcon,
    ClipboardDocumentListIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowPathIcon,
    TruckIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AmbulancesMaintenance({ auth, ambulances, maintenanceSchedule, notifications }) {
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
    // Status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'out_of_service':
                return 'bg-red-100 text-red-800';
            case 'assigned':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };
    
    // Schedule status
    const getScheduleStatus = (schedule) => {
        const now = new Date();
        const scheduledDate = new Date(schedule.scheduled_date);
        
        if (schedule.completed_at) {
            return {
                label: 'Completed',
                icon: CheckCircleIcon,
                color: 'text-green-600',
                bg: 'bg-green-100'
            };
        } else if (schedule.in_progress) {
            return {
                label: 'In Progress',
                icon: ArrowPathIcon,
                color: 'text-blue-600',
                bg: 'bg-blue-100'
            };
        } else if (scheduledDate < now) {
            return {
                label: 'Overdue',
                icon: XCircleIcon,
                color: 'text-red-600',
                bg: 'bg-red-100'
            };
        } else {
            return {
                label: 'Scheduled',
                icon: ClockIcon,
                color: 'text-amber-600',
                bg: 'bg-amber-100'
            };
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'PP', { locale: id });
    };
    
    const openScheduleModal = (ambulance) => {
        setSelectedAmbulance(ambulance);
        setIsScheduleModalOpen(true);
    };
    
    return (
        <AdminDashboardLayout
            title="Ambulance Maintenance"
            user={auth.user}
            notifications={notifications}
        >
            <Head title="Ambulance Maintenance" />
            
            <div className="space-y-6">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Ambulance Maintenance</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            View and manage maintenance schedules for all ambulances.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link
                            href={route('admin.maintenance.schedule')}
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                            <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Schedule Maintenance
                        </Link>
                    </div>
                </div>
                
                {/* Upcoming maintenance section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Maintenance</h3>
                    </div>
                    <div className="bg-white p-5 sm:p-6">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {maintenanceSchedule && maintenanceSchedule.upcoming && maintenanceSchedule.upcoming.length > 0 ? (
                                maintenanceSchedule.upcoming.map((schedule) => {
                                    const status = getScheduleStatus(schedule);
                                    const StatusIcon = status.icon;
                                    
                                    return (
                                        <div 
                                            key={schedule.id} 
                                            className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow transition-shadow duration-300"
                                        >
                                            <div className="p-5">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 rounded-md ${status.bg} p-3`}>
                                                        <StatusIcon className={`h-6 w-6 ${status.color}`} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <h4 className="text-base font-medium text-gray-900">{schedule.ambulance.code}</h4>
                                                        <p className="text-sm text-gray-500">{schedule.ambulance.type}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                        <span>{formatDate(schedule.scheduled_date)}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                                        <WrenchIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                        <span>{schedule.maintenance_type}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                                        <ClipboardDocumentListIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                        <span className="line-clamp-2">{schedule.notes || 'No notes'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 px-5 py-3">
                                                <div className="flex items-center justify-between">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    <Link
                                                        href={route('admin.maintenance.edit', schedule.id)}
                                                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                                    >
                                                        View details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-4 text-center text-gray-500">
                                    No upcoming maintenance scheduled.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Ambulances list */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Ambulance Fleet</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Vehicle Code
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        License Plate
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Type
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Last Maintenance
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Next Scheduled
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {ambulances && ambulances.length > 0 ? (
                                    ambulances.map((ambulance) => (
                                        <tr key={ambulance.id} className="hover:bg-slate-50">
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                {ambulance.code}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.license_plate}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.type}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                                                    {ambulance.status_label}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.last_maintenance ? formatDate(ambulance.last_maintenance) : 'Never'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ambulance.next_maintenance ? formatDate(ambulance.next_maintenance) : 'Not scheduled'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    type="button"
                                                    onClick={() => openScheduleModal(ambulance)}
                                                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                >
                                                    <CalendarIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                                                    Schedule
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-3 py-4 text-sm text-center text-gray-500">
                                            No ambulances found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Past maintenance section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Maintenance History</h3>
                    </div>
                    <div className="bg-white p-5 sm:p-6">
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-slate-200">
                                {maintenanceSchedule && maintenanceSchedule.past && maintenanceSchedule.past.length > 0 ? (
                                    maintenanceSchedule.past.map((record) => (
                                        <li key={record.id} className="py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                        <TruckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900">
                                                        {record.ambulance.code} - {record.maintenance_type}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500">
                                                        Completed on {formatDate(record.completed_at)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Link
                                                        href={route('admin.maintenance.show', record.id)}
                                                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                    >
                                                        View details
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="py-4 text-center text-gray-500">
                                        No maintenance history available.
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <Link
                                href={route('admin.maintenance.history')}
                                className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm hover:bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                View all history
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Modal for scheduling maintenance */}
                {isScheduleModalOpen && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsScheduleModalOpen(false)}></div>
                            
                            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                            
                            <div className="inline-block transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <CalendarIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                                Schedule Maintenance
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Schedule maintenance for ambulance {selectedAmbulance?.code}.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <form className="mt-5">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="maintenance_type" className="block text-sm font-medium text-gray-700">
                                                    Maintenance Type
                                                </label>
                                                <select
                                                    id="maintenance_type"
                                                    name="maintenance_type"
                                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                                    defaultValue="routine"
                                                >
                                                    <option value="routine">Routine Maintenance</option>
                                                    <option value="repair">Repair</option>
                                                    <option value="inspection">Safety Inspection</option>
                                                    <option value="oil_change">Oil Change</option>
                                                    <option value="tire_replacement">Tire Replacement</option>
                                                </select>
                                            </div>
                                            
                                            <div className="sm:col-span-2">
                                                <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="scheduled_date"
                                                    id="scheduled_date"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                />
                                            </div>
                                            
                                            <div className="sm:col-span-2">
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                    Notes
                                                </label>
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    placeholder="Add any notes about this maintenance"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                                    >
                                        Schedule
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setIsScheduleModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}
