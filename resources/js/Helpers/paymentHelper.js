/**
 * Payment helper functions for the application
 */

/**
 * Format payment status to display friendly text
 * 
 * @param {string} status 
 * @returns {string}
 */
export function formatPaymentStatus(status) {
    switch (status) {
        case 'pending':
            return 'Menunggu Pembayaran';
        case 'paid':
            return 'Sudah Dibayar';
        case 'expired':
            return 'Kedaluwarsa';
        case 'refunded':
            return 'Dikembalikan';
        case 'failed':
            return 'Gagal';
        default:
            return status;
    }
}

/**
 * Check if an emergency booking requires payment reminders
 * 
 * @param {Object} booking 
 * @returns {boolean}
 */
export function isEmergencyPaymentDue(booking) {
    return booking && 
           booking.type === 'emergency' && 
           booking.status === 'completed' && 
           booking.payment && 
           booking.payment.status === 'pending';
}

/**
 * Calculate time remaining until payment expiry
 * 
 * @param {string} expiryDateTime 
 * @returns {Object} Hours, minutes, seconds, and if expired
 */
export function calculatePaymentTimeRemaining(expiryDateTime) {
    if (!expiryDateTime) {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: true
        };
    }

    const expiryDate = new Date(expiryDateTime);
    const now = new Date();

    // If already expired
    if (now >= expiryDate) {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: true
        };
    }

    // Calculate time difference
    const diff = expiryDate - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
        hours,
        minutes,
        seconds,
        expired: false
    };
}
