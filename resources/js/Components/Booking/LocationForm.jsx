import React, { useState } from 'react';
import TextInput from '../Common/TextInput';
import InputLabel from '../Common/InputLabel';
import InputError from '../Common/InputError';

export default function LocationForm({ data, errors, onChange }) {
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-medical">
        <h2 className="text-xl font-heading font-semibold text-medical-gray-800 mb-4">
          Location Details
        </h2>
        
        <div className="space-y-5">
          <div>
            <InputLabel htmlFor="pickup_location" value="Pickup Location" required={true} />
            <div className="mt-1 relative">
              <TextInput
                id="pickup_location"
                name="pickup_location"
                value={data.pickup_location || ''}
                onChange={handleChange}
                className="block w-full pr-10"
                placeholder="Enter pickup address"
                required
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                }
              />
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-500 hover:text-primary-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 1.586l-4 4V17h8V5.586l-4-4zM2 0h3v18H2V0zm15 0h3v18h-3V0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <InputError message={errors.pickup_location} className="mt-2" />
          </div>
          
          <div>
            <InputLabel htmlFor="dropoff_location" value="Dropoff Location" required={true} />
            <div className="mt-1 relative">
              <TextInput
                id="dropoff_location"
                name="dropoff_location"
                value={data.dropoff_location || ''}
                onChange={handleChange}
                className="block w-full pr-10"
                placeholder="Enter destination address"
                required
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                }
              />
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-500 hover:text-primary-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 1.586l-4 4V17h8V5.586l-4-4zM2 0h3v18H2V0zm15 0h3v18h-3V0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <InputError message={errors.dropoff_location} className="mt-2" />
          </div>

          {showMap && (
            <div className="mt-4 relative rounded-lg overflow-hidden border border-medical-gray-200 shadow-sm">
              <div className="h-72 bg-medical-gray-100 flex items-center justify-center">
                <div className="text-center px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-medical-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="mt-2 text-sm text-medical-gray-500">Map integration will be available soon.</p>
                  <p className="text-xs text-medical-gray-400">You can continue with manual address entry.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="pickup_date" value="Pickup Date" required={true} />
              <TextInput
                id="pickup_date"
                name="pickup_date"
                type="date"
                value={data.pickup_date || ''}
                onChange={handleChange}
                className="mt-1 block w-full"
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <InputError message={errors.pickup_date} className="mt-2" />
            </div>
            
            <div>
              <InputLabel htmlFor="pickup_time" value="Pickup Time" required={true} />
              <TextInput
                id="pickup_time"
                name="pickup_time"
                type="time"
                value={data.pickup_time || ''}
                onChange={handleChange}
                className="mt-1 block w-full"
                required
              />
              <InputError message={errors.pickup_time} className="mt-2" />
            </div>
          </div>
          
          <div>
            <InputLabel htmlFor="special_instructions" value="Special Instructions" />
            <textarea
              id="special_instructions"
              name="special_instructions"
              value={data.special_instructions || ''}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
              placeholder="Parking details, entrance information, etc."
            />
            <InputError message={errors.special_instructions} className="mt-2" />
          </div>
        </div>
      </div>
      
      <div className="bg-medical-gray-50 p-4 rounded-lg border border-medical-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-medical-gray-700">Distance Calculation</h3>
            <div className="mt-2 text-sm text-medical-gray-500">
              <p>The exact fare will be calculated based on the distance between pickup and dropoff locations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
