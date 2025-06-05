import React from 'react';

export default function SecondaryButton({ 
  type = 'button', 
  className = '', 
  disabled = false, 
  children, 
  icon = null,
  iconPosition = 'left',
  size = 'md',
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-60 disabled:cursor-not-allowed bg-white border border-secondary-300 hover:bg-secondary-50 active:bg-secondary-100 text-secondary-700 rounded-md shadow-sm";
  
  const sizeClasses = {
    'xs': 'text-xs px-2.5 py-1.5',
    'sm': 'text-sm px-3 py-2',
    'md': 'text-sm px-4 py-2.5',
    'lg': 'text-base px-5 py-3',
    'xl': 'text-lg px-6 py-3.5',
  };
  
  return (
    <button
      {...props}
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
}
