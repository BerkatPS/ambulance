import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import TestNotificationButton from '@/Components/TestNotificationButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({ 
  title, 
  children, 
  user, 
  currentRoute,
  notifications = [],
  maintenanceMode = false 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Head title={title} />
      
      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 transition-all duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <AdminSidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            currentRoute={currentRoute}
            user={user}
          />
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <AdminHeader 
            user={user} 
            notifications={notifications} 
            setSidebarOpen={setSidebarOpen}
            title={title}
          />
          
          <main className="flex-1 overflow-y-auto bg-slate-50 pb-8">
            <div className="pt-6 transition-all duration-200 ease-in-out">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Test Notification Button */}
                <div className="mb-6 flex justify-end">
                  <TestNotificationButton className="shadow-sm" />
                </div>
                
                {/* Maintenance mode alert */}
                {maintenanceMode && (
                  <div className="mb-6 rounded-xl bg-amber-50 p-4 border-l-4 border-amber-400 shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Maintenance Mode Active</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>The system is currently in maintenance mode. Some features may be temporarily unavailable.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Page content */}
                <div className={`transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                  {children}
                </div>
              </div>
            </div>
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Ambulance Portal. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Help Center</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
