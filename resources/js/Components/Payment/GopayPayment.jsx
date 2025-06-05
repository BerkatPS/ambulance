import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import PaymentTimer from './PaymentTimer';

export default function GopayPayment({ 
  deeplink, 
  qrCodeUrl, 
  amount, 
  expiryTime, 
  onExpired 
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleOpenApp = () => {
    if (deeplink) {
      window.location.href = deeplink;
      
      // Set a timeout to check if the app was opened
      setTimeout(() => {
        // If we're still here, the app might not be installed
        // We can show a message or redirect to Play Store/App Store
        document.getElementById('app-not-opened-message').classList.remove('hidden');
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-medical overflow-hidden">
      <div className="bg-medical-gray-50 px-6 py-4 border-b border-medical-gray-200">
        <h3 className="text-lg font-medium text-medical-gray-900">GoPay Payment</h3>
        <p className="mt-1 text-sm text-medical-gray-600">
          Pay using your GoPay e-wallet
        </p>
      </div>
      
      <div className="p-6">
        {expiryTime && (
          <div className="mb-6">
            <PaymentTimer expiryTime={expiryTime} onExpired={onExpired} />
          </div>
        )}
        
        <div className="text-center">
          {amount && (
            <div className="mb-6">
              <p className="text-sm text-medical-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-medical-gray-900">{formatCurrency(amount)}</p>
            </div>
          )}
          
          {qrCodeUrl && (
            <div className="mb-6">
              <div className="bg-white border-2 border-medical-gray-200 rounded-lg p-4 inline-block mx-auto">
                <img 
                  src={qrCodeUrl} 
                  alt="GoPay QR Code" 
                  className="h-48 w-48 mx-auto" 
                />
              </div>
              <p className="mt-2 text-sm text-medical-gray-600">
                Scan this QR code with your Gojek app
              </p>
            </div>
          )}
          
          {deeplink && (
            <div className="mt-6">
              <button
                onClick={handleOpenApp}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="mr-2">Open Gojek App</span>
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </button>
              
              <div id="app-not-opened-message" className="mt-3 text-sm text-danger-600 hidden">
                Couldn't open the Gojek app. Is it installed on your device?
              </div>
            </div>
          )}
          
          {!isMobile() && deeplink && (
            <div className="mt-4 text-sm text-medical-gray-600">
              <p>To pay with GoPay, please open this page on your mobile device.</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-medical-gray-200">
          <h4 className="font-medium text-medical-gray-900 mb-3">How to Pay with GoPay</h4>
          
          <div className="bg-medical-gray-50 rounded-md px-4 py-3 text-medical-gray-600 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the Gojek app on your mobile device</li>
              <li>Tap on the "Pay" button and select "Scan QR"</li>
              <li>Scan the QR code displayed above</li>
              <li>Verify the payment amount: {formatCurrency(amount || 0)}</li>
              <li>Confirm the payment using your GoPay PIN</li>
              <li>Once payment is complete, you'll be redirected back to this page</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-6 bg-info-50 rounded-md p-4 flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-info-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-info-700">
              Make sure you have sufficient balance in your GoPay account before proceeding with the payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
