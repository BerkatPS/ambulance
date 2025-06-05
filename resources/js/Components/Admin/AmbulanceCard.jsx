import React from 'react';

export default function AmbulanceCard({ 
  ambulance, 
  onViewDetails, 
  onEdit, 
  onMaintenance,
  detailed = false 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-medical-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              ambulance.status === 'available' ? 'bg-success-100 text-success-700' : 
              ambulance.status === 'in_use' ? 'bg-primary-100 text-primary-700' :
              ambulance.status === 'maintenance' ? 'bg-warning-100 text-warning-700' :
              'bg-danger-100 text-danger-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-.8-.4L14 7v-2a1 1 0 00-1-1H3z" />
              </svg>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-medical-gray-900">
                {ambulance.registration_number}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ambulance.status === 'available' ? 'bg-success-100 text-success-800' : 
                ambulance.status === 'in_use' ? 'bg-primary-100 text-primary-800' :
                ambulance.status === 'maintenance' ? 'bg-warning-100 text-warning-800' :
                'bg-danger-100 text-danger-800'
              }`}>
                {ambulance.status === 'available' ? 'Available' :
                 ambulance.status === 'in_use' ? 'In Use' :
                 ambulance.status === 'maintenance' ? 'Under Maintenance' :
                 'Out of Service'}
              </span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-medical-gray-500">Type</p>
                <p className="text-sm font-medium text-medical-gray-900">{ambulance.type}</p>
              </div>
              <div>
                <p className="text-xs text-medical-gray-500">Capacity</p>
                <p className="text-sm font-medium text-medical-gray-900">{ambulance.capacity} passengers</p>
              </div>
            </div>

            {detailed && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-medical-gray-500">Make/Model</p>
                    <p className="text-sm font-medium text-medical-gray-900">{ambulance.make} {ambulance.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-gray-500">Year</p>
                    <p className="text-sm font-medium text-medical-gray-900">{ambulance.year}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-medical-gray-500">Features</p>
                  <div className="flex flex-wrap mt-1 gap-1">
                    {ambulance.features && ambulance.features.map((feature, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-info-100 text-info-800">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {ambulance.lastMaintenance && (
                  <div className="mt-3">
                    <p className="text-xs text-medical-gray-500">Last Maintenance</p>
                    <p className="text-sm font-medium text-medical-gray-900">
                      {new Date(ambulance.lastMaintenance).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {ambulance.nextMaintenance && (
                  <div className="mt-3">
                    <p className="text-xs text-medical-gray-500">Next Scheduled Maintenance</p>
                    <p className="text-sm font-medium text-medical-gray-900">
                      {new Date(ambulance.nextMaintenance).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {ambulance.currentDriver && (
                  <div className="mt-3">
                    <p className="text-xs text-medical-gray-500">Current Driver</p>
                    <div className="mt-1 flex items-center p-2 bg-medical-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {ambulance.currentDriver.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-medical-gray-900">{ambulance.currentDriver.name}</p>
                        <p className="text-xs text-medical-gray-500">{ambulance.currentDriver.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-medical-gray-50 px-5 py-3 flex justify-between items-center">
        <div className="flex items-center">
          {ambulance.mileage && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-xs font-medium text-medical-gray-700">{ambulance.mileage} km</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(ambulance)}
              className="text-xs font-medium text-primary hover:text-primary-700 transition-colors"
            >
              View Details
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(ambulance)}
              className="text-xs font-medium text-medical-gray-600 hover:text-medical-gray-900 transition-colors"
            >
              Edit
            </button>
          )}
          
          {onMaintenance && ambulance.status !== 'maintenance' && (
            <button
              onClick={() => onMaintenance(ambulance)}
              className="text-xs font-medium text-warning-600 hover:text-warning-800 transition-colors"
            >
              Schedule Maintenance
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
