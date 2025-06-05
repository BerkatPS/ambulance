import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import UserSidebar from '@/Components/User/UserSidebar';
import UserHeader from '@/Components/User/UserHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon, ExclamationTriangleIcon, BellAlertIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import NotificationToast from '@/Components/NotificationToast';
import NotificationListener from '@/Components/NotificationListener';
import { useNotification } from '@/Contexts/NotificationContext';

export default function UserDashboardLayout({
    title,
    children,
    header,
    maintenanceMode = false,
    notifications = [],
    unreadCount = 0,
    isEmergencyPaymentDue = false,
    paymentReminderInterval = 5000
}) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showEmergencyButton, setShowEmergencyButton] = useState(true);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [realtimeNotifications, setRealtimeNotifications] = useState([]);
    const user = auth.user;

    // Load saved notifications from localStorage when component mounts
    useEffect(() => {
        setMounted(true);

        // Load saved notifications from localStorage
        try {
            const savedNotifications = localStorage.getItem('userNotifications');
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
                localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
                
                return updatedNotifications;
            });
        } catch (error) {
            console.error('Error processing new notification', error);
        }
    };

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        if (realtimeNotifications.length > 0) {
            try {
                localStorage.setItem('userNotifications', JSON.stringify(realtimeNotifications));
            } catch (error) {
                console.error('Error saving notifications to localStorage:', error);
            }
        }
    }, [realtimeNotifications]);

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

    // Close sidebar on window resize (for mobile)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        // Listen to notification events
        if (window.Echo && user) {
            const channel = window.Echo.private(`App.Models.User.${user.id}`);

            channel.notification((notification) => {
                console.log('Received notification:', notification);

                // Add notification to state for persistence
                setRealtimeNotifications(prev => {
                    // Check if notification already exists to avoid duplicates
                    const exists = prev.some(n =>
                        n.id === notification.id ||
                        (n.created_at === notification.created_at && n.type === notification.type)
                    );

                    if (!exists) {
                        return [...prev, notification];
                    }
                    return prev;
                });

                // Handle the notification
                showImprovedNotificationToast(notification);
            });

            return () => {
                channel.stopListening('notification');
            };
        }
    }, [user]);

    // Show emergency payment reminder periodically
    useEffect(() => {
        let reminderInterval = null;

        if (isEmergencyPaymentDue) {
            // Show initial reminder
            showEmergencyPaymentReminder();

            // Set interval for reminder
            reminderInterval = setInterval(() => {
                showEmergencyPaymentReminder();
            }, paymentReminderInterval);
        }

        return () => {
            if (reminderInterval) {
                clearInterval(reminderInterval);
            }
        };
    }, [isEmergencyPaymentDue, paymentReminderInterval]);

    // Function to display improved notification toast with NotificationToast component
    const showImprovedNotificationToast = (notification) => {
        // Parse notification data if needed
        const data = typeof notification.data === 'string'
            ? JSON.parse(notification.data)
            : notification.data;

        // Configure toast options
        const toastOptions = {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };

        // Determine notification type
        let notificationType = 'info';
        let actionUrl = null;
        let actionText = null;

        if (data) {
            if (data.type === 'payment_reminder' || data.type === 'payment') {
                notificationType = 'payment';
                actionUrl = data.action_url || route('user.payments.index');
                actionText = 'Lihat Pembayaran';
            } else if (data.type === 'emergency_booking') {
                notificationType = 'emergency';
                actionUrl = data.action_url;
                actionText = 'Lihat Detail';
            } else if (data.type === 'booking_confirmed' || data.type === 'booking') {
                notificationType = 'booking';
                actionUrl = data.action_url || route('user.bookings.index');
                actionText = 'Lihat Pemesanan';
            }
        }

        // Use NotificationToast component with react-toastify
        toast((props) => (
            <NotificationToast
                type={notificationType}
                title={data?.title || notification.title || 'Notifikasi Baru'}
                message={data?.message || notification.body || 'Anda memiliki notifikasi baru'}
                playSound={true}
                actionText={actionText}
                actionUrl={actionUrl}
                notification={notification}
                closeToast={props.closeToast}
            />
        ), toastOptions);
    };

    // Function to display notification toast (legacy - keeping for backwards compatibility)
    const showNotificationToast = (notification) => {
        // Format based on notification type
        const notifTypes = {
            'payment_reminder': {
                icon: <CreditCardIcon className="h-5 w-5 text-amber-500" />,
                className: 'border-l-4 border-amber-500'
            },
            'emergency_booking': {
                icon: <BellAlertIcon className="h-5 w-5 text-red-500" />,
                className: 'border-l-4 border-red-500'
            },
            'booking_confirmed': {
                icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
                className: 'border-l-4 border-green-500'
            },
            'default': {
                icon: <BellAlertIcon className="h-5 w-5 text-primary-500" />,
                className: 'border-l-4 border-primary-500'
            }
        };

        const data = typeof notification.data === 'string'
            ? JSON.parse(notification.data)
            : notification.data;

        const type = (data && data.type) || 'default';
        const config = notifTypes[type] || notifTypes['default'];

        toast(
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    {config.icon}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        {data?.title || notification.title || 'Notifikasi Baru'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {data?.message || notification.body || ''}
                    </p>
                </div>
            </div>,
            {
                className: config.className,
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            }
        );
    };

    // Show emergency payment reminder
    const showEmergencyPaymentReminder = () => {
        toast(
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <CreditCardIcon className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        Pembayaran Darurat Tertunda
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Mohon segera selesaikan pembayaran untuk layanan darurat Anda
                    </p>
                    <div className="mt-2">
                        <Link
                            href={route('user.payments.show')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Bayar Sekarang
                        </Link>
                    </div>
                </div>
            </div>,
            {
                className: 'border-l-4 border-red-500',
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
            }
        );
    };

    return (
        <div className="min-h-screen flex overflow-hidden bg-slate-50">
            <Head title={title || 'Dashboard Pengguna'} />

            {/* Toast notifications container */}
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
                limit={3}
                toastClassName="p-0 bg-transparent shadow-none rounded-none"
                bodyClassName="p-0 m-0"
                closeButton={false}
            />

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
                <UserSidebar
                    user={user}
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    onEmergencyClick={() => setShowEmergencyModal(true)}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <UserHeader
                    user={user}
                    setSidebarOpen={setSidebarOpen}
                    title={title || header}
                    notifications={notifications}
                    unreadCount={unreadCount}
                />

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto focus:outline-none bg-slate-50 pb-8">
                    <div className="pt-6 transition-all duration-200 ease-in-out">
                        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Peringatan mode pemeliharaan */}
                            {maintenanceMode && (
                                <div className="mb-6 sm:rounded-xl bg-amber-50 p-4 border-l-4 border-amber-400 shadow-sm">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="flex-shrink-0 flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div className="ml-0 sm:ml-3">
                                            <h3 className="text-sm font-medium text-amber-800">Mode Pemeliharaan Aktif</h3>
                                            <div className="mt-2 text-sm text-amber-700">
                                                <p>Sistem sedang dalam mode pemeliharaan. Beberapa fitur mungkin tidak tersedia untuk sementara waktu.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kartu akses cepat layanan darurat */}
                            <div className="mb-6 block lg:hidden">
                                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white sm:rounded-xl shadow-md overflow-hidden">
                                    <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 flex flex-col sm:flex-row justify-between items-center">
                                        <div className="sm:flex items-center mb-4 sm:mb-0 text-center sm:text-left">
                                            <div className="rounded-full bg-white/20 p-3 mr-4 hidden sm:block">
                                                <ExclamationTriangleIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Bantuan Darurat</h3>
                                                <p className="text-white/80 text-sm">Butuh bantuan segera? Hubungi layanan darurat kami</p>
                                            </div>
                                        </div>
                                        <Link href={route('user.bookings.create')} className="px-5 py-2 bg-white text-red-600 font-medium rounded-lg shadow-sm hover:bg-red-50 transition-colors duration-150 inline-flex items-center">
                                            Pesan Sekarang
                                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Bagian header */}
                            {header && (
                                <header className="mb-6">
                                    <div className="bg-white shadow-sm sm:rounded-xl px-4 sm:px-6 py-4">
                                        {header}
                                    </div>
                                </header>
                            )}

                            {/* Konten halaman */}
                            <div className={`transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-white shadow-sm sm:rounded-xl p-4 sm:p-6 lg:p-8">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between">
                        <p className="text-sm text-slate-500 mb-3 sm:mb-0">
                            &copy; {new Date().getFullYear()} Portal Ambulans. Hak cipta dilindungi undang-undang.
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
                            <a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Syarat Layanan</a>
                            <a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Pusat Bantuan</a>
                            <Link href={route('support')} className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Hubungi Dukungan</Link>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Notification Listener */}
            {user && (
                <NotificationListener 
                    userType="user" 
                    user={user}
                    onNewNotification={handleNewNotification}
                />
            )}

            {/* Emergency Call Button - Now visible on all devices */}
            {showEmergencyButton && (
                <div className="fixed bottom-4 right-4 z-50">
                    <button
                        onClick={() => setShowEmergencyModal(true)}
                        className="rounded-full bg-red-500 p-3 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300 animate-pulse"
                        aria-label="Panggilan Darurat"
                    >
                        <PhoneIcon className="h-6 w-6" />
                    </button>
                </div>
            )}

            {/* Emergency Modal - Improved UI */}
            {showEmergencyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white sm:rounded-xl max-w-md w-full overflow-hidden shadow-xl transform transition-all">
                        <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-4 py-5 sm:p-6 sm:pb-4">
                            <button
                                onClick={() => setShowEmergencyModal(false)}
                                className="absolute top-3 right-3 text-white hover:text-red-100 focus:outline-none bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white sm:mx-0 sm:h-10 sm:w-10">
                                    <PhoneIcon className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-white">Panggilan Darurat</h3>
                                    <div className="mt-1">
                                        <p className="text-sm text-red-100">
                                            Apakah Anda membutuhkan ambulans sekarang?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-5 sm:p-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Jika Anda atau seseorang di sekitar Anda berada dalam keadaan darurat medis,
                                silakan hubungi nomor darurat di bawah ini untuk mendapatkan bantuan segera:
                            </p>

                            <div className="space-y-3">
                                <a
                                    href="tel:119"
                                    className="w-full flex items-center justify-between px-4 py-3 bg-red-50 sm:rounded-lg hover:bg-red-100 transition-colors duration-150"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-500 rounded-full mr-3">
                                            <PhoneIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-900">Panggilan Darurat Nasional</div>
                                            <div className="text-xs text-gray-500">Nomor Darurat Nasional</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-red-600 text-lg">
                                        119
                                    </div>
                                </a>

                                <a
                                    href="tel:118"
                                    className="w-full flex items-center justify-between px-4 py-3 bg-red-50 sm:rounded-lg hover:bg-red-100 transition-colors duration-150"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-500 rounded-full mr-3">
                                            <PhoneIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-900">Ambulans</div>
                                            <div className="text-xs text-gray-500">Layanan Ambulans</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-red-600 text-lg">
                                        118
                                    </div>
                                </a>

                                <a
                                    href="tel:112"
                                    className="w-full flex items-center justify-between px-4 py-3 bg-red-50 sm:rounded-lg hover:bg-red-100 transition-colors duration-150"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-500 rounded-full mr-3">
                                            <PhoneIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-900">Nomor Darurat Terpadu</div>
                                            <div className="text-xs text-gray-500">Polisi, Ambulans, Pemadam Kebakaran</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-red-600 text-lg">
                                        112
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                                onClick={() => setShowEmergencyModal(false)}
                            >
                                Tutup
                            </button>
                            <Link
                                href={route('user.bookings.create')}
                                className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm transition-colors duration-150"
                            >
                                Pesan Ambulans
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
