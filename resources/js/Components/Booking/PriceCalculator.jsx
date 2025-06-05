import React, { useState, useEffect } from 'react';

export default function PriceCalculator({ 
  pickupLocation, 
  dropoffLocation, 
  ambulanceType, 
  onPriceCalculated
}) {
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  // Base rates for different ambulance types (in USD)
  const baseRates = {
    'basic': 50,
    'advanced': 80,
    'neonatal': 100,
    'patient_transport': 40
  };

  // Rate per kilometer
  const ratePerKm = {
    'basic': 2.5,
    'advanced': 3.5,
    'neonatal': 4.0,
    'patient_transport': 2.0
  };

  useEffect(() => {
    // Only calculate if we have both locations and ambulance type
    if (pickupLocation && dropoffLocation && ambulanceType) {
      calculatePrice();
    } else {
      // Reset price when inputs are cleared
      setPrice(null);
      setDistance(null);
      if (onPriceCalculated) {
        onPriceCalculated(null);
      }
    }
  }, [pickupLocation, dropoffLocation, ambulanceType]);

  const calculatePrice = async () => {
    setIsCalculating(true);
    setError(null);

    try {
      // In a real application, this would be an API call to a distance matrix service
      // For demo purposes, we'll simulate this with a timeout and random distance
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate distance calculation (in a real app, use Google Maps Distance Matrix API or similar)
      const calculatedDistance = simulateDistanceCalculation(pickupLocation, dropoffLocation);
      setDistance(calculatedDistance);
      
      // Calculate price based on distance and ambulance type
      const baseRate = baseRates[ambulanceType] || 50;
      const kmRate = ratePerKm[ambulanceType] || 2.5;
      const calculatedPrice = baseRate + (calculatedDistance * kmRate);
      
      setPrice(calculatedPrice);
      
      // Notify parent component
      if (onPriceCalculated) {
        onPriceCalculated(calculatedPrice);
      }
    } catch (err) {
      setError('Unable to calculate price. Please try again.');
      console.error('Price calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Simulate distance calculation based on string addresses
  // In a real app, you would use a geocoding and routing API
  const simulateDistanceCalculation = (origin, destination) => {
    // This is just a simulation - in production, use actual geocoding and routing APIs
    // Using string hashing to get a consistent but "random" distance for demo purposes
    const combined = origin + destination;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Generate a distance between 2 and 30 km
    return Math.abs(hash % 28) + 2;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!pickupLocation || !dropoffLocation || !ambulanceType) {
    return (
      <div className="bg-medical-gray-50 p-4 rounded-lg mt-4">
        <p className="text-medical-gray-500 text-sm">
          Enter pickup and dropoff locations and select an ambulance type to see the estimated price.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-medical-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-medical-gray-900">Price Estimate</h3>
          {isCalculating && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800">
              <svg className="mr-1.5 h-2 w-2 text-info-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Calculating...
            </span>
          )}
        </div>
        
        {error ? (
          <div className="mt-4 p-3 rounded-md bg-danger-50 text-danger-700 text-sm">
            {error}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {distance !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-medical-gray-500">Estimated Distance:</span>
                <span className="font-medium text-medical-gray-700">{distance.toFixed(1)} km</span>
              </div>
            )}
            
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-medical-gray-500">
                Base Rate ({baseRates[ambulanceType] ? `${ambulanceType.replace('_', ' ')}` : 'standard'}):
              </span>
              <span className="font-medium text-medical-gray-700">
                {baseRates[ambulanceType] ? formatCurrency(baseRates[ambulanceType]) : formatCurrency(50)}
              </span>
            </div>
            
            {distance !== null && (
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-medical-gray-500">
                  Distance Charge ({distance.toFixed(1)} km × {formatCurrency(ratePerKm[ambulanceType] || 2.5)}/km):
                </span>
                <span className="font-medium text-medical-gray-700">
                  {formatCurrency(distance * (ratePerKm[ambulanceType] || 2.5))}
                </span>
              </div>
            )}
            
            {price !== null && (
              <>
                <div className="border-t border-medical-gray-200 my-2 pt-2"></div>
                <div className="flex justify-between items-baseline text-lg">
                  <span className="font-medium text-medical-gray-900">Total Estimated Price:</span>
                  <span className="font-semibold text-primary-600">{formatCurrency(price)}</span>
                </div>
                <p className="text-xs text-medical-gray-500 mt-1">
                  * Final price may vary based on actual distance, waiting time, and additional services.
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-medical-gray-50 px-4 py-3 sm:px-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs text-medical-gray-500">
              All prices are in USD. Payment is required at the time of booking confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
