import React, { useRef, useEffect, useCallback } from 'react';
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
  const starsRef = useRef(null);
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  const handleStarClick = useCallback((ratingValue) => {
    onChange(name, ratingValue);
  }, [name, onChange]);

  const handleTouchRating = useCallback((clientX) => {
    if (!starsRef.current) return;
    
    const containerRect = starsRef.current.getBoundingClientRect();
    const relativeX = clientX - containerRect.left;
    const starWidth = containerRect.width / maxStars;
    let ratingValue = Math.ceil(relativeX / starWidth);
    
    // Ensure rating is between 1 and maxStars
    ratingValue = Math.max(1, Math.min(ratingValue, maxStars));
    onChange(name, ratingValue);
  }, [name, onChange, maxStars]);

  useEffect(() => {
    if (!isTouchDevice || !starsRef.current) return;

    const starsContainer = starsRef.current;

    const handleTouchStart = (e) => {
      handleTouchRating(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      handleTouchRating(e.touches[0].clientX);
    };

    starsContainer.addEventListener('touchstart', handleTouchStart);
    starsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      starsContainer.removeEventListener('touchstart', handleTouchStart);
      starsContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTouchDevice, handleTouchRating]);

  return (
    <div className="star-rating-container">
      <label className="star-rating-label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      
      <div className="stars" ref={starsRef}>
        {[...Array(maxStars)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <span
              key={ratingValue}
              className={`star ${value >= ratingValue ? 'selected' : ''}`}
              onClick={() => handleStarClick(ratingValue)}
              onMouseEnter={() => {}}
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