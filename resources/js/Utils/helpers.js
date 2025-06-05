/**
 * General helper functions for the Ambulance Portal
 * Miscellaneous utility functions that don't fit into other categories
 */

import { STORAGE_KEYS } from './constants';

/**
 * Generates a unique ID for temporary use (not for database)
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID string
 */
export const generateUniqueId = (prefix = '') => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}-${random}`;
};

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (default: 'IDR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'IDR') => {
  if (amount == null) return '-';
  
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currencyCode} ${amount.toLocaleString('id-ID')}`;
  }
};

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttles a function call
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Checks if a user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Gets current user data from local storage
 * @returns {Object|null} User data or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Checks if current user has a specific role
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean} True if user has any of the specified roles
 */
export const hasRole = (roles) => {
  const user = getCurrentUser();
  
  if (!user || !user.role) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

/**
 * Extracts error message from API response
 * @param {Error} error - Error object from API call
 * @returns {string} Extracted error message
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Laravel validation errors format
  if (error.response && error.response.data && error.response.data.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  
  // General message format
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  
  // Network error
  if (error.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
};

/**
 * Calculates estimated arrival time based on distance and speed
 * @param {number} distanceInMeters - Distance in meters
 * @param {number} speedInKmh - Speed in kilometers per hour (default: 40)
 * @returns {number} Estimated time in minutes
 */
export const calculateETA = (distanceInMeters, speedInKmh = 40) => {
  // Convert speed to meters per minute
  const speedInMpm = (speedInKmh * 1000) / 60;
  
  // Calculate time in minutes
  return Math.ceil(distanceInMeters / speedInMpm);
};

/**
 * Formats a coordinate pair for display
 * @param {Object} coordinates - Object with lat and lng properties
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    return 'Invalid coordinates';
  }
  
  return `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
};

/**
 * Checks if the application is running in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Gets browser language preference
 * @returns {string} Browser language code
 */
export const getBrowserLanguage = () => {
  return navigator.language || navigator.userLanguage || 'en';
};

/**
 * Safely parses JSON without throwing exceptions
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback value
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Removes HTML tags from a string
 * @param {string} html - String with HTML tags
 * @returns {string} String without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Creates a query string from an object
 * @param {Object} params - Object of key-value pairs
 * @returns {string} URL query string
 */
export const createQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const query = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return query ? `?${query}` : '';
};

/**
 * Parses a query string into an object
 * @param {string} queryString - URL query string
 * @returns {Object} Parsed query parameters
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  
  // Remove the leading '?' if present
  const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  
  return query.split('&').reduce((params, param) => {
    const [key, value] = param.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return params;
  }, {});
};

/**
 * Detects device type based on user agent
 * @returns {string} Device type: 'mobile', 'tablet', or 'desktop'
 */
export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile';
  }
  
  return 'desktop';
};

/**
 * Gets current geolocation from browser
 * @returns {Promise} Promise resolving to coordinates or error
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      error => {
        let errorMessage = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export default {
  generateUniqueId,
  debounce,
  throttle,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  extractErrorMessage,
  calculateDistance,
  calculateETA,
  formatCoordinates,
  isDevelopment,
  getBrowserLanguage,
  safeJsonParse,
  clamp,
  stripHtml,
  capitalizeWords,
  createQueryString,
  parseQueryString,
  getDeviceType,
  getCurrentPosition,
  formatCurrency
};
