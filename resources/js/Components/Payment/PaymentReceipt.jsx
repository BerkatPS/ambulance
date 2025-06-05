import React from 'react';
import { CheckCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function PaymentReceipt({ 
  payment, 
  booking, 
  onDownload,
  showPrintButton = true 
}) {
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

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'gopay': 'GoPay',
      'qris': 'QRIS',
      'va_bca': 'Virtual Account BCA',
      'va_mandiri': 'Virtual Account Mandiri', 
      'va_bri': 'Virtual Account BRI',
      'va_bni': 'Virtual Account BNI'
    };
    
    return methods[method] || method;
  };

  const handlePrintReceipt = () => {
    if (onDownload && typeof onDownload === 'function') {
      onDownload();
      return;
    }
    
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-medical overflow-hidden print:shadow-none print:border">
      <div className="px-6 py-4 border-b border-medical-gray-200 flex justify-between items-center print:hidden">
        <h3 className="text-lg font-medium text-medical-gray-900">Payment Receipt</h3>
        
        {showPrintButton && (
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="inline-flex items-center px-3 py-1.5 border border-medical-gray-300 shadow-sm text-sm font-medium rounded-md text-medical-gray-700 bg-white hover:bg-medical-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
            Download Receipt
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="text-center mb-6 print:mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success-100 print:hidden">
            <CheckCircleIcon className="h-8 w-8 text-success-600" />
          </div>
          
          <h2 className="mt-4 text-xl font-semibold text-medical-gray-900 font-heading print:mt-0">
            Payment Successful
          </h2>
          
          {payment?.amount && (
            <div className="mt-2">
              <span className="text-2xl font-bold text-medical-gray-900">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          )}
        </div>
        
        <div className="border-t border-b border-medical-gray-200 py-4 px-1 print:border-t-0">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-medical-gray-500">Receipt Number</p>
              <p className="text-sm font-medium text-medical-gray-900 font-mono">
                {payment?.receipt_number || payment?.id || 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-medical-gray-500">Payment Date</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {formatDate(payment?.created_at || payment?.payment_date)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-medical-gray-500">Payment Method</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {getPaymentMethodLabel(payment?.method || payment?.payment_method)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-medical-gray-500">Status</p>
              <p className="text-sm font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  {payment?.status === 'paid' ? 'Paid' : 
                   payment?.status === 'completed' ? 'Completed' : 
                   payment?.status || 'Paid'}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-4 px-1">
          <h4 className="text-sm font-medium text-medical-gray-900 mb-3">
            Booking Details
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-medical-gray-500">Booking ID</p>
              <p className="text-sm font-medium text-medical-gray-900 font-mono">
                {booking?.id || 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-medical-gray-500">Booking Date</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {formatDate(booking?.created_at || booking?.booking_date)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-medical-gray-500">Patient Name</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {booking?.patient_name || 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-medical-gray-500">Ambulance Type</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {booking?.ambulance_type === 'basic' ? 'Basic Life Support' :
                 booking?.ambulance_type === 'advanced' ? 'Advanced Life Support' :
                 booking?.ambulance_type === 'neonatal' ? 'Neonatal' :
                 booking?.ambulance_type === 'patient_transport' ? 'Patient Transport' :
                 booking?.ambulance_type || 'Standard'}
              </p>
            </div>
            
            <div className="col-span-2">
              <p className="text-sm text-medical-gray-500">Pickup Location</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {booking?.pickup_location || 'N/A'}
              </p>
            </div>
            
            <div className="col-span-2">
              <p className="text-sm text-medical-gray-500">Destination</p>
              <p className="text-sm font-medium text-medical-gray-900">
                {booking?.dropoff_location || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        {payment?.amount && (
          <div className="border-t border-medical-gray-200 py-4 px-1">
            <h4 className="text-sm font-medium text-medical-gray-900 mb-3">
              Payment Details
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-medical-gray-500">Base Fare</p>
                <p className="text-sm font-medium text-medical-gray-900">
                  {formatCurrency(payment?.base_fare || (payment?.amount * 0.8))}
                </p>
              </div>
              
              {payment?.distance_charge && (
                <div className="flex justify-between">
                  <p className="text-sm text-medical-gray-500">Distance Charge</p>
                  <p className="text-sm font-medium text-medical-gray-900">
                    {formatCurrency(payment.distance_charge)}
                  </p>
                </div>
              )}
              
              {payment?.additional_charges && (
                <div className="flex justify-between">
                  <p className="text-sm text-medical-gray-500">Additional Charges</p>
                  <p className="text-sm font-medium text-medical-gray-900">
                    {formatCurrency(payment.additional_charges)}
                  </p>
                </div>
              )}
              
              {(payment?.tax || payment?.amount * 0.1) > 0 && (
                <div className="flex justify-between">
                  <p className="text-sm text-medical-gray-500">Tax</p>
                  <p className="text-sm font-medium text-medical-gray-900">
                    {formatCurrency(payment?.tax || payment?.amount * 0.1)}
                  </p>
                </div>
              )}
              
              <div className="border-t border-medical-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-medical-gray-900">Total Amount</p>
                  <p className="text-sm font-bold text-medical-gray-900">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center print:hidden">
          <Link
            href={route('dashboard')}
            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
          >
            Return to Dashboard
          </Link>
        </div>
        
        <div className="mt-6 text-xs text-medical-gray-500 text-center border-t border-medical-gray-200 pt-4">
          <p>For any questions or assistance, please contact our support team.</p>
          <p className="mt-1">Thank you for using our ambulance service.</p>
        </div>
      </div>
    </div>
  );
}
