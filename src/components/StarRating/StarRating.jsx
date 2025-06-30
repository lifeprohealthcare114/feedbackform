import React from 'react';
import './StarRating.css';

const StarRating = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  maxStars = 5 
}) => {
  const handleRatingChange = (ratingValue) => {
    onChange(name, ratingValue);
  };

  return (
    <div className="star-rating-container">
      <label className="star-rating-label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      
      <div className="stars">
        {[...Array(maxStars)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <span
              key={ratingValue}
              className={`star ${value >= ratingValue ? 'selected' : ''}`}
              onClick={() => handleRatingChange(ratingValue)}
              onMouseEnter={() => {
                // Add hover effect logic if needed
              }}
              aria-label={`Rate ${ratingValue} out of ${maxStars}`}
              role="button"
              tabIndex={0}
            >
              ★
            </span>
          );
        })}
      </div>
      
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default StarRating;