import React from 'react';

export default function DriverCard({ 
  driver, 
  onViewDetails, 
  onEdit, 
  onDeactivate,
  detailed = false 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-medical-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
              {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-medical-gray-900">
                {driver.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                driver.status === 'active' ? 'bg-success-100 text-success-800' : 
                driver.status === 'on_duty' ? 'bg-primary-100 text-primary-800' :
                driver.status === 'off_duty' ? 'bg-medical-gray-100 text-medical-gray-800' :
                'bg-danger-100 text-danger-800'
              }`}>
                {driver.status === 'active' ? 'Active' :
                 driver.status === 'on_duty' ? 'On Duty' :
                 driver.status === 'off_duty' ? 'Off Duty' :
                 'Inactive'}
              </span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-medical-gray-500">License</p>
                <p className="text-sm font-medium text-medical-gray-900">{driver.license_number}</p>
              </div>
              <div>
                <p className="text-xs text-medical-gray-500">Contact</p>
                <p className="text-sm font-medium text-medical-gray-900">{driver.phone}</p>
              </div>
            </div>

            {detailed && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-medical-gray-500">Email</p>
                    <p className="text-sm font-medium text-medical-gray-900">{driver.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-gray-500">Address</p>
                    <p className="text-sm font-medium text-medical-gray-900 truncate">{driver.address}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-medical-gray-500">Experience</p>
                  <p className="text-sm text-medical-gray-700">{driver.experience} years</p>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-medical-gray-500">Certifications</p>
                  <div className="flex flex-wrap mt-1 gap-1">
                    {driver.certifications && driver.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-info-100 text-info-800">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                
                {driver.current_ambulance && (
                  <div className="mt-3">
                    <p className="text-xs text-medical-gray-500">Current Ambulance</p>
                    <div className="mt-1 flex items-center p-2 bg-medical-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-.8-.4L14 7v-2a1 1 0 00-1-1H3z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-medical-gray-900">{driver.current_ambulance.registration_number}</p>
                        <p className="text-xs text-medical-gray-500">{driver.current_ambulance.type}</p>
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
          {driver.rating && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-xs font-medium text-medical-gray-700">{driver.rating} ({driver.total_trips} trips)</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(driver)}
              className="text-xs font-medium text-primary hover:text-primary-700 transition-colors"
            >
              View Details
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(driver)}
              className="text-xs font-medium text-medical-gray-600 hover:text-medical-gray-900 transition-colors"
            >
              Edit
            </button>
          )}
          
          {onDeactivate && driver.status !== 'inactive' && (
            <button
              onClick={() => onDeactivate(driver)}
              className="text-xs font-medium text-danger-600 hover:text-danger-800 transition-colors"
            >
              {driver.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
