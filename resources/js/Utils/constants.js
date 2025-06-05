/**
 * Application constants for the Ambulance Portal
 * Centralized location for all fixed values used throughout the application
 */

/**
 * Application general settings
 */
export const APP_NAME = 'Ambulance Portal';
export const APP_VERSION = '1.0.0';
export const APP_COPYRIGHT = `  ${new Date().getFullYear()} Ambulance Portal. All rights reserved.`;
export const APP_CONTACT_EMAIL = 'support@ambulance-portal.com';
export const APP_CONTACT_PHONE = '+62 812-3456-7890';
export const APP_ADDRESS = 'Jl. Merdeka No. 123, Jakarta Pusat, Indonesia';

/**
 * API endpoints
 */
export const API = {
  BASE_URL: '/api',
  VERSION: 'v1',
  TIMEOUT: 30000, // 30 seconds
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    BOOKINGS: '/admin/bookings',
    DRIVERS: '/admin/drivers',
    AMBULANCES: '/admin/ambulances',
    USERS: '/admin/users',
    PAYMENTS: '/admin/payments',
    RATINGS: '/admin/ratings',
    MAINTENANCE: '/admin/maintenance',
    SETTINGS: '/admin/settings',
    NOTIFICATIONS: '/admin/notifications',
    HOSPITALS: '/admin/hospitals',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    BOOKINGS: '/user/bookings',
    PAYMENTS: '/user/payments',
    NOTIFICATIONS: '/user/notifications',
    RATINGS: '/user/ratings',
    ADDRESSES: '/user/addresses',
    MEDICAL_RECORDS: '/user/medical-records',
    EMERGENCY_CONTACTS: '/user/emergency-contacts',
  },
  
  // Booking endpoints
  BOOKING: {
    CREATE: '/bookings',
    EMERGENCY: '/bookings/emergency',
    STATUS: '/bookings/status',
    CANCEL: '/bookings/cancel',
    TRACK: '/bookings/track',
    HISTORY: '/bookings/history',
    DETAILS: '/bookings/:id',
    NEAREST: '/bookings/nearest',
    ESTIMATE: '/bookings/estimate',
  },
  
  // Payment endpoints
  PAYMENT: {
    PROCESS: '/payments/process',
    VERIFY: '/payments/verify',
    METHODS: '/payments/methods',
    INVOICE: '/payments/invoice',
    RECEIPT: '/payments/receipt',
    CALLBACK: '/payments/callback',
    HISTORY: '/payments/history',
  },
  
  // Driver endpoints
  DRIVER: {
    AVAILABILITY: '/drivers/availability',
    LOCATION: '/drivers/location',
    STATUS: '/drivers/status',
    ASSIGNMENTS: '/drivers/assignments',
    ROUTES: '/drivers/routes',
    REVIEWS: '/drivers/reviews',
  },
  
  // Ambulance endpoints
  AMBULANCE: {
    LOCATION: '/ambulances/location',
    STATUS: '/ambulances/status',
    MAINTENANCE: '/ambulances/maintenance',
    INVENTORY: '/ambulances/inventory',
    TYPES: '/ambulances/types',
  },
  
  // Hospital endpoints
  HOSPITAL: {
    LIST: '/hospitals',
    NEAREST: '/hospitals/nearest',
    DETAILS: '/hospitals/:id',
    SPECIALTIES: '/hospitals/specialties',
    AVAILABILITY: '/hospitals/availability',
  },
  
  // System endpoints
  SYSTEM: {
    HEALTH: '/system/health',
    STATS: '/system/stats',
    LOGS: '/system/logs',
    CONFIG: '/system/config',
  },
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ambulance_portal_auth_token',
  USER: 'ambulance_portal_user',
  THEME: 'ambulance_portal_theme',
  LANGUAGE: 'ambulance_portal_language',
  RECENT_SEARCHES: 'ambulance_portal_recent_searches',
  BOOKING_DRAFT: 'ambulance_portal_booking_draft',
  LAST_NOTIFICATION_CHECK: 'ambulance_portal_last_notification_check',
  LOCATION_PERMISSION: 'ambulance_portal_location_permission',
  REMEMBER_ME: 'ambulance_portal_remember_me',
  LAST_VIEWED_BOOKING: 'ambulance_portal_last_viewed_booking',
  PREFERRED_PAYMENT_METHOD: 'ambulance_portal_preferred_payment_method',
  SAVED_ADDRESSES: 'ambulance_portal_saved_addresses',
};

/**
 * Booking statuses
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  DRIVER_ASSIGNED: 'driver_assigned',
  DRIVER_EN_ROUTE: 'driver_en_route',
  ARRIVED_AT_PICKUP: 'arrived_at_pickup',
  PATIENT_ONBOARD: 'patient_onboard',
  EN_ROUTE_TO_DESTINATION: 'en_route_to_destination',
  ARRIVED_AT_DESTINATION: 'arrived_at_destination',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  CANCELLED_BY_USER: 'cancelled_by_user',
  CANCELLED_BY_DRIVER: 'cancelled_by_driver',
  CANCELLED_BY_ADMIN: 'cancelled_by_admin',
  EXPIRED: 'expired',
  FAILED: 'failed',
};

/**
 * Booking types
 */
export const BOOKING_TYPES = {
  EMERGENCY: 'emergency',
  SCHEDULED: 'scheduled',
  ROUTINE: 'routine',
  TRANSFER: 'transfer',
  ROUND_TRIP: 'round_trip',
  WAIT_AND_RETURN: 'wait_and_return',
};

/**
 * Payment statuses
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
};

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
  GOPAY: 'gopay',
  OVO: 'ovo',
  DANA: 'dana',
  SHOPEEPAY: 'shopeepay',
  LINKAJA: 'linkaja',
  QRIS: 'qris',
  BCA_VA: 'bca_va',
  MANDIRI_VA: 'mandiri_va',
  BNI_VA: 'bni_va',
  BRI_VA: 'bri_va',
  PERMATA_VA: 'permata_va',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  CASH: 'cash',
  INSURANCE: 'insurance',
  CORPORATE_BILLING: 'corporate_billing',
};

/**
 * Ambulance types
 */
export const AMBULANCE_TYPES = {
  BASIC: {
    id: 'basic',
    name: 'Ambulans Dasar',
    description: 'Layanan transportasi medis dasar dengan peralatan pertolongan pertama standar',
    price_per_km: 8000,
    base_fare: 75000,
  },
  EMERGENCY: {
    id: 'emergency',
    name: 'Ambulans Gawat Darurat',
    description: 'Dilengkapi alat medis lengkap dan staf terlatih untuk kasus gawat darurat',
    price_per_km: 12000,
    base_fare: 150000,
  },
  PATIENT_TRANSPORT: {
    id: 'patient_transport',
    name: 'Transportasi Pasien',
    description: 'Khusus untuk transportasi pasien antar fasilitas kesehatan dengan monitor vital signs',
    price_per_km: 10000,
    base_fare: 100000,
  },
  NEONATAL: {
    id: 'neonatal',
    name: 'Ambulans Neonatal',
    description: 'Khusus untuk bayi baru lahir dan prematur dengan inkubator portable',
    price_per_km: 15000,
    base_fare: 200000,
  },
  ICU: {
    id: 'icu',
    name: 'Ambulans ICU',
    description: 'Dilengkapi dengan peralatan ICU lengkap dan tenaga medis spesialis',
    price_per_km: 18000,
    base_fare: 250000,
  },
  BARIATRIC: {
    id: 'bariatric',
    name: 'Ambulans Bariatrik',
    description: 'Dirancang khusus untuk pasien dengan berat badan berlebih',
    price_per_km: 16000,
    base_fare: 180000,
  },
};

/**
 * Ambulance statuses
 */
export const AMBULANCE_STATUS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  ON_DUTY: 'on_duty',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
};

/**
 * User roles
 */
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STAFF: 'staff',
  DRIVER: 'driver',
  USER: 'user',
  HOSPITAL_ADMIN: 'hospital_admin',
  CORPORATE_ADMIN: 'corporate_admin',
};

/**
 * User statuses
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification',
};

/**
 * Driver statuses
 */
export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
  ON_BREAK: 'on_break',
  ON_ASSIGNMENT: 'on_assignment',
};

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_COMPLETED: 'booking_completed',
  DRIVER_ASSIGNED: 'driver_assigned',
  DRIVER_ARRIVED: 'driver_arrived',
  DRIVER_EN_ROUTE: 'driver_en_route',
  ARRIVED_AT_DESTINATION: 'arrived_at_destination',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
  RATING_REMINDER: 'rating_reminder',
  ACCOUNT_UPDATE: 'account_update',
  EMERGENCY_ALERT: 'emergency_alert',
  MAINTENANCE_NOTICE: 'maintenance_notice',
};

/**
 * Notification priorities
 */
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

/**
 * Map settings
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: -6.2088, lng: 106.8456 }, // Jakarta, Indonesia
  DEFAULT_ZOOM: 12,
  API_KEY: process.env.MIX_GOOGLE_MAPS_API_KEY || '',
  MARKER_COLORS: {
    USER: '#3B82F6', // blue
    DRIVER: '#10B981', // green
    DESTINATION: '#EF4444', // red
    HOSPITAL: '#8B5CF6', // purple
  },
  REFRESH_INTERVAL: 10000, // 10 seconds
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
};

/**
 * Time constants
 */
export const TIME = {
  MINUTE: 60, // seconds
  HOUR: 3600, // seconds
  DAY: 86400, // seconds
  WEEK: 604800, // seconds
  MONTH: 2592000, // seconds (30 days)
  BOOKING_EXPIRY: 1800, // seconds (30 minutes)
  PAYMENT_EXPIRY: 3600, // seconds (1 hour)
  DRIVER_RESPONSE_TIMEOUT: 30, // seconds
  LOCATION_UPDATE_INTERVAL: 10, // seconds
  NOTIFICATION_EXPIRY: 604800, // seconds (7 days)
};

/**
 * Form validation rules
 */
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME_MAX_LENGTH: 100,
  PHONE_REGEX: /^(\+62|62|0)8[1-9][0-9]{7,11}$/,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  ADDRESS_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  EMAIL_REGEX: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  LICENSE_PLATE_REGEX: /^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/,
  ID_CARD_REGEX: /^\d{16}$/,
  POSTAL_CODE_REGEX: /^\d{5}$/,
};

/**
 * Application routes
 */
export const ROUTES = {
  // Auth routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // User dashboard routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADDRESSES: '/addresses',
  MEDICAL_RECORDS: '/medical-records',
  EMERGENCY_CONTACTS: '/emergency-contacts',
  NOTIFICATIONS: '/notifications',
  
  // Booking routes
  BOOKING: '/bookings',
  BOOKING_NEW: '/bookings/new',
  BOOKING_EMERGENCY: '/bookings/emergency',
  BOOKING_TRACK: '/bookings/track',
  BOOKING_HISTORY: '/bookings/history',
  BOOKING_DETAILS: (id) => `/bookings/${id}`,
  
  // Payment routes
  PAYMENT: '/payments',
  PAYMENT_HISTORY: '/payments/history',
  PAYMENT_DETAILS: (id) => `/payments/${id}`,
  PAYMENT_PROCESS: (id) => `/payments/process/${id}`,
  PAYMENT_SUCCESS: '/payments/success',
  PAYMENT_FAILED: '/payments/failed',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    
    // User management
    USERS: '/admin/users',
    USER_CREATE: '/admin/users/create',
    USER_EDIT: (id) => `/admin/users/${id}/edit`,
    USER_SHOW: (id) => `/admin/users/${id}`,
    
    // Driver management
    DRIVERS: '/admin/drivers',
    DRIVER_CREATE: '/admin/drivers/create',
    DRIVER_EDIT: (id) => `/admin/drivers/${id}/edit`,
    DRIVER_SHOW: (id) => `/admin/drivers/${id}`,
    
    // Ambulance management
    AMBULANCES: '/admin/ambulances',
    AMBULANCE_CREATE: '/admin/ambulances/create',
    AMBULANCE_EDIT: (id) => `/admin/ambulances/${id}/edit`,
    AMBULANCE_SHOW: (id) => `/admin/ambulances/${id}`,
    
    // Booking management
    BOOKINGS: '/admin/bookings',
    BOOKING_CREATE: '/admin/bookings/create',
    BOOKING_EDIT: (id) => `/admin/bookings/${id}/edit`,
    BOOKING_SHOW: (id) => `/admin/bookings/${id}`,
    
    // Payment management
    PAYMENTS: '/admin/payments',
    PAYMENT_SHOW: (id) => `/admin/payments/${id}`,
    
    // Hospital management
    HOSPITALS: '/admin/hospitals',
    HOSPITAL_CREATE: '/admin/hospitals/create',
    HOSPITAL_EDIT: (id) => `/admin/hospitals/${id}/edit`,
    HOSPITAL_SHOW: (id) => `/admin/hospitals/${id}`,
    
    // Rating & Reviews
    RATINGS: '/admin/ratings',
    
    // Notifications
    NOTIFICATIONS: '/admin/notifications',
    
    // Reports
    REPORTS: '/admin/reports',
    REPORT_BOOKINGS: '/admin/reports/bookings',
    REPORT_PAYMENTS: '/admin/reports/payments',
    REPORT_DRIVERS: '/admin/reports/drivers',
    REPORT_USERS: '/admin/reports/users',
    
    // Settings
    SETTINGS: '/admin/settings',
    SETTINGS_GENERAL: '/admin/settings/general',
    SETTINGS_PAYMENT: '/admin/settings/payment',
    SETTINGS_NOTIFICATION: '/admin/settings/notification',
    SETTINGS_API: '/admin/settings/api',
    
    // Maintenance
    MAINTENANCE: '/admin/maintenance',
    MAINTENANCE_SCHEDULE: '/admin/maintenance/schedule',
    MAINTENANCE_HISTORY: '/admin/maintenance/history',
  },
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 25, 50, 100],
  MAX_VISIBLE_PAGES: 5,
};

/**
 * Theme settings
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Languages
 */
export const LANGUAGES = {
  INDONESIAN: 'id',
  ENGLISH: 'en',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Terjadi kesalahan. Silakan coba lagi nanti.',
  NETWORK: 'Kesalahan jaringan. Silakan periksa koneksi internet Anda.',
  SERVER: 'Kesalahan server. Tim kami telah diberitahu.',
  NOT_FOUND: 'Sumber daya yang diminta tidak ditemukan.',
  UNAUTHORIZED: 'Anda tidak berwenang untuk melakukan tindakan ini.',
  VALIDATION: 'Silakan periksa formulir untuk kesalahan.',
  SESSION_EXPIRED: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
  PAYMENT_FAILED: 'Pemrosesan pembayaran gagal. Silakan coba lagi.',
  BOOKING_FAILED: 'Pembuatan pemesanan gagal. Silakan coba lagi.',
  LOCATION_ACCESS_DENIED: 'Akses lokasi ditolak. Layanan memerlukan izin lokasi untuk berfungsi dengan baik.',
  DRIVER_NOT_FOUND: 'Tidak ada pengemudi yang tersedia saat ini. Silakan coba lagi nanti.',
  AMBULANCE_NOT_AVAILABLE: 'Ambulans tidak tersedia saat ini. Silakan coba lagi nanti.',
  INVALID_CREDENTIALS: 'Email atau kata sandi tidak valid.',
  ACCOUNT_SUSPENDED: 'Akun Anda telah ditangguhkan. Silakan hubungi dukungan pelanggan.',
  INVALID_OTP: 'Kode OTP tidak valid atau telah kedaluwarsa.',
  TOO_MANY_ATTEMPTS: 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
  BOOKING_ALREADY_EXISTS: 'Anda memiliki pemesanan aktif. Selesaikan atau batalkan pemesanan Anda yang ada.',
  BOOKING_CANCELLED: 'Pemesanan telah dibatalkan dan tidak dapat diubah.',
  INVALID_PAYMENT_METHOD: 'Metode pembayaran tidak valid atau tidak didukung.',
  PAYMENT_TIMEOUT: 'Waktu pemrosesan pembayaran habis. Silakan coba lagi.',
  INVALID_DESTINATION: 'Tujuan tidak valid atau di luar area layanan.',
  RATE_LIMIT_EXCEEDED: 'Batas kecepatan terlampaui. Silakan coba lagi nanti.',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Pemesanan berhasil dibuat!',
  BOOKING_UPDATED: 'Pemesanan berhasil diperbarui!',
  BOOKING_CANCELLED: 'Pemesanan berhasil dibatalkan.',
  DRIVER_ASSIGNED: 'Pengemudi telah ditugaskan untuk pemesanan Anda.',
  DRIVER_ARRIVED: 'Pengemudi telah tiba di lokasi penjemputan.',
  ARRIVED_AT_DESTINATION: 'Telah tiba di tujuan.',
  PAYMENT_COMPLETED: 'Pembayaran berhasil diselesaikan!',
  PAYMENT_REFUNDED: 'Pembayaran berhasil dikembalikan.',
  PROFILE_UPDATED: 'Profil berhasil diperbarui!',
  PASSWORD_CHANGED: 'Kata sandi berhasil diubah!',
  EMAIL_SENT: 'Email berhasil dikirim!',
  RATING_SUBMITTED: 'Terima kasih atas umpan balik Anda!',
  ACCOUNT_CREATED: 'Akun berhasil dibuat! Silakan verifikasi email Anda.',
  ACCOUNT_VERIFIED: 'Akun Anda telah diverifikasi!',
  PASSWORD_RESET_LINK_SENT: 'Tautan reset kata sandi telah dikirim ke email Anda.',
  NOTIFICATION_MARKED_READ: 'Notifikasi ditandai sebagai telah dibaca.',
  ADDRESS_ADDED: 'Alamat berhasil ditambahkan.',
  CONTACT_ADDED: 'Kontak darurat berhasil ditambahkan.',
  DATA_SAVED: 'Data berhasil disimpan.',
  FEEDBACK_SUBMITTED: 'Umpan balik berhasil dikirim. Terima kasih!',
};

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DEFAULT: 'DD MMM YYYY',
  WITH_TIME: 'DD MMM YYYY, HH:mm',
  SHORT: 'DD/MM/YY',
  DAY_MONTH: 'DD MMM',
  TIME_ONLY: 'HH:mm',
  DAY_NAME: 'dddd',
  MONTH_YEAR: 'MMMM YYYY',
  ISO: 'YYYY-MM-DD',
};

/**
 * Regex patterns
 */
export const REGEX_PATTERNS = {
  PHONE: /^(\+62|62|0)8[1-9][0-9]{7,11}$/,
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  LICENSE_PLATE: /^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/,
  ID_CARD: /^\d{16}$/,
  POSTAL_CODE: /^\d{5}$/,
};

/**
 * Rating constants
 */
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
};

export default {
  APP_NAME,
  APP_VERSION,
  APP_COPYRIGHT,
  APP_CONTACT_EMAIL,
  APP_CONTACT_PHONE,
  APP_ADDRESS,
  API,
  STORAGE_KEYS,
  BOOKING_STATUS,
  BOOKING_TYPES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  AMBULANCE_TYPES,
  AMBULANCE_STATUS,
  USER_ROLES,
  USER_STATUS,
  DRIVER_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  MAP_CONFIG,
  TIME,
  VALIDATION_RULES,
  ROUTES,
  PAGINATION,
  THEMES,
  LANGUAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  REGEX_PATTERNS,
  RATING,
};
