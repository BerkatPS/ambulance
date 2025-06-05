import React from 'react';
import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
  const baseClasses = "w-full flex items-start pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out";
  const activeClasses = active
    ? "border-primary-400 text-primary-700 bg-primary-50 focus:text-primary-800 focus:bg-primary-100 focus:border-primary-700"
    : "border-transparent text-medical-gray-600 hover:text-medical-gray-800 hover:bg-medical-gray-50 hover:border-medical-gray-300 focus:text-medical-gray-800 focus:bg-medical-gray-50 focus:border-medical-gray-300";

  return (
    <Link
      {...props}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {children}
    </Link>
  );
}

// Responsive Nav Button for dropdown actions
ResponsiveNavLink.Button = function ResponsiveNavButton({ active = false, className = '', children, ...props }) {
  const baseClasses = "w-full flex items-start pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out";
  const activeClasses = active
    ? "border-primary-400 text-primary-700 bg-primary-50 focus:text-primary-800 focus:bg-primary-100 focus:border-primary-700"
    : "border-transparent text-medical-gray-600 hover:text-medical-gray-800 hover:bg-medical-gray-50 hover:border-medical-gray-300 focus:text-medical-gray-800 focus:bg-medical-gray-50 focus:border-medical-gray-300";

  return (
    <button
      {...props}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {children}
    </button>
  );
};
