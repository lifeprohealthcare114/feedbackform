import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfettiExplosion from 'react-confetti-explosion';
import { isValidPhoneNumber } from 'react-phone-number-input';

import '../css/feedback.css';
import logo from '../image/logo.png';
import StepWelcome from './Steps/WelcomeStep';
import StepAboutYou from './Steps/AboutYouStep';
import StepProductFeedback from './Steps/ProductStep';
import StepCompanyFeedback from './Steps/CompanyStep';
import StepServiceWebsite from './Steps/ServiceStep';
import StepAdditionalFeedback from './Steps/FinalStep';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    customerStatus: '',
    customerDuration: '',
    howHeard: '',
    productInterest: '',
    productSatisfaction: 0,
    favoriteFeatures: '',
    productRecommendation: '',
    npsScore: 0,
    companyOverallSatisfaction: '',
    brandStatements: {
      innovative: false,
      reliable: false,
      customerCentric: false,
      trustworthy: false,
    },
    customerServiceUsed: '',
    customerServiceRating: 0,
    websiteEaseOfUse: 0,
    websiteImprovements: '',
    generalComments: '',
    contactForFollowUp: '',
    followUpEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 6;

  const validateStep = (step) => {
    let newErrors = {};
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format.';
        if (formData.phone && !isValidPhoneNumber(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.customerStatus) newErrors.customerStatus = 'Please select your customer status.';
        break;
      case 2:
        if (!formData.productInterest) newErrors.productInterest = 'Please select a product.';
        if (formData.productSatisfaction === 0) newErrors.productSatisfaction = 'Please rate your product satisfaction.';
        if (!formData.productRecommendation) newErrors.productRecommendation = 'Please select if you would recommend the product.';
        break;
      case 3:
        if (formData.npsScore === 0) newErrors.npsScore = 'Please provide a Net Promoter Score (0-10).';
        if (!formData.companyOverallSatisfaction) newErrors.companyOverallSatisfaction = 'Please rate overall company satisfaction.';
        break;
      case 4:
        if (formData.customerServiceUsed === 'Yes' && formData.customerServiceRating === 0) {
          newErrors.customerServiceRating = 'Please rate your customer service experience.';
        }
        if (formData.websiteEaseOfUse === 0) newErrors.websiteEaseOfUse = 'Please rate website ease of use.';
        break;
      case 5:
        if (formData.contactForFollowUp === 'Yes' && (!formData.followUpEmail.trim() || !/^\S+@\S+\.\S+$/.test(formData.followUpEmail))) {
          newErrors.followUpEmail = 'Email is required for follow-up and must be valid.';
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) toast.error('Please correct errors before proceeding.');
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith('brandStatements.')) {
      const statementKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        brandStatements: {
          ...prev.brandStatements,
          [statementKey]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRatingChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'brandStatements') {
          // Handle brand statements separately
          Object.entries(value).forEach(([statementKey, statementValue]) => {
            formDataToSend.append(`brandStatements.${statementKey}`, statementValue);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });
      
      // Add the form-name required by Netlify
      formDataToSend.append('form-name', 'feedback');

      const response = await fetch('/', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Submission failed');

      setShowConfetti(true);
      setTimeout(() => navigate('/thank-you'), 2000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepWelcome onNext={handleNext} />;
      case 1:
        return (
          <StepAboutYou 
            formData={formData} 
            handleChange={handleChange} 
            errors={errors} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 2:
        return (
          <StepProductFeedback 
            formData={formData} 
            handleChange={handleChange} 
            handleRatingChange={handleRatingChange} 
            errors={errors} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 3:
        return (
          <StepCompanyFeedback 
            formData={formData} 
            handleChange={handleChange} 
            handleRatingChange={handleRatingChange} 
            errors={errors} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 4:
        return (
          <StepServiceWebsite 
            formData={formData} 
            handleChange={handleChange} 
            handleRatingChange={handleRatingChange} 
            errors={errors} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 5:
        return (
          <StepAdditionalFeedback 
            formData={formData} 
            handleChange={handleChange} 
            errors={errors} 
            onSubmit={handleSubmit} 
            onBack={handleBack} 
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <StepWelcome onNext={handleNext} />;
    }
  };

  return (
    <div className="feedback-container">
      {showConfetti && <ConfettiExplosion duration={3000} particleCount={200} force={0.8} />}
      <img src={logo} alt="Life Pro Healthcare" className="logo" />
      <h1 className="main-heading">We Value Your Feedback</h1>
      <p className="sub-heading">Your opinion helps us deliver better healthcare. Please take a moment to share your thoughts.</p>

      {currentStep > 0 && currentStep < totalSteps && (
        <div className="form-progress">
          Step {currentStep} of {totalSteps - 1}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentStep - 1) / (totalSteps - 2)) * 100}%` }}></div>
          </div>
        </div>
      )}

      <form 
        name="feedback"
        method="POST"
        data-netlify="true"
        onSubmit={handleSubmit}
        netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="feedback" />
        {renderStep()}
      </form>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default FeedbackForm;