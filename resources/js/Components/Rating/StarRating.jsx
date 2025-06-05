import React, { useState } from 'react';

export default function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  size = 'medium', 
  onChange = null,
  readOnly = false,
  precision = 'full', // 'full', 'half', or 'quarter'
  className = ''
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Get star size based on the size prop
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-8 w-8';
      case 'medium':
      default:
        return 'h-6 w-6';
    }
  };
  
  // Get gap size based on the size prop
  const getGapSize = () => {
    switch (size) {
      case 'small':
        return 'gap-1';
      case 'large':
        return 'gap-2';
      case 'medium':
      default:
        return 'gap-1.5';
    }
  };
  
  // Helper to get the display rating (either the hover rating or the actual rating)
  const getDisplayRating = () => {
    return isHovering ? hoverRating : rating;
  };
  
  // Convert a rating value to a percentage for partially filled stars
  const ratingToPercent = (starIndex, rating) => {
    const percent = Math.max(0, Math.min(100, (rating - starIndex) * 100));
    
    // Adjust percentage based on precision
    if (precision === 'half') {
      // Round to nearest 50%
      return Math.round(percent / 50) * 50;
    } else if (precision === 'quarter') {
      // Round to nearest 25%
      return Math.round(percent / 25) * 25;
    }
    
    // For 'full' precision, round to 0 or 100
    return percent >= 50 ? 100 : 0;
  };
  
  // Handle click on a star
  const handleStarClick = (index) => {
    if (readOnly || !onChange) return;
    
    let newRating;
    
    if (precision === 'full') {
      // For full stars, always set to the clicked index + 1
      newRating = index + 1;
    } else {
      // For half or quarter stars, calculate based on click position
      // If clicking on the current rating, decrease by one unit
      if (Math.ceil(rating) === index + 1) {
        if (precision === 'half') {
          newRating = index + 0.5;
        } else if (precision === 'quarter') {
          newRating = index + 0.75;
        }
      } else {
        newRating = index + 1;
      }
    }
    
    // Call the onChange handler with the new rating
    onChange(newRating);
  };
  
  // Handle mouse entering a star
  const handleStarEnter = (index) => {
    if (readOnly) return;
    
    setIsHovering(true);
    setHoverRating(index + 1);
  };
  
  // Handle mouse leaving the rating component
  const handleMouseLeave = () => {
    if (readOnly) return;
    
    setIsHovering(false);
    setHoverRating(0);
  };
  
  return (
    <div 
      className={`inline-flex ${getGapSize()} items-center ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, index) => {
        const displayRating = getDisplayRating();
        const fillPercent = ratingToPercent(index, displayRating);
        
        return (
          <button
            key={index}
            type="button"
            className={`relative ${readOnly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarEnter(index)}
            disabled={readOnly}
            aria-label={`${index + 1} stars`}
          >
            {/* Background star (empty) */}
            <svg 
              className={`${getStarSize()} text-medical-gray-300`} 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path 
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Foreground star (filled) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <svg 
                className={`${getStarSize()} text-warning-400`} 
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path 
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        );
      })}
      
      {onChange && !readOnly && (
        <span className="text-sm text-medical-gray-500 ml-2">
          {getDisplayRating().toFixed(precision === 'full' ? 0 : 1)}
        </span>
      )}
    </div>
  );
}
