import React from 'react';
import { BanknotesIcon, QrCodeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

// Ikon bank dan metode pembayaran
const methodIcons = {
    BCA: () => <img src="/images/payment/bca.png" alt="BCA" className="h-6" onError={(e) => e.target.src = '/images/payment/bank-default.png'} />,
    BNI: () => <img src="/images/payment/bni.png" alt="BNI" className="h-6" onError={(e) => e.target.src = '/images/payment/bank-default.png'} />,
    BRI: () => <img src="/images/payment/bri.png" alt="BRI" className="h-6" onError={(e) => e.target.src = '/images/payment/bank-default.png'} />,
    MANDIRI: () => <img src="/images/payment/mandiri.png" alt="Mandiri" className="h-6" onError={(e) => e.target.src = '/images/payment/bank-default.png'} />,
    QRIS: () => <img src="/images/payment/qris.png" alt="QRIS" className="h-6" onError={(e) => e.target.src = '/images/payment/qr-default.png'} />,
    ALFAMART: () => <img src="/images/payment/alfamart.png" alt="Alfamart" className="h-6" onError={(e) => e.target.src = '/images/payment/retail-default.png'} />,
    INDOMARET: () => <img src="/images/payment/indomaret.png" alt="Indomaret" className="h-6" onError={(e) => e.target.src = '/images/payment/retail-default.png'} />,
};

const PaymentMethodSelector = ({
    paymentMethods,
    selectedCategory,
    selectedMethod,
    onCategorySelect,
    onMethodSelect
}) => {
    // Fungsi untuk menampilkan ikon metode pembayaran
    const renderMethodIcon = (methodCode) => {
        if (methodIcons[methodCode]) {
            return methodIcons[methodCode]();
        }

        return null;
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                {paymentMethods.map((category) => (
                    <div key={category.id}>
                        <button
                            type="button"
                            className={`w-full p-4 flex flex-col items-center justify-center border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
                                ${selectedCategory?.id === category.id
                                ? 'border-primary-500 bg-primary-50 shadow-sm'
                                : 'border-slate-100 bg-white hover:border-primary-300 hover:bg-primary-50'}`}
                            onClick={() => onCategorySelect(category)}
                        >
                            {category.id === 'VA' && <BanknotesIcon className="h-8 w-8 mb-2 text-primary-600" />}
                            {category.id === 'QRIS' && <QrCodeIcon className="h-8 w-8 mb-2 text-primary-600" />}
                            {category.id === 'RETAIL' && <ShoppingBagIcon className="h-8 w-8 mb-2 text-primary-600" />}
                            <span className={`text-sm ${selectedCategory?.id === category.id ? 'font-semibold text-primary-700' : 'font-medium text-gray-900 hover:text-primary-600'}`}>
                                {category.name}
                            </span>
                        </button>
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Pilih {selectedCategory.name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCategory.methods.map((method) => (
                            <button
                                key={method.code}
                                type="button"
                                className={`p-3 border rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
                                    ${selectedMethod?.code === method.code
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-slate-100 hover:border-primary-300 hover:bg-primary-50'}`}
                                onClick={() => onMethodSelect(method)}
                            >
                                <div className="flex items-center">
                                    <div className="mr-3">
                                        {renderMethodIcon(method.code)}
                                    </div>
                                    <span className={`text-sm font-medium ${selectedMethod?.code === method.code ? 'text-primary-700' : 'text-gray-900'}`}>{method.name}</span>
                                </div>
                                {selectedMethod?.code === method.code && (
                                    <div className="flex-shrink-0 h-5 w-5 text-primary-600">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodSelector;
