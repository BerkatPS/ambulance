import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import TextInput from '../Common/TextInput';
import InputLabel from '../Common/InputLabel';
import InputError from '../Common/InputError';
import PrimaryButton from '../Common/PrimaryButton';
import SecondaryButton from '../Common/SecondaryButton';

export default function DriverModal({
  show = false,
  driver = null,
  errors = {},
  mode = 'view', // view, edit, create
  processing = false,
  onClose,
  onSave,
  onDeactivate
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license_number: '',
    address: '',
    experience: '',
    certifications: '',
    status: 'active'
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
        license_number: driver.license_number || '',
        address: driver.address || '',
        experience: driver.experience ? String(driver.experience) : '',
        certifications: Array.isArray(driver.certifications) 
          ? driver.certifications.join(', ') 
          : driver.certifications || '',
        status: driver.status || 'active'
      });
    } else {
      // Reset form when creating a new driver
      setFormData({
        name: '',
        email: '',
        phone: '',
        license_number: '',
        address: '',
        experience: '',
        certifications: '',
        status: 'active'
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert certifications from comma-separated string to array
    const formattedData = {
      ...formData,
      certifications: formData.certifications
        ? formData.certifications.split(',').map(item => item.trim())
        : []
    };
    
    onSave(formattedData);
  };

  const getStatusOptions = () => {
    return [
      { value: 'active', label: 'Active' },
      { value: 'on_duty', label: 'On Duty' },
      { value: 'off_duty', label: 'Off Duty' },
      { value: 'inactive', label: 'Inactive' }
    ];
  };

  return (
    <Modal show={show} onClose={onClose} maxWidth="2xl">
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-medical-gray-900">
              {mode === 'create' ? 'Add New Driver' : 
               mode === 'edit' ? 'Edit Driver Information' : 'Driver Details'}
            </h2>
            {driver && driver.id && (
              <span className="text-sm text-medical-gray-600">
                Driver ID: {driver.id}
              </span>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {/* Status indicator for existing driver */}
            {driver && driver.id && (
              <div className="bg-medical-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                    {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-medical-gray-900">{driver.name}</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formData.status === 'active' ? 'bg-success-100 text-success-800' : 
                        formData.status === 'on_duty' ? 'bg-primary-100 text-primary-800' :
                        formData.status === 'off_duty' ? 'bg-medical-gray-100 text-medical-gray-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {formData.status === 'active' ? 'Active' :
                         formData.status === 'on_duty' ? 'On Duty' :
                         formData.status === 'off_duty' ? 'Off Duty' :
                         'Inactive'}
                      </span>
                      
                      {driver.rating && (
                        <div className="flex items-center ml-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-xs font-medium text-medical-gray-700">
                            {driver.rating} ({driver.total_trips || 0} trips)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form fields in grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="name" value="Full Name" required={true} />
                <TextInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="email" value="Email Address" required={true} />
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="phone" value="Phone Number" required={true} />
                <TextInput
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.phone} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="license_number" value="License Number" required={true} />
                <TextInput
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                  required
                />
                <InputError message={errors.license_number} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="experience" value="Experience (years)" />
                <TextInput
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.experience}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  disabled={mode === 'view'}
                />
                <InputError message={errors.experience} className="mt-2" />
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
            </div>

            <div>
              <InputLabel htmlFor="address" value="Address" />
              <TextInput
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full"
                disabled={mode === 'view'}
              />
              <InputError message={errors.address} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="certifications" value="Certifications" />
              <p className="text-xs text-medical-gray-500 mt-1">Separate multiple certifications with commas</p>
              <textarea
                id="certifications"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                disabled={mode === 'view'}
                placeholder="e.g. BLS, ACLS, PHTLS"
              />
              <InputError message={errors.certifications} className="mt-2" />
            </div>

            {driver && driver.current_ambulance && mode === 'view' && (
              <div className="bg-medical-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-medical-gray-700">Current Assignment</h3>
                <div className="mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-.8-.4L14 7v-2a1 1 0 00-1-1H3z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-medical-gray-900">
                      {driver.current_ambulance.registration_number}
                    </p>
                    <p className="text-xs text-medical-gray-500">
                      {driver.current_ambulance.type}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end p-6 bg-medical-gray-50 border-t border-medical-gray-200 rounded-b-lg">
          {mode !== 'view' ? (
            <>
              <SecondaryButton onClick={onClose} className="mr-3">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" className="ml-3" disabled={processing}>
                {processing ? 'Saving...' : 'Save Driver'}
              </PrimaryButton>
            </>
          ) : (
            <>
              {driver && driver.id && onDeactivate && (
                <SecondaryButton
                  onClick={() => onDeactivate(driver)}
                  className={`mr-3 ${
                    driver.status === 'inactive' 
                      ? '!bg-success-50 !text-success-700 hover:!bg-success-100' 
                      : '!bg-danger-50 !text-danger-700 hover:!bg-danger-100'
                  }`}
                >
                  {driver.status === 'inactive' ? 'Activate Driver' : 'Deactivate Driver'}
                </SecondaryButton>
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
