import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DriverDashboardLayout from '@/Layouts/DriverDashboardLayout';
import {
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    CheckIcon,
    XMarkIcon,
    TruckIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// OpenStreetMap dan Geolokasi imports
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function Show({ booking, flash }) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [map, setMap] = useState(null);
    const [pickupMarker, setPickupMarker] = useState(null);
    const [destinationMarker, setDestinationMarker] = useState(null);
    const [driverMarker, setDriverMarker] = useState(null);
    const [routePath, setRoutePath] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    const { post, processing } = useForm();

    // Fix Leaflet default icon issue in webpack
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: icon,
            iconUrl: icon,
            shadowUrl: iconShadow,
        });
    }, []);

    // Initialize map
    useEffect(() => {
        // Pastikan DOM element ada dan tidak ada map yang sudah dibuat
        if (!mapContainerRef.current || map) return;

        // Set up default icon
        const DefaultIcon = L.Icon.extend({
            options: {
                iconUrl: icon,
                shadowUrl: iconShadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }
        });
        L.Marker.prototype.options.icon = new DefaultIcon();

        // Create map instance
        const newMap = L.map(mapContainerRef.current, {
            center: [-6.2088, 106.8456], // Default to Jakarta
            zoom: 13,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        setMap(newMap);
        mapRef.current = newMap;

        // Cleanup function
        return () => {
            if (mapRef.current) {
                // Penting: Hapus semua event listeners dan marker sebelum remove map
                mapRef.current.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        mapRef.current.removeLayer(layer);
                    }
                });
                mapRef.current.off();
                mapRef.current.remove();
                mapRef.current = null;
                setMap(null);
                setPickupMarker(null);
                setDestinationMarker(null);
                setDriverMarker(null);
                setRoutePath(null);
            }
        };
    }, []);

    // Add booking location markers
    useEffect(() => {
        if (!map || !booking) return;

        // Clear existing markers
        if (pickupMarker) map.removeLayer(pickupMarker);
        if (destinationMarker) map.removeLayer(destinationMarker);
        if (routePath) map.removeLayer(routePath);

        // Add pickup location marker
        if (booking.pickup_lat && booking.pickup_lng) {
            const pickupPoint = L.marker([booking.pickup_lat, booking.pickup_lng], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div style="background-color: #3B82F6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            })
            .addTo(map)
            .bindPopup(`
                <div class="text-sm font-medium">
                    <p class="font-bold text-base">Lokasi Penjemputan</p>
                    <p>${booking.pickup_address || 'Tidak ditentukan'}</p>
                </div>
            `);

            setPickupMarker(pickupPoint);
        }

        // Add destination marker
        if (booking.destination_lat && booking.destination_lng) {
            const destinationPoint = L.marker([booking.destination_lat, booking.destination_lng], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div style="background-color: #F15B50; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            })
            .addTo(map)
            .bindPopup(`
                <div class="text-sm font-medium">
                    <p class="font-bold text-base">Lokasi Tujuan</p>
                    <p>${booking.destination_address || 'Tidak ditentukan'}</p>
                </div>
            `);

            setDestinationMarker(destinationPoint);
        }

        // Fit bounds to include both markers
        const markers = [];
        if (pickupMarker) markers.push(pickupMarker);
        if (destinationMarker) markers.push(destinationMarker);

        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }, [map, booking]);

    // Track driver's current location
    const startLocationTracking = () => {
        if (!map) {
            toast.error("Peta belum dimuat dengan sempurna. Mohon tunggu sebentar.");
            return;
        }

        setIsTracking(true);

        // Cek apakah geolocation tersedia
        if (!navigator.geolocation) {
            toast.error("Geolocation tidak didukung di browser Anda");
            setIsTracking(false);
            return;
        }

        // Dapatkan posisi awal
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });

                // Buat atau update marker driver
                if (driverMarker) {
                    driverMarker.setLatLng([latitude, longitude]);
                } else if (map) {
                    // Buat driver marker dengan custom icon
                    const driverIcon = L.divIcon({
                        className: 'driver-marker',
                        html: '<div class="driver-marker-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" /><path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" /><path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" /></svg></div>',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });

                    try {
                        const newDriverMarker = L.marker([latitude, longitude], { icon: driverIcon });
                        if (map) {
                            newDriverMarker.addTo(map);
                            newDriverMarker.bindPopup("<b>Lokasi Anda</b><br>Posisi saat ini");
                            setDriverMarker(newDriverMarker);
                        }
                    } catch (error) {
                        console.error("Error adding marker to map:", error);
                        toast.error("Gagal menambahkan marker ke peta");
                    }
                }

                // Mulai interval untuk update lokasi
                const interval = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;

                            // Update state lokasi
                            setCurrentLocation({ lat: latitude, lng: longitude });

                            // Update marker posisi driver jika ada
                            if (driverMarker && map) {
                                driverMarker.setLatLng([latitude, longitude]);
                            }

                            // Kirim update lokasi ke server jika booking sedang berlangsung
                            if (['assigned', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(booking.status)) {
                                updateDriverLocation(latitude, longitude);
                            }
                        },
                        error => {
                            console.error("Error getting current position:", error);
                            // Tidak menghentikan tracking jika hanya ada error sesaat
                            if (error.code === error.PERMISSION_DENIED) {
                                toast.error("Akses lokasi ditolak. Silakan izinkan akses lokasi dan coba lagi.");
                                stopLocationTracking();
                            }
                        },
                        { enableHighAccuracy: true }
                    );
                }, 10000); // Update setiap 10 detik

                setLocationUpdateInterval(interval);
            },
            error => {
                console.error("Error getting initial position:", error);
                toast.error("Gagal mendapatkan lokasi Anda. " + getGeolocationErrorMessage(error));
                setIsTracking(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // Fungsi untuk memperbarui lokasi driver ke server
    const updateDriverLocation = (latitude, longitude) => {
        // Siapkan data lokasi
        const locationData = {
            latitude: latitude,
            longitude: longitude
        };

        // Tambahkan driver_id dan booking_id jika ada
        if (booking.driver_id) {
            locationData.driver_id = booking.driver_id;
        }

        if (booking.id) {
            locationData.booking_id = booking.id;
        }

        // Kirim ke server
        axios.post(route('location.update'), locationData)
            .then(response => {
                // Optional success handling
                console.log("Lokasi berhasil diperbarui");
            })
            .catch(error => {
                console.error("Gagal memperbarui lokasi:", error);
                toast.error("Gagal memperbarui lokasi. Mencoba lagi nanti.");
            });
    };

    // Fungsi untuk mendapatkan pesan error geolocation yang lebih informatif
    const getGeolocationErrorMessage = (error) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                return "Akses ke lokasi ditolak. Mohon aktifkan izin lokasi di browser Anda.";
            case error.POSITION_UNAVAILABLE:
                return "Informasi lokasi tidak tersedia. Pastikan GPS aktif dan cobalah di luar ruangan.";
            case error.TIMEOUT:
                return "Waktu permintaan lokasi habis. Silakan coba lagi.";
            case error.UNKNOWN_ERROR:
            default:
                return "Terjadi kesalahan yang tidak diketahui saat mengakses lokasi.";
        }
    };

    // Fungsi untuk berhenti melacak lokasi
    const stopLocationTracking = () => {
        setIsTracking(false);

        // Bersihkan interval update lokasi
        if (locationUpdateInterval) {
            clearInterval(locationUpdateInterval);
            setLocationUpdateInterval(null);
        }
    };

    // Draw route from driver to target location
    const drawRouteToTarget = (startLat, startLng, targetLatLng) => {
        // Remove existing route if any
        if (routePath) {
            map.removeLayer(routePath);
        }

        // Get route using OSRM
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${targetLatLng.lng},${targetLatLng.lat}?overview=full&geometries=polyline6`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const route = data.routes[0];

                    // Manually decode the polyline since L.Polyline.fromEncoded is not available
                    // Create polyline directly from the coordinates provided by OSRM
                    const coordinates = decodePolyline(route.geometry);
                    const routeLayer = L.polyline(coordinates, {
                        color: '#3B82F6',
                        weight: 5,
                        opacity: 0.7,
                        lineJoin: 'round'
                    }).addTo(map);

                    // Save route to state
                    setRoutePath(routeLayer);

                    // Display route information
                    const distance = (route.distance / 1000).toFixed(1);
                    const duration = Math.round(route.duration / 60);

                    setRouteInfo({
                        jarak: `${distance} km`,
                        waktu: `${duration} menit`,
                    });

                    // Fit bounds to include both markers and route
                    const bounds = routeLayer.getBounds();
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            })
            .catch(error => {
                console.error("Error fetching route:", error);
                toast.error("Gagal mendapatkan rute. Silakan coba lagi.");
            });
    };

    // Polyline decoder function
    // This is a JavaScript implementation of the algorithm used in the polyline utility of the Google Maps API
    function decodePolyline(encodedPolyline) {
        const precision = 1e6;
        const points = [];
        let index = 0, lat = 0, lng = 0;

        while (index < encodedPolyline.length) {
            let b, shift = 0, result = 0;
            do {
                b = encodedPolyline.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encodedPolyline.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push([lat / precision, lng / precision]);
        }
        return points;
    }

    // Navigate to target location
    const navigateToLocation = (targetType) => {
        const target = targetType === 'pickup' ? pickupMarker : destinationMarker;

        if (!target || !currentLocation) {
            toast.error("Tidak dapat memulai navigasi. Pastikan GPS aktif dan lokasi target tersedia.");
            return;
        }

        const targetLatLng = target.getLatLng();

        // Start navigation within the current OpenStreetMap
        if (!map) {
            toast.error("Peta tidak tersedia. Silakan muat ulang halaman.");
            return;
        }

        // Clear any existing route
        if (routePath) {
            map.removeLayer(routePath);
            setRoutePath(null);
        }

        // Draw route between current location and target
        drawRouteToTarget(currentLocation.lat, currentLocation.lng, targetLatLng);

        // Center map and zoom to show the route
        map.setView([currentLocation.lat, currentLocation.lng], 15);

        // Display navigation instructions
        const locationName = targetType === 'pickup' ?
            (booking.pickup_address || 'Lokasi Penjemputan') :
            (booking.destination_address || 'Lokasi Tujuan');

        toast.success(`Navigasi ke ${locationName} dimulai. Ikuti rute berwarna biru pada peta.`);

        // Add navigation control panel if it doesn't exist
        const navControlContainer = document.getElementById('navigation-control');
        if (!navControlContainer) {
            const navDiv = document.createElement('div');
            navDiv.id = 'navigation-control';
            navDiv.className = 'absolute bottom-4 left-4 right-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100 z-[1000]';
            navDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-900">Navigasi ke: ${locationName}</p>
                        <div class="flex items-center mt-1">
                            <span class="text-xs font-medium text-gray-500 mr-3">
                                <span id="nav-distance">${routeInfo?.jarak || '0 km'}</span>
                            </span>
                            <span class="text-xs font-medium text-gray-500">
                                <span id="nav-duration">${routeInfo?.waktu || '0 menit'}</span>
                            </span>
                        </div>
                    </div>
                    <button id="end-navigation" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                        Selesai
                    </button>
                </div>
            `;

            document.getElementById('map-container').appendChild(navDiv);

            // Add event listener to end navigation button
            document.getElementById('end-navigation').addEventListener('click', () => {
                document.getElementById('navigation-control').remove();

                // Center map to show both points
                if (pickupMarker && destinationMarker) {
                    const group = L.featureGroup([pickupMarker, destinationMarker]);
                    map.fitBounds(group.getBounds(), { padding: [50, 50] });
                }

                toast.info("Navigasi diakhiri");
            });
        }

        // Update navigation info when available
        if (routeInfo && routeInfo.jarak && routeInfo.waktu) {
            const distanceElement = document.getElementById('nav-distance');
            const durationElement = document.getElementById('nav-duration');

            if (distanceElement) distanceElement.textContent = routeInfo.jarak;
            if (durationElement) durationElement.textContent = routeInfo.waktu;
        }
    };

    // Display toast notification when flash message is present
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return 'Rp -';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Update booking status
    const updateBookingStatus = (action) => {
        if (processing) return;

        const statusActions = {
            start: {
                url: route('driver.bookings.start', booking.id),
                confirmTitle: 'Mulai Perjalanan',
                confirmText: 'Anda akan memulai perjalanan menuju lokasi penjemputan. Lanjutkan?',
                successMessage: 'Perjalanan menuju lokasi penjemputan dimulai.'
            },
            arrive: {
                url: route('driver.bookings.arrive', booking.id),
                confirmTitle: 'Tiba di Lokasi Penjemputan',
                confirmText: 'Konfirmasi bahwa Anda telah tiba di lokasi penjemputan?',
                successMessage: 'Status berhasil diperbarui. Silakan temui pasien.'
            },
            depart: {
                url: route('driver.bookings.depart', booking.id),
                confirmTitle: 'Berangkat ke Tujuan',
                confirmText: 'Konfirmasi bahwa Anda telah menjemput pasien dan akan berangkat ke lokasi tujuan?',
                successMessage: 'Perjalanan menuju lokasi tujuan dimulai.'
            },
            complete: {
                url: route('driver.bookings.complete', booking.id),
                confirmTitle: 'Selesaikan Perjalanan',
                confirmText: 'Konfirmasi bahwa pasien telah sampai di tujuan dan perjalanan selesai?',
                successMessage: 'Perjalanan telah selesai. Terima kasih!'
            },
            cancel: {
                url: route('driver.bookings.cancel', booking.id),
                confirmTitle: 'Batalkan Pesanan',
                confirmText: 'Anda yakin ingin membatalkan pesanan ini?',
                successMessage: 'Pesanan berhasil dibatalkan.'
            }
        };

        const actionInfo = statusActions[action];
        if (!actionInfo) return;

        Swal.fire({
            title: actionInfo.confirmTitle,
            text: actionInfo.confirmText,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);

                post(actionInfo.url, {}, {
                    onSuccess: () => {
                        toast.success(actionInfo.successMessage);
                        // Reload the page to get the updated booking status
                        window.location.reload();
                    },
                    onError: (errors) => {
                        console.error(errors);
                        toast.error(errors.message || 'Terjadi kesalahan saat memperbarui status.');
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    }
                });
            }
        });
    };

    const cancelBooking = () => {
        Swal.fire({
            title: 'Batalkan Booking?',
            text: 'Masukkan alasan pembatalan',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                placeholder: 'Alasan pembatalan'
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Batalkan',
            cancelButtonText: 'Batal',
            preConfirm: (cancellationReason) => {
                if (!cancellationReason || cancellationReason.trim() === '') {
                    Swal.showValidationMessage('Alasan pembatalan harus diisi');
                    return false;
                }
                return cancellationReason;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                post(route('driver.bookings.cancel', booking.id), {
                    cancellation_reason: result.value
                }, {
                    onSuccess: () => {
                        toast.success('Booking berhasil dibatalkan.');
                        // Reload the page to get the updated booking status
                        window.location.reload();
                    },
                    onError: (errors) => {
                        console.error(errors);
                        toast.error(errors.message || 'Terjadi kesalahan saat membatalkan booking.');
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    }
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        let color, text;

        switch (status) {
            case 'pending':
                color = 'bg-yellow-100 text-yellow-800';
                text = 'Menunggu';
                break;
            case 'confirmed':
                color = 'bg-blue-100 text-blue-800';
                text = 'Dikonfirmasi';
                break;
            case 'dispatched':
                color = 'bg-purple-100 text-purple-800';
                text = 'Dikirim';
                break;
            case 'arrived':
                color = 'bg-indigo-100 text-indigo-800';
                text = 'Tiba di Lokasi';
                break;
            case 'enroute':
                color = 'bg-cyan-100 text-cyan-800';
                text = 'Dalam Perjalanan';
                break;
            case 'completed':
                color = 'bg-green-100 text-green-800';
                text = 'Selesai';
                break;
            case 'cancelled':
                color = 'bg-red-100 text-red-800';
                text = 'Dibatalkan';
                break;
            default:
                color = 'bg-gray-100 text-gray-800';
                text = status;
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {text}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        let color, text;

        switch (status) {
            case 'paid':
                color = 'bg-green-100 text-green-800';
                text = 'Lunas';
                break;
            case 'pending':
                color = 'bg-yellow-100 text-yellow-800';
                text = 'Menunggu Pembayaran';
                break;
            case 'failed':
                color = 'bg-red-100 text-red-800';
                text = 'Gagal';
                break;
            default:
                color = 'bg-gray-100 text-gray-800';
                text = status;
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {text}
            </span>
        );
    };

    const renderActionButtons = () => {
        if (booking.status === 'pending') {
            return (
                <button
                    type="button"
                    onClick={() => updateBookingStatus('accept')}
                    disabled={processing || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Terima Pesanan
                </button>
            );
        } else if (booking.status === 'confirmed') {
            return (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                        type="button"
                        onClick={() => updateBookingStatus('start')}
                        disabled={processing || isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Mulai Perjalanan
                    </button>
                    <button
                        type="button"
                        onClick={cancelBooking}
                        disabled={processing || isLoading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Batalkan
                    </button>
                </div>
            );
        } else if (booking.status === 'dispatched') {
            return (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                        type="button"
                        onClick={() => updateBookingStatus('arrive')}
                        disabled={processing || isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Tiba di Lokasi
                    </button>
                    <button
                        type="button"
                        onClick={cancelBooking}
                        disabled={processing || isLoading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Batalkan
                    </button>
                </div>
            );
        } else if (booking.status === 'arrived') {
            return (
                <button
                    type="button"
                    onClick={() => updateBookingStatus('depart')}
                    disabled={processing || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Menuju Tujuan
                </button>
            );
        } else if (booking.status === 'enroute') {
            return (
                <button
                    type="button"
                    onClick={() => updateBookingStatus('complete')}
                    disabled={processing || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Selesaikan Perjalanan
                </button>
            );
        }

        return null;
    };

    return (
        <DriverDashboardLayout
            title="Detail Booking"
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Detail Booking #{booking.booking_code || booking.id}
                    </h2>
                    <div className="mt-2 md:mt-0 flex items-center space-x-3">
                        <Link
                            href={route('driver.bookings.index')}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Kembali ke Daftar
                        </Link>
                        <div className="flex space-x-2">
                            {getStatusBadge(booking.status)}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Booking #${booking.id}`} />
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Main Content */}
            <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left side - Map and Navigation */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peta Navigasi</h3>

                            {/* Map Container */}
                            <div id="map-container" className="relative">
                                <div ref={mapContainerRef} className="h-[500px] w-full rounded-lg"></div>
                            </div>

                            {/* Navigation Controls */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                {isTracking ? (
                                    <button
                                        onClick={stopLocationTracking}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Berhenti Melacak
                                    </button>
                                ) : (
                                    <button
                                        onClick={startLocationTracking}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <MapPinIcon className="h-4 w-4 mr-2" />
                                        Mulai Melacak
                                    </button>
                                )}

                                {isTracking && (
                                    <>
                                        <button
                                            onClick={() => navigateToLocation('pickup')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <MapPinIcon className="h-4 w-4 mr-2" />
                                            Navigasi ke Penjemputan
                                        </button>

                                        <button
                                            onClick={() => navigateToLocation('destination')}
                                            className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <MapPinIcon className="h-4 w-4 mr-2" />
                                            Navigasi ke Tujuan
                                        </button>
                                    </>
                                )}

                                {routeInfo && (
                                    <div className="flex items-center space-x-4 ml-auto">
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-500">Jarak: </span>
                                            <span className="font-semibold">{routeInfo.jarak}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-500">Waktu: </span>
                                            <span className="font-semibold">{routeInfo.waktu}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Booking Info */}
                    <div className="lg:col-span-1">

                        {/* Passenger Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Penumpang</h3>
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nama</p>
                                    <div className="flex items-center">
                                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <p className="font-medium">{booking.passenger_name || '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <p className="font-medium">{booking.passenger_phone || '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Catatan</p>
                                    <p className="font-medium">{booking.notes || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Lokasi</h3>
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <div className="flex items-start">
                                        <MapPinIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Lokasi Penjemputan</p>
                                            <p className="text-sm text-gray-600 break-words">{booking.pickup_address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-start">
                                        <MapPinIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Lokasi Tujuan</p>
                                            <p className="text-sm text-gray-600 break-words">{booking.destination_address}</p>
                                        </div>
                                    </div>
                                </div>
                                {booking.distance && (
                                    <div>
                                        <div className="flex items-start">
                                            <TruckIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Jarak Tempuh</p>
                                                <p className="text-sm text-gray-600">{booking.distance} km</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tindakan</h3>
                            <div className="flex flex-wrap gap-3">
                                {renderActionButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
}
