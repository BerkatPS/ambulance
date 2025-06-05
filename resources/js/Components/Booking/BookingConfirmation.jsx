import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircleIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function BookingConfirmation({ booking, onTrackBooking }) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-medical">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100">
            <CheckCircleIcon className="h-10 w-10 text-success-600" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-heading font-semibold text-medical-gray-900">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-medical-gray-600">
            Your ambulance booking has been successfully placed.
          </p>
          
          {booking?.id && (
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-info-100 text-info-800">
                Booking ID: {booking.id}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-medical-gray-200">
          <dl className="divide-y divide-medical-gray-200">
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Status</dt>
              <dd className="text-sm font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {booking?.status === 'confirmed' ? 'Confirmed' : 
                   booking?.status === 'pending' ? 'Processing' : 
                   booking?.status || 'Processing'}
                </span>
              </dd>
            </div>
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Patient Name</dt>
              <dd className="text-sm text-medical-gray-900">{booking?.patient_name}</dd>
            </div>
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Pickup Location</dt>
              <dd className="text-sm text-medical-gray-900">{booking?.pickup_location}</dd>
            </div>
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Destination</dt>
              <dd className="text-sm text-medical-gray-900">{booking?.dropoff_location}</dd>
            </div>
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Pickup Time</dt>
              <dd className="text-sm text-medical-gray-900">
                {booking?.pickup_time ? new Date(booking.pickup_time).toLocaleString() : 'Not specified'}
              </dd>
            </div>
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Ambulance Type</dt>
              <dd className="text-sm text-medical-gray-900">
                {booking?.ambulance_type === 'basic' ? 'Basic Life Support' :
                 booking?.ambulance_type === 'advanced' ? 'Advanced Life Support' :
                 booking?.ambulance_type === 'neonatal' ? 'Neonatal' :
                 booking?.ambulance_type === 'patient_transport' ? 'Patient Transport' :
                 booking?.ambulance_type || 'Standard'}
              </dd>
            </div>
            
            {booking?.amount && (
              <div className="py-4 flex justify-between">
                <dt className="text-sm font-medium text-medical-gray-600">Total Amount</dt>
                <dd className="text-sm font-medium text-medical-gray-900">
                  ${parseFloat(booking.amount).toFixed(2)}
                </dd>
              </div>
            )}
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-medical-gray-600">Payment Status</dt>
              <dd className="text-sm font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  booking?.payment_status === 'paid' ? 'bg-success-100 text-success-800' : 
                  booking?.payment_status === 'pending' ? 'bg-warning-100 text-warning-800' :
                  booking?.payment_status === 'failed' ? 'bg-danger-100 text-danger-800' :
                  'bg-medical-gray-100 text-medical-gray-800'
                }`}>
                  {booking?.payment_status === 'paid' ? 'Paid' : 
                   booking?.payment_status === 'pending' ? 'Pending' : 
                   booking?.payment_status === 'failed' ? 'Failed' : 
                   booking?.payment_status || 'Pending'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 space-y-4">
          {booking?.payment_status === 'pending' && (
            <div className="bg-warning-50 border border-warning-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="h-5 w-5 text-warning-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-warning-800">Payment Required</h3>
                  <div className="mt-2 text-sm text-warning-700">
                    <p>
                      Your booking requires payment to be completed. Please complete the payment to confirm your ambulance.
                    </p>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={route('payment.show', { booking: booking?.id })}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-warning-600 hover:bg-warning-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning-500"
                    >
                      Complete Payment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-medical-gray-50 border border-medical-gray-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-medical-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-medical-gray-800">Track Your Booking</h3>
                <div className="mt-2 text-sm text-medical-gray-500">
                  <p>
                    You can track the status of your ambulance booking in real-time. We'll also send updates to your email and phone.
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => onTrackBooking && onTrackBooking(booking)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Track Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-4 border-t border-medical-gray-200">
            <Link
              href={route('dashboard')}
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
