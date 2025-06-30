import React from 'react';
import StarRating from '../StarRating/StarRating';

const ProductStep = ({ formData, handleChange, handleRatingChange, errors, onNext, onBack }) => {
  return (
    <div className="form-step slide-in">
      <fieldset>
        <legend>Product Feedback</legend>

        <label htmlFor="howHeard">
          How did you hear about us?
          <select
            id="howHeard"
            name="howHeard"
            value={formData.howHeard}
            onChange={handleChange}
          >
            <option value="">Select an option</option>
            <option value="Google Search">Google Search</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label htmlFor="productInterest" className="required">
          Product of Interest:
          <select
            id="productInterest"
            name="productInterest"
            value={formData.productInterest}
            onChange={handleChange}
            aria-describedby="productInterest-error"
            aria-invalid={!!errors.productInterest}
          >
            <option value="">Select the product you're interested in</option>
            <option value="Lambda">Lambda</option>
            <option value="Samantree">Samantree</option>
            <option value="REBIS">REBIS</option>
            <option value="Caterwill">Caterwill</option>
          </select>
        </label>
        {errors.productInterest && <span id="productInterest-error" className="error">{errors.productInterest}</span>}

        <StarRating
          label="Overall Product Satisfaction:"
          name="productSatisfaction"
          value={formData.productSatisfaction}
          onChange={handleRatingChange}
          error={errors.productSatisfaction}
          maxStars={5}
          className="required"
        />

        <label htmlFor="favoriteFeatures">
          What are your favorite features or aspects of the product?
          <textarea
            id="favoriteFeatures"
            name="favoriteFeatures"
            value={formData.favoriteFeatures}
            onChange={handleChange}
            placeholder="e.g., ease of use, effectiveness, design..."
            minLength={5}
          />
        </label>

        <label className="radio-label required">Would you recommend this product to a colleague or friend?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="productRecommendation"
              value="Yes"
              checked={formData.productRecommendation === 'Yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="productRecommendation"
              value="No"
              checked={formData.productRecommendation === 'No'}
              onChange={handleChange}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              name="productRecommendation"
              value="Maybe"
              checked={formData.productRecommendation === 'Maybe'}
              onChange={handleChange}
            />
            Maybe
          </label>
        </div>
        {errors.productRecommendation && <span className="error">{errors.productRecommendation}</span>}

      </fieldset>
      <div className="form-navigation">
        <button type="button" onClick={onBack} className="back-button">Back</button>
        <button type="button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default ProductStep;