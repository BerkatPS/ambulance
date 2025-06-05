import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set the base URL for all axios requests to include the port
// This ensures all AJAX requests use the correct URL with port
const baseUrl = window.location.origin;
window.axios.defaults.baseURL = baseUrl;
console.log('Axios base URL set to:', baseUrl);

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Check if Pusher configuration is available
const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

if (pusherKey && pusherCluster) {
    // Initialize Pusher only when document is ready
    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Determine auth endpoint based on user type (stored in meta tags)
            let authEndpoint = '/broadcasting/auth';
            const userType = document.head.querySelector('meta[name="user-type"]')?.getAttribute('content');
            
            // Set up Echo with the appropriate configuration
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: pusherKey,
                cluster: pusherCluster,
                forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
                enabledTransports: ['ws', 'wss'],
                disableStats: true,
                enableLogging: true,
                authEndpoint: authEndpoint,
                auth: {
                    headers: {
                        'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            });

            // Add Pusher connection status monitoring
            const pusher = window.Echo.connector.pusher;

            pusher.connection.bind('connected', () => {
                console.log('Pusher terhubung dengan sukses! Socket ID:', pusher.connection.socket_id);
                window.pusherConnected = true;

                // Create custom event to notify app that Pusher is connected
                const event = new CustomEvent('pusherConnected', { detail: { socketId: pusher.connection.socket_id } });
                window.dispatchEvent(event);
            });

            pusher.connection.bind('error', (err) => {
                console.error('Terjadi kesalahan pada koneksi Pusher:', err);
                window.pusherConnected = false;

                // Create custom event to notify app about Pusher error
                const event = new CustomEvent('pusherError', { detail: { error: err } });
                window.dispatchEvent(event);
            });

            pusher.connection.bind('disconnected', () => {
                console.warn('Pusher terputus dari server!');
                window.pusherConnected = false;

                // Create custom event to notify app that Pusher is disconnected
                const event = new CustomEvent('pusherDisconnected');
                window.dispatchEvent(event);
            });

            // Helper to check Pusher connection status
            window.isPusherConnected = () => {
                return window.pusherConnected === true;
            };

        } catch (error) {
            console.error('Gagal menginisialisasi Pusher:', error);
            window.pusherConnected = false;
        }
    });
} else {
    console.warn('Konfigurasi Pusher tidak ditemukan. Notifikasi real-time tidak akan berfungsi.');
    window.Echo = null;
    window.pusherConnected = false;
}
