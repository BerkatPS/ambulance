import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PaymentStatus({ status, amount, timestamp, reference, className = '' }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
      case 'paid':
      case 'completed':
        return {
          icon: CheckCircleIcon,
          color: 'text-success',
          bgColor: 'bg-success-100',
          title: 'Payment Successful',
          description: 'Your payment has been successfully processed.'
        };
      case 'failed':
      case 'rejected':
        return {
          icon: XCircleIcon,
          color: 'text-danger',
          bgColor: 'bg-danger-100',
          title: 'Payment Failed',
          description: 'We were unable to process your payment. Please try again.'
        };
      case 'pending':
      case 'waiting':
        return {
          icon: ClockIcon,
          color: 'text-warning',
          bgColor: 'bg-warning-100',
          title: 'Payment Pending',
          description: 'Your payment is currently being processed.'
        };
      case 'expired':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-medical-gray-600',
          bgColor: 'bg-medical-gray-100',
          title: 'Payment Expired',
          description: 'This payment has expired. Please make a new payment.'
        };
      default:
        return {
          icon: ClockIcon,
          color: 'text-info',
          bgColor: 'bg-info-100',
          title: 'Payment Status',
          description: 'The status of your payment.'
        };
    }
  };

  const { icon: Icon, color, bgColor, title, description } = getStatusConfig();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-medical ${className}`}>
      <div className={`${bgColor} px-6 py-8 text-center`}>
        <div className="flex justify-center">
          <Icon className={`h-16 w-16 ${color}`} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-medical-gray-900 font-heading">{title}</h2>
        <p className="mt-1 text-medical-gray-600">{description}</p>
        
        {amount && (
          <div className="mt-6">
            <span className="text-2xl font-bold text-medical-gray-900">{formatCurrency(amount)}</span>
          </div>
        )}
      </div>
      
      <div className="bg-white px-6 py-4 border-t border-medical-gray-200">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-medical-gray-500">Status</dt>
            <dd className="mt-1 text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'success' || status === 'paid' || status === 'completed' ? 'bg-success-100 text-success-800' :
                status === 'failed' || status === 'rejected' ? 'bg-danger-100 text-danger-800' :
                status === 'pending' || status === 'waiting' ? 'bg-warning-100 text-warning-800' :
                'bg-medical-gray-100 text-medical-gray-800'
              }`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
              </span>
            </dd>
          </div>
          
          {timestamp && (
            <div>
              <dt className="text-sm font-medium text-medical-gray-500">Date & Time</dt>
              <dd className="mt-1 text-sm text-medical-gray-900">{formatDate(timestamp)}</dd>
            </div>
          )}
          
          {reference && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-medical-gray-500">Reference ID</dt>
              <dd className="mt-1 text-sm text-medical-gray-900 font-mono">{reference}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
