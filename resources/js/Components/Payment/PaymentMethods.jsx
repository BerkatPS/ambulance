import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CreditCardIcon, QrCodeIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

export default function PaymentMethods({ onSelect, selectedMethod }) {
  const [selected, setSelected] = useState(selectedMethod || 'gopay');

  const methods = [
    {
      id: 'gopay',
      name: 'GoPay',
      description: 'Pay using GoPay e-wallet',
      icon: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
      logo: "/images/payment/gopay.png"
    },
    {
      id: 'qris',
      name: 'QRIS',
      description: 'Scan QR code to pay',
      icon: QrCodeIcon,
      logo: "/images/payment/qris.png"
    },
    {
      id: 'virtual_account',
      name: 'Virtual Account',
      description: 'Pay via bank transfer',
      icon: BuildingLibraryIcon,
      logo: "/images/payment/bank.png"
    },
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Pay with Visa, Mastercard, or JCB',
      icon: CreditCardIcon,
      logo: "/images/payment/card.png"
    }
  ];

  const handleChange = (value) => {
    setSelected(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className="w-full">
      <RadioGroup value={selected} onChange={handleChange} className="space-y-3">
        <RadioGroup.Label className="sr-only">Payment method</RadioGroup.Label>
        
        {methods.map((method) => (
          <RadioGroup.Option
            key={method.id}
            value={method.id}
            className={({ checked }) => `
              ${checked ? 'border-primary-500 bg-primary-50' : 'border-medical-gray-200 bg-white'}
              relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none transition-all duration-200 ease-in-out
            `}
          >
            {({ checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-medical-gray-500">
                      {method.logo ? (
                        <img src={method.logo} alt={method.name} className="h-8 w-auto" />
                      ) : (
                        <method.icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-4">
                      <RadioGroup.Label
                        as="p"
                        className={`font-medium ${checked ? 'text-primary-700' : 'text-medical-gray-800'}`}
                      >
                        {method.name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="p"
                        className={`text-sm ${checked ? 'text-primary-600' : 'text-medical-gray-500'}`}
                      >
                        {method.description}
                      </RadioGroup.Description>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 rounded-full border-2 p-1 ${checked ? 'border-primary-500' : 'border-medical-gray-300'}`}>
                    <div className={`h-3 w-3 rounded-full ${checked ? 'bg-primary-500' : 'bg-transparent'}`} />
                  </div>
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}
