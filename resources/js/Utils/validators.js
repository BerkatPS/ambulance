/**
 * Validation utility functions for the Ambulance Portal
 * Used for client-side validation before form submission
 */

/**
 * Check if a value is empty (null, undefined, empty string, or only whitespace)
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Validate an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid
 */
export const isValidEmail = (email) => {
  if (isEmpty(email)) return false;
  
  // Standard email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate a phone number format
 * @param {string} phone - The phone number to validate
 * @param {boolean} allowInternational - Whether to allow international format
 * @returns {boolean} True if the phone number is valid
 */
export const isValidPhone = (phone, allowInternational = true) => {
  if (isEmpty(phone)) return false;
  
  // Remove all non-numeric characters for comparison
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for minimum length
  if (cleaned.length < 8) return false;
  
  // Indonesian mobile number validation
  if (allowInternational) {
    // Check for valid Indonesian prefix (08, +62, or 62)
    if (phone.startsWith('08') || phone.startsWith('+62') || phone.startsWith('62')) {
      return cleaned.length >= 10 && cleaned.length <= 13;
    }
    
    // General international number (at least 8 digits)
    return cleaned.length >= 8;
  } else {
    // Only allow Indonesian numbers
    return (
      (phone.startsWith('08') && cleaned.length >= 10 && cleaned.length <= 12) ||
      ((phone.startsWith('+62') || phone.startsWith('62')) && cleaned.length >= 11 && cleaned.length <= 13)
    );
  }
};

/**
 * Validate a password meets security requirements
 * @param {string} password - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum password length (default: 8)
 * @param {boolean} options.requireUppercase - Require at least one uppercase letter
 * @param {boolean} options.requireLowercase - Require at least one lowercase letter
 * @param {boolean} options.requireNumber - Require at least one number
 * @param {boolean} options.requireSpecial - Require at least one special character
 * @returns {boolean} True if the password meets all requirements
 */
export const isValidPassword = (password, options = {}) => {
  if (isEmpty(password)) return false;
  
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false
  } = options;
  
  // Check minimum length
  if (password.length < minLength) return false;
  
  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  
  // Check for lowercase letters
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  
  // Check for numbers
  if (requireNumber && !/\d/.test(password)) return false;
  
  // Check for special characters
  if (requireSpecial && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
  
  return true;
};

/**
 * Validate an Indonesian postal code
 * @param {string} postalCode - The postal code to validate
 * @returns {boolean} True if the postal code is valid
 */
export const isValidPostalCode = (postalCode) => {
  if (isEmpty(postalCode)) return false;
  
  // Indonesian postal codes are 5 digits
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Validate if a date is in the future
 * @param {string|Date} date - The date to validate
 * @returns {boolean} True if the date is in the future
 */
export const isFutureDate = (date) => {
  if (isEmpty(date)) return false;
  
  try {
    const dateObj = new Date(date);
    const now = new Date();
    
    return dateObj > now;
  } catch (error) {
    return false;
  }
};

/**
 * Validate if a date is in the past
 * @param {string|Date} date - The date to validate
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date) => {
  if (isEmpty(date)) return false;
  
  try {
    const dateObj = new Date(date);
    const now = new Date();
    
    return dateObj < now;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a date format (YYYY-MM-DD)
 * @param {string} date - The date string to validate
 * @returns {boolean} True if the date format is valid
 */
export const isValidDateFormat = (date) => {
  if (isEmpty(date)) return false;
  
  // Check format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  // Check if it's a valid date
  try {
    const parts = date.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-11
    const day = parseInt(parts[2], 10);
    
    const dateObj = new Date(year, month, day);
    
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month &&
      dateObj.getDate() === day
    );
  } catch (error) {
    return false;
  }
};

/**
 * Validate an Indonesian ID number (KTP/NIK)
 * @param {string} nik - The NIK to validate
 * @returns {boolean} True if the NIK format is valid
 */
export const isValidNIK = (nik) => {
  if (isEmpty(nik)) return false;
  
  // NIK should be 16 digits
  const nikRegex = /^\d{16}$/;
  
  if (!nikRegex.test(nik)) return false;
  
  // Additional validation could be added here, like checking province codes
  // or birth date encoded in the NIK, but that's more complex
  
  return true;
};

/**
 * Validate form fields against a set of rules
 * @param {Object} data - The form data to validate
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} Object with errors for invalid fields
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const field in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, field)) {
      const fieldRules = rules[field];
      const value = data[field];
      
      // Required field check
      if (fieldRules.required && isEmpty(value)) {
        errors[field] = fieldRules.requiredMessage || 'This field is required';
        continue; // Skip other validations if the field is required and empty
      }
      
      // Skip other validations if field is empty and not required
      if (isEmpty(value) && !fieldRules.required) {
        continue;
      }
      
      // Email validation
      if (fieldRules.email && !isValidEmail(value)) {
        errors[field] = fieldRules.emailMessage || 'Please enter a valid email address';
      }
      
      // Phone validation
      if (fieldRules.phone && !isValidPhone(value, fieldRules.allowInternational)) {
        errors[field] = fieldRules.phoneMessage || 'Please enter a valid phone number';
      }
      
      // Password validation
      if (fieldRules.password && !isValidPassword(value, fieldRules.passwordOptions)) {
        errors[field] = fieldRules.passwordMessage || 'Password does not meet security requirements';
      }
      
      // Minimum length validation
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = fieldRules.minLengthMessage || `Must be at least ${fieldRules.minLength} characters`;
      }
      
      // Maximum length validation
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = fieldRules.maxLengthMessage || `Must be at most ${fieldRules.maxLength} characters`;
      }
      
      // Pattern validation
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors[field] = fieldRules.patternMessage || 'Invalid format';
      }
      
      // Custom validation
      if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customError = fieldRules.custom(value, data);
        if (customError) {
          errors[field] = customError;
        }
      }
    }
  }
  
  return errors;
};

export default {
  isEmpty,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidPostalCode,
  isFutureDate,
  isPastDate,
  isValidDateFormat,
  isValidNIK,
  validateForm
};
