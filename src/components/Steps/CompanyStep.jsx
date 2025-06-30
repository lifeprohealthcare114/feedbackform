import React from 'react';

const CompanyStep = ({ formData, handleChange, handleRatingChange, errors, onNext, onBack }) => {
  const npsScores = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="form-step slide-in">
      <fieldset>
        <legend>Company Feedback</legend>

        <label htmlFor="npsScore" className="required">
          On a scale of 0 to 10, how likely are you to recommend Lifepro Healthcare to a friend or colleague?
          <select
            id="npsScore"
            name="npsScore"
            value={formData.npsScore}
            onChange={(e) => handleRatingChange('npsScore', parseInt(e.target.value))}
            aria-describedby="npsScore-error"
            aria-invalid={!!errors.npsScore}
          >
            <option value="0">Select a score</option>
            {npsScores.map((score) => (
              <option key={score} value={score}>{score} - {
                score >= 9 ? 'Promoter' :
                score >= 7 ? 'Passive' :
                'Detractor'
              }</option>
            ))}
          </select>
        </label>
        {errors.npsScore && <span id="npsScore-error" className="error">{errors.npsScore}</span>}

        <label htmlFor="companyOverallSatisfaction" className="required">
          How satisfied are you with Lifepro Healthcare overall?
          <select
            id="companyOverallSatisfaction"
            name="companyOverallSatisfaction"
            value={formData.companyOverallSatisfaction}
            onChange={handleChange}
            aria-describedby="companyOverallSatisfaction-error"
            aria-invalid={!!errors.companyOverallSatisfaction}
          >
            <option value="">Select an option</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </label>
        {errors.companyOverallSatisfaction && <span id="companyOverallSatisfaction-error" className="error">{errors.companyOverallSatisfaction}</span>}

        <p className="checkbox-label">Please check all statements that you agree with regarding Lifepro Healthcare:</p>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="brandStatements.innovative"
              checked={formData.brandStatements.innovative}
              onChange={handleChange}
            />
            Innovative solutions
          </label>
          <label>
            <input
              type="checkbox"
              name="brandStatements.reliable"
              checked={formData.brandStatements.reliable}
              onChange={handleChange}
            />
            Reliable products
          </label>
          <label>
            <input
              type="checkbox"
              name="brandStatements.customerCentric"
              checked={formData.brandStatements.customerCentric}
              onChange={handleChange}
            />
            Customer-centric approach
          </label>
          <label>
            <input
              type="checkbox"
              name="brandStatements.trustworthy"
              checked={formData.brandStatements.trustworthy}
              onChange={handleChange}
            />
            Trustworthy brand
          </label>
        </div>

      </fieldset>
      <div className="form-navigation">
        <button type="button" onClick={onBack} className="back-button">Back</button>
        <button type="button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default CompanyStep;