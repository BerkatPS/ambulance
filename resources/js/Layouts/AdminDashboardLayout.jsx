import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationToast from '@/Components/NotificationToast';
import NotificationListener from '@/Components/NotificationListener';
import axios from 'axios';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '@/Contexts/NotificationContext';

export default function AdminDashboardLayout({ title, children, user, notifications = [], unreadCount = 0, maintenanceMode = false }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [emergencyNotification, setEmergencyNotification] = useState(null);
    const [showEmergencyToast, setShowEmergencyToast] = useState(false);
    const [realtimeNotifications, setRealtimeNotifications] = useState([]);
    const { auth } = usePage().props;
    const adminUser = user || auth?.user;
    
    // Load saved notifications from localStorage on component mount
    useEffect(() => {
        setMounted(true);
        
        try {
            const savedNotifications = localStorage.getItem('adminNotifications');
            if (savedNotifications) {
                const parsedNotifications = JSON.parse(savedNotifications);
                // Only restore notifications that are less than 24 hours old
                const recentNotifications = parsedNotifications.filter(notification => {
                    const notifTime = new Date(notification.created_at || Date.now());
                    const currentTime = new Date();
                    const hoursDiff = (currentTime - notifTime) / (1000 * 60 * 60);
                    return hoursDiff < 24; // Keep notifications less than 24 hours old
                });
                
                setRealtimeNotifications(recentNotifications);
                
                // Get the most recent emergency notification if any exists
                const emergencyNotif = recentNotifications.find(n => {
                    const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                    return data?.type === 'emergency_booking';
                });
                
                if (emergencyNotif) {
                    const data = typeof emergencyNotif.data === 'string' ? 
                        JSON.parse(emergencyNotif.data) : emergencyNotif.data;
                    
                    setEmergencyNotification({
                        title: data.title || 'Peringatan Pemesanan Darurat',
                        message: data.message || `Pemesanan darurat baru`,
                        id: data.booking_id || null
                    });
                    
                    setShowEmergencyToast(true);
                }
            }
        } catch (error) {
            console.error('Failed to load saved notifications', error);
        }
    }, []);

    // Handle new notifications from the NotificationListener
    const handleNewNotification = (notification) => {
        try {
            // Parse notification data if it's a string
            const data = typeof notification.data === 'string' ? 
                JSON.parse(notification.data) : notification.data;
            
            // Add the notification to the realtime notifications list
            setRealtimeNotifications(prev => {
                // Check if this notification already exists
                const exists = prev.some(n => n.id === notification.id);
                if (exists) return prev;
                
                // Add to the beginning of the array
                const updatedNotifications = [notification, ...prev];
                
                // Save to localStorage
                localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
                
                return updatedNotifications;
            });
            
            // Special handling for emergency notifications
            if (data?.type === 'emergency_booking') {
                setEmergencyNotification({
                    title: data.title || 'Peringatan Pemesanan Darurat',
                    message: data.message || `Pemesanan darurat baru`,
                    id: data.booking_id || null
                });
                
                setShowEmergencyToast(true);
            }
        } catch (error) {
            console.error('Error processing new notification', error);
        }
    };

    // Set up realtime listeners for pusher
    useEffect(() => {
        if (adminUser) {
            // Listen for emergency bookings on the public channel
            window.Echo.channel('emergency-bookings')
                .listen('.emergency.booking.created', (data) => {
                    console.log('Emergency booking event received:', data);
                    
                    // Add to notifications list
                    const newNotification = {
                        id: Date.now(),
                        type: 'emergency_booking',
                        title: 'Pemesanan Darurat',
                        message: data.message || 'Ada pemesanan ambulans darurat baru',
                        created_at: new Date().toISOString(),
                        read_at: null,
                        data: {
                            type: 'emergency_booking',
                            action_url: data.action_url || route('admin.bookings.show', data.booking_id),
                            booking_id: data.booking_id
                        }
                    };
                    
                    // Update state and localStorage
                    setRealtimeNotifications(prev => [newNotification, ...prev]);
                    localStorage.setItem('adminNotifications', JSON.stringify([
                        newNotification, 
                        ...realtimeNotifications
                    ]));
                    
                    // Show emergency toast
                    setEmergencyNotification({
                        title: 'Pemesanan Darurat Baru',
                        message: data.message || 'Ada pemesanan ambulans darurat yang perlu ditangani segera!',
                        type: 'error',
                        actionUrl: data.action_url || route('admin.bookings.show', data.booking_id)
                    });
                    
                    setShowEmergencyToast(true);
                    
                    // Also show a toast notification
                    showImprovedNotificationToast({
                        title: 'Pemesanan Darurat Baru',
                        message: data.message || 'Ada pemesanan ambulans darurat baru',
                        type: 'emergency_booking',
                        data: {
                            type: 'emergency_booking',
                            action_url: data.action_url || route('admin.bookings.show', data.booking_id)
                        }
                    });
                });
                
            // Listen for admin notifications on the private channel
            window.Echo.private(`admin.notifications.${adminUser.id}`)
                .listen('.notification.created', (data) => {
                    console.log('Admin notification received:', data);
                    
                    if (data.notification) {
                        // Update state and localStorage
                        setRealtimeNotifications(prev => [data.notification, ...prev]);
                        localStorage.setItem('adminNotifications', JSON.stringify([
                            data.notification, 
                            ...realtimeNotifications
                        ]));
                        
                        // Show toast
                        showImprovedNotificationToast(data.notification);
                    }
                });
        }
        
        return () => {
            if (window.Echo) {
                window.Echo.leave('emergency-bookings');
                if (adminUser) {
                    window.Echo.leave(`admin.notifications.${adminUser.id}`);
                }
            }
        };
    }, [adminUser, realtimeNotifications]);
    
    // Close sidebar on route change
    useEffect(() => {
        const handleRouteChange = () => {
            setSidebarOpen(false);
        };

        document.addEventListener('inertia:navigate', handleRouteChange);

        return () => {
            document.removeEventListener('inertia:navigate', handleRouteChange);
        };
    }, []);
    
    const showImprovedNotificationToast = (notification) => {
        try {
            let data = notification.data;
            let actionUrl;
            let notifType = 'info';
            
            // Handle string data (JSON)
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.error('Error parsing notification data:', e);
                }
            }
            
            // Determine notification type based on data
            if (data) {
                if (data.type === 'emergency_booking') {
                    notifType = 'emergency';
                    actionUrl = data.action_url || route('admin.bookings.emergency');
                } else if (data.type === 'payment') {
                    notifType = 'payment';
                    actionUrl = data.action_url || route('admin.payments.index');
                } else if (data.type === 'booking') {
                    notifType = 'booking';
                    actionUrl = data.action_url || route('admin.bookings.index');
                }
            }
            
            // Use NotificationToast component with react-toastify
            toast((props) => (
                <NotificationToast
                    type={notifType}
                    title={notification.title || data?.title || 'Notifikasi Baru'}
                    message={notification.message || data?.message || notification.data}
                    actionUrl={actionUrl}
                    actionText={data?.action_text || 'Lihat Detail'}
                    onClose={props.closeToast}
                />
            ), {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
        } catch (error) {
            console.error('Error showing notification toast:', error);
        }
    };
    
    // Function to close emergency banner
    const closeEmergencyBanner = () => {
        setShowEmergencyToast(false);
    };
    
    // Function to handle click on emergency banner
    const handleEmergencyBannerClick = () => {
        if (emergencyNotification && emergencyNotification.actionUrl) {
            window.location.href = emergencyNotification.actionUrl;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title} />
            
            {/* Notification Listener */}
            {adminUser && (
                <NotificationListener 
                    userType="admin" 
                    user={adminUser}
                    onNewNotification={handleNewNotification}
                />
            )}
            
            <AdminSidebar 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                user={adminUser}
            />
            
            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
                <AdminSidebar 
                    sidebarOpen={false}
                    setSidebarOpen={() => {}}
                    user={adminUser}
                />
            </div>

            {/* Main content area */}
            <div className="lg:pl-72">
                <AdminHeader
                    setSidebarOpen={setSidebarOpen}
                    title={title}
                    user={adminUser}
                    notifications={realtimeNotifications}
                    unreadCount={unreadCount}
                />
                
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Maintenance mode banner */}
                        {maintenanceMode && (
                            <div className="mb-6 rounded-xl bg-yellow-50 p-4 border border-yellow-200">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Mode Pemeliharaan Aktif</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                Portal dalam mode pemeliharaan. Pengguna tidak dapat mengakses sistem saat ini.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Emergency notification banner */}
                        {showEmergencyToast && emergencyNotification && (
                            <div className="mb-6 relative">
                                <div
                                    onClick={handleEmergencyBannerClick}
                                    className="cursor-pointer rounded-xl bg-red-50 p-4 border border-red-200 shadow-sm"
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <h3 className="text-sm font-medium text-red-800">{emergencyNotification.title}</h3>
                                            <p className="mt-1 text-sm text-red-700">{emergencyNotification.message}</p>
                                            <div className="mt-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (emergencyNotification.actionUrl) {
                                                            window.location.href = emergencyNotification.actionUrl;
                                                        }
                                                    }}
                                                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                                                >
                                                    Lihat Sekarang
                                                </button>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 flex">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeEmergencyBanner();
                                                }}
                                                className="inline-flex rounded-md bg-red-50 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                <span className="sr-only">Tutup</span>
                                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Content container */}
                        <div className="space-y-6">
                            {/* Page title */}
                            {title && (
                                <div className="mb-6">
                                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                                </div>
                            )}
                            
                            {/* Page content */}
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Toast notifications container */}
            <ToastContainer />
        </div>
    );
}
