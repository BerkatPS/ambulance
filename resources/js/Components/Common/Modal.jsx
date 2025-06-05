import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function Modal({
  children,
  show = false,
  maxWidth = '2xl',
  closeable = true,
  onClose = () => {},
  title = null,
  footer = null,
}) {
  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
  }[maxWidth];

  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto"
        onClose={closeable ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-medical-gray-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className={`mb-6 bg-white rounded-lg overflow-hidden shadow-dropdown ${maxWidthClass} w-full mx-4 sm:mx-auto`}>
            {title && (
              <div className="px-6 py-4 border-b border-medical-gray-200">
                <div className="text-lg font-semibold text-medical-gray-900 font-heading">{title}</div>
              </div>
            )}

            <div className="p-6">
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 bg-medical-gray-50 border-t border-medical-gray-200 flex justify-end space-x-3">
                {footer}
              </div>
            )}

            {closeable && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-medical-gray-400 hover:text-medical-gray-500 focus:outline-none focus:text-medical-gray-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
