/**
 * Utility functions for formatting data in the Ambulance Portal
 */

/**
 * Format a number as Indonesian Rupiah currency
 * @param {number} value - The value to format
 * @param {boolean} withSymbol - Whether to include the Rp symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, withSymbol = true) => {
  if (value === null || value === undefined) return '-';
  
  try {
    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
    
    return withSymbol ? formattedValue : formattedValue.replace(/[^\d,.-]/g, '');
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${withSymbol ? 'Rp ' : ''}${value}`;
  }
};

/**
 * Format a date string to a localized format
 * @param {string|Date} dateString - The date to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - The locale to use (default: 'id-ID')
 * @param {string} options.format - The format type: 'full', 'long', 'medium', 'short', or 'time'
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  const { locale = 'id-ID', format = 'medium' } = options;
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date)) return dateString;
    
    let formatOptions;
    
    switch (format) {
      case 'full':
        formatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        };
        break;
      case 'long':
        formatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        break;
      case 'short':
        formatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
        break;
      case 'time':
        formatOptions = {
          hour: '2-digit',
          minute: '2-digit'
        };
        break;
      case 'medium':
      default:
        formatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
    }
    
    return date.toLocaleString(locale, formatOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a phone number to a readable format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '-';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's an Indonesian number
  if (cleaned.startsWith('62')) {
    // Format as +62 xxx-xxxx-xxxx
    const match = cleaned.match(/^62(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `+62 ${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  
  // General formatting based on length
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  
  // If we can't format it, return the original
  return phoneNumber;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format a file size in bytes to a human-readable format
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a distance in meters to a readable format
 * @param {number} meters - The distance in meters
 * @param {boolean} includeUnit - Whether to include the unit
 * @returns {string} Formatted distance
 */
export const formatDistance = (meters, includeUnit = true) => {
  if (meters === null || meters === undefined) return '-';
  
  // For very short distances
  if (meters < 1) {
    return includeUnit ? `${meters} meter` : `${meters}`;
  }
  
  // For distances less than 1 km
  if (meters < 1000) {
    return includeUnit ? `${Math.round(meters)} m` : `${Math.round(meters)}`;
  }
  
  // For distances 1 km and above
  const km = meters / 1000;
  return includeUnit ? `${km.toFixed(1)} km` : `${km.toFixed(1)}`;
};

/**
 * Format a booking status to a human-readable string
 * @param {string} status - The booking status
 * @returns {string} Formatted status
 */
export const formatBookingStatus = (status) => {
  if (!status) return '-';
  
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'expired': 'Expired'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Get a CSS class for a booking status (for color coding)
 * @param {string} status - The booking status
 * @returns {string} CSS class name
 */
export const getStatusColorClass = (status) => {
  if (!status) return 'bg-medical-gray-100 text-medical-gray-800';
  
  const statusColors = {
    'pending': 'bg-warning-100 text-warning-800',
    'confirmed': 'bg-info-100 text-info-800',
    'in_progress': 'bg-primary-100 text-primary-800',
    'completed': 'bg-success-100 text-success-800',
    'cancelled': 'bg-danger-100 text-danger-800',
    'expired': 'bg-medical-gray-100 text-medical-gray-800'
  };
  
  return statusColors[status.toLowerCase()] || 'bg-medical-gray-100 text-medical-gray-800';
};

/**
 * Format payment method to a human-readable string
 * @param {string} method - The payment method
 * @returns {string} Formatted payment method
 */
export const formatPaymentMethod = (method) => {
  if (!method) return '-';
  
  const methodMap = {
    'gopay': 'GoPay',
    'qris': 'QRIS',
    'virtual_account': 'Virtual Account',
    'credit_card': 'Credit Card',
    'bank_transfer': 'Bank Transfer',
    'cash': 'Cash'
  };
  
  return methodMap[method.toLowerCase()] || method;
};

/**
 * Format ambulance type to a human-readable string
 * @param {string} type - The ambulance type
 * @returns {string} Formatted ambulance type
 */
export const formatAmbulanceType = (type) => {
  if (!type) return '-';
  
  const typeMap = {
    'basic': 'Basic Life Support',
    'advanced': 'Advanced Life Support',
    'neonatal': 'Neonatal',
    'patient_transport': 'Patient Transport',
    'emergency': 'Emergency Response',
    'icu': 'Mobile ICU'
  };
  
  return typeMap[type.toLowerCase()] || type;
};

export default {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  truncateText,
  formatFileSize,
  formatDistance,
  formatBookingStatus,
  getStatusColorClass,
  formatPaymentMethod,
  formatAmbulanceType
};
