import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import InputLabel from '../Common/InputLabel';
import InputError from '../Common/InputError';
import PrimaryButton from '../Common/PrimaryButton';
import SecondaryButton from '../Common/SecondaryButton';

export default function AssignmentModal({
  show = false,
  drivers = [],
  ambulances = [],
  currentAssignment = null,
  errors = {},
  processing = false,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    driver_id: '',
    ambulance_id: '',
    start_date: '',
    notes: ''
  });

  useEffect(() => {
    if (currentAssignment) {
      setFormData({
        driver_id: currentAssignment.driver_id || '',
        ambulance_id: currentAssignment.ambulance_id || '',
        start_date: currentAssignment.start_date || getCurrentDate(),
        notes: currentAssignment.notes || ''
      });
    } else {
      // Reset form for new assignment
      setFormData({
        driver_id: '',
        ambulance_id: '',
        start_date: getCurrentDate(),
        notes: ''
      });
    }
  }, [currentAssignment, show]);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Filter out drivers and ambulances that are already assigned
  const getAvailableDrivers = () => {
    return drivers.filter(driver => 
      driver.status !== 'inactive' && 
      (!driver.current_assignment || 
        (currentAssignment && driver.id === currentAssignment.driver_id))
    );
  };

  const getAvailableAmbulances = () => {
    return ambulances.filter(ambulance => 
      ambulance.status !== 'maintenance' && 
      ambulance.status !== 'out_of_service' &&
      (!ambulance.current_driver || 
        (currentAssignment && ambulance.id === currentAssignment.ambulance_id))
    );
  };

  const selectedDriver = drivers.find(driver => driver.id === Number(formData.driver_id));
  const selectedAmbulance = ambulances.find(ambulance => ambulance.id === Number(formData.ambulance_id));

  return (
    <Modal show={show} onClose={onClose} maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-medical-gray-900">
            {currentAssignment ? 'Edit Assignment' : 'Assign Driver to Ambulance'}
          </h2>

          <div className="mt-6 space-y-6">
            {/* Preview of selected driver and ambulance */}
            {(selectedDriver || selectedAmbulance) && (
              <div className="bg-medical-gray-50 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                {selectedDriver && (
                  <div className="flex-1 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {selectedDriver.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-medical-gray-900">{selectedDriver.name}</p>
                      <p className="text-xs text-medical-gray-500">{selectedDriver.license_number}</p>
                    </div>
                  </div>
                )}
                
                {selectedDriver && selectedAmbulance && (
                  <div className="flex items-center text-medical-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {selectedAmbulance && (
                  <div className="flex-1 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-info-100 flex items-center justify-center text-info-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-.8-.4L14 7v-2a1 1 0 00-1-1H3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-medical-gray-900">{selectedAmbulance.registration_number}</p>
                      <p className="text-xs text-medical-gray-500">{selectedAmbulance.type}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="driver_id" value="Select Driver" required={true} />
                <select
                  id="driver_id"
                  name="driver_id"
                  value={formData.driver_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                  required
                >
                  <option value="">Select a driver</option>
                  {getAvailableDrivers().map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.license_number}
                    </option>
                  ))}
                </select>
                <InputError message={errors.driver_id} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="ambulance_id" value="Select Ambulance" required={true} />
                <select
                  id="ambulance_id"
                  name="ambulance_id"
                  value={formData.ambulance_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                  required
                >
                  <option value="">Select an ambulance</option>
                  {getAvailableAmbulances().map(ambulance => (
                    <option key={ambulance.id} value={ambulance.id}>
                      {ambulance.registration_number} - {ambulance.type}
                    </option>
                  ))}
                </select>
                <InputError message={errors.ambulance_id} className="mt-2" />
              </div>
            </div>

            <div>
              <InputLabel htmlFor="start_date" value="Assignment Start Date" required={true} />
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                required
              />
              <InputError message={errors.start_date} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="notes" value="Assignment Notes" />
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                placeholder="Add any special instructions or notes about this assignment"
              />
              <InputError message={errors.notes} className="mt-2" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 bg-medical-gray-50 border-t border-medical-gray-200 rounded-b-lg">
          <SecondaryButton onClick={onClose} className="mr-3">
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={processing}>
            {processing ? 'Saving...' : currentAssignment ? 'Update Assignment' : 'Create Assignment'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
