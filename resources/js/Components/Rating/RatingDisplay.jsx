import React from 'react';
import StarRating from './StarRating';

export default function RatingDisplay({ 
  ratings = [], 
  averageRating = null,
  showDetails = true,
  className = '',
  compact = false
}) {
  // Calculate average rating if not provided
  const calculateAverageRating = () => {
    if (averageRating !== null) return averageRating;
    if (!ratings || ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + parseFloat(rating.rating || 0), 0);
    return sum / ratings.length;
  };
  
  // Get the calculated average
  const avg = calculateAverageRating();
  
  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Helper to calculate rating distribution
  const calculateRatingDistribution = () => {
    if (!ratings || ratings.length === 0) return Array(5).fill(0);
    
    const distribution = Array(5).fill(0);
    
    ratings.forEach(rating => {
      const ratingValue = Math.round(parseFloat(rating.rating || 0));
      if (ratingValue >= 1 && ratingValue <= 5) {
        distribution[ratingValue - 1]++;
      }
    });
    
    return distribution;
  };
  
  // Get the rating distribution
  const ratingDistribution = calculateRatingDistribution();
  
  // Calculate the total number of ratings
  const totalRatings = ratings.length;
  
  // Render a compact version of the component
  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <StarRating 
          rating={avg} 
          readOnly={true} 
          size="small" 
          precision="half"
        />
        <span className="ml-1 text-sm text-medical-gray-600">
          ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-medical ${className}`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-medium text-medical-gray-900 mb-2">Customer Reviews</h3>
            
            <div className="flex items-center mb-1">
              <span className="text-3xl font-bold text-medical-gray-900 mr-2">{avg.toFixed(1)}</span>
              <StarRating rating={avg} readOnly={true} />
            </div>
            
            <p className="text-sm text-medical-gray-600">
              Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          
          {showDetails && totalRatings > 0 && (
            <div className="mt-6 md:mt-0 w-full md:w-auto md:min-w-[240px]">
              <h4 className="text-sm font-medium text-medical-gray-900 mb-2 text-center md:text-left">
                Rating Distribution
              </h4>
              
              <div className="space-y-1.5">
                {ratingDistribution.map((count, index) => {
                  const reversedIndex = 5 - index - 1; // To display 5 stars first
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  
                  return (
                    <div key={reversedIndex} className="flex items-center">
                      <div className="flex items-center mr-2 w-12">
                        <span className="text-xs font-medium text-medical-gray-700">
                          {reversedIndex + 1}
                        </span>
                        <svg 
                          className="h-3.5 w-3.5 text-warning-400 ml-0.5" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20"
                        >
                          <path 
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                          />
                        </svg>
                      </div>
                      
                      <div className="w-full bg-medical-gray-200 rounded-full h-2">
                        <div 
                          className="bg-warning-400 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="ml-2 w-8 text-xs text-medical-gray-600">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {showDetails && ratings.length > 0 && (
          <div className="mt-8 border-t border-medical-gray-200 pt-6">
            <h4 className="text-md font-medium text-medical-gray-900 mb-4">
              Recent Reviews
            </h4>
            
            <div className="space-y-6">
              {ratings.slice(0, 5).map((rating, index) => (
                <div key={rating.id || index} className="border-b border-medical-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-medical-gray-200 flex items-center justify-center">
                        <span className="text-medical-gray-600 font-medium text-sm">
                          {rating.user_name ? rating.user_name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-medical-gray-900">
                          {rating.user_name || 'Anonymous User'}
                        </h5>
                        <span className="text-xs text-medical-gray-500">
                          {formatDate(rating.created_at)}
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <StarRating rating={parseFloat(rating.rating || 0)} readOnly={true} size="small" />
                      </div>
                      
                      {rating.comment && (
                        <p className="mt-2 text-sm text-medical-gray-600">
                          {rating.comment}
                        </p>
                      )}
                      
                      {(rating.driver_rating || rating.ambulance_rating || rating.service_rating) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {rating.driver_rating > 0 && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-medical-gray-100 text-medical-gray-800">
                              Driver: {rating.driver_rating.toFixed(1)}
                            </div>
                          )}
                          
                          {rating.ambulance_rating > 0 && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-medical-gray-100 text-medical-gray-800">
                              Ambulance: {rating.ambulance_rating.toFixed(1)}
                            </div>
                          )}
                          
                          {rating.service_rating > 0 && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-medical-gray-100 text-medical-gray-800">
                              Service: {rating.service_rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {ratings.length > 5 && (
              <div className="mt-6 text-center">
                <button 
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-medical-gray-300 rounded-md shadow-sm text-sm font-medium text-medical-gray-700 bg-white hover:bg-medical-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View All Reviews
                </button>
              </div>
            )}
          </div>
        )}
        
        {totalRatings === 0 && (
          <div className="mt-6 text-center py-8 border rounded-md border-dashed border-medical-gray-300">
            <svg 
              className="mx-auto h-12 w-12 text-medical-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <p className="mt-2 text-sm text-medical-gray-600">
              No reviews available yet. Be the first to leave a review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
