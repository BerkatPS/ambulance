import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-primary-50 to-white">
      {/* Left side - Branding and info */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 text-white p-8 flex-col justify-between">
        <div>
          <div className="mb-8">
            <Link href="/">
              <ApplicationLogo className="h-16 w-auto" />
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-6">Ambulance Portal</h1>
          <p className="text-lg opacity-90 mb-8">
            Your trusted partner for emergency and scheduled medical transportation services.
          </p>

          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="bg-white text-primary-600 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium">24/7 Emergency Assistance</p>
              </div>
              <div className="flex items-center mb-4">
                <div className="bg-white text-primary-600 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium">Qualified Medical Professionals</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white text-primary-600 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium">Secure Patient Information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto text-sm opacity-75">
          &copy; {new Date().getFullYear()} Ambulance Portal. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="md:hidden mb-8 flex justify-center">
          <Link href="/">
            <ApplicationLogo className="h-16 w-auto" />
          </Link>
        </div>

        <div className="w-full max-w-md">
          {title && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-medical p-8 border border-gray-100">
            {children}
          </div>


        </div>
      </div>
    </div>
  );
}
