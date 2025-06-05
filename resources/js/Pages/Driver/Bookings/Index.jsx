import {useState, useEffect, useRef} from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DriverDashboardLayout from '@/Layouts/DriverDashboardLayout';
import Pagination from '@/Components/Common/Pagination';
import NotificationToast from '@/Components/NotificationToast';
import {
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    TruckIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ExclamationTriangleIcon,
    CalendarIcon, ArchiveBoxIcon, ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

// OpenStreetMap dan Geolocation imports
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {XMarkIcon} from "@heroicons/react/20/solid";

export default function Index({ bookings, filters, driver, driverAmbulance, urgencyOptions, statusOptions, perPageOptions, currentPerPage }) {
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [driverMarker, setDriverMarker] = useState(null);
    const [bookingMarkers, setBookingMarkers] = useState({});
    const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
    const mapRef = useRef(null);
    const { data, setData, get, processing } = useForm({
        status: filters.status || '',
        urgency: filters.urgency || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        per_page: currentPerPage || 10,
        history: filters.history || false
    });

    // Initialize map when component mounts
    useEffect(() => {
        if (!mapRef.current) return;

        // Fix Leaflet default icon path issue
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: icon,
            iconUrl: icon,
            shadowUrl: iconShadow
        });

        // Create map instance
        const mapInstance = L.map(mapRef.current).setView([-6.2088, 106.8456], 10); // Default to Jakarta

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);

        // Cleanup on unmount
        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }

            if (locationUpdateInterval) {
                clearInterval(locationUpdateInterval);
            }
        };
    }, []);

    // Add booking markers when map and bookings data are available
    useEffect(() => {
        if (!map || !bookings.data) return;

        // Clear existing markers
        Object.values(bookingMarkers).forEach(marker => {
            if (marker) marker.remove();
        });

        const newMarkers = {};
        const boundPoints = [];

        // Add markers for each booking with coordinates
        bookings.data.forEach(booking => {
            // Add pickup marker
            if (booking.pickup_latitude && booking.pickup_longitude) {
                const pickupLatLng = [booking.pickup_latitude, booking.pickup_longitude];
                boundPoints.push(pickupLatLng);

                // Create marker with color based on booking status
                let markerColor = '#4B9CE3'; // Blue for confirmed
                if (booking.status === 'pending') markerColor = '#F59E0B'; // Yellow for pending
                if (booking.status === 'dispatched') markerColor = '#8B5CF6'; // Purple for dispatched
                if (booking.status === 'arrived') markerColor = '#6366F1'; // Indigo for arrived
                if (booking.status === 'enroute') markerColor = '#06B6D4'; // Cyan for enroute

                const marker = L.marker(pickupLatLng, {
                    icon: L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                })
                .addTo(map)
                .bindPopup(`
                    <div class="text-sm">
                        <p class="font-bold">${booking.passenger_name || 'Tidak ditentukan'}</p>
                        <p>${booking.pickup_address || 'Tidak ditentukan'}</p>
                        <p>Status: ${getStatusText(booking.status)}</p>
                        <a href="${route('driver.bookings.show', booking.id)}" class="text-blue-600 hover:underline">Lihat Detail</a>
                    </div>
                `);

                newMarkers[`pickup-${booking.id}`] = marker;
            }

            // Add destination marker
            if (booking.destination_latitude && booking.destination_longitude) {
                const destLatLng = [booking.destination_latitude, booking.destination_longitude];
                boundPoints.push(destLatLng);

                const marker = L.marker(destLatLng, {
                    icon: L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: #F15B50; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                })
                .addTo(map)
                .bindPopup(`
                    <div class="text-sm">
                        <p class="font-bold">Tujuan</p>
                        <p>${booking.destination_address || 'Tidak ditentukan'}</p>
                        <a href="${route('driver.bookings.show', booking.id)}" class="text-blue-600 hover:underline">Lihat Detail</a>
                    </div>
                `);

                newMarkers[`dest-${booking.id}`] = marker;
            }
        });

        setBookingMarkers(newMarkers);

        // Fit map to markers if there are any
        if (boundPoints.length > 0) {
            map.fitBounds(L.latLngBounds(boundPoints), { padding: [50, 50] });
        }
    }, [map, bookings.data]);

    // Start tracking driver location
    const startLocationTracking = () => {
        if (!map) return;

        setIsTracking(true);

        // Get initial location
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });

                // Create or update driver marker
                if (driverMarker) {
                    driverMarker.setLatLng([latitude, longitude]);
                } else {
                    const marker = L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: 'custom-div-icon',
                            html: '<div style="background-color: #10B981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })
                    })
                    .addTo(map)
                    .bindPopup('Lokasi Anda Saat Ini');

                    setDriverMarker(marker);
                }

                // Center map on driver's location
                map.setView([latitude, longitude], 15);

                // Set up interval to update location every 15 seconds
                const interval = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(
                        pos => {
                            const { latitude, longitude } = pos.coords;
                            setCurrentLocation({ lat: latitude, lng: longitude });

                            if (driverMarker) {
                                driverMarker.setLatLng([latitude, longitude]);
                            }

                            // Send driver location update to server
                            axios.post(route('driver.location.update'), {
                                latitude: latitude,
                                longitude: longitude,
                                driver_id: driver.id,
                            }).then(response => {
                                console.log("Lokasi berhasil diperbarui");
                            }).catch(error => {
                                console.error("Gagal memperbarui lokasi:", error);
                                NotificationToast.error("Gagal memperbarui lokasi. Mencoba lagi nanti.");
                            });
                        },
                        error => {
                            console.error("Error getting location:", error);
                            NotificationToast.error("Gagal melacak lokasi. Silakan periksa izin lokasi Anda.");
                        },
                        { enableHighAccuracy: true }
                    );
                }, 1000000); // Update every 15 seconds

                setLocationUpdateInterval(interval);

                // Send initial location update to server
                axios.post(route('driver.location.update'), {
                    latitude: latitude,
                    longitude: longitude,
                    driver_id: driver.id,
                }).then(response => {
                    console.log("Lokasi berhasil diperbarui");
                }).catch(error => {
                    console.error("Gagal memperbarui lokasi:", error);
                    NotificationToast.error("Gagal memperbarui lokasi. Mencoba lagi nanti.");
                });
            },
            error => {
                console.error("Error getting location:", error);
                setIsTracking(false);
                NotificationToast.error("Gagal mendapatkan lokasi. Pastikan GPS diaktifkan.");
            },
            { enableHighAccuracy: true }
        );
    };

    // Stop tracking driver location
    const stopLocationTracking = () => {
        if (locationUpdateInterval) {
            clearInterval(locationUpdateInterval);
            setLocationUpdateInterval(null);
        }
        setIsTracking(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Menunggu',
            'confirmed': 'Dikonfirmasi',
            'dispatched': 'Dikirim',
            'arrived': 'Sampai di Lokasi',
            'enroute': 'Dalam Perjalanan',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'dispatched': 'bg-purple-100 text-purple-800',
            'arrived': 'bg-indigo-100 text-indigo-800',
            'enroute': 'bg-cyan-100 text-cyan-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
        const colorMap = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'paid': 'bg-green-100 text-green-800',
            'failed': 'bg-red-100 text-red-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusText = (status) => {
        const statusMap = {
            'pending': 'Menunggu Pembayaran',
            'paid': 'Lunas',
            'failed': 'Gagal'
        };
        return statusMap[status] || status;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);

        Object.keys(data).forEach(key => {
            if (data[key]) {
                url.searchParams.set(key, data[key]);
            } else {
                url.searchParams.delete(key);
            }
        });

        window.location.href = url.toString();
    };

    const clearFilters = () => {
        setData({
            status: '',
            date_from: '',
            date_to: '',
            per_page: currentPerPage,
            history: false
        });

        window.location.href = route('driver.bookings.index');
    };

    const handleAcceptBooking = (bookingId) => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin menerima pemesanan ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Terima',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);

                // Submit to accept booking endpoint
                axios.post(route('driver.bookings.accept', bookingId))
                    .then(response => {
                        NotificationToast.success('Pemesanan berhasil diterima');
                        window.location.reload();
                    })
                    .catch(error => {
                        NotificationToast.error('Gagal menerima pemesanan: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
                        console.error(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        });
    };

    return (
        <DriverDashboardLayout>
            <Head title="Daftar Pemesanan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Daftar Pemesanan</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                            </button>
                        </div>
                    </div>

                    {/* Filter section */}
                    {showFilters && (
                        <div className="bg-white shadow rounded-lg p-4 mb-4">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData({...data, status: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        >
                                            <option value="">Semua Status</option>
                                            {Array.isArray(statusOptions) ? statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            )) : Object.entries(statusOptions || {}).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                                        <input
                                            type="date"
                                            id="date_from"
                                            name="date_from"
                                            value={data.date_from}
                                            onChange={(e) => setData({...data, date_from: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">Hingga Tanggal</label>
                                        <input
                                            type="date"
                                            id="date_to"
                                            name="date_to"
                                            value={data.date_to}
                                            onChange={(e) => setData({...data, date_to: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="history" className="block text-sm font-medium text-gray-700">Tampilkan Riwayat</label>
                                        <div className="mt-2">
                                            <input
                                                type="checkbox"
                                                id="history"
                                                name="history"
                                                checked={data.history}
                                                onChange={(e) => setData({...data, history: e.target.checked})}
                                                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                            />
                                            <label htmlFor="history" className="ml-2 text-sm text-gray-600">Termasuk pemesanan selesai & dibatalkan</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center space-x-4">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring focus:ring-primary-300 transition"
                                    >
                                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                        Cari
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
                                    >
                                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                                        Reset
                                    </button>

                                    <div className="ml-auto flex items-center">
                                        <label htmlFor="per_page" className="mr-2 text-sm text-gray-600">Item per halaman:</label>
                                        <select
                                            id="per_page"
                                            name="per_page"
                                            value={data.per_page}
                                            onChange={(e) => setData({...data, per_page: e.target.value})}
                                            className="mt-1 inline-block w-auto rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        >
                                            {Array.isArray(perPageOptions) ? perPageOptions.map((option) => (
                                                <option key={option.value} value={option.value}>{option.value}</option>
                                            )) : Object.entries(perPageOptions || {}).map(([value, label]) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Bookings list */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No. Pemesanan
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lokasi
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pembayaran
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Aksi</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.data.length > 0 ? (
                                        bookings.data.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {booking.booking_code || booking.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                    <div className="flex items-start space-x-2">
                                                        <MapPinIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <div className="line-clamp-2">{booking.pickup_address || '-'}</div>
                                                            <div className="mt-1 flex items-center">
                                                                <TruckIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                                <span className="text-xs">{booking.distance ? `${booking.distance} km` : '-'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                        <span>{formatDate(booking.created_at)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {getStatusText(booking.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                                                            {getPaymentStatusText(booking.payment_status)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs mt-1">{formatCurrency(booking.total_fare)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-end">
                                                        {booking.status === 'pending' ? (
                                                            <button
                                                                onClick={() => handleAcceptBooking(booking.id)}
                                                                disabled={isLoading}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                            >
                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                Terima
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                href={route('driver.bookings.show', booking.id)}
                                                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                                                            >
                                                                Detail
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Tidak ada data pemesanan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200">
                            <Pagination links={bookings.links} />
                        </div>
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
}
