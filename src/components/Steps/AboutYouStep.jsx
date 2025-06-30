import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AboutYouStep = ({ formData, handleChange, errors, onNext, onBack }) => {
  const handlePhoneChange = (value) => {
    handleChange({
      target: {
        name: 'phone',
        value: value
      }
    });
  };

  return (
    <div className="form-step slide-in">
      <fieldset>
        <legend>About You</legend>

        <label htmlFor="name" className="required">
          Name:
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            aria-describedby="name-error"
            aria-invalid={!!errors.name}
          />
        </label>
        {errors.name && <span id="name-error" className="error">{errors.name}</span>}

        <label htmlFor="email" className="required">
          Email:
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            aria-describedby="email-error"
            aria-invalid={!!errors.email}
          />
        </label>
        {errors.email && <span id="email-error" className="error">{errors.email}</span>}

        <label htmlFor="phone">
          Phone:
          <PhoneInput
            id="phone"
            international
            defaultCountry="US"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            className={`phone-input ${errors.phone ? 'error' : ''}`}
            aria-describedby="phone-error"
            aria-invalid={!!errors.phone}
          />
        </label>
        {errors.phone && <span id="phone-error" className="error">{errors.phone}</span>}

        <label htmlFor="companyName">
          Company Name:
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your company (optional)"
          />
        </label>

        <label htmlFor="customerStatus" className="required">
          Are you a new or returning customer?
          <select
            id="customerStatus"
            name="customerStatus"
            value={formData.customerStatus}
            onChange={handleChange}
            aria-describedby="customerStatus-error"
            aria-invalid={!!errors.customerStatus}
          >
            <option value="">Select an option</option>
            <option value="New">New Customer</option>
            <option value="Returning">Returning Customer</option>
          </select>
        </label>
        {errors.customerStatus && <span id="customerStatus-error" className="error">{errors.customerStatus}</span>}

        {formData.customerStatus === 'Returning' && (
            <label htmlFor="customerDuration">
                How long have you been a Lifepro Healthcare customer?
                <input
                    id="customerDuration"
                    type="text"
                    name="customerDuration"
                    value={formData.customerDuration}
                    onChange={handleChange}
                    placeholder="e.g., 1-2 years, >5 years"
                />
            </label>
        )}

      </fieldset>
      <div className="form-navigation">
        <button type="button" onClick={onBack} className="back-button">Back</button>
        <button type="button" onClick={onNext} className="next-button">Next</button>
      </div>
    </div>
  );
};

export default AboutYouStep;