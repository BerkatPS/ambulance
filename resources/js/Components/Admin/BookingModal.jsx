import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import TextInput from '../Common/TextInput';
import InputLabel from '../Common/InputLabel';
import InputError from '../Common/InputError';
import PrimaryButton from '../Common/PrimaryButton';
import SecondaryButton from '../Common/SecondaryButton';
import BookingStatusBadge from './BookingStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';

export default function BookingModal({
  show = false,
  booking = null,
  drivers = [],
  ambulances = [],
  errors = {},
  mode = 'view', // view, edit, create
  processing = false,
  onClose,
  onSave,
  onCancel,
  onComplete
}) {
  const [formData, setFormData] = useState({
    patient_name: '',
    contact_number: '',
    pickup_location: '',
    dropoff_location: '',
    pickup_time: '',
    medical_notes: '',
    ambulance_type: '',
    payment_status: 'pending',
    status: 'pending',
    driver_id: '',
    ambulance_id: '',
    amount: ''
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        patient_name: booking.patient_name || '',
        contact_number: booking.contact_number || '',
        pickup_location: booking.pickup_location || '',
        dropoff_location: booking.dropoff_location || '',
        pickup_time: booking.pickup_time || '',
        medical_notes: booking.medical_notes || '',
        ambulance_type: booking.ambulance_type || '',
        payment_status: booking.payment_status || 'pending',
        status: booking.status || 'pending',
        driver_id: booking.driver_id || '',
        ambulance_id: booking.ambulance_id || '',
        amount: booking.amount ? String(booking.amount) : ''
      });
    } else {
      // Reset form when creating a new booking
      setFormData({
        patient_name: '',
        contact_number: '',
        pickup_location: '',
        dropoff_location: '',
        pickup_time: '',
        medical_notes: '',
        ambulance_type: '',
        payment_status: 'pending',
        status: 'pending',
        driver_id: '',
        ambulance_id: '',
        amount: ''
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getStatusOptions = () => {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'driver_assigned', label: 'Driver Assigned' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  };

  const getPaymentStatusOptions = () => {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' },
      { value: 'partially_paid', label: 'Partially Paid' }
    ];
  };

  const getAmbulanceTypeOptions = () => {
    return [
      { value: 'basic', label: 'Basic' },
      { value: 'advanced', label: 'Advanced Life Support' },
      { value: 'neonatal', label: 'Neonatal' },
      { value: 'patient_transport', label: 'Patient Transport' },
      { value: 'bariatric', label: 'Bariatric' }
    ];
  };

  return (
    <Modal show={show} onClose={onClose} maxWidth="2xl">
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-medical-gray-900">
              {mode === 'create' ? 'Create New Booking' : 
               mode === 'edit' ? 'Edit Booking' : 'Booking Details'}
            </h2>
            {booking && booking.id && (
              <span className="text-sm text-medical-gray-600">
                Booking #{booking.id}
              </span>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {/* Top section with status and payment info */}
            {booking && booking.id && (
              <div className="bg-medical-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-xs text-medical-gray-500">Status</p>
                    <div className="mt-1">
                      <BookingStatusBadge status={formData.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-medical-gray-500">Payment</p>
                    <div className="mt-1">
                      <PaymentStatusBadge status={formData.payment_status} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-medical-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-medical-gray-900">
                    ${formData.amount || '0.00'}
                  </p>
                </div>
              </div>
            )}

            {/* Form fields in grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="patient_name" value="Patient Name" required={true} />
                <TextInput
                  id="patient_name"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.patient_name} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="contact_number" value="Contact Number" required={true} />
                <TextInput
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.contact_number} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="pickup_location" value="Pickup Location" required={true} />
                <TextInput
                  id="pickup_location"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.pickup_location} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="dropoff_location" value="Dropoff Location" required={true} />
                <TextInput
                  id="dropoff_location"
                  name="dropoff_location"
                  value={formData.dropoff_location}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.dropoff_location} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="pickup_time" value="Pickup Time" required={true} />
                <TextInput
                  id="pickup_time"
                  name="pickup_time"
                  type="datetime-local"
                  value={formData.pickup_time}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.pickup_time} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="ambulance_type" value="Ambulance Type" required={true} />
                <select
                  id="ambulance_type"
                  name="ambulance_type"
                  value={formData.ambulance_type}
                  onChange={handleChange}
                  className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                  disabled={mode === 'view'}
                  required
                >
                  <option value="">Select Type</option>
                  {getAmbulanceTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <InputError message={errors.ambulance_type} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="amount" value="Amount (USD)" />
                <TextInput
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                />
                <InputError message={errors.amount} className="mt-2" />
              </div>

              {mode !== 'create' && (
                <div>
                  <InputLabel htmlFor="status" value="Status" />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                    disabled={mode === 'view'}
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.status} className="mt-2" />
                </div>
              )}

              {mode !== 'create' && (
                <div>
                  <InputLabel htmlFor="payment_status" value="Payment Status" />
                  <select
                    id="payment_status"
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                    disabled={mode === 'view'}
                  >
                    {getPaymentStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.payment_status} className="mt-2" />
                </div>
              )}

              {(mode === 'edit' || mode === 'view') && (
                <div>
                  <InputLabel htmlFor="driver_id" value="Assigned Driver" />
                  <select
                    id="driver_id"
                    name="driver_id"
                    value={formData.driver_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                    disabled={mode === 'view'}
                  >
                    <option value="">Not Assigned</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.phone}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.driver_id} className="mt-2" />
                </div>
              )}

              {(mode === 'edit' || mode === 'view') && (
                <div>
                  <InputLabel htmlFor="ambulance_id" value="Assigned Ambulance" />
                  <select
                    id="ambulance_id"
                    name="ambulance_id"
                    value={formData.ambulance_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                    disabled={mode === 'view'}
                  >
                    <option value="">Not Assigned</option>
                    {ambulances.map(ambulance => (
                      <option key={ambulance.id} value={ambulance.id}>
                        {ambulance.registration_number} - {ambulance.type}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.ambulance_id} className="mt-2" />
                </div>
              )}
            </div>

            <div>
              <InputLabel htmlFor="medical_notes" value="Medical Notes" />
              <textarea
                id="medical_notes"
                name="medical_notes"
                value={formData.medical_notes}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                disabled={mode === 'view'}
              />
              <InputError message={errors.medical_notes} className="mt-2" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 bg-medical-gray-50 border-t border-medical-gray-200 rounded-b-lg">
          {mode !== 'view' ? (
            <>
              <SecondaryButton onClick={onClose} className="mr-3">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" className="ml-3" disabled={processing}>
                {processing ? 'Saving...' : 'Save Booking'}
              </PrimaryButton>
            </>
          ) : (
            <>
              {booking && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <>
                  {onCancel && (
                    <SecondaryButton
                      onClick={() => onCancel(booking)}
                      className="mr-3 !bg-danger-50 !text-danger-700 hover:!bg-danger-100"
                    >
                      Cancel Booking
                    </SecondaryButton>
                  )}
                  {onComplete && booking.status === 'in_progress' && (
                    <SecondaryButton
                      onClick={() => onComplete(booking)}
                      className="mr-3 !bg-success-50 !text-success-700 hover:!bg-success-100"
                    >
                      Mark as Completed
                    </SecondaryButton>
                  )}
                </>
              )}
              <PrimaryButton onClick={onClose}>
                Close
              </PrimaryButton>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}
