import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ExclamationTriangleIcon, CheckCircleIcon, ChevronRightIcon, ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function EmergencyCalls({ auth, emergencyCalls = [] }) {
    // If no emergency calls provided, use this sample data
    const sampleEmergencyCalls = [
        {
            id: 'E-4589',
            patientName: 'Ahmad Fauzi',
            phoneNumber: '081234567890',
            location: 'Jl. Sudirman No. 45, Jakarta Pusat',
            coordinates: { lat: -6.1751, lng: 106.8650 },
            emergencyType: 'Accident',
            status: 'pending',
            timestamp: '2023-08-15T10:45:30',
            additionalInfo: 'Car accident, possible head injury'
        },
        {
            id: 'E-4587',
            patientName: 'Siti Rahayu',
            phoneNumber: '081234567891',
            location: 'Jl. Gajah Mada No. 12, Jakarta Barat',
            coordinates: { lat: -6.1600, lng: 106.8169 },
            emergencyType: 'Medical',
            status: 'assigned',
            timestamp: '2023-08-15T10:30:12',
            additionalInfo: 'Difficulty breathing, possible asthma attack',
            assignedDriver: {
                id: 'D-123',
                name: 'Budi Santoso',
                phone: '081234567892',
                vehicleId: 'AMB-001',
                eta: '10 minutes'
            }
        },
        {
            id: 'E-4586',
            patientName: 'Tono Wijaya',
            phoneNumber: '081234567893',
            location: 'Jl. Kemang Raya No. 10, Jakarta Selatan',
            coordinates: { lat: -6.2608, lng: 106.8162 },
            emergencyType: 'Medical',
            status: 'completed',
            timestamp: '2023-08-15T10:15:45',
            additionalInfo: 'Chest pain, possible heart attack',
            completionDetails: {
                hospitalName: 'RS Medika',
                arrivalTime: '2023-08-15T10:45:22',
                driverId: 'D-124',
                driverName: 'Rudi Hartono'
            }
        },
        {
            id: 'E-4585',
            patientName: 'Maya Anggraini',
            phoneNumber: '081234567894',
            location: 'Jl. Hayam Wuruk No. 28, Jakarta Pusat',
            coordinates: { lat: -6.1472, lng: 106.8158 },
            emergencyType: 'Accident',
            status: 'cancelled',
            timestamp: '2023-08-15T10:05:18',
            additionalInfo: 'False alarm, patient called back to cancel',
            cancellationReason: 'Patient requested cancellation'
        },
        {
            id: 'E-4584',
            patientName: 'Dian Permana',
            phoneNumber: '081234567895',
            location: 'Jl. Pluit Selatan No. 8, Jakarta Utara',
            coordinates: { lat: -6.1269, lng: 106.7944 },
            emergencyType: 'Medical',
            status: 'completed',
            timestamp: '2023-08-15T09:45:33',
            additionalInfo: 'Severe allergic reaction',
            completionDetails: {
                hospitalName: 'RS Pluit',
                arrivalTime: '2023-08-15T10:15:42',
                driverId: 'D-125',
                driverName: 'Andi Susanto'
            }
        }
    ];

    // Use provided emergency calls or sample data
    const callsData = emergencyCalls.length > 0 ? emergencyCalls : sampleEmergencyCalls;
    
    // State for filter and search
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCall, setSelectedCall] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    
    // Filter and search functions
    const filteredCalls = callsData.filter(call => {
        const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
        const matchesSearch = call.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            call.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            call.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Format date and time
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate time elapsed
    const getTimeElapsed = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hours ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`;
        }
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
                        Pending
                    </span>
                );
            case 'assigned':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ArrowPathIcon className="mr-1 h-4 w-4" />
                        Driver Assigned
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                        Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    // Handle assign driver to emergency
    const handleAssign = (call) => {
        setSelectedCall(call);
        setIsAssignModalOpen(true);
    };

    // Close the assign modal
    const closeAssignModal = () => {
        setSelectedCall(null);
        setIsAssignModalOpen(false);
    };

    // Display details of a call
    const viewCallDetails = (call) => {
        setSelectedCall(call);
    };

    // Modal for emergency call details
    const EmergencyCallDetailsModal = ({ call, onClose }) => {
        if (!call) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="emergency-call-details-modal" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                        Emergency Call: {call.id}
                                        <StatusBadge status={call.status} className="ml-2" />
                                    </h3>
                                    <div className="mt-4">
                                        <div className="grid grid-cols-1 gap-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Patient Information</h4>
                                                <p className="text-sm text-gray-900 mt-1">{call.patientName}</p>
                                                <p className="text-sm text-gray-900">{call.phoneNumber}</p>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Emergency Type</h4>
                                                <p className="text-sm text-gray-900 mt-1">{call.emergencyType}</p>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                                <p className="text-sm text-gray-900 mt-1 flex items-center">
                                                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                    {call.location}
                                                </p>
                                                {/* This would be replaced with an actual map */}
                                                <div className="mt-2 bg-gray-100 h-40 rounded-lg flex items-center justify-center">
                                                    <p className="text-gray-500">Map will be displayed here</p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Additional Information</h4>
                                                <p className="text-sm text-gray-900 mt-1">{call.additionalInfo}</p>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                                                <p className="text-sm text-gray-900 mt-1">{formatDateTime(call.timestamp)}</p>
                                                <p className="text-xs text-gray-500">{getTimeElapsed(call.timestamp)}</p>
                                            </div>
                                            
                                            {call.status === 'assigned' && call.assignedDriver && (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <h4 className="text-sm font-medium text-gray-500">Assigned Driver</h4>
                                                    <p className="text-sm text-gray-900 mt-1">{call.assignedDriver.name}</p>
                                                    <p className="text-sm text-gray-900">{call.assignedDriver.phone}</p>
                                                    <p className="text-sm text-gray-900">Vehicle: {call.assignedDriver.vehicleId}</p>
                                                    <p className="text-sm text-gray-900">ETA: {call.assignedDriver.eta}</p>
                                                </div>
                                            )}
                                            
                                            {call.status === 'completed' && call.completionDetails && (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <h4 className="text-sm font-medium text-gray-500">Completion Details</h4>
                                                    <p className="text-sm text-gray-900 mt-1">Hospital: {call.completionDetails.hospitalName}</p>
                                                    <p className="text-sm text-gray-900">Driver: {call.completionDetails.driverName}</p>
                                                    <p className="text-sm text-gray-900">Arrival Time: {formatDateTime(call.completionDetails.arrivalTime)}</p>
                                                </div>
                                            )}
                                            
                                            {call.status === 'cancelled' && call.cancellationReason && (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <h4 className="text-sm font-medium text-gray-500">Cancellation Reason</h4>
                                                    <p className="text-sm text-gray-900 mt-1">{call.cancellationReason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            {call.status === 'pending' && (
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        onClose();
                                        handleAssign(call);
                                    }}
                                >
                                    Assign Driver
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Modal for assigning a driver to an emergency
    const AssignDriverModal = ({ call, onClose }) => {
        const [loading, setLoading] = useState(false);
        const [selectedDriver, setSelectedDriver] = useState('');
        
        // Sample available drivers data
        const availableDrivers = [
            { id: 'D-123', name: 'Budi Santoso', phone: '081234567892', vehicle: 'AMB-001', distance: '2.5 km', eta: '10 min' },
            { id: 'D-124', name: 'Rudi Hartono', phone: '081234567893', vehicle: 'AMB-002', distance: '3.2 km', eta: '12 min' },
            { id: 'D-125', name: 'Andi Susanto', phone: '081234567894', vehicle: 'AMB-003', distance: '1.8 km', eta: '8 min' },
            { id: 'D-126', name: 'Dewi Lestari', phone: '081234567895', vehicle: 'AMB-004', distance: '4.5 km', eta: '15 min' },
            { id: 'D-127', name: 'Sari Indah', phone: '081234567896', vehicle: 'AMB-005', distance: '2.1 km', eta: '9 min' },
        ];

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!selectedDriver) return;

            setLoading(true);
            
            // Simulate API call to assign driver
            setTimeout(() => {
                // This would be replaced with actual API call
                console.log(`Assigned driver ${selectedDriver} to emergency ${call.id}`);
                setLoading(false);
                onClose();
                // In a real application, this would update the call status
            }, 1000);
        };

        if (!call) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="assign-driver-modal" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Assign Driver to Emergency {call.id}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Select an available driver to respond to this emergency call.
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
                                                Available Drivers
                                            </label>
                                            <div className="mt-2 space-y-2">
                                                {availableDrivers.map(driver => (
                                                    <div 
                                                        key={driver.id}
                                                        className={`relative rounded-lg border p-4 cursor-pointer hover:border-primary-500 ${
                                                            selectedDriver === driver.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                                                        }`}
                                                        onClick={() => setSelectedDriver(driver.id)}
                                                    >
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900">{driver.name}</h4>
                                                                <p className="text-sm text-gray-500">{driver.phone}</p>
                                                                <p className="text-sm text-gray-500">Vehicle: {driver.vehicle}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-gray-900">{driver.distance}</p>
                                                                <p className="text-sm text-primary-600">ETA: {driver.eta}</p>
                                                            </div>
                                                        </div>
                                                        {selectedDriver === driver.id && (
                                                            <div className="absolute top-4 right-4">
                                                                <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {availableDrivers.length === 0 && (
                                                <p className="text-sm text-gray-500 mt-2">No drivers available at the moment.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    disabled={!selectedDriver || loading}
                                >
                                    {loading ? 'Assigning...' : 'Assign Driver'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminDashboardLayout user={auth.user} title="Emergency Calls">
            <Head title="Emergency Calls | Admin Dashboard" />

            <div className="py-4">
                {/* Filters and search */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <div>
                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-64">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="ID, patient name, location"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency calls list */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredCalls.length > 0 ? (
                            filteredCalls.map((call) => (
                                <li key={call.id} className="cursor-pointer hover:bg-gray-50" onClick={() => viewCallDetails(call)}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-primary-600 truncate">{call.id}</p>
                                                <div className="ml-2">
                                                    <StatusBadge status={call.status} />
                                                </div>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    {getTimeElapsed(call.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {call.patientName}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    {call.location}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>{call.emergencyType}</p>
                                                <ChevronRightIcon className="flex-shrink-0 ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-6 text-center text-sm text-gray-500">
                                No emergency calls found matching the filters.
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Emergency call details modal */}
            {selectedCall && !isAssignModalOpen && (
                <EmergencyCallDetailsModal call={selectedCall} onClose={() => setSelectedCall(null)} />
            )}

            {/* Assign driver modal */}
            {selectedCall && isAssignModalOpen && (
                <AssignDriverModal call={selectedCall} onClose={closeAssignModal} />
            )}
        </AdminDashboardLayout>
    );
}
