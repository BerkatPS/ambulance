import React, { useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import PaymentTimer from './PaymentTimer';

export default function VirtualAccountPayment({
  bankName,
  bankLogo,
  accountNumber,
  amount,
  expiryTime,
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

  const banks = {
    'bca': {
      name: 'BCA',
      instructions: [
        'Log in to your BCA mobile banking app or KlikBCA',
        'Select "Transfer" and choose "To BCA Virtual Account"',
        'Enter the virtual account number',
        'Confirm payment details and enter your PIN/password',
        'Transaction complete! Keep your receipt as proof of payment'
      ]
    },
    'mandiri': {
      name: 'Mandiri',
      instructions: [
        'Log in to your Mandiri mobile banking app or Livin by Mandiri',
        'Select "Payment" and choose "Virtual Account"',
        'Enter the virtual account number',
        'Confirm payment details and enter your PIN/password',
        'Transaction complete! Keep your receipt as proof of payment'
      ]
    },
    'bni': {
      name: 'BNI',
      instructions: [
        'Log in to your BNI mobile banking app',
        'Select "Transfer" and choose "Virtual Account"',
        'Enter the virtual account number',
        'Confirm payment details and enter your PIN',
        'Transaction complete! Keep your receipt as proof of payment'
      ]
    },
    'bri': {
      name: 'BRI',
      instructions: [
        'Log in to your BRImo app',
        'Select "Payment" and choose "BRI Virtual Account"',
        'Enter the virtual account number',
        'Confirm payment details and enter your PIN',
        'Transaction complete! Keep your receipt as proof of payment'
      ]
    },
    'default': {
      name: 'Bank',
      instructions: [
        'Log in to your mobile banking app',
        'Select "Transfer" or "Payment" option',
        'Choose "Virtual Account" payment method',
        'Enter the virtual account number',
        'Confirm payment details and complete the transaction',
        'Keep your receipt as proof of payment'
      ]
    }
  };

  const getBankData = (name) => {
    if (!name) return banks.default;
    const lowercaseName = name.toLowerCase();
    return banks[lowercaseName] || banks.default;
  };

  const bankData = getBankData(bankName);

  return (
    <div className="bg-white rounded-lg shadow-medical overflow-hidden">
      <div className="bg-medical-gray-50 px-6 py-4 border-b border-medical-gray-200">
        <h3 className="text-lg font-medium text-medical-gray-900">Virtual Account Payment</h3>
        <p className="mt-1 text-sm text-medical-gray-600">
          Transfer the exact amount to complete your payment
        </p>
      </div>

      <div className="p-6">
        {expiryTime && (
          <div className="mb-6">
            <PaymentTimer expiryTime={expiryTime} onExpired={onExpired} />
          </div>
        )}

        <div className="bg-medical-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            {bankLogo ? (
              <img src={bankLogo} alt={bankName || 'Bank'} className="h-8 w-auto mr-3" />
            ) : (
              <div className="h-8 w-8 rounded bg-medical-gray-200 flex items-center justify-center mr-3">
                <span className="text-medical-gray-600 font-medium text-xs">{(bankName || 'Bank').substring(0, 3).toUpperCase()}</span>
              </div>
            )}
            <h4 className="text-medical-gray-900 font-medium">{bankData.name} Virtual Account</h4>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-medical-gray-500">Virtual Account Number</div>
              <button
                onClick={() => handleCopy(accountNumber)}
                className="text-info-600 hover:text-info-700 text-sm flex items-center focus:outline-none"
              >
                <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                <span>Copy</span>
              </button>
            </div>
            <div className="mt-1 font-mono text-lg font-medium text-medical-gray-900 tracking-wide">
              {accountNumber}
            </div>

            {copied && (
              <div className="mt-1 text-xs text-success-600">
                Account number copied to clipboard!
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm text-medical-gray-500">Total Amount</div>
            <div className="mt-1 text-lg font-semibold text-primary-600">
              {formatCurrency(amount || 0)}
            </div>
            <div className="mt-1 text-xs text-medical-gray-500">
              Please transfer the exact amount to avoid payment verification issues.
            </div>
          </div>
        </div>

        <div className="border-t border-medical-gray-200 pt-6">
          <h4 className="font-medium text-medical-gray-900 mb-3">How to Pay</h4>

          <div className="bg-medical-gray-50 rounded-md px-4 py-3 text-medical-gray-600 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              {bankData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
