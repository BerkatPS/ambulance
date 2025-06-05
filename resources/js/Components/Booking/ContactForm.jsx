import React from 'react';
import TextInput from '../Common/TextInput';
import InputLabel from '../Common/InputLabel';
import InputError from '../Common/InputError';

export default function ContactForm({ data, errors, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-medical">
        <h2 className="text-xl font-heading font-semibold text-medical-gray-800 mb-4">
          Contact Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <InputLabel htmlFor="contact_name" value="Contact Person Name" required={true} />
            <TextInput
              id="contact_name"
              name="contact_name"
              value={data.contact_name || ''}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
            />
            <InputError message={errors.contact_name} className="mt-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="contact_phone" value="Phone Number" required={true} />
              <TextInput
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={data.contact_phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full"
                required
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                }
              />
              <InputError message={errors.contact_phone} className="mt-2" />
            </div>
            
            <div>
              <InputLabel htmlFor="contact_email" value="Email Address" required={true} />
              <TextInput
                id="contact_email"
                name="contact_email"
                type="email"
                value={data.contact_email || ''}
                onChange={handleChange}
                className="mt-1 block w-full"
                required
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
              <InputError message={errors.contact_email} className="mt-2" />
            </div>
          </div>
          
          <div className="bg-medical-gray-50 p-4 rounded-lg border border-medical-gray-200 mt-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="same_as_patient"
                  name="same_as_patient"
                  type="checkbox"
                  checked={data.same_as_patient || false}
                  onChange={(e) => handleChange({ 
                    target: { 
                      name: 'same_as_patient', 
                      value: e.target.checked 
                    } 
                  })}
                  className="h-4 w-4 rounded border-medical-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="same_as_patient" className="font-medium text-medical-gray-700">
                  Contact is the same as patient
                </label>
                <p className="text-medical-gray-500">Check this if you are the patient or booking for yourself</p>
              </div>
            </div>
          </div>
          
          <div>
            <InputLabel htmlFor="relationship" value="Relationship to Patient" />
            <select
              id="relationship"
              name="relationship"
              value={data.relationship || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-medical-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
              disabled={data.same_as_patient}
            >
              <option value="">Select Relationship</option>
              <option value="self">Self</option>
              <option value="family">Family Member</option>
              <option value="friend">Friend</option>
              <option value="caregiver">Caregiver</option>
              <option value="healthcare_professional">Healthcare Professional</option>
              <option value="other">Other</option>
            </select>
            <InputError message={errors.relationship} className="mt-2" />
          </div>
          
          <div>
            <InputLabel htmlFor="emergency_contact" value="Emergency Contact (Optional)" />
            <TextInput
              id="emergency_contact"
              name="emergency_contact"
              value={data.emergency_contact || ''}
              onChange={handleChange}
              className="mt-1 block w-full"
              placeholder="Name and phone number"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              }
            />
            <InputError message={errors.emergency_contact} className="mt-2" />
          </div>
        </div>
      </div>
      
      <div className="bg-medical-gray-50 p-4 rounded-lg border border-medical-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-medical-gray-800">Your information is secure</h3>
            <div className="mt-2 text-sm text-medical-gray-500">
              <p>We value your privacy. Your contact information will only be used for communication related to this booking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
