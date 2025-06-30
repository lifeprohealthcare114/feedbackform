import React from 'react';

const FinalStep = ({ formData, handleChange, errors, onSubmit, onBack, isSubmitting }) => {
  return (
    <div className="form-step slide-in">
      <fieldset>
        <legend>Additional Feedback & Optional Contact</legend>

        <label htmlFor="generalComments">
          Do you have any other comments or general feedback you'd like to share?
          <textarea
            id="generalComments"
            name="generalComments"
            value={formData.generalComments}
            onChange={handleChange}
            placeholder="Any other thoughts..."
            minLength={5}
          />
        </label>

        <label className="radio-label">Would you be willing to be contacted for a follow-up discussion?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="contactForFollowUp"
              value="Yes"
              checked={formData.contactForFollowUp === 'Yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="contactForFollowUp"
              value="No"
              checked={formData.contactForFollowUp === 'No'}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        {formData.contactForFollowUp === 'Yes' && (
          <label htmlFor="followUpEmail" className="required">
            Please provide your email for follow-up:
            <input
              id="followUpEmail"
              type="email"
              name="followUpEmail"
              value={formData.followUpEmail}
              onChange={handleChange}
              placeholder="followup@example.com"
              aria-describedby="followUpEmail-error"
              aria-invalid={!!errors.followUpEmail}
            />
          </label>
        )}
        {errors.followUpEmail && <span id="followUpEmail-error" className="error">{errors.followUpEmail}</span>}

      </fieldset>
      <div className="form-navigation">
        <button type="button" onClick={onBack} className="back-button">Back</button>
        <button type="submit" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

export default FinalStep;