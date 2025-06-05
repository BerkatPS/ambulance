import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import StarRating from './StarRating';
import InputError from '../InputError';

export default function RatingForm({ booking, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    booking_id: booking?.id || '',
    rating: 0,
    comment: '',
    driver_rating: 0,
    ambulance_rating: 0,
    service_rating: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    post(route('user.ratings.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleRatingChange = (value) => {
    setData('rating', value);
  };

  const handleDriverRatingChange = (value) => {
    setData('driver_rating', value);
  };

  const handleAmbulanceRatingChange = (value) => {
    setData('ambulance_rating', value);
  };

  const handleServiceRatingChange = (value) => {
    setData('service_rating', value);
  };

  const handleCommentChange = (e) => {
    setData('comment', e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-medical overflow-hidden">
      <div className="bg-medical-gray-50 px-6 py-4 border-b border-medical-gray-200">
        <h3 className="text-lg font-medium text-medical-gray-900">Rate Your Experience</h3>
        <p className="mt-1 text-sm text-medical-gray-600">
          Your feedback helps us improve our ambulance service
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-medical-gray-700 mb-2">
              Overall Rating
            </label>
            <StarRating
              rating={data.rating}
              onChange={handleRatingChange}
              size="large"
              precision="half"
            />
            <InputError message={errors.rating} className="mt-2" />
          </div>

          {/* Detailed Ratings */}
          <div className="border-t border-medical-gray-200 pt-4">
            <h4 className="text-sm font-medium text-medical-gray-900 mb-4">
              Detailed Ratings
            </h4>

            <div className="space-y-4">
              {/* Driver Rating */}
              <div className="flex justify-between items-center">
                <label htmlFor="driver_rating" className="block text-sm text-medical-gray-700">
                  Driver Professionalism
                </label>
                <StarRating
                  rating={data.driver_rating}
                  onChange={handleDriverRatingChange}
                  size="small"
                  precision="half"
                />
              </div>
              <InputError message={errors.driver_rating} className="mt-1" />

              {/* Ambulance Rating */}
              <div className="flex justify-between items-center">
                <label htmlFor="ambulance_rating" className="block text-sm text-medical-gray-700">
                  Ambulance Condition
                </label>
                <StarRating
                  rating={data.ambulance_rating}
                  onChange={handleAmbulanceRatingChange}
                  size="small"
                  precision="half"
                />
              </div>
              <InputError message={errors.ambulance_rating} className="mt-1" />

              {/* Service Rating */}
              <div className="flex justify-between items-center">
                <label htmlFor="service_rating" className="block text-sm text-medical-gray-700">
                  Service Quality
                </label>
                <StarRating
                  rating={data.service_rating}
                  onChange={handleServiceRatingChange}
                  size="small"
                  precision="half"
                />
              </div>
              <InputError message={errors.service_rating} className="mt-1" />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-medical-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              className="block w-full rounded-md border-medical-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm resize-none"
              placeholder="Share your experience with our service..."
              value={data.comment}
              onChange={handleCommentChange}
            />
            <InputError message={errors.comment} className="mt-2" />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing || isSubmitting || data.rating === 0}
              className={`
                inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${processing || isSubmitting || data.rating === 0
                  ? 'bg-medical-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }
              `}
            >
              {processing || isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-medical-gray-50 px-6 py-4 border-t border-medical-gray-200">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-info-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-medical-gray-500">
            Your review will be shared with our team to improve our service. All reviews are moderated.
          </p>
        </div>
      </div>
    </div>
  );
}
