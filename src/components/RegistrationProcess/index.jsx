import React, { useState, useEffect } from 'react';
import StepCircles from './StepCircles';
import CropForm from './CropForm';
import LoginForm from './LoginForm';
import VerificationStatus from './VerificationStatus';
import MarketplaceStatus from './MarketplaceStatus';

const RegistrationProcess = ({ setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    harvestDate: '',
    location: '',
    sustainablePractices: []
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [salesProgress, setSalesProgress] = useState(0); // Percentage of crop sold
  
  // Function to handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  
  // Function to handle login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    setIsLoggedIn(true);
    setShowLogin(false);
  };
  
  // Function to handle form submission for step 1
  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate the form here
    
    // Show login form after submission
    setShowLogin(true);
  };
  
  // Continue to verification after login
  useEffect(() => {
    if (isLoggedIn && showLogin === false && currentStep === 1) {
      setCurrentStep(2);
      setRegistrationStatus('pending');
    }
  }, [isLoggedIn, showLogin, currentStep]);
  
  // Simulate auditor decision (approve/reject)
  const simulateAuditorDecision = (decision) => {
    setRegistrationStatus(decision);
    if (decision === 'approved') {
      setCurrentStep(3);
      // Simulate sales progress over time
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress > 100) progress = 100;
        setSalesProgress(progress);
        if (progress === 100) clearInterval(interval);
      }, 2000);
    }
  };
  
  // This would be called by the form to handle changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedPractices = [...formData.sustainablePractices];
    
    if (checked) {
      updatedPractices.push(value);
    } else {
      updatedPractices = updatedPractices.filter(practice => practice !== value);
    }
    
    setFormData({
      ...formData,
      sustainablePractices: updatedPractices
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center animate-fadeIn">
        Register Your Crop
      </h1>
      
      {/* Step Progress Circles */}
      <StepCircles currentStep={currentStep} registrationStatus={registrationStatus} />
      
      {/* Step content based on current step */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn">
        {showLogin && (
          <LoginForm 
            loginData={loginData} 
            handleLoginChange={handleLoginChange} 
            handleLoginSubmit={handleLoginSubmit} 
          />
        )}
        
        {currentStep === 1 && !showLogin && (
          <CropForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleCheckboxChange={handleCheckboxChange} 
            handleStepOneSubmit={handleStepOneSubmit} 
          />
        )}
        
        {currentStep === 2 && (
          <VerificationStatus 
            registrationStatus={registrationStatus} 
            simulateAuditorDecision={simulateAuditorDecision} 
          />
        )}
        
        {currentStep === 3 && (
          <MarketplaceStatus 
            formData={formData} 
            salesProgress={salesProgress} 
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationProcess;