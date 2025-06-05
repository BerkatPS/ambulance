import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import NotificationListener from '@/Components/NotificationListener';
import { formatDateDisplay } from '@/Utils/dateHelpers';
import { 
  BellIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  CogIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronRightIcon, 
  ClockIcon
} from '@heroicons/react/24/outline';

export default function NotificationsIndex({ auth, notifications, unreadCount }) {
  const [processing, setProcessing] = useState(false);
  const { post, delete: destroy } = useForm();
  
  const handleMarkAsRead = (id) => {
    setProcessing(true);
    post(route('admin.notifications.read', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Notifikasi ditandai sebagai telah dibaca');
        setProcessing(false);
      },
      onError: (errors) => {
        console.error('Error marking notification as read:', errors);
        setProcessing(false);
      }
    });
  };

  const handleMarkAllAsRead = () => {
    setProcessing(true);
    post(route('admin.notifications.read.all'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Semua notifikasi ditandai sebagai telah dibaca');
        setProcessing(false);
      },
      onError: (errors) => {
        console.error('Error marking all notifications as read:', errors);
        setProcessing(false);
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Notifikasi yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessing(true);
        destroy(route('admin.notifications.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire(
              'Terhapus!',
              'Notifikasi berhasil dihapus.',
              'success'
            );
            setProcessing(false);
          },
          onError: (errors) => {
            console.error('Error deleting notification:', errors);
            setProcessing(false);
            Swal.fire(
              'Gagal!',
              'Terjadi kesalahan saat menghapus notifikasi.',
              'error'
            );
          }
        });
      }
    });
  };
  
  // Handle pagination click with client-side navigation
  const handlePageClick = (url) => {
    if (url && !processing) {
      router.visit(url, { 
        preserveState: true,
        preserveScroll: true,
        only: ['notifications', 'unreadCount']
      });
    }
  };

  // Parse notification data from JSON if needed
  const parseNotificationData = (notification) => {
    if (!notification) {
      return { 
        id: null,
        type: '',
        title: 'Notifikasi', 
        message: 'Tidak ada detail',
        action_url: null,
        action_text: null,
        read: false,
        created_at: null,
        read_at: null,
        notifiable_type: null,
        notifiable_id: null
      };
    }

    let data = notification.data;

    // Initialize with default values
    let result = { 
      id: notification.id,
      type: notification.type || '',
      title: 'Notifikasi', 
      message: 'Tidak ada detail',
      action_url: null,
      action_text: null,
      read: notification.read_at !== null,
      created_at: notification.created_at,
      read_at: notification.read_at,
      notifiable_type: notification.notifiable_type,
      notifiable_id: notification.notifiable_id
    };

    // Handle string data (JSON)
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing notification data:', e);
        return result;
      }
    }

    // If data is undefined or null, return defaults
    if (!data) {
      return result;
    }

    // Merge data with default values
    return {
      ...result,
      title: data.title || result.title,
      message: data.message || data.content || result.message,
      action_url: data.action_url || null,
      action_text: data.action_text || null
    };
  };

  return (
    <AdminDashboardLayout
      title="Notifikasi"
      user={auth.user}
      notifications={notifications.data || []}
      unreadCount={unreadCount}
    >
      <Head title="Notifikasi" />
      
      {/* Real-time notification listener */}
      <NotificationListener 
        userType="admin"
        channelName={`admin.notifications.${auth.user.id}`}
        user={auth.user}
      />

      <div className="space-y-6">
        {/* Header section */}
        <div className="bg-white sm:rounded-xl shadow-sm px-4 sm:px-6 py-5 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <BellIcon className="h-7 w-7 text-primary-600 mr-3" />
              <div>
                <h1 className="text-lg font-semibold text-slate-800">Pusat Notifikasi</h1>
                <p className="text-sm text-slate-500">Kelola semua pemberitahuan sistem</p>
              </div>
              {unreadCount > 0 && (
                <span className="ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {unreadCount} belum dibaca
                </span>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={processing}
                className={`px-4 py-2 bg-primary-50 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium inline-flex items-center ${
                  processing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden border border-slate-100">
          {notifications.data && notifications.data.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notifications.data.map((rawNotification) => {
                const notification = parseNotificationData(rawNotification);
                return (
                  <div 
                    key={notification.id} 
                    className={`p-5 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-primary-50/50 border-l-4 border-l-primary-500' : 'bg-white'}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(notification.type).bg}`}>
                          {getTypeIcon(notification.type, getTypeColor(notification.type).text)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-semibold text-slate-800">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
                                  Baru
                                </span>
                              )}
                            </div>
                            
                            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                              {notification.message}
                            </p>
                            
                            <div className="mt-3 flex items-center flex-wrap gap-2">
                              {notification.action_url && notification.action_url !== '#' && notification.action_text && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!notification.read) {
                                      handleMarkAsRead(notification.id);
                                    }
                                    router.visit(notification.action_url);
                                  }}
                                  disabled={processing}
                                  className={`inline-flex items-center text-sm text-primary-600 hover:text-primary-800 font-medium bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors ${
                                    processing ? 'opacity-70 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {notification.action_text}
                                  <ChevronRightIcon className="ml-1 w-4 h-4" />
                                </button>
                              )}
                              
                              {!notification.read && (
                                <button 
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={processing}
                                  className={`text-sm text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors ${
                                    processing ? 'opacity-70 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                  Tandai telah dibaca
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleDelete(notification.id)}
                                disabled={processing}
                                className={`text-sm text-danger-600 hover:text-danger-800 flex items-center gap-1.5 bg-danger-50 hover:bg-danger-100 px-3 py-1.5 rounded-lg transition-colors ${
                                  processing ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                              >
                                <TrashIcon className="h-4 w-4" />
                                Hapus
                              </button>
                            </div>
                          </div>
                          
                          {/* Timestamp and type */}
                          <div className="flex flex-col items-end gap-1 mt-3 md:mt-0 md:ml-4">
                            <div className="flex items-center text-xs text-slate-500 whitespace-nowrap">
                              <ClockIcon className="mr-1 h-3.5 w-3.5" />
                              {formatDateDisplay(notification.created_at, 'id-ID')}
                            </div>
                            
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type).badge}`}>
                              {getTypeName(notification.type)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <BellIcon className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">Tidak ada notifikasi</h3>
              <p className="text-slate-500">Anda tidak memiliki notifikasi saat ini.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {notifications.data && notifications.data.length > 0 && notifications.links && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white sm:rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="text-sm text-slate-600 mb-4 md:mb-0">
              Menampilkan <span className="font-medium">{notifications.from}</span> hingga <span className="font-medium">{notifications.to}</span> dari <span className="font-medium">{notifications.total}</span> notifikasi
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
              {notifications.links.map((link, index) => {
                // Parse the label to remove HTML entities
                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                
                // Only render clickable link if it has a URL
                if (!link.url && !link.active) {
                  return (
                    <span 
                      key={index}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border bg-white text-slate-400 border-slate-200 opacity-50 cursor-not-allowed text-xs sm:text-sm"
                    >
                      {label}
                    </span>
                  );
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handlePageClick(link.url)}
                    disabled={processing || link.active}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border text-xs sm:text-sm ${
                      link.active
                        ? 'bg-primary-600 text-white border-primary-600 font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    } ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

// Helper function to get human-readable notification type name
function getTypeName(type) {
  if (!type) return 'Sistem';

  if (type.includes('BookingCreated') || type.includes('booking_created') || type.includes('Booking')) {
    return 'Booking';
  } else if (type.includes('BookingCancelled') || type.includes('booking_cancelled')) {
    return 'Pembatalan';
  } else if (type.includes('PaymentReceived') || type.includes('payment_received') || type.includes('Payment')) {
    return 'Pembayaran';
  } else if (type.includes('DriverAssigned') || type.includes('driver_assigned') || type.includes('Driver')) {
    return 'Driver';
  } else if (type.includes('SystemNotification') || type.includes('system')) {
    return 'Sistem';
  } else if (type.includes('Alert') || type.includes('alert')) {
    return 'Peringatan';
  } else if (type.includes('Emergency') || type.includes('emergency')) {
    return 'Darurat';
  } else {
    return 'Sistem';
  }
}

// Helper functions for notification type styling
function getTypeColor(type) {
  if (!type) return {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-800',
  };

  // Handle Laravel notification class names
  if (type && type.includes && type.includes('\\Notifications\\')) {
    if (type.includes('Booking')) {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-600', 
        badge: 'bg-blue-100 text-blue-800',
      };
    } else if (type.includes('Payment')) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-800',
      };
    } else if (type.includes('Driver')) {
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800',
      };
    } else if (type.includes('System')) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-800',
      };
    } else if (type.includes('Alert') || type.includes('Emergency')) {
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-800',
      };
    }
  }

  // Legacy/fallback handling
  if (!type || typeof type !== 'string') return {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-800',
  };
  
  if (type.includes('BookingCreated') || type.includes('booking_created') || type.includes('booking')) {
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-600', 
      badge: 'bg-blue-100 text-blue-800',
    };
  } else if (type.includes('BookingCancelled') || type.includes('booking_cancelled')) {
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800',
    };
  } else if (type.includes('PaymentReceived') || type.includes('payment_received') || type.includes('payment')) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-600',
      badge: 'bg-green-100 text-green-800',
    };
  } else if (type.includes('DriverAssigned') || type.includes('driver_assigned') || type.includes('driver')) {
    return {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-800',
    };
  } else if (type.includes('SystemNotification') || type.includes('system')) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800',
    };
  } else if (type.includes('Alert') || type.includes('alert') || type.includes('Emergency') || type.includes('emergency')) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-600',
      badge: 'bg-red-100 text-red-800',
    };
  } else {
    return {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      badge: 'bg-slate-100 text-slate-800',
    };
  }
}

function getTypeIcon(type, textColorClass) {
  const iconClass = `h-5 w-5 ${textColorClass}`;

  if (!type) return <BellIcon className={iconClass} />;

  // Handle Laravel notification class names
  if (type && type.includes && type.includes('\\Notifications\\')) {
    if (type.includes('Booking')) {
      return <CalendarIcon className={iconClass} />;
    } else if (type.includes('Payment')) {
      return <CreditCardIcon className={iconClass} />;
    } else if (type.includes('Driver')) {
      return <UserIcon className={iconClass} />;
    } else if (type.includes('System')) {
      return <CogIcon className={iconClass} />;
    } else if (type.includes('Alert') || type.includes('Emergency')) {
      return <ExclamationTriangleIcon className={iconClass} />;
    }
  }

  // Legacy/fallback handling
  if (!type || typeof type !== 'string') return <BellIcon className={iconClass} />;
  
  if (type.includes('Booking') || type.includes('booking')) {
    return <CalendarIcon className={iconClass} />;
  } else if (type.includes('Payment') || type.includes('payment')) {
    return <CreditCardIcon className={iconClass} />;
  } else if (type.includes('Driver') || type.includes('driver')) {
    return <UserIcon className={iconClass} />;
  } else if (type.includes('System') || type.includes('system')) {
    return <CogIcon className={iconClass} />;
  } else if (type.includes('Alert') || type.includes('alert') || type.includes('Emergency') || type.includes('emergency')) {
    return <ExclamationTriangleIcon className={iconClass} />;
  } else {
    return <BellIcon className={iconClass} />;
  }
}
