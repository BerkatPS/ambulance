import React, { forwardRef, useEffect, useRef } from 'react';

const TextInput = forwardRef(({ 
  type = 'text', 
  className = '', 
  isFocused = false, 
  disabled = false, 
  error = false,
  icon = null,
  ...props 
}, ref) => {
  const input = ref ? ref : useRef();

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, [isFocused]);

  const baseClasses = "w-full rounded-md border-medical-gray-300 shadow-sm transition-colors focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50";
  const errorClasses = error ? "border-danger text-danger focus:border-danger focus:ring-danger-200" : "";
  const disabledClasses = disabled ? "bg-medical-gray-100 text-medical-gray-400 cursor-not-allowed" : "";
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-medical-gray-500">
          {icon}
        </div>
      )}
      <input
        {...props}
        type={type}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${icon ? 'pl-10' : ''} ${className}`}
        ref={input}
        disabled={disabled}
      />
    </div>
  );
});

export default TextInput;
