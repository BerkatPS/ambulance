import React from 'react';

export default function InputLabel({ value, className = '', children, required = false, htmlFor, optional = false }) {
  return (
    <label htmlFor={htmlFor} className={`block font-medium text-sm text-medical-gray-800 mb-1.5 ${className}`}>
      {value ? value : children}
      {required && <span className="ml-1 text-danger">*</span>}
      {optional && <span className="ml-1 text-xs text-medical-gray-500 font-normal">(optional)</span>}
    </label>
  );
}
