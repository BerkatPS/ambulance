/**
 * API utility functions for the Ambulance Portal
 * This file handles all API requests and responses
 */

import axios from 'axios';
import { API, STORAGE_KEYS, ERROR_MESSAGES } from './constants';

/**
 * Create an axios instance with default config
 */
const apiClient = axios.create({
  baseURL: `${API.BASE_URL}/${API.VERSION}`,
  timeout: API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

/**
 * Request interceptor
 * Add authentication token to requests if available
 */
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle common response errors
 */
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session_expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request handler
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload (for POST, PUT)
 * @param {Object} config - Additional axios config
 * @returns {Promise} Promise resolving to response data
 */
const request = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data: method !== 'get' ? data : null,
      params: method === 'get' ? data : null,
      ...config
    });
    
    return response.data;
  } catch (error) {
    // Format and re-throw the error
    const errorMessage = formatErrorMessage(error);
    const formattedError = new Error(errorMessage);
    formattedError.originalError = error;
    formattedError.response = error.response;
    formattedError.status = error.response ? error.response.status : null;
    
    throw formattedError;
  }
};

/**
 * Format error message from API response
 * @param {Error} error - Error object from API call
 * @returns {string} Formatted error message
 */
const formatErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.GENERIC;
  
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  const { status, data } = error.response;
  
  // Handle validation errors
  if (status === 422 && data.errors) {
    const firstError = Object.values(data.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  
  // Handle error with message
  if (data && data.message) {
    return data.message;
  }
  
  // Handle common HTTP status codes
  switch (status) {
    case 400:
      return data.error || 'Bad request';
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return 'You do not have permission to perform this action';
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.SERVER;
    default:
      return ERROR_MESSAGES.GENERIC;
  }
};

/**
 * API services organized by entity
 */
const api = {
  /**
   * Authentication API
   */
  auth: {
    /**
     * Log in a user
     * @param {Object} credentials - User credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise} Promise resolving to user data with token
     */
    login: (credentials) => request('post', API.AUTH.LOGIN, credentials),
    
    /**
     * Register a new user
     * @param {Object} userData - New user data
     * @returns {Promise} Promise resolving to registered user data
     */
    register: (userData) => request('post', API.AUTH.REGISTER, userData),
    
    /**
     * Log out current user
     * @returns {Promise} Promise resolving to logout confirmation
     */
    logout: () => request('post', API.AUTH.LOGOUT),
    
    /**
     * Request password reset
     * @param {Object} data - Password reset request data
     * @param {string} data.email - User email
     * @returns {Promise} Promise resolving to reset confirmation
     */
    forgotPassword: (data) => request('post', API.AUTH.FORGOT_PASSWORD, data),
    
    /**
     * Reset password with token
     * @param {Object} data - Password reset data
     * @returns {Promise} Promise resolving to reset confirmation
     */
    resetPassword: (data) => request('post', API.AUTH.RESET_PASSWORD, data),
    
    /**
     * Get current authenticated user
     * @returns {Promise} Promise resolving to user data
     */
    me: () => request('get', API.AUTH.ME),
  },
  
  /**
   * Admin API
   */
  admin: {
    /**
     * Get dashboard statistics
     * @returns {Promise} Promise resolving to dashboard data
     */
    getDashboardStats: () => request('get', API.ADMIN.DASHBOARD),
    
    /**
     * Get bookings with pagination and filters
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated bookings
     */
    getBookings: (params) => request('get', API.ADMIN.BOOKINGS, params),
    
    /**
     * Get a single booking by ID
     * @param {number|string} id - Booking ID
     * @returns {Promise} Promise resolving to booking data
     */
    getBooking: (id) => request('get', `${API.ADMIN.BOOKINGS}/${id}`),
    
    /**
     * Update a booking
     * @param {number|string} id - Booking ID
     * @param {Object} data - Updated booking data
     * @returns {Promise} Promise resolving to updated booking
     */
    updateBooking: (id, data) => request('put', `${API.ADMIN.BOOKINGS}/${id}`, data),
    
    /**
     * Delete a booking
     * @param {number|string} id - Booking ID
     * @returns {Promise} Promise resolving to deletion confirmation
     */
    deleteBooking: (id) => request('delete', `${API.ADMIN.BOOKINGS}/${id}`),
    
    /**
     * Get drivers with pagination and filters
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated drivers
     */
    getDrivers: (params) => request('get', API.ADMIN.DRIVERS, params),
    
    /**
     * Get a single driver by ID
     * @param {number|string} id - Driver ID
     * @returns {Promise} Promise resolving to driver data
     */
    getDriver: (id) => request('get', `${API.ADMIN.DRIVERS}/${id}`),
    
    /**
     * Create a new driver
     * @param {Object} data - New driver data
     * @returns {Promise} Promise resolving to created driver
     */
    createDriver: (data) => request('post', API.ADMIN.DRIVERS, data),
    
    /**
     * Update a driver
     * @param {number|string} id - Driver ID
     * @param {Object} data - Updated driver data
     * @returns {Promise} Promise resolving to updated driver
     */
    updateDriver: (id, data) => request('put', `${API.ADMIN.DRIVERS}/${id}`, data),
    
    /**
     * Delete a driver
     * @param {number|string} id - Driver ID
     * @returns {Promise} Promise resolving to deletion confirmation
     */
    deleteDriver: (id) => request('delete', `${API.ADMIN.DRIVERS}/${id}`),
    
    /**
     * Get ambulances with pagination and filters
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated ambulances
     */
    getAmbulances: (params) => request('get', API.ADMIN.AMBULANCES, params),
    
    /**
     * Get a single ambulance by ID
     * @param {number|string} id - Ambulance ID
     * @returns {Promise} Promise resolving to ambulance data
     */
    getAmbulance: (id) => request('get', `${API.ADMIN.AMBULANCES}/${id}`),
    
    /**
     * Create a new ambulance
     * @param {Object} data - New ambulance data
     * @returns {Promise} Promise resolving to created ambulance
     */
    createAmbulance: (data) => request('post', API.ADMIN.AMBULANCES, data),
    
    /**
     * Update an ambulance
     * @param {number|string} id - Ambulance ID
     * @param {Object} data - Updated ambulance data
     * @returns {Promise} Promise resolving to updated ambulance
     */
    updateAmbulance: (id, data) => request('put', `${API.ADMIN.AMBULANCES}/${id}`, data),
    
    /**
     * Delete an ambulance
     * @param {number|string} id - Ambulance ID
     * @returns {Promise} Promise resolving to deletion confirmation
     */
    deleteAmbulance: (id) => request('delete', `${API.ADMIN.AMBULANCES}/${id}`),
    
    /**
     * Get users with pagination and filters
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated users
     */
    getUsers: (params) => request('get', API.ADMIN.USERS, params),
    
    /**
     * Get a single user by ID
     * @param {number|string} id - User ID
     * @returns {Promise} Promise resolving to user data
     */
    getUser: (id) => request('get', `${API.ADMIN.USERS}/${id}`),
    
    /**
     * Update a user
     * @param {number|string} id - User ID
     * @param {Object} data - Updated user data
     * @returns {Promise} Promise resolving to updated user
     */
    updateUser: (id, data) => request('put', `${API.ADMIN.USERS}/${id}`, data),
    
    /**
     * Delete a user
     * @param {number|string} id - User ID
     * @returns {Promise} Promise resolving to deletion confirmation
     */
    deleteUser: (id) => request('delete', `${API.ADMIN.USERS}/${id}`),
    
    /**
     * Get payments with pagination and filters
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated payments
     */
    getPayments: (params) => request('get', API.ADMIN.PAYMENTS, params),
    
    /**
     * Get a single payment by ID
     * @param {number|string} id - Payment ID
     * @returns {Promise} Promise resolving to payment data
     */
    getPayment: (id) => request('get', `${API.ADMIN.PAYMENTS}/${id}`),
    
    /**
     * Update a payment
     * @param {number|string} id - Payment ID
     * @param {Object} data - Updated payment data
     * @returns {Promise} Promise resolving to updated payment
     */
    updatePayment: (id, data) => request('put', `${API.ADMIN.PAYMENTS}/${id}`, data),
  },
  
  /**
   * User API
   */
  user: {
    /**
     * Get current user profile
     * @returns {Promise} Promise resolving to user profile
     */
    getProfile: () => request('get', API.USER.PROFILE),
    
    /**
     * Update user profile
     * @param {Object} data - Updated profile data
     * @returns {Promise} Promise resolving to updated profile
     */
    updateProfile: (data) => request('put', API.USER.PROFILE, data),
    
    /**
     * Get user bookings with pagination
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated bookings
     */
    getBookings: (params) => request('get', API.USER.BOOKINGS, params),
    
    /**
     * Get a single booking by ID
     * @param {number|string} id - Booking ID
     * @returns {Promise} Promise resolving to booking data
     */
    getBooking: (id) => request('get', `${API.USER.BOOKINGS}/${id}`),
    
    /**
     * Get user payments with pagination
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated payments
     */
    getPayments: (params) => request('get', API.USER.PAYMENTS, params),
    
    /**
     * Get user notifications with pagination
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated notifications
     */
    getNotifications: (params) => request('get', API.USER.NOTIFICATIONS, params),
    
    /**
     * Mark notifications as read
     * @param {Array|string} ids - Notification ID(s) to mark as read
     * @returns {Promise} Promise resolving to success confirmation
     */
    markNotificationsAsRead: (ids) => request('post', `${API.USER.NOTIFICATIONS}/read`, { ids }),
    
    /**
     * Get user ratings with pagination
     * @param {Object} params - Query parameters
     * @returns {Promise} Promise resolving to paginated ratings
     */
    getRatings: (params) => request('get', API.USER.RATINGS, params),
  },
  
  /**
   * Booking API
   */
  booking: {
    /**
     * Create a new booking
     * @param {Object} data - Booking data
     * @returns {Promise} Promise resolving to created booking
     */
    create: (data) => request('post', API.BOOKING.CREATE, data),
    
    /**
     * Create an emergency booking
     * @param {Object} data - Emergency booking data
     * @returns {Promise} Promise resolving to created emergency booking
     */
    createEmergency: (data) => request('post', API.BOOKING.EMERGENCY, data),
    
    /**
     * Get booking status
     * @param {number|string} id - Booking ID
     * @returns {Promise} Promise resolving to booking status
     */
    getStatus: (id) => request('get', `${API.BOOKING.STATUS}/${id}`),
    
    /**
     * Cancel a booking
     * @param {number|string} id - Booking ID
     * @param {Object} data - Cancellation reason
     * @returns {Promise} Promise resolving to cancellation confirmation
     */
    cancel: (id, data) => request('post', `${API.BOOKING.CANCEL}/${id}`, data),
    
    /**
     * Track a booking location
     * @param {number|string} id - Booking ID
     * @returns {Promise} Promise resolving to tracking data
     */
    track: (id) => request('get', `${API.BOOKING.TRACK}/${id}`),
  },
  
  /**
   * Payment API
   */
  payment: {
    /**
     * Process a payment
     * @param {Object} data - Payment data
     * @returns {Promise} Promise resolving to payment result
     */
    process: (data) => request('post', API.PAYMENT.PROCESS, data),
    
    /**
     * Verify a payment
     * @param {number|string} id - Payment ID
     * @returns {Promise} Promise resolving to verification result
     */
    verify: (id) => request('get', `${API.PAYMENT.VERIFY}/${id}`),
    
    /**
     * Get available payment methods
     * @returns {Promise} Promise resolving to available payment methods
     */
    getMethods: () => request('get', API.PAYMENT.METHODS),
  },
  
  /**
   * Custom request function for more advanced use cases
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise resolving to response data
   */
  custom: (method, endpoint, data, config) => request(method, endpoint, data, config),
};

export default api;
