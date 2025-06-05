import React, { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';

export default function Toast({ 
  show = false, 
  type = 'success', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  position = 'bottom-right'
}) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const icons = {
    success: (
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-success/20 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    error: (
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-danger/20 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    warning: (
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-warning/20 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    info: (
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-info/20 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const positionClass = positions[position] || positions['bottom-right'];

  return (
    <Transition
      show={isVisible}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`fixed ${positionClass} z-50 max-w-sm w-full shadow-dropdown bg-white rounded-lg pointer-events-auto overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start">
            {icons[type]}
            <div className="ml-3 w-0 flex-1">
              {title && <p className="text-sm font-medium text-medical-gray-900">{title}</p>}
              {message && <p className="mt-1 text-sm text-medical-gray-600">{message}</p>}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => {
                  setIsVisible(false);
                  if (onClose) onClose();
                }}
                className="bg-white rounded-md inline-flex text-medical-gray-400 hover:text-medical-gray-500 focus:outline-none focus:text-medical-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`h-0.5 ${
          type === 'success' ? 'bg-success' :
          type === 'error' ? 'bg-danger' :
          type === 'warning' ? 'bg-warning' :
          'bg-info'
        }`}></div>
      </div>
    </Transition>
  );
}
