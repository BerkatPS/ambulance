import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import RatingForm from './RatingForm';

export default function RatingModal({ 
  isOpen, 
  onClose, 
  booking, 
  onSuccess 
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-medical-gray-900/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-medical-gray-400 hover:text-medical-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="bg-medical-gray-50 px-6 py-4 border-b border-medical-gray-200">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-medical-gray-900"
                  >
                    Rate Your Ambulance Experience
                  </Dialog.Title>
                  <p className="mt-1 text-sm text-medical-gray-600">
                    Your feedback helps us improve our service
                  </p>
                </div>
                
                <div className="px-6 py-5">
                  <RatingForm 
                    booking={booking} 
                    onSuccess={() => {
                      if (onSuccess) onSuccess();
                      onClose();
                    }} 
                  />
                </div>
                
                <div className="bg-medical-gray-50 px-6 py-4 border-t border-medical-gray-200 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-medical-gray-300 bg-white px-4 py-2 text-sm font-medium text-medical-gray-700 shadow-sm hover:bg-medical-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
