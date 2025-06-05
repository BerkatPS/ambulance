import React from 'react';
import TextInput from '../Common/TextInput';
import InputLabel from '../Common/InputLabel';
import InputError from '../Common/InputError';

export default function PatientInfoForm({ data, errors, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-medical">
        <h2 className="text-xl font-heading font-semibold text-medical-gray-800 mb-4">
          Patient Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <InputLabel htmlFor="patient_name" value="Full Name" required={true} />
            <TextInput
              id="patient_name"
              name="patient_name"
              value={data.patient_name || ''}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
            <InputError message={errors.patient_name} className="mt-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="age" value="Age" required={true} />
              <TextInput
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                value={data.age || ''}
                onChange={handleChange}
                className="mt-1 block w-full"
                required
              />
              <InputError message={errors.age} className="mt-2" />
            </div>
            
            <div>
              <InputLabel htmlFor="gender" value="Gender" required={true} />
              <select
                id="gender"
                name="gender"
                value={data.gender || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              <InputError message={errors.gender} className="mt-2" />
            </div>
          </div>
          
          <div>
            <InputLabel htmlFor="medical_conditions" value="Medical Conditions" />
            <textarea
              id="medical_conditions"
              name="medical_conditions"
              value={data.medical_conditions || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
              placeholder="Please list any medical conditions, allergies, or special requirements"
            />
            <InputError message={errors.medical_conditions} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="ambulance_type" value="Type of Ambulance" required={true} />
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'basic', name: 'Basic Life Support', description: 'For stable patients requiring basic medical care' },
                { id: 'advanced', name: 'Advanced Life Support', description: 'For patients requiring advanced medical equipment' },
                { id: 'neonatal', name: 'Neonatal', description: 'Specialized for newborn babies' },
                { id: 'patient_transport', name: 'Patient Transport', description: 'For non-emergency transportation' }
              ].map((type) => (
                <div 
                  key={type.id}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                    data.ambulance_type === type.id 
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' 
                      : 'border-medical-gray-200 hover:border-medical-gray-300'
                  }`}
                  onClick={() => handleChange({ target: { name: 'ambulance_type', value: type.id } })}
                >
                  <div className="flex items-start">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      data.ambulance_type === type.id ? 'bg-primary-500' : 'border border-medical-gray-300'
                    }`}>
                      {data.ambulance_type === type.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        data.ambulance_type === type.id ? 'text-primary-700' : 'text-medical-gray-700'
                      }`}>
                        {type.name}
                      </p>
                      <p className={`text-xs ${
                        data.ambulance_type === type.id ? 'text-primary-600' : 'text-medical-gray-500'
                      }`}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <InputError message={errors.ambulance_type} className="mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
