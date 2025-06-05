import React from 'react';
import { formatCurrency } from '../../Utils/helpers';

export default function BookingSummary({ data }) {
  // Helper function to format date
  const formatDate = (dateString, timeString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let formattedDate = date.toLocaleDateString('en-US', options);
      
      if (timeString) {
        formattedDate += ` at ${timeString}`;
      }
      
      return formattedDate;
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to get ambulance type label
  const getAmbulanceTypeLabel = (type) => {
    const types = {
      'basic': 'Basic Life Support',
      'advanced': 'Advanced Life Support',
      'neonatal': 'Neonatal',
      'patient_transport': 'Patient Transport'
    };
    
    return types[type] || type;
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-medical">
        <h2 className="text-xl font-heading font-semibold text-medical-gray-800 mb-4">
          Booking Summary
        </h2>
        
        <div className="space-y-5">
          {/* Patient Information */}
          <div>
            <h3 className="text-sm font-medium uppercase text-medical-gray-500">Patient Information</h3>
            <div className="mt-2 border-t border-medical-gray-200 pt-2">
              <dl className="divide-y divide-medical-gray-100">
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Name</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.patient_name || 'Not provided'}</dd>
                </div>
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Age</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.age || 'Not provided'}</dd>
                </div>
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Gender</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">
                    {data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : 'Not provided'}
                  </dd>
                </div>
                {data.medical_conditions && (
                  <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-medical-gray-600">Medical Conditions</dt>
                    <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.medical_conditions}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Ambulance Information */}
          <div>
            <h3 className="text-sm font-medium uppercase text-medical-gray-500">Ambulance Details</h3>
            <div className="mt-2 border-t border-medical-gray-200 pt-2">
              <dl className="divide-y divide-medical-gray-100">
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Type</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">
                    {data.ambulance_type ? getAmbulanceTypeLabel(data.ambulance_type) : 'Not selected'}
                  </dd>
                </div>
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Pickup Date & Time</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">
                    {formatDate(data.pickup_date, data.pickup_time) || 'Not provided'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Location Information */}
          <div>
            <h3 className="text-sm font-medium uppercase text-medical-gray-500">Location Details</h3>
            <div className="mt-2 border-t border-medical-gray-200 pt-2">
              <dl className="divide-y divide-medical-gray-100">
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Pickup Location</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.pickup_location || 'Not provided'}</dd>
                </div>
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Dropoff Location</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.dropoff_location || 'Not provided'}</dd>
                </div>
                {data.special_instructions && (
                  <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-medical-gray-600">Special Instructions</dt>
                    <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.special_instructions}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium uppercase text-medical-gray-500">Contact Information</h3>
            <div className="mt-2 border-t border-medical-gray-200 pt-2">
              <dl className="divide-y divide-medical-gray-100">
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Contact Name</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.contact_name || 'Not provided'}</dd>
                </div>
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Phone</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.contact_phone || 'Not provided'}</dd>
                </div>
                <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-medical-gray-600">Email</dt>
                  <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.contact_email || 'Not provided'}</dd>
                </div>
                {data.relationship && (
                  <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-medical-gray-600">Relationship to Patient</dt>
                    <dd className="text-sm text-medical-gray-900 sm:col-span-2">
                      {data.relationship.charAt(0).toUpperCase() + data.relationship.slice(1).replace('_', ' ')}
                    </dd>
                  </div>
                )}
                {data.emergency_contact && (
                  <div className="px-2 py-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-medical-gray-600">Emergency Contact</dt>
                    <dd className="text-sm text-medical-gray-900 sm:col-span-2">{data.emergency_contact}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Pricing Information if available */}
          {data.estimatedPrice && (
            <div className="bg-medical-gray-50 p-4 rounded-lg mt-6">
              <div className="flex justify-between items-center">
                <span className="text-medical-gray-700 font-medium">Estimated Price:</span>
                <span className="text-lg font-semibold text-primary-600">{formatCurrency(data.estimatedPrice)}</span>
              </div>
              <p className="text-xs text-medical-gray-500 mt-1">
                Final price may vary based on actual distance and time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
