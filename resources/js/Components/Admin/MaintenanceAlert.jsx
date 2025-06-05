import React from 'react';

export default function MaintenanceAlert({ 
  title, 
  message, 
  type = 'warning', 
  onDismiss,
  actionText,
  onAction
}) {
  // Determine the styling based on the alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
      case 'danger':
        return {
          bg: 'bg-danger-50',
          border: 'border-danger-200',
          text: 'text-danger-800',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          text: 'text-success-800',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'info':
        return {
          bg: 'bg-info-50',
          border: 'border-info-200',
          text: 'text-info-800',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'warning':
      default:
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          text: 'text-warning-800',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const { bg, border, text, icon } = getAlertStyles();

  return (
    <div className={`rounded-lg border ${border} ${bg} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${text}`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ${text}`}>
            <p>{message}</p>
          </div>
          
          {(onAction || onDismiss) && (
            <div className="mt-4">
              <div className="flex space-x-3">
                {onAction && actionText && (
                  <button
                    type="button"
                    onClick={onAction}
                    className={`rounded-md bg-${type}-100 px-3 py-2 text-sm font-medium ${text} hover:bg-${type}-200 focus:outline-none focus:ring-2 focus:ring-${type}-500 focus:ring-offset-2`}
                  >
                    {actionText}
                  </button>
                )}
                {onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className={`rounded-md bg-white px-3 py-2 text-sm font-medium text-medical-gray-700 hover:bg-medical-gray-50 focus:outline-none focus:ring-2 focus:ring-${type}-500 focus:ring-offset-2`}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
