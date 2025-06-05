import React from 'react';

export default function ApplicationLogo({ className }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3"
      >
        <rect width="40" height="40" rx="8" fill="#FF624E" />
        <path d="M28 12H12V28H28V12Z" fill="white" />
        <path d="M21 15H19V19H15V21H19V25H21V21H25V19H21V15Z" fill="#FF624E" />
      </svg>
      <div className="flex flex-col">
        <span className="font-heading font-bold text-xl tracking-medical-heading text-foreground">Ambulance Portal</span>
        <span className="text-xs text-medical-gray-600 font-medium">Emergency Response System</span>
      </div>
    </div>
  );
}
