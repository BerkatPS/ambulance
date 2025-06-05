import React, { useState, useEffect } from 'react';
import { MapPinIcon, PhoneIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function BookingTracker({ 
  booking,
  onClose,
  refreshInterval = 30000 // 30 seconds
}) {
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'pending');
  const [driverInfo, setDriverInfo] = useState(booking?.driver || null);
  const [ambulanceInfo, setAmbulanceInfo] = useState(booking?.ambulance || null);
  const [estimatedArrival, setEstimatedArrival] = useState(booking?.eta || null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Status order for the progress tracker
  const statusOrder = [
    'pending',
    'confirmed',
    'driver_assigned',
    'en_route',
    'arrived_pickup',
    'in_progress',
    'arrived_destination',
    'completed'
  ];

  // Format ETA time
  const formatETA = (eta) => {
    if (!eta) return 'Calculating...';
    
    try {
      const etaDate = new Date(eta);
      return etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Calculating...';
    }
  };

  // Get current status index
  const getCurrentStatusIndex = () => {
    return statusOrder.indexOf(currentStatus) > -1 
      ? statusOrder.indexOf(currentStatus) 
      : 0;
  };

  // Status labels for display
  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Booking Pending',
      'confirmed': 'Booking Confirmed',
      'driver_assigned': 'Driver Assigned',
      'en_route': 'Driver En Route',
      'arrived_pickup': 'Arrived at Pickup',
      'in_progress': 'In Progress',
      'arrived_destination': 'Arrived at Destination',
      'completed': 'Trip Completed',
      'cancelled': 'Booking Cancelled'
    };
    
    return labels[status] || status;
  };

  useEffect(() => {
    // Set initial state from booking
    if (booking) {
      setCurrentStatus(booking.status || 'pending');
      setDriverInfo(booking.driver || null);
      setAmbulanceInfo(booking.ambulance || null);
      setEstimatedArrival(booking.eta || null);
    }
    
    // Set up polling to refresh booking status
    const intervalId = setInterval(() => {
      refreshBookingStatus();
    }, refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [booking, refreshInterval]);

  // Simulated function to refresh booking status
  // In a real app, this would make an API call to get the latest status
  const refreshBookingStatus = async () => {
    if (!booking?.id) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch actual data from your backend
      // For demo purposes, we'll simulate progress
      simulateStatusUpdate();
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing booking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // This is just for demonstration - in a real app you would get real updates from the server
  const simulateStatusUpdate = () => {
    const currentIndex = getCurrentStatusIndex();
    
    // If status is "completed" or beyond the defined statuses, don't update
    if (currentStatus === 'completed' || currentStatus === 'cancelled' || currentIndex >= statusOrder.length - 1) {
      return;
    }
    
    // Small chance to advance to next status for demo purposes
    // In a real app, this would come from your backend
    if (Math.random() < 0.2) {
      const nextStatus = statusOrder[currentIndex + 1];
      setCurrentStatus(nextStatus);
      
      // If the new status is driver_assigned and we don't have driver info yet, add demo driver
      if (nextStatus === 'driver_assigned' && !driverInfo) {
        setDriverInfo({
          name: 'John Driver',
          phone: '+1 (555) 123-4567',
          rating: 4.8,
          photo: null
        });
        
        setAmbulanceInfo({
          registration: 'AMB-12345',
          type: booking?.ambulance_type || 'basic',
          description: 'White Mercedes Sprinter'
        });
        
        // Set estimated arrival time (current time + random minutes)
        const now = new Date();
        now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 15) + 5);
        setEstimatedArrival(now.toISOString());
      }
    }
  };

  // Get CSS classes for a status step based on current progress
  const getStepClasses = (stepStatus) => {
    const currentIndex = getCurrentStatusIndex();
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < 0) return 'bg-medical-gray-200'; // Status not in our defined order
    
    if (stepIndex < currentIndex) {
      return 'bg-success-500'; // Completed step
    } else if (stepIndex === currentIndex) {
      return 'bg-primary-500'; // Current step
    } else {
      return 'bg-medical-gray-200'; // Future step
    }
  };

  // Determine if booking was cancelled
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="bg-white rounded-lg shadow-medical overflow-hidden">
      <div className="bg-medical-gray-50 px-4 py-3 border-b border-medical-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-medical-gray-900">Booking Tracker</h3>
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800">
              <svg className="mr-1.5 h-2 w-2 text-info-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Updating...
            </span>
          ) : (
            <button
              type="button"
              onClick={refreshBookingStatus}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-medical-gray-500 hover:bg-medical-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center p-1 border border-transparent rounded-full text-medical-gray-500 hover:bg-medical-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Status indicator */}
        <div className="flex items-center justify-center mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isCancelled ? 'bg-danger-100 text-danger-800' :
            currentStatus === 'completed' ? 'bg-success-100 text-success-800' :
            'bg-primary-100 text-primary-800'
          }`}>
            {isCancelled && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-danger-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {getStatusLabel(currentStatus)}
          </span>
        </div>
        
        {!isCancelled && (
          <div className="mb-8">
            {/* Progress bar */}
            <div className="relative">
              <div className="overflow-hidden h-2 flex rounded bg-medical-gray-200">
                {statusOrder.map((status, index) => {
                  if (index === statusOrder.length - 1) return null; // Skip the last one
                  
                  const width = 100 / (statusOrder.length - 1);
                  return (
                    <div
                      key={status}
                      style={{ width: `${width}%` }}
                      className={`${getStepClasses(status)} transition-all duration-500`}
                    />
                  );
                })}
              </div>
              
              {/* Status markers */}
              <div className="relative h-2">
                {statusOrder.map((status, index) => {
                  // Calculate position as percentage of total width
                  const position = index * (100 / (statusOrder.length - 1));
                  const currentIndex = getCurrentStatusIndex();
                  
                  return (
                    <div 
                      key={status}
                      style={{ left: `${position}%` }}
                      className={`absolute top-0 -mt-1 -ml-1 h-4 w-4 rounded-full border-2 border-white transition-all duration-500 ${
                        index < currentIndex ? 'bg-success-500' :
                        index === currentIndex ? 'bg-primary-500' :
                        'bg-medical-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
              
              {/* Status labels */}
              <div className="relative mt-6">
                {statusOrder.map((status, index) => {
                  // Only show a subset of important status labels to avoid crowding
                  if (!['pending', 'driver_assigned', 'in_progress', 'completed'].includes(status)) {
                    return null;
                  }
                  
                  // Calculate position as percentage of total width
                  const position = index * (100 / (statusOrder.length - 1));
                  const currentIndex = getCurrentStatusIndex();
                  
                  return (
                    <div
                      key={status}
                      style={{ left: `${position}%` }}
                      className="absolute -ml-6 text-center w-12 text-xs font-medium"
                    >
                      <span className={
                        index < currentIndex ? 'text-success-600' :
                        index === currentIndex ? 'text-primary-600' :
                        'text-medical-gray-500'
                      }>
                        {status === 'pending' ? 'Booked' :
                         status === 'driver_assigned' ? 'Assigned' :
                         status === 'in_progress' ? 'In Transit' :
                         status === 'completed' ? 'Completed' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Driver and ambulance information */}
        {driverInfo && ambulanceInfo && !isCancelled && currentStatus !== 'pending' && (
          <div className="bg-medical-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-medical-gray-900 mb-3">Your Ambulance</h4>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {driverInfo.photo ? (
                  <img
                    src={driverInfo.photo}
                    alt={driverInfo.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-medical-gray-900">
                  {driverInfo.name}
                  {driverInfo.rating && (
                    <span className="ml-2 inline-flex items-center text-xs text-medical-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {driverInfo.rating}
                    </span>
                  )}
                </p>
                <p className="text-sm text-medical-gray-500 truncate">
                  {ambulanceInfo.description || ambulanceInfo.type || 'Ambulance'}
                </p>
                <p className="text-sm text-medical-gray-500 mt-1">
                  {ambulanceInfo.registration}
                </p>
                
                <div className="mt-2 flex space-x-2">
                  <a
                    href={`tel:${driverInfo.phone}`}
                    className="inline-flex items-center px-2.5 py-1.5 border border-medical-gray-300 shadow-sm text-xs font-medium rounded text-medical-gray-700 bg-white hover:bg-medical-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PhoneIcon className="h-4 w-4 mr-1.5 text-medical-gray-500" />
                    Call Driver
                  </a>
                </div>
              </div>
              
              {estimatedArrival && ['confirmed', 'driver_assigned', 'en_route'].includes(currentStatus) && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-medical-gray-500">Estimated arrival</p>
                  <p className="text-lg font-medium text-medical-gray-900">{formatETA(estimatedArrival)}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Pickup and destination details */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="h-6 w-6 rounded-full border-2 border-primary-500 flex items-center justify-center">
                <MapPinIcon className="h-3 w-3 text-primary-500" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-medical-gray-900">Pickup Location</p>
              <p className="text-sm text-medical-gray-500">{booking?.pickup_location}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="h-6 w-6 rounded-full border-2 border-accent-500 flex items-center justify-center">
                <MapPinIcon className="h-3 w-3 text-accent-500" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-medical-gray-900">Destination</p>
              <p className="text-sm text-medical-gray-500">{booking?.dropoff_location}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="h-6 w-6 rounded-full border-2 border-medical-gray-300 flex items-center justify-center">
                <ClockIcon className="h-3 w-3 text-medical-gray-500" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-medical-gray-900">Scheduled Pickup Time</p>
              <p className="text-sm text-medical-gray-500">
                {booking?.pickup_time 
                  ? new Date(booking.pickup_time).toLocaleString() 
                  : 'Not specified'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Last updated timestamp */}
        <div className="mt-6 text-xs text-medical-gray-500 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
