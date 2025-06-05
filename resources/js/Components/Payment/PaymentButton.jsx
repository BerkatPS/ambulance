import React from 'react';
import { Link } from '@inertiajs/react';

export default function PaymentButton({ 
  type = 'button', 
  className = '', 
  processing = false, 
  disabled = false, 
  children, 
  href = null,
  method = 'post',
  data = {},
  as = 'button',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-medium text-sm text-white tracking-wide hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150 ease-in-out shadow-button';
  
  const processingClasses = processing ? 'opacity-80 cursor-wait' : '';
  const disabledClasses = disabled ? 'opacity-70 cursor-not-allowed' : '';
  
  const finalClasses = `${baseClasses} ${processingClasses} ${disabledClasses} ${className}`;

  // If we have an href, render as a Link
  if (href) {
    return (
      <Link
        href={href}
        method={method}
        data={data}
        as={as}
        className={finalClasses}
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  // Otherwise render as a button
  return (
    <button
      type={type}
      className={finalClasses}
      disabled={disabled || processing}
      {...props}
    >
      {processing && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
