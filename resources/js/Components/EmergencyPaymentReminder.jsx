import React, { useState, useEffect, useRef } from 'react';
import { InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function EmergencyPaymentReminder({ booking, reminderInterval, isEmergencyPaymentDue }) {
    const [isActive, setIsActive] = useState(true);
    const [lastReminderTime, setLastReminderTime] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const intervalRef = useRef(null);
    
    // Reset state if booking or payment status changes
    useEffect(() => {
        if (!isEmergencyPaymentDue) {
            setIsActive(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } else {
            setIsActive(true);
            setLastReminderTime(new Date());
        }
    }, [booking, isEmergencyPaymentDue]);
    
    // Set up interval for sending reminders
    useEffect(() => {
        if (isActive && isEmergencyPaymentDue && reminderInterval > 0) {
            // Initial reminder
            sendPaymentReminder();
            
            // Set interval for subsequent reminders
            intervalRef.current = setInterval(() => {
                sendPaymentReminder();
            }, reminderInterval);
            
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        }
    }, [isActive, isEmergencyPaymentDue, reminderInterval]);
    
    const sendPaymentReminder = async () => {
        try {
            const response = await axios.post(
                route('user.bookings.send-payment-reminder', booking.id)
            );
            
            if (response.data.success) {
                setLastReminderTime(new Date());
                setErrorMessage(null);
            } else {
                setErrorMessage(response.data.message || 'Gagal mengirim pengingat pembayaran');
            }
        } catch (error) {
            console.error('Error sending payment reminder:', error);
            setErrorMessage('Terjadi kesalahan saat mengirim pengingat pembayaran');
        }
    };
    
    // Don't render anything if not active or not due
    if (!isActive || !isEmergencyPaymentDue) {
        return null;
    }
    
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md shadow-sm">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Pembayaran Darurat Menunggu!</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>
                            Anda memiliki tagihan pembayaran untuk layanan ambulans darurat yang perlu segera dibayar.
                            Silakan lakukan pembayaran secepatnya untuk menghindari penundaan dalam penanganan medis di masa mendatang.
                        </p>
                        {lastReminderTime && (
                            <p className="mt-1 text-xs">
                                Pengingat terakhir: {lastReminderTime.toLocaleTimeString()}
                            </p>
                        )}
                        {errorMessage && (
                            <p className="mt-1 text-xs text-red-600">
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
