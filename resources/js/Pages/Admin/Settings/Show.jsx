import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Settings({ auth, admin, settings }) {
    const { data, setData, errors, put, processing } = useForm({
        theme: settings.theme,
        language: settings.language,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        put(route('admin.settings.update'), {
            onSuccess: () => {
                toast.success('Settings updated successfully');
            },
        });
    };

    return (
        <AdminDashboardLayout title="Settings">
            <Head title="Settings" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-8 divide-y divide-gray-200">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Preferences</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Configure your application preferences.
                                        </p>
                                        
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            <div className="sm:col-span-6">
                                                <div className="flex items-start">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id="notifications_enabled"
                                                            name="notifications_enabled"
                                                            type="checkbox"
                                                            checked={data.notifications_enabled}
                                                            onChange={(e) => setData('notifications_enabled', e.target.checked)}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor="notifications_enabled" className="font-medium text-gray-700">
                                                            Enable Notifications
                                                        </label>
                                                        <p className="text-gray-500">
                                                            Receive notifications about bookings, payments, and system updates.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Appearance</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Customize how the application looks.
                                            </p>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <fieldset>
                                                <legend className="text-base font-medium text-gray-900">Theme</legend>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="theme-light"
                                                            name="theme"
                                                            type="radio"
                                                            value="light"
                                                            checked={data.theme === 'light'}
                                                            onChange={() => setData('theme', 'light')}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Light
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="theme-dark"
                                                            name="theme"
                                                            type="radio"
                                                            value="dark"
                                                            checked={data.theme === 'dark'}
                                                            onChange={() => setData('theme', 'dark')}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Dark
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Language</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Select your preferred language.
                                            </p>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <select
                                                id="language"
                                                name="language"
                                                value={data.language}
                                                onChange={(e) => setData('language', e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="en">English</option>
                                                <option value="id">Indonesian</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Save Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
