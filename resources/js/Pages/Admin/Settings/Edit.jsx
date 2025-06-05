import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';import { 
    CogIcon, 
    BellIcon, 
    LockClosedIcon, 
    GlobeAltIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';

export default function SettingsEdit({ auth, notifications, settings }) {
    const [activeTab, setActiveTab] = useState('general');
    
    const { data, setData, post, processing, errors } = useForm({
        site_description: settings?.site_description || 'Online ambulance booking service',
        contact_email: settings?.contact_email || 'contact@ambulance-portal.com',
        contact_phone: settings?.contact_phone || '+62 812 3456 7890',
        business_address: settings?.business_address || 'Jl. Gatot Subroto No. 123, Jakarta Selatan',
        currency: settings?.currency || 'IDR',
        tax_percentage: settings?.tax_percentage || '11',
        booking_fee: settings?.booking_fee || '10000',
        enable_notifications: settings?.enable_notifications || true,
        notification_email: settings?.notification_email || true,
        notification_sms: settings?.notification_sms || true,
        notification_push: settings?.notification_push || true,
        maintenance_mode: settings?.maintenance_mode || false,
        privacy_policy: settings?.privacy_policy || '',
        terms_of_service: settings?.terms_of_service || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Settings updated successfully');
            }
        });
    };
    
    const tabs = [
        { name: 'General', value: 'general', icon: CogIcon },
        { name: 'Notifications', value: 'notifications', icon: BellIcon },
        { name: 'Payment', value: 'payment', icon: CreditCardIcon },
        { name: 'Privacy & Terms', value: 'privacy', icon: LockClosedIcon },
        { name: 'Region & Language', value: 'region', icon: GlobeAltIcon },
    ];
    
    return (
        <AdminDashboardLayout
            title="Edit Settings"
            user={auth.user}
            notifications={notifications}
        >
            <Head title="Edit Settings" />
            
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your application settings and configurations.
                    </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">Select a tab</label>
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                        >
                            {tabs.map((tab) => (
                                <option key={tab.value} value={tab.value}>{tab.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="hidden sm:block border-b border-slate-100">
                        <div className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    className={`
                                        flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium flex items-center justify-center
                                        ${activeTab === tab.value 
                                            ? 'border-primary-600 text-primary-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                    onClick={() => setActiveTab(tab.value)}
                                >
                                    <tab.icon 
                                        className={`mr-2 h-5 w-5 ${activeTab === tab.value ? 'text-primary-600' : 'text-gray-400'}`} 
                                        aria-hidden="true" 
                                    />
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="p-6 space-y-6">
                                <div className="border-b border-slate-100 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        General settings for your application.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                                            Site Name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="site_name"
                                                id="site_name"
                                                value={data.site_name}
                                                onChange={(e) => setData('site_name', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.site_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.site_name}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                                            Contact Email
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="email"
                                                name="contact_email"
                                                id="contact_email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.contact_email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                                            Contact Phone
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="contact_phone"
                                                id="contact_phone"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.contact_phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-6">
                                        <label htmlFor="site_description" className="block text-sm font-medium text-gray-700">
                                            Site Description
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="site_description"
                                                name="site_description"
                                                rows={3}
                                                value={data.site_description}
                                                onChange={(e) => setData('site_description', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.site_description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.site_description}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-6">
                                        <label htmlFor="business_address" className="block text-sm font-medium text-gray-700">
                                            Business Address
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="business_address"
                                                name="business_address"
                                                rows={3}
                                                value={data.business_address}
                                                onChange={(e) => setData('business_address', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.business_address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="maintenance_mode"
                                                    name="maintenance_mode"
                                                    type="checkbox"
                                                    checked={data.maintenance_mode}
                                                    onChange={(e) => setData('maintenance_mode', e.target.checked)}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="maintenance_mode" className="font-medium text-gray-700">
                                                    Maintenance Mode
                                                </label>
                                                <p className="text-gray-500">Enable maintenance mode to show a maintenance page to visitors.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="p-6 space-y-6">
                                <div className="border-b border-slate-100 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Configure how and when notifications are sent.
                                    </p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="enable_notifications"
                                                name="enable_notifications"
                                                type="checkbox"
                                                checked={data.enable_notifications}
                                                onChange={(e) => setData('enable_notifications', e.target.checked)}
                                                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="enable_notifications" className="font-medium text-gray-700">
                                                Enable Notifications
                                            </label>
                                            <p className="text-gray-500">Enable all notifications system-wide.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pl-7 space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="notification_email"
                                                    name="notification_email"
                                                    type="checkbox"
                                                    checked={data.notification_email}
                                                    onChange={(e) => setData('notification_email', e.target.checked)}
                                                    disabled={!data.enable_notifications}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="notification_email" className="font-medium text-gray-700">
                                                    Email Notifications
                                                </label>
                                                <p className="text-gray-500">Send notifications via email.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="notification_sms"
                                                    name="notification_sms"
                                                    type="checkbox"
                                                    checked={data.notification_sms}
                                                    onChange={(e) => setData('notification_sms', e.target.checked)}
                                                    disabled={!data.enable_notifications}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="notification_sms" className="font-medium text-gray-700">
                                                    SMS Notifications
                                                </label>
                                                <p className="text-gray-500">Send notifications via SMS.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="notification_push"
                                                    name="notification_push"
                                                    type="checkbox"
                                                    checked={data.notification_push}
                                                    onChange={(e) => setData('notification_push', e.target.checked)}
                                                    disabled={!data.enable_notifications}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="notification_push" className="font-medium text-gray-700">
                                                    Push Notifications
                                                </label>
                                                <p className="text-gray-500">Send browser push notifications.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div className="p-6 space-y-6">
                                <div className="border-b border-slate-100 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Configure payment options and fees.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                            Currency
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="currency"
                                                name="currency"
                                                value={data.currency}
                                                onChange={(e) => setData('currency', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="IDR">Indonesian Rupiah (IDR)</option>
                                                <option value="USD">US Dollar (USD)</option>
                                                <option value="EUR">Euro (EUR)</option>
                                                <option value="SGD">Singapore Dollar (SGD)</option>
                                            </select>
                                        </div>
                                        {errors.currency && (
                                            <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="tax_percentage" className="block text-sm font-medium text-gray-700">
                                            Tax Percentage (%)
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="number"
                                                name="tax_percentage"
                                                id="tax_percentage"
                                                value={data.tax_percentage}
                                                onChange={(e) => setData('tax_percentage', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.tax_percentage && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tax_percentage}</p>
                                        )}
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="booking_fee" className="block text-sm font-medium text-gray-700">
                                            Booking Fee
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="number"
                                                name="booking_fee"
                                                id="booking_fee"
                                                value={data.booking_fee}
                                                onChange={(e) => setData('booking_fee', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        {errors.booking_fee && (
                                            <p className="mt-1 text-sm text-red-600">{errors.booking_fee}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Privacy & Terms Settings */}
                        {activeTab === 'privacy' && (
                            <div className="p-6 space-y-6">
                                <div className="border-b border-slate-100 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900">Privacy & Terms</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage your privacy policy and terms of service.
                                    </p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="privacy_policy" className="block text-sm font-medium text-gray-700">
                                            Privacy Policy
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="privacy_policy"
                                                name="privacy_policy"
                                                rows={10}
                                                value={data.privacy_policy}
                                                onChange={(e) => setData('privacy_policy', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Enter your privacy policy here..."
                                            />
                                        </div>
                                        {errors.privacy_policy && (
                                            <p className="mt-1 text-sm text-red-600">{errors.privacy_policy}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="terms_of_service" className="block text-sm font-medium text-gray-700">
                                            Terms of Service
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="terms_of_service"
                                                name="terms_of_service"
                                                rows={10}
                                                value={data.terms_of_service}
                                                onChange={(e) => setData('terms_of_service', e.target.value)}
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Enter your terms of service here..."
                                            />
                                        </div>
                                        {errors.terms_of_service && (
                                            <p className="mt-1 text-sm text-red-600">{errors.terms_of_service}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Region & Language Settings */}
                        {activeTab === 'region' && (
                            <div className="p-6 space-y-6">
                                <div className="border-b border-slate-100 pb-6">
                                    <h3 className="text-lg font-medium text-gray-900">Region & Language</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Configure regional settings and language options.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="default_language" className="block text-sm font-medium text-gray-700">
                                            Default Language
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="default_language"
                                                name="default_language"
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                defaultValue="id"
                                            >
                                                <option value="id">Bahasa Indonesia</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                                            Timezone
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="timezone"
                                                name="timezone"
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                defaultValue="Asia/Jakarta"
                                            >
                                                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                                                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                                                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                                                <option value="UTC">UTC</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="date_format" className="block text-sm font-medium text-gray-700">
                                            Date Format
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="date_format"
                                                name="date_format"
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                defaultValue="DD/MM/YYYY"
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:col-span-3">
                                        <label htmlFor="time_format" className="block text-sm font-medium text-gray-700">
                                            Time Format
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="time_format"
                                                name="time_format"
                                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                defaultValue="24"
                                            >
                                                <option value="12">12 Hour (AM/PM)</option>
                                                <option value="24">24 Hour</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="px-6 py-3 bg-slate-50 text-right">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                disabled={processing}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
