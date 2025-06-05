import React from 'react';
import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
  const baseClasses = "inline-flex items-center px-4 py-2 font-medium text-sm transition duration-150 ease-in-out";
  const activeClasses = active 
    ? "text-primary-600 font-semibold border-b-2 border-primary" 
    : "text-medical-gray-600 hover:text-primary-500 hover:border-b-2 hover:border-primary-300";

  return (
    <Link
      {...props}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {children}
    </Link>
  );
}
