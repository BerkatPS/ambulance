/**
 * Date format utilities for consistent date handling across the application
 */

/**
 * Format an ISO date string to YYYY-MM-DD format suitable for input[type="date"]
 * @param {string} dateString - ISO date string (e.g., "2025-03-22T00:00:00.000000Z")
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
        // Create a date object and extract YYYY-MM-DD portion
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

/**
 * Format a date object or string to localized display format
 * @param {Date|string} date - Date object or ISO date string
 * @param {string} locale - Locale code, defaults to 'id-ID' for Indonesian
 * @returns {string} Formatted date string
 */
export const formatDateDisplay = (date, locale = 'id-ID') => {
    if (!date) return '';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date for display:', error);
        return '';
    }
};
