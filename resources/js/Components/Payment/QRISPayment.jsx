import React, { useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import PaymentTimer from './PaymentTimer';

export default function QRISPayment({ 
  qrCode, 
  qrCodeUrl, 
  amount, 
  expiryTime, 
  virtualAccount,
  onExpired 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-medical overflow-hidden">
      <div className="bg-medical-gray-50 px-6 py-4 border-b border-medical-gray-200">
        <h3 className="text-lg font-medium text-medical-gray-900">QRIS Payment</h3>
        <p className="mt-1 text-sm text-medical-gray-600">
          Scan the QR code using any QRIS-supported mobile banking or e-wallet app
        </p>
      </div>
      
      <div className="p-6">
        {expiryTime && (
          <div className="mb-6">
            <PaymentTimer expiryTime={expiryTime} onExpired={onExpired} />
          </div>
        )}
        
        <div className="text-center">
          <div className="bg-white border-2 border-medical-gray-200 rounded-lg p-4 inline-block mb-4 mx-auto">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QRIS Payment QR Code" 
                className="h-48 w-48 mx-auto" 
              />
            ) : (
              <div className="h-48 w-48 mx-auto bg-medical-gray-100 flex items-center justify-center">
                <svg className="h-12 w-12 text-medical-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            
            {amount && (
              <div className="mt-2 text-center">
                <span className="font-semibold text-lg text-medical-gray-900">{formatCurrency(amount)}</span>
              </div>
            )}
          </div>
          
          <div className="max-w-xs mx-auto">
            <button
              onClick={() => qrCodeUrl && window.open(qrCodeUrl, '_blank')}
              className="w-full flex items-center justify-center px-4 py-2 border border-medical-gray-300 rounded-md shadow-sm text-sm font-medium text-medical-gray-700 bg-white hover:bg-medical-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mb-3"
            >
              Download QR Code
            </button>
          </div>
        </div>
        
        {virtualAccount && (
          <div className="mt-6 pt-6 border-t border-medical-gray-200">
            <div className="rounded-md bg-medical-gray-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-info-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-medical-gray-700">
                    You can also pay via Virtual Account transfer.
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <button
                      onClick={() => handleCopy(virtualAccount)}
                      className="whitespace-nowrap inline-flex items-center text-info-600 hover:text-info-500"
                    >
                      <span>{virtualAccount}</span>
                      <DocumentDuplicateIcon className="ml-1 h-4 w-4" />
                    </button>
                  </p>
                </div>
              </div>
            </div>
            
            {copied && (
              <div className="mt-2 text-center text-xs text-success-600">
                Virtual account number copied to clipboard!
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <div className="bg-medical-gray-50 rounded-md px-4 py-3 text-medical-gray-600 text-sm">
            <p className="font-medium">Instructions:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Open your mobile banking or e-wallet app</li>
              <li>Select QRIS payment or scan QR</li>
              <li>Scan the QR code above</li>
              <li>Confirm the payment amount: {formatCurrency(amount || 0)}</li>
              <li>Complete the payment within your app</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
