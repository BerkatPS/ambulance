import React from 'react';
import ApplicationLogo from './ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, showHeaderLinks = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-medical-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex-shrink-0">
              <ApplicationLogo className="block h-9 w-auto" />
            </Link>

            {showHeaderLinks && (
              <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
                <Link 
                  href={route('login')} 
                  className="text-sm text-medical-gray-700 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link 
                  href={route('register')} 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-medical-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
            <div className="flex items-center">
              <ApplicationLogo className="block h-8 w-auto" />
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <p className="text-sm text-medical-gray-600">
                &copy; {new Date().getFullYear()} Ambulance Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
