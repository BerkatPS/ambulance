import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import DriverDashboardLayout from '@/Layouts/DriverDashboardLayout';
import {
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    MapPinIcon,
    PhoneIcon,
    StarIcon,
    TruckIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    NoSymbolIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const loadingCSS = `
@keyframes spinner {
    to {transform: rotate(360deg);}
}
.loader {
    width: 12px;
    height: 12px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spinner .6s linear infinite;
    margin: 0 auto;
}
`;

export default function Dashboard({ driver, stats, recent_bookings, emergency_bookings, ambulance, flash }) {
    // Valid status values
    const VALID_STATUSES = ['available', 'busy', 'off'];

    // Get CSRF token from Inertia page props
    const { props } = usePage();
    const csrfToken = props.csrf_token || '';

    const [emergencyBookings, setEmergencyBookings] = useState(emergency_bookings || []);
    const [isAcceptingEmergency, setIsAcceptingEmergency] = useState(false);

    // Check if driver has active bookings
    const hasActiveBookings = useMemo(() => {
        return recent_bookings && recent_bookings.some(booking =>
            booking.status !== 'completed' && booking.status !== 'cancelled'
        );
    }, [recent_bookings]);

    const determineInitialStatus = () => {
        if (driver?.status && VALID_STATUSES.includes(driver.status)) {
            return driver.status;
        }

        // Default fallback
        console.warn('Could not determine valid status from driver data, defaulting to available');
        return 'available';
    };

    const [status, setStatus] = useState(determineInitialStatus());
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
    });

    // Update status when driver data changes
    useEffect(() => {
        const newStatus = determineInitialStatus();
        if (newStatus !== status) {
            setStatus(newStatus);
        }
    }, [driver]);

    // Add a useEffect to watch for changes to the driver prop from Inertia
    useEffect(() => {
        if (driver && driver.status) {
            // Update local state if the driver prop changes from Inertia
            setStatus(driver.status);
            console.log(`Driver status updated from props: ${driver.status}`);
        }
    }, [driver]);

    // Display toast notification when flash message is present
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Set up Pusher listener untuk emergency bookings
    useEffect(() => {
        if (window.Echo) {
            const emergencyChannel = window.Echo.channel('booking.emergency');

            emergencyChannel.listen('EmergencyBookingCreated', (e) => {
                setEmergencyBookings(prevBookings => {
                    if (!prevBookings.some(booking => booking.id === e.booking.id)) {
                        const formattedBooking = {
                            ...e.booking,
                            formatted_requested_at: new Date(e.booking.requested_at).toLocaleString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            }),
                            time_since_request: 'Baru saja',
                            patient_name: e.booking.user?.name || 'Pasien Darurat',
                            pickup_address_short: e.booking.pickup_address?.substring(0, 50) +
                                (e.booking.pickup_address?.length > 50 ? '...' : '')
                        };

                        toast.info("Ada permintaan ambulans darurat baru!", {
                            autoClose: 10000
                        });

                        return [formattedBooking, ...prevBookings];
                    }
                    return prevBookings;
                });
            });

            emergencyChannel.listen('EmergencyBookingUpdated', (e) => {
                if (e.booking.status !== 'pending' || e.booking.driver_id) {
                    setEmergencyBookings(prevBookings =>
                        prevBookings.filter(booking => booking.id !== e.booking.id)
                    );
                }
            });

            return () => {
                emergencyChannel.stopListening('EmergencyBookingCreated');
                emergencyChannel.stopListening('EmergencyBookingUpdated');
            };
        }
    }, []);

    useEffect(() => {
        if (isUpdatingStatus) {
            const timer = setTimeout(() => {
                console.warn('Auto-resetting isUpdatingStatus after timeout');
                setIsUpdatingStatus(false);
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [isUpdatingStatus]);

    const getStatusColor = (statusValue) => {
        // Ensure we have a valid status
        const validStatus = VALID_STATUSES.includes(statusValue) ? statusValue : 'available';

        switch (validStatus) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800';
            case 'off':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper untuk mendapatkan ikon status driver
    const getStatusIcon = (status) => {
        switch (status) {
            case 'available':
                return <CheckCircleIcon className="h-5 w-5 text-current" />;
            case 'busy':
                return <BriefcaseIcon className="h-5 w-5 text-current" />;
            case 'off':
                return <NoSymbolIcon className="h-5 w-5 text-current" />;
            default:
                return <XCircleIcon className="h-5 w-5 text-current" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak ditentukan';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Tanggal tidak valid';

            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.toast.error('Error formatting date:', error);
            return 'Kesalahan format tanggal';
        }
    };

    const forceReload = () => {
        console.log('Force reloading page to refresh state');
        window.location.reload();
    };

    const updateDriverStatus = (newStatus) => {
        // Validate new status
        if (!VALID_STATUSES.includes(newStatus)) {
            console.error(`Invalid status value: ${newStatus}`);
            toast.error('Status tidak valid');
            return;
        }

        // If status is the same, don't do anything
        if (status === newStatus) {
            console.log(`Status already set to ${newStatus}`);
            return;
        }

        // Check if driver has active bookings
        if (hasActiveBookings) {
            toast.error('Anda tidak dapat mengubah status karena masih memiliki pesanan aktif. Selesaikan pesanan Anda terlebih dahulu.');
            return;
        }

        // Set loading state
        setIsUpdatingStatus(true);

        // Determine appropriate message based on status change
        let confirmMessage = `Apakah Anda yakin ingin mengubah status Anda menjadi ${getStatusTranslation(newStatus).toUpperCase()}?`;

        // Add specific warning for 'busy' status
        if (newStatus === 'busy') {
            confirmMessage = "Mengubah status Anda menjadi SIBUK akan membuat Anda tidak tersedia untuk pemesanan baru. Apakah Anda yakin ingin melanjutkan?";
        } else if (newStatus === 'off') {
            confirmMessage = "Mengubah status Anda menjadi TIDAK BERTUGAS akan membuat Anda tidak tersedia untuk semua pemesanan. Apakah Anda yakin ingin melanjutkan?";
        }

        Swal.fire({
            title: 'Perbarui Status',
            text: confirmMessage,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, perbarui!',
            cancelButtonText: 'Tidak, batalkan'
        }).then((result) => {
            if (result.isConfirmed) {
                // Log the request being sent
                console.log(`Sending status update request: ${newStatus}`);

                // Force reset isUpdatingStatus after 10 seconds in case of network issues
                const safetyTimer = setTimeout(() => {
                    console.warn('Safety timeout triggered - resetting isUpdatingStatus');
                    setIsUpdatingStatus(false);
                }, 10000);

                // Use Inertia's built-in form submission
                setData('status', newStatus);

                post(route('driver.update-status'), {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        // Clear safety timer
                        clearTimeout(safetyTimer);

                        // Update local state
                        setStatus(newStatus);
                        setIsUpdatingStatus(false);

                        console.log('Status update success:', newStatus);

                        // Show success message - with proper null checks
                        if (page?.props?.flash?.success) {
                            toast.success(page.props.flash.success);
                        } else {
                            toast.success(`Status berhasil diperbarui menjadi ${getStatusTranslation(newStatus).toUpperCase()}`);
                        }
                    },
                    onError: (errors) => {
                        // Clear safety timer
                        clearTimeout(safetyTimer);

                        console.toast.error('Status update error:', errors);
                        setIsUpdatingStatus(false);
                        toast.error('Gagal memperbarui status. Silakan coba lagi.');
                    },
                    onFinish: () => {
                        // Clear safety timer
                        clearTimeout(safetyTimer);

                        // Always ensure we reset isUpdatingStatus
                        setIsUpdatingStatus(false);
                    }
                });
            } else {
                // User canceled the dialog
                setIsUpdatingStatus(false);
            }
        });
    };

    const getBookingStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Menunggu</span>;
            case 'confirmed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Dikonfirmasi</span>;
            case 'in_progress':
            case 'dispatched':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Dalam Proses</span>;
            case 'arrived':
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Selesai</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Dibatalkan</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Tidak Diketahui</span>;
        }
    };

    const getStatusTranslation = (status) => {
        // Validate status before translating
        const validStatus = VALID_STATUSES.includes(status) ? status : 'available';

        switch (validStatus) {
            case 'available':
                return 'Tersedia';
            case 'busy':
                return 'Sibuk';
            case 'off':
                return 'Tidak Bertugas';
            default:
                return validStatus;
        }
    };

    const getBookingStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'dispatched':
                return 'bg-purple-100 text-purple-800';
            case 'arrived':
                return 'bg-teal-100 text-teal-800';
            case 'enroute':
                return 'bg-indigo-100 text-indigo-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const resetDriverStatus = (forcedStatus) => {
        try {
            console.log(`Forcing driver status reset to: ${forcedStatus}`);
            setIsUpdatingStatus(true);

            // Add safety timer for the reset function
            const safetyTimer = setTimeout(() => {
                console.warn('Safety timeout triggered in reset function - resetting isUpdatingStatus');
                setIsUpdatingStatus(false);
            }, 10000);

            // Use Inertia form for reliable CSRF handling
            setData('status', forcedStatus);
            setData('force_reset', true);

            post(route('driver.update-status'), {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Clear safety timer
                    clearTimeout(safetyTimer);

                    // Update local state
                    setStatus(forcedStatus);
                    setIsUpdatingStatus(false);

                    // Show success message
                    toast.success(`Status reset to ${getStatusTranslation(forcedStatus).toUpperCase()}`);
                },
                onError: (errors) => {
                    // Clear safety timer
                    clearTimeout(safetyTimer);

                    console.toast.error('Error forcing status reset:', errors);
                    setIsUpdatingStatus(false);
                    toast.error('Gagal reset status');
                },
                onFinish: () => {
                    // Clear safety timer
                    clearTimeout(safetyTimer);

                    // Always ensure we reset isUpdatingStatus
                    setIsUpdatingStatus(false);
                }
            });
        } catch (error) {
            console.toast.error('Error in resetDriverStatus:', error);
            setIsUpdatingStatus(false);
            toast.error('Gagal reset status');
        }
    };

    const renderStatusButtons = () => {
        return (
            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-slate-100 mb-6">
                <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-900">Status Ketersediaan</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => updateDriverStatus('available')}
                        disabled={isUpdatingStatus || status === 'available' || hasActiveBookings}
                        className={`relative px-4 py-3 rounded-lg shadow-sm transition-all ${
                            status === 'available'
                                ? 'bg-success-600 text-white'
                                : 'bg-white text-success-600 border border-success-200 hover:bg-success-50'
                        } ${
                            isUpdatingStatus || status === 'available' || hasActiveBookings
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            {getStatusIcon('available')}
                            <span className="ml-2 font-medium">Tersedia</span>
                        </div>
                        {isUpdatingStatus && status !== 'available' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-success-600 bg-opacity-20 rounded-lg">
                                <div className="loader"></div>
                            </div>
                        )}
                    </button>

                    <button
                        onClick={() => updateDriverStatus('busy')}
                        disabled={isUpdatingStatus || status === 'busy' || hasActiveBookings}
                        className={`relative px-4 py-3 rounded-lg shadow-sm transition-all ${
                            status === 'busy'
                                ? 'bg-warning-500 text-white'
                                : 'bg-white text-warning-500 border border-warning-200 hover:bg-warning-50'
                        } ${
                            isUpdatingStatus || status === 'busy' || hasActiveBookings
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            {getStatusIcon('busy')}
                            <span className="ml-2 font-medium">Sibuk</span>
                        </div>
                        {isUpdatingStatus && status !== 'busy' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-warning-500 bg-opacity-20 rounded-lg">
                                <div className="loader"></div>
                            </div>
                        )}
                    </button>

                    <button
                        onClick={() => updateDriverStatus('off')}
                        disabled={isUpdatingStatus || status === 'off' || hasActiveBookings}
                        className={`relative px-4 py-3 rounded-lg shadow-sm transition-all ${
                            status === 'off'
                                ? 'bg-danger-600 text-white'
                                : 'bg-white text-danger-600 border border-danger-200 hover:bg-danger-50'
                        } ${
                            isUpdatingStatus || status === 'off' || hasActiveBookings
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            {getStatusIcon('off')}
                            <span className="ml-2 font-medium">Tidak Bertugas</span>
                        </div>
                        {isUpdatingStatus && status !== 'off' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-danger-600 bg-opacity-20 rounded-lg">
                                <div className="loader"></div>
                            </div>
                        )}
                    </button>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    <p className="mb-2">
                        <span className="font-medium">Status saat ini: </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            <span className="ml-1">{getStatusTranslation(status)}</span>
                        </span>
                    </p>
                    <p>Catatan: Mengubah status Anda akan memengaruhi kemampuan Anda untuk menerima pemesanan baru. Saat Anda siap menerima tugas baru, atur status Anda menjadi "Tersedia".</p>
                </div>
            </div>
        );
    };

    const confirmReleaseAmbulance = () => {
        Swal.fire({
            title: 'Lepaskan Penugasan Ambulans?',
            text: 'Anda akan melepaskan penugasan ambulans. Tindakan ini akan mempengaruhi ketersediaan Anda untuk menerima pemesanan yang memerlukan ambulans.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lepaskan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                handleReleaseAmbulance();
            }
        });
    };

    const handleReleaseAmbulance = () => {
        post(route('driver.release-ambulance'), {
            onSuccess: () => {
                toast.success('Penugasan ambulans berhasil dilepaskan');
            },
            onError: (errors) => {
                toast.error(errors.message || 'Terjadi kesalahan saat melepaskan penugasan ambulans');
            }
        });
    };

    // Fungsi untuk menerima emergency booking
    const acceptEmergencyBooking = (bookingId) => {
        if (status !== 'available') {
            toast.error('Anda harus dalam status "Tersedia" untuk menerima booking darurat');
            return;
        }

        if (!ambulance) {
            toast.error('Anda harus terhubung dengan ambulans untuk menerima booking darurat');
            return;
        }

        setIsAcceptingEmergency(true);

        // Gunakan FormData untuk memastikan format data yang benar
        const formData = new FormData();
        formData.append('booking_id', bookingId);
        formData.append('_token', csrfToken);

        // Tampilkan pesan loading
        toast.info('Sedang memproses permintaan...', { autoClose: 2000 });

        axios.post(route('driver.accept-emergency-booking'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => {
            toast.success('Booking darurat berhasil diterima! Segera menuju lokasi penjemputan.');

            // Hapus booking ini dari daftar emergency
            setEmergencyBookings(prevBookings =>
                prevBookings.filter(booking => booking.id !== bookingId)
            );

            // Update status driver menjadi busy
            setStatus('busy');

            // Redirect ke halaman detail booking setelah delay singkat
            setTimeout(() => {
                window.location.href = route('driver.bookings.show', bookingId);
            }, 1500);
        })
        .catch(error => {
            console.error('Error accepting emergency booking:', error);

            let errorMessage = 'Gagal menerima booking darurat.';

            if (error.response) {
                // Request made and server responded
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 500) {
                    errorMessage = 'Terjadi kesalahan server. Silakan coba lagi atau hubungi administrator.';
                }

                // Jika booking sudah diambil driver lain, hapus dari daftar
                if (errorMessage.includes('sudah diterima') || errorMessage.includes('already accepted')) {
                    setEmergencyBookings(prevBookings =>
                        prevBookings.filter(booking => booking.id !== bookingId)
                    );
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'Tidak ada respons dari server. Periksa koneksi internet Anda.';
            }

            toast.error(errorMessage);
        })
        .finally(() => {
            setIsAcceptingEmergency(false);
        });
    };

    return (
        <DriverDashboardLayout
            title="Dashboard"
            driver={driver}
        >
            <Head title="Dashboard Driver" />

            <div className="pt-5 pb-10">
                <div className="container mx-auto px-4">
                    {/* Dashboard Status */}
                    <div className="grid grid-cols-1 gap-5">
                        {/* Status Buttons */}
                        {renderStatusButtons()}

                        {/* Stats Cards */}


                        {/* My Ambulance Card */}
                        {ambulance ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <TruckIcon className="h-5 w-5 text-primary-600 mr-2" />
                                        <h3 className="text-lg font-medium text-gray-900">Ambulans Saya</h3>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                        Aktif
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dl className="grid grid-cols-1 gap-4">
                                            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Kode Kendaraan</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">{ambulance.vehicle_code}</dd>
                                            </div>
                                            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Plat Nomor</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">{ambulance.license_plate}</dd>
                                            </div>
                                            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Terakhir Servis</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(ambulance.last_service)}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="flex items-center justify-center md:justify-end">
                                        <button
                                            onClick={confirmReleaseAmbulance}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            Lepaskan Penugasan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-100 p-5 sm:p-6 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                Anda belum ditugaskan untuk ambulans. Hubungi administrator untuk mendapatkan penugasan ambulans.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Emergency Bookings Section */}
                        {emergencyBookings.length > 0 && (
                            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-red-200 mb-6">
                                <div className="px-5 py-4 sm:px-6 border-b border-red-100 bg-red-50">
                                    <div className="flex items-center">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                                        <h3 className="text-base font-medium text-red-800">Permintaan Ambulans Darurat</h3>
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {emergencyBookings.length} permintaan
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Permintaan ambulans darurat memerlukan respon cepat. Jika Anda tersedia, mohon segera tanggapi permintaan berikut:
                                    </p>

                                    <div className="space-y-4">
                                        {emergencyBookings.map(booking => (
                                            <div key={booking.id} className="bg-white border border-red-100 rounded-lg p-4 shadow-sm">
                                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                                    <div className="lg:col-span-3">
                                                        <div className="flex items-center mb-2">
                                                            <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-1.5" />
                                                            <h4 className="font-medium text-gray-900">Pasien: {booking.patient_name}</h4>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="flex items-start">
                                                                <ClockIcon className="h-4 w-4 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                                                <div className="text-sm text-gray-600">
                                                                    <p className="font-medium">Waktu Permintaan:</p>
                                                                    <p>{booking.formatted_requested_at || booking.time_since_request}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start">
                                                                <MapPinIcon className="h-4 w-4 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                                                <div className="text-sm text-gray-600">
                                                                    <p className="font-medium">Lokasi Penjemputan:</p>
                                                                    <p>{booking.pickup_address_short || booking.pickup_address}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-center lg:justify-end">
                                                        <button
                                                            onClick={() => acceptEmergencyBooking(booking.id)}
                                                            disabled={isAcceptingEmergency || status !== 'available' || !ambulance}
                                                            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                                                                status === 'available' && ambulance
                                                                    ? 'bg-primary hover:bg-primary-700 text-white'
                                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {isAcceptingEmergency ? (
                                                                <>
                                                                    <div className="loader mr-2"></div>
                                                                    Memproses...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Terima Permintaan
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {(status !== 'available' || !ambulance) && (
                                        <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {status !== 'available' && (
                                                                <li>
                                                                    Anda harus dalam status "Tersedia" untuk menerima permintaan darurat.
                                                                </li>
                                                            )}
                                                            {!ambulance && (
                                                                <li>
                                                                    Anda harus terhubung dengan ambulans untuk menerima permintaan darurat.
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recent Bookings */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-100 mb-6">
                            <div className="px-5 py-4 sm:px-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 text-primary-600 mr-2" />
                                        <h3 className="text-base font-medium text-gray-900">Riwayat Pemesanan</h3>
                                    </div>
                                    <Link
                                        href={route('driver.bookings.index')}
                                        className="text-sm font-medium text-primary hover:text-primary-700"
                                    >
                                        Lihat Semua
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-hidden">
                                {recent_bookings && recent_bookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Pemesanan
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Pasien
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Lokasi
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="relative px-6 py-3">
                                                        <span className="sr-only">Aksi</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recent_bookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.type === 'emergency' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                    {booking.type === 'emergency' ? 'Darurat' : 'Terjadwal'}
                                                                </span>
                                                                <span className="ml-2 text-sm font-medium text-gray-900">#{booking.id}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {booking.formatted_created_at || formatDate(booking.created_at)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{booking.user?.name || booking.patient_name || 'Tidak tersedia'}</div>
                                                            {booking.user?.phone && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    <a href={`tel:${booking.user.phone}`} className="flex items-center text-primary hover:text-primary-700">
                                                                        <PhoneIcon className="h-3 w-3 mr-1" />
                                                                        {booking.user.phone}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 truncate max-w-[200px]">{booking.pickup_address}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                                                                {booking.status === 'pending' && 'Menunggu'}
                                                                {booking.status === 'confirmed' && 'Dikonfirmasi'}
                                                                {booking.status === 'dispatched' && 'Dikirim'}
                                                                {booking.status === 'arrived' && 'Tiba'}
                                                                {booking.status === 'enroute' && 'Dalam Perjalanan'}
                                                                {booking.status === 'completed' && 'Selesai'}
                                                                {booking.status === 'cancelled' && 'Dibatalkan'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link
                                                                href={route('driver.bookings.show', booking.id)}
                                                                className="text-primary hover:text-primary-700"
                                                            >
                                                                Detail
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada riwayat pemesanan</h3>
                                        <p className="mt-1 text-sm text-gray-500">Riwayat pemesanan Anda akan muncul di sini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
}
