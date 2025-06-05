import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import UserSidebar from '@/Components/User/UserSidebar';
import UserHeader from '@/Components/User/UserHeader';
import { ToastContainer, toast } from 'react-toastify';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Handle flash messages
    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast container for notifications */}
            
            {/* Sidebar component for desktop and mobile */}
            <UserSidebar 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                user={user}
            />
            
            {/* Main content area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header */}
                <UserHeader 
                    setSidebarOpen={setSidebarOpen}
                    title={header}
                    user={user}
                />
                
                {/* Main content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
                
                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Ambulance Portal. All rights reserved.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                Terms of Service
                            </Link>
                            <Link href={route('support')} className="text-sm text-gray-500 hover:text-gray-700">
                                Support
                            </Link>
            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />                        </div>
            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />                    </div>
                </footer>
            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />            </div>
            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />        </div>
    );
}
