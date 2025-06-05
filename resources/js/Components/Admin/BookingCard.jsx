import React from 'react';
import { Link } from '@inertiajs/react';
import BookingStatusBadge from './BookingStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';

export default function BookingCard({ 
  booking, 
  onViewDetails, 
  onEdit, 
  onCancel,
  detailed = false 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-medical-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-medical-gray-900">
              Booking #{booking.id}
            </h3>
            <p className="text-sm text-medical-gray-500">
              {new Date(booking.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-medical-gray-500">Patient</p>
            <p className="text-sm font-medium text-medical-gray-900">{booking.patient_name}</p>
          </div>
          <div>
            <p className="text-xs text-medical-gray-500">Contact</p>
            <p className="text-sm font-medium text-medical-gray-900">{booking.contact_number}</p>
          </div>
          <div>
            <p className="text-xs text-medical-gray-500">From</p>
            <p className="text-sm font-medium text-medical-gray-900 truncate">{booking.pickup_location}</p>
          </div>
          <div>
            <p className="text-xs text-medical-gray-500">To</p>
            <p className="text-sm font-medium text-medical-gray-900 truncate">{booking.dropoff_location}</p>
          </div>
        </div>

        {detailed && (
          <>
            <div className="mt-4">
              <p className="text-xs text-medical-gray-500">Medical Notes</p>
              <p className="text-sm text-medical-gray-700 mt-1">{booking.medical_notes || 'No medical notes provided'}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-medical-gray-500">Ambulance Type</p>
                <p className="text-sm font-medium text-medical-gray-900">{booking.ambulance_type}</p>
              </div>
              <div>
                <p className="text-xs text-medical-gray-500">Payment</p>
                <div className="flex items-center mt-1">
                  <PaymentStatusBadge status={booking.payment_status} />
                  <span className="ml-2 text-sm font-medium text-medical-gray-900">${booking.amount}</span>
                </div>
              </div>
            </div>
            
            {booking.driver && (
              <div className="mt-4">
                <p className="text-xs text-medical-gray-500">Assigned Driver</p>
                <div className="flex items-center mt-1">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      {booking.driver.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-medical-gray-900">{booking.driver.name}</p>
                    <p className="text-xs text-medical-gray-500">{booking.driver.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-medical-gray-50 px-5 py-3 flex justify-between items-center">
        <div className="flex space-x-2">
          {/* Estimated time or distance */}
          {booking.estimated_time && (
            <div className="flex items-center text-xs text-medical-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {booking.estimated_time}
            </div>
          )}
          
          {/* Distance */}
          {booking.distance && (
            <div className="flex items-center text-xs text-medical-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {booking.distance}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(booking)}
              className="text-xs font-medium text-primary hover:text-primary-700 transition-colors"
            >
              View Details
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(booking)}
              className="text-xs font-medium text-medical-gray-600 hover:text-medical-gray-900 transition-colors"
            >
              Edit
            </button>
          )}
          
          {onCancel && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              onClick={() => onCancel(booking)}
              className="text-xs font-medium text-danger-600 hover:text-danger-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
