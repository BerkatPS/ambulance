/**
 * Storage utility functions for the Ambulance Portal
 * Handles localStorage, sessionStorage, and cookies for persistent data
 */

import { STORAGE_KEYS } from './constants';

/**
 * Local Storage wrapper with error handling and expiration
 */
export const localStorage = {
  /**
   * Set an item in local storage with optional expiration
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @param {number} expiresInMinutes - Optional expiration time in minutes
   */
  set: (key, value, expiresInMinutes = null) => {
    try {
      const item = {
        value,
        expiry: expiresInMinutes ? Date.now() + expiresInMinutes * 60 * 1000 : null
      };
      
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  },
  
  /**
   * Get an item from local storage, respecting expiration
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key not found or expired
   * @returns {*} Stored value or defaultValue
   */
  get: (key, defaultValue = null) => {
    try {
      const itemStr = window.localStorage.getItem(key);
      
      if (!itemStr) {
        return defaultValue;
      }
      
      const item = JSON.parse(itemStr);
      
      // Check for expiration
      if (item.expiry && Date.now() > item.expiry) {
        // Item has expired, remove it
        window.localStorage.removeItem(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  },
  
  /**
   * Remove an item from local storage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  },
  
  /**
   * Check if an item exists in local storage and is not expired
   * @param {string} key - Storage key
   * @returns {boolean} True if item exists and is not expired
   */
  exists: (key) => {
    try {
      const itemStr = window.localStorage.getItem(key);
      
      if (!itemStr) {
        return false;
      }
      
      const item = JSON.parse(itemStr);
      
      // Check for expiration
      if (item.expiry && Date.now() > item.expiry) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking localStorage item:', error);
      return false;
    }
  },
  
  /**
   * Clear all items from local storage
   */
  clear: () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Session Storage wrapper with error handling
 */
export const sessionStorage = {
  /**
   * Set an item in session storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   */
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify({
        value
      }));
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
    }
  },
  
  /**
   * Get an item from session storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Stored value or defaultValue
   */
  get: (key, defaultValue = null) => {
    try {
      const itemStr = window.sessionStorage.getItem(key);
      
      if (!itemStr) {
        return defaultValue;
      }
      
      const item = JSON.parse(itemStr);
      return item.value;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return defaultValue;
    }
  },
  
  /**
   * Remove an item from session storage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
    }
  },
  
  /**
   * Check if an item exists in session storage
   * @param {string} key - Storage key
   * @returns {boolean} True if item exists
   */
  exists: (key) => {
    try {
      return window.sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking sessionStorage item:', error);
      return false;
    }
  },
  
  /**
   * Clear all items from session storage
   */
  clear: () => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
};

/**
 * Cookie utility functions
 */
export const cookies = {
  /**
   * Set a cookie
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {Object} options - Cookie options
   * @param {number} options.days - Cookie expiration in days
   * @param {string} options.path - Cookie path
   * @param {boolean} options.secure - Only transmit over HTTPS
   * @param {boolean} options.sameSite - SameSite attribute (strict, lax, none)
   */
  set: (name, value, options = {}) => {
    try {
      const {
        days = 7,
        path = '/',
        secure = true,
        sameSite = 'strict'
      } = options;
      
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      
      let cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
      cookieValue += `; expires=${expires.toUTCString()}`;
      cookieValue += `; path=${path}`;
      
      if (secure) {
        cookieValue += '; secure';
      }
      
      if (sameSite) {
        cookieValue += `; samesite=${sameSite}`;
      }
      
      document.cookie = cookieValue;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  },
  
  /**
   * Get a cookie by name
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null if not found
   */
  get: (name) => {
    try {
      const nameEQ = `${encodeURIComponent(name)}=`;
      const cookies = document.cookie.split(';');
      
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
        }
        
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  },
  
  /**
   * Delete a cookie by name
   * @param {string} name - Cookie name
   * @param {string} path - Cookie path
   */
  remove: (name, path = '/') => {
    try {
      document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  },
  
  /**
   * Check if a cookie exists
   * @param {string} name - Cookie name
   * @returns {boolean} True if cookie exists
   */
  exists: (name) => {
    try {
      return cookies.get(name) !== null;
    } catch (error) {
      console.error('Error checking cookie:', error);
      return false;
    }
  }
};

/**
 * Auth storage - specific functions for handling authentication data
 */
export const authStorage = {
  /**
   * Save authentication token
   * @param {string} token - Authentication token
   * @param {boolean} remember - Whether to remember the token (longer expiry)
   */
  setToken: (token, remember = false) => {
    const expiryMinutes = remember ? 60 * 24 * 7 : 60 * 24; // 7 days or 1 day
    localStorage.set(STORAGE_KEYS.AUTH_TOKEN, token, expiryMinutes);
  },
  
  /**
   * Get authentication token
   * @returns {string|null} Authentication token
   */
  getToken: () => {
    return localStorage.get(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  /**
   * Remove authentication token
   */
  removeToken: () => {
    localStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  /**
   * Save user data
   * @param {Object} user - User data
   * @param {boolean} remember - Whether to remember the user (longer expiry)
   */
  setUser: (user, remember = false) => {
    const expiryMinutes = remember ? 60 * 24 * 7 : 60 * 24; // 7 days or 1 day
    localStorage.set(STORAGE_KEYS.USER, user, expiryMinutes);
  },
  
  /**
   * Get user data
   * @returns {Object|null} User data
   */
  getUser: () => {
    return localStorage.get(STORAGE_KEYS.USER);
  },
  
  /**
   * Remove user data
   */
  removeUser: () => {
    localStorage.remove(STORAGE_KEYS.USER);
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return localStorage.exists(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    localStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.remove(STORAGE_KEYS.USER);
  }
};

/**
 * Settings storage - for user preferences and app settings
 */
export const settingsStorage = {
  /**
   * Set theme preference
   * @param {string} theme - Theme name (light, dark, system)
   */
  setTheme: (theme) => {
    localStorage.set(STORAGE_KEYS.THEME, theme);
  },
  
  /**
   * Get theme preference
   * @returns {string} Theme name (defaults to 'system')
   */
  getTheme: () => {
    return localStorage.get(STORAGE_KEYS.THEME, 'system');
  },
  
  /**
   * Set language preference
   * @param {string} language - Language code
   */
  setLanguage: (language) => {
    localStorage.set(STORAGE_KEYS.LANGUAGE, language);
  },
  
  /**
   * Get language preference
   * @returns {string} Language code (defaults to 'id')
   */
  getLanguage: () => {
    return localStorage.get(STORAGE_KEYS.LANGUAGE, 'id');
  }
};

/**
 * Booking storage - for temporary booking data
 */
export const bookingStorage = {
  /**
   * Save booking draft
   * @param {Object} bookingData - Booking form data
   */
  saveDraft: (bookingData) => {
    localStorage.set(STORAGE_KEYS.BOOKING_DRAFT, bookingData, 60); // 1 hour expiry
  },
  
  /**
   * Get booking draft
   * @returns {Object|null} Booking draft data
   */
  getDraft: () => {
    return localStorage.get(STORAGE_KEYS.BOOKING_DRAFT);
  },
  
  /**
   * Clear booking draft
   */
  clearDraft: () => {
    localStorage.remove(STORAGE_KEYS.BOOKING_DRAFT);
  }
};

/**
 * Search storage - for recent searches
 */
export const searchStorage = {
  /**
   * Add a search term to recent searches
   * @param {string} term - Search term
   * @param {number} maxItems - Maximum number of items to keep
   */
  addRecentSearch: (term, maxItems = 5) => {
    const searches = localStorage.get(STORAGE_KEYS.RECENT_SEARCHES, []);
    
    // Remove if already exists (to move to top)
    const filteredSearches = searches.filter(s => s !== term);
    
    // Add to beginning of array
    filteredSearches.unshift(term);
    
    // Limit the number of items
    const limitedSearches = filteredSearches.slice(0, maxItems);
    
    localStorage.set(STORAGE_KEYS.RECENT_SEARCHES, limitedSearches);
  },
  
  /**
   * Get recent searches
   * @returns {Array} Recent search terms
   */
  getRecentSearches: () => {
    return localStorage.get(STORAGE_KEYS.RECENT_SEARCHES, []);
  },
  
  /**
   * Clear recent searches
   */
  clearRecentSearches: () => {
    localStorage.remove(STORAGE_KEYS.RECENT_SEARCHES);
  }
};

export default {
  localStorage,
  sessionStorage,
  cookies,
  authStorage,
  settingsStorage,
  bookingStorage,
  searchStorage
};
