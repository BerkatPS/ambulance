import React, { useEffect, useRef } from 'react';

export default function MapDisplay({ 
  pickupLocation, 
  dropoffLocation, 
  ambulanceLocation,
  height = '400px'
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      if (!mapRef.current) return;
      
      // If map is already initialized, clean it up
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        markersRef.current = [];
      }

      try {
        // Check if window.google exists before proceeding
        if (window.google && window.google.maps) {
          const center = pickupLocation || { lat: -6.2088, lng: 106.8456 }; // Default to Jakarta if no pickup location
          
          // Create map instance
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          // Add markers if locations are provided
          if (pickupLocation) {
            addMarker(pickupLocation, 'Pickup Location', 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          }
          
          if (dropoffLocation) {
            addMarker(dropoffLocation, 'Dropoff Location', 'http://maps.google.com/mapfiles/ms/icons/red-dot.png');
          }
          
          if (ambulanceLocation) {
            addMarker(ambulanceLocation, 'Ambulance', 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
          }
          
          // Fit bounds if we have at least one location
          if (markersRef.current.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            markersRef.current.forEach(marker => {
              bounds.extend(marker.getPosition());
            });
            mapInstanceRef.current.fitBounds(bounds);
            
            // Zoom out a bit if we only have one marker
            if (markersRef.current.length === 1) {
              const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
                mapInstanceRef.current.setZoom(15);
                window.google.maps.event.removeListener(listener);
              });
            }
          }
        } else {
          console.error('Google Maps not loaded');
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    const addMarker = (position, title, icon) => {
      if (!mapInstanceRef.current) return;
      
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title,
        icon
      });
      
      markersRef.current.push(marker);
    };
    
    // Initialize map if Google Maps API is loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Otherwise, we'll just show a placeholder
      console.warn('Google Maps API not loaded, showing placeholder');
    }
    
    // Cleanup function
    return () => {
      markersRef.current = [];
    };
  }, [pickupLocation, dropoffLocation, ambulanceLocation]);
  
  // Update ambulance marker position when it changes
  useEffect(() => {
    if (!mapInstanceRef.current || !ambulanceLocation) return;
    
    // Remove existing ambulance marker if it exists
    const ambulanceMarkerIndex = markersRef.current.findIndex(marker => 
      marker.getTitle() === 'Ambulance'
    );
    
    if (ambulanceMarkerIndex !== -1) {
      markersRef.current[ambulanceMarkerIndex].setMap(null);
      markersRef.current.splice(ambulanceMarkerIndex, 1);
    }
    
    // Add new ambulance marker
    const marker = new window.google.maps.Marker({
      position: ambulanceLocation,
      map: mapInstanceRef.current,
      title: 'Ambulance',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    
    markersRef.current.push(marker);
  }, [ambulanceLocation]);
  
  return (
    <div style={{ width: '100%', height }}>
      {/* Map container */}
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
      />
      
      {/* Show this if Google Maps is not loaded */}
      {(!window.google || !window.google.maps) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem'
        }}>
          <p className="text-gray-500">Map not available</p>
        </div>
      )}
    </div>
  );
}
