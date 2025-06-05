import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/Hooks/useToast';
import NotificationListener from '@/Components/NotificationListener';
import {
  BellIcon,
  TruckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function NotificationsIndex({ auth, notifications, unreadCount }) {
  const [processing, setProcessing] = useState(false);
  const { post, delete: destroy } = useForm();
  const { success } = useToast();

  const handleMarkAsRead = (id) => {
    setProcessing(true);
    post(route('user.notifications.read', id), {
      preserveScroll: true,
      onSuccess: () => {
        success('Notifikasi ditandai sebagai telah dibaca');
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
    post(route('user.notifications.read.all'), {
      preserveScroll: true,
      onSuccess: () => {
        success('Semua notifikasi ditandai sebagai telah dibaca');
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
        destroy(route('user.notifications.destroy', id), {
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

  // Parse notification data from JSON if needed
  const parseNotificationData = (notification) => {
    if (!notification) {
      return { title: 'Notifikasi', message: 'Tidak ada detail' };
    }

    let data = notification.data;

    // Initialize with default values
    let result = { 
      title: 'Notifikasi', 
      message: 'Tidak ada detail',
      action_url: null,
      action_text: null
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
    <UserDashboardLayout
      title="Notifikasi"
      unreadCount={unreadCount}
      notifications={notifications.data}
    >
      <Head title="Notifikasi" />

      {/* Real-time notification listener */}
      <NotificationListener
        userType="user"
        channelName={`user.notifications.${auth.user.id}`}
        user={auth.user}
      />

      <div className="space-y-6">
        {/* Header with title and actions */}
        <div className="bg-white sm:rounded-xl shadow-sm px-4 sm:px-6 py-5 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <BellIcon className="h-7 w-7 text-primary-600 mr-3" />
              <div>
                <h1 className="text-lg font-semibold text-slate-800">Pusat Notifikasi</h1>
                <p className="text-sm text-slate-500">Kelola semua pemberitahuan Anda</p>
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
              {notifications.data.map((notification) => {
                const data = parseNotificationData(notification);

                return (
                  <div
                    key={notification.id}
                    className={`p-5 hover:bg-slate-50 transition-colors ${!notification.read_at ? 'bg-primary-50/50 border-l-4 border-l-primary-500' : 'bg-white'}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                          <h3 className="text-base font-semibold text-slate-800 mb-1 md:mb-0 md:mr-2">
                            {data.title}
                          </h3>
                          <span className="text-xs text-slate-500 mb-2 md:mb-0 flex items-center">
                            <ClockIcon className="h-3.5 w-3.5 mr-1" />
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: id
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{data.message}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {data.action_url && data.action_text && (
                            <Link
                              href={data.action_url}
                              className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                              onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                            >
                              {data.action_text}
                              <ChevronRightIcon className="ml-1 w-4 h-4" />
                            </Link>
                          )}

                          {!notification.read_at && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={processing}
                              className={`px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors inline-flex items-center ${
                                processing ? 'opacity-70 cursor-not-allowed' : ''
                              }`}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                              Tandai Dibaca
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(notification.id)}
                            disabled={processing}
                            className={`px-3 py-1.5 text-sm text-danger-600 hover:text-danger-800 hover:bg-danger-50 rounded-lg transition-colors inline-flex items-center ${
                              processing ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            <TrashIcon className="h-4 w-4 mr-1.5" />
                            Hapus
                          </button>
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
              Menampilkan {notifications.from}-{notifications.to} dari {notifications.total} notifikasi
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
              {notifications.links.map((link, index) => {
                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                
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
                  <Link
                    key={index}
                    href={link.url}
                    className={`px-3 py-1.5 rounded border ${
                      link.active
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    preserveScroll
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

// Helper functions for notification type styling
function getTypeColor(type) {
  if (!type) return 'bg-slate-100 text-slate-600';

  // Handle Laravel notification class names
  if (type && type.includes && type.includes('\\Notifications\\')) {
    if (type.includes('Booking')) {
      return 'bg-primary-100 text-primary-600';
    } else if (type.includes('Payment')) {
      return 'bg-success-100 text-success-600';
    } else if (type.includes('Emergency') || type.includes('Alert')) {
      return 'bg-danger-100 text-danger-600';
    } else if (type.includes('System')) {
      return 'bg-info-100 text-info-600';
    } else if (type.includes('Driver')) {
      return 'bg-indigo-100 text-indigo-600';
    } else if (type.includes('User')) {
      return 'bg-purple-100 text-purple-600';
    }
  }

  // Legacy/fallback handling
  if (!type || typeof type !== 'string') return 'bg-slate-100 text-slate-600';
  
  switch (type.toLowerCase()) {
    case 'booking':
      return 'bg-primary-100 text-primary-600';
    case 'payment':
      return 'bg-success-100 text-success-600';
    case 'system':
      return 'bg-info-100 text-info-600';
    case 'alert':
      return 'bg-danger-100 text-danger-600';
    case 'emergency':
      return 'bg-danger-100 text-danger-600';
    case 'user':
      return 'bg-purple-100 text-purple-600';
    case 'driver':
      return 'bg-indigo-100 text-indigo-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function getTypeIcon(type) {
  if (!type) return <BellIcon className="h-6 w-6" />;

  // Handle Laravel notification class names
  if (type && type.includes && type.includes('\\Notifications\\')) {
    if (type.includes('Booking')) {
      return <TruckIcon className="h-6 w-6" />;
    } else if (type.includes('Payment')) {
      return <CreditCardIcon className="h-6 w-6" />;
    } else if (type.includes('Emergency') || type.includes('Alert')) {
      return <ExclamationCircleIcon className="h-6 w-6" />;
    } else if (type.includes('System')) {
      return <InformationCircleIcon className="h-6 w-6" />;
    } else if (type.includes('Driver')) {
      return <UserIcon className="h-6 w-6" />;
    } else if (type.includes('User')) {
      return <UserIcon className="h-6 w-6" />;
    }
  }

  // Legacy/fallback handling
  if (!type || typeof type !== 'string') return <BellIcon className="h-6 w-6" />;
  
  switch (type.toLowerCase()) {
    case 'booking':
      return <TruckIcon className="h-6 w-6" />;
    case 'payment':
      return <CreditCardIcon className="h-6 w-6" />;
    case 'system':
      return <InformationCircleIcon className="h-6 w-6" />;
    case 'alert':
    case 'emergency':
      return <ExclamationCircleIcon className="h-6 w-6" />;
    case 'user':
      return <UserIcon className="h-6 w-6" />;
    case 'driver':
      return <UserIcon className="h-6 w-6" />;
    default:
      return <BellIcon className="h-6 w-6" />;
  }
}
