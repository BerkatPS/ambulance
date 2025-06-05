import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function PaymentTimer({ expiryTime, onExpired }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        // Parse the expiry time
        const expiryDate = new Date(expiryTime);
        const now = new Date();
        
        // Calculate total seconds between now and expiry
        const diff = Math.max(0, Math.floor((expiryDate - now) / 1000));
        
        if (diff <= 0) {
          // Time has expired
          setIsExpired(true);
          setTimeLeft({
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0
          });
          
          if (onExpired && !isExpired) {
            onExpired();
          }
          
          return;
        }
        
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        setTimeLeft({
          hours,
          minutes,
          seconds,
          total: diff
        });
      } catch (error) {
        console.error('Error calculating time left:', error);
        setIsExpired(true);
      }
    };
    
    // Calculate immediately and then set an interval
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up the interval on unmount
    return () => clearInterval(timer);
  }, [expiryTime, onExpired, isExpired]);

  // Format the time units to always show two digits
  const formatTimeUnit = (unit) => {
    return unit.toString().padStart(2, '0');
  };

  return (
    <div className={`rounded-md ${isExpired ? 'bg-danger-50' : 'bg-warning-50'} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ClockIcon className={`h-5 w-5 ${isExpired ? 'text-danger-400' : 'text-warning-400'}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <div>
            <p className={`text-sm ${isExpired ? 'text-danger-700' : 'text-warning-700'} font-medium`}>
              {isExpired ? 'Payment Time Expired' : 'Complete Payment Before'}
            </p>
            
            {!isExpired ? (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-mono font-semibold text-medical-gray-900 w-8">
                        {formatTimeUnit(timeLeft.hours)}
                      </div>
                      <div className="text-xs text-medical-gray-500">
                        Hour
                      </div>
                    </div>
                    
                    <div className="text-xl font-mono font-semibold text-medical-gray-900 self-start mt-0">:</div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-mono font-semibold text-medical-gray-900 w-8">
                        {formatTimeUnit(timeLeft.minutes)}
                      </div>
                      <div className="text-xs text-medical-gray-500">
                        Min
                      </div>
                    </div>
                    
                    <div className="text-xl font-mono font-semibold text-medical-gray-900 self-start mt-0">:</div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-mono font-semibold text-medical-gray-900 w-8">
                        {formatTimeUnit(timeLeft.seconds)}
                      </div>
                      <div className="text-xs text-medical-gray-500">
                        Sec
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm text-danger-600">
                The payment time has expired. Please initiate a new payment.
              </p>
            )}
          </div>
          
          {!isExpired && (
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="h-2 bg-warning-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning-500" 
                  style={{ 
                    width: `${Math.min(100, (timeLeft.total / (24 * 60 * 60)) * 100)}%`,
                    transition: 'width 1s linear'
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
