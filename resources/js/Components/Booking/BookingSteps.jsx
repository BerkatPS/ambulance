import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function BookingSteps({ currentStep = 1, totalSteps = 4 }) {
  const steps = [
    { id: 1, name: 'Patient Info' },
    { id: 2, name: 'Location' },
    { id: 3, name: 'Contact' },
    { id: 4, name: 'Summary' },
  ];

  return (
    <div className="w-full py-4 px-2 sm:px-0">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {step.id < currentStep ? (
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600">
                    <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-primary-600 mt-2">{step.name}</span>
                  
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 right-0 h-0.5 w-8 sm:w-16 bg-primary-600" aria-hidden="true" />
                  )}
                </div>
              ) : step.id === currentStep ? (
                <div className="flex flex-col items-center relative">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-500 bg-white text-primary-500">
                    <span className="text-sm font-medium">{step.id}</span>
                  </span>
                  <span className="text-sm font-medium text-primary-500 mt-2">{step.name}</span>
                  
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 right-0 h-0.5 w-8 sm:w-16 bg-medical-gray-300" aria-hidden="true" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-medical-gray-300 bg-white text-medical-gray-500">
                    <span className="text-sm font-medium">{step.id}</span>
                  </span>
                  <span className="text-sm font-medium text-medical-gray-500 mt-2">{step.name}</span>
                  
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 right-0 h-0.5 w-8 sm:w-16 bg-medical-gray-300" aria-hidden="true" />
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
