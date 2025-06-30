import React from 'react';
import StarRating from '../StarRating/StarRating';

const ServiceStep = ({ formData, handleChange, handleRatingChange, errors, onNext, onBack }) => {
  return (
    <div className="form-step slide-in">
      <fieldset>
        <legend>Client Service & Website Experience</legend>

        <label className="radio-label">Have you interacted with our customer service team?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="customerServiceUsed"
              value="Yes"
              checked={formData.customerServiceUsed === 'Yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="customerServiceUsed"
              value="No"
              checked={formData.customerServiceUsed === 'No'}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        {formData.customerServiceUsed === 'Yes' && (
          <StarRating
            label="How would you rate your customer service experience?"
            name="customerServiceRating"
            value={formData.customerServiceRating}
            onChange={handleRatingChange}
            error={errors.customerServiceRating}
            maxStars={5}
            className="required"
          />
        )}

        <StarRating
          label="How easy was it to find information or navigate our website?"
          name="websiteEaseOfUse"
          value={formData.websiteEaseOfUse}
          onChange={handleRatingChange}
          error={errors.websiteEaseOfUse}
          maxStars={5}
          className="required"
        />

        <label htmlFor="websiteImprovements">
          Do you have any suggestions for improving our website?
          <textarea
            id="websiteImprovements"
            name="websiteImprovements"
            value={formData.websiteImprovements}
            onChange={handleChange}
            placeholder="Your suggestions here..."
            minLength={5}
          />
        </label>

      </fieldset>
      <div className="form-navigation">
        <button type="button" onClick={onBack} className="back-button">Back</button>
        <button type="button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default ServiceStep;