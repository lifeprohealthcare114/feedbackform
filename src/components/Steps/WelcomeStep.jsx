import React from 'react';

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="form-step fade-in">
      <fieldset>
        <legend>Welcome to Our Feedback Form!</legend>
        <p>Thank you for taking the time to provide your valuable feedback. Your insights help us improve our products and services.</p>
        <p>This form will guide you through a few sections to collect your thoughts on our products, company, and service.</p>
      </fieldset>
      <div className="form-navigation">
        <button type="button" onClick={onNext}>Start Feedback</button>
      </div>
    </div>
  );
};

export default WelcomeStep;