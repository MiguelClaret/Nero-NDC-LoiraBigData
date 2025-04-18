import React, { useState } from 'react';
import { Camera, Leaf, FileText, Check, X, Shield, DollarSign, AlertCircle, User, Settings, Lock, Calendar, MapPin, ChevronRight, Archive, ClipboardCheck } from 'lucide-react';

// Mock data for demonstration
const mockUser = {
  name: "John Farmer",
  farm: "Green Valley Farm",
  location: "São Paulo, Brazil"
};

// Main App Component
const SafeSeedApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  // Render the appropriate page content
  const renderPageContent = () => {
    switch(currentPage) {
      case 'register':
        return <RegistrationProcess />;
      default:
        return <HeroSection setCurrentPage={setCurrentPage} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Leaf className="h-6 w-6 text-green-700" />
            <span className="font-bold text-xl text-green-800">SafeSeed</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto p-4">
          {renderPageContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 mt-auto">
        <div className="max-w-screen-xl mx-auto p-4 text-center text-sm text-gray-600">
          &copy; 2025 SafeSeed. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
          Register your harvest, secure your future
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          SafeSeed connects farmers with investors through a secure and transparent platform. Register your crop, get verified, and receive funding.
        </p>
        
        <button 
          onClick={() => setCurrentPage('register')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition duration-300 flex items-center mx-auto"
        >
          <Leaf className="mr-2 h-5 w-5" />
          Register Your Crop
        </button>
      </div>
      
      <div className="w-full max-w-3xl mt-12">
        <h2 className="text-2xl font-semibold text-green-800 mb-6">How it works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-green-800">Register Your Crop</h3>
            <p className="text-gray-600 text-sm">Enter details about your crop, including type, quantity, and sustainable practices.</p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Shield className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-green-800">Get Verified</h3>
            <p className="text-gray-600 text-sm">Our auditors will verify your information and approve your crop for the marketplace.</p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <DollarSign className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-green-800">Receive Funding</h3>
            <p className="text-gray-600 text-sm">Investors can purchase tokens of your crop, providing you with immediate funding.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Process Component with Step Circles
const RegistrationProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    harvestDate: '',
    location: '',
    sustainablePractices: [],
    images: []
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [salesProgress, setSalesProgress] = useState(0); // Percentage of crop sold
  
  // Function to handle form submission for step 1
  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate the form here
    setCurrentStep(2);
    // Simulate sending to auditor
    setRegistrationStatus('pending');
  };
  
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
      <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-8 text-center">
        Register Your Crop
      </h1>
      
      {/* Step Progress Circles - Optimized for mobile */}
      <div className="flex justify-center items-center mb-12 px-4">
        {/* Step 1: Register */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-semibold border-2 ${
            currentStep >= 1 ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'
          }`}>
            <FileText className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <span className="mt-2 text-xs md:text-sm font-medium text-gray-700">Register</span>
        </div>
        
        {/* Connector line */}
        <div className={`w-10 md:w-24 h-1 ${
          currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'
        }`}></div>
        
        {/* Step 2: Verification */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-semibold border-2 ${
            currentStep >= 2 
              ? (registrationStatus === 'approved' ? 'bg-green-600 border-green-600 text-white' : 
                 registrationStatus === 'rejected' ? 'bg-red-500 border-red-500 text-white' : 
                 'bg-yellow-500 border-yellow-500 text-white')
              : 'bg-gray-200 border-gray-300 text-gray-500'
          }`}>
            {currentStep >= 2 && registrationStatus === 'pending' ? (
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
            ) : currentStep >= 2 && registrationStatus === 'approved' ? (
              <Check className="h-5 w-5 md:h-6 md:w-6" />
            ) : currentStep >= 2 && registrationStatus === 'rejected' ? (
              <X className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <Lock className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </div>
          <span className="mt-2 text-xs md:text-sm font-medium text-gray-700">Verification</span>
        </div>
        
        {/* Connector line */}
        <div className={`w-10 md:w-24 h-1 ${
          currentStep >= 3 ? 'bg-green-600' : 'bg-gray-300'
        }`}></div>
        
        {/* Step 3: Marketplace */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-semibold border-2 ${
            currentStep >= 3 ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'
          }`}>
            {currentStep >= 3 ? (
              <DollarSign className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <Lock className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </div>
          <span className="mt-2 text-xs md:text-sm font-medium text-gray-700">Marketplace</span>
        </div>
      </div>
      
      {/* Step content based on current step */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-green-800 mb-4">Crop Details</h2>
            <form onSubmit={handleStepOneSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Type
                  </label>
                  <select 
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select crop type</option>
                    <option value="coffee">Coffee</option>
                    <option value="soybean">Soybean</option>
                    <option value="corn">Corn</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Quantity (kg)
                  </label>
                  <input 
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g. 1000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Harvest Date
                  </label>
                  <input 
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Location
                  </label>
                  <input 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="City, State"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sustainable Practices (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="practice1"
                        name="sustainablePractices"
                        value="organic"
                        checked={formData.sustainablePractices.includes('organic')}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="practice1" className="ml-2 text-sm text-gray-700">
                        Organic farming (no synthetic pesticides)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="practice2"
                        name="sustainablePractices"
                        value="conservation"
                        checked={formData.sustainablePractices.includes('conservation')}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="practice2" className="ml-2 text-sm text-gray-700">
                        Conservation tillage
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="practice3"
                        name="sustainablePractices"
                        value="rotation"
                        checked={formData.sustainablePractices.includes('rotation')}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="practice3" className="ml-2 text-sm text-gray-700">
                        Crop rotation
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="practice4"
                        name="sustainablePractices"
                        value="water"
                        checked={formData.sustainablePractices.includes('water')}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="practice4" className="ml-2 text-sm text-gray-700">
                        Water conservation techniques
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Farm Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <button type="button" className="text-sm font-medium text-green-600 hover:text-green-500">
                        Upload a file
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition duration-300"
                  >
                    Submit for Verification
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-green-800 mb-4">Verification Status</h2>
            
            {registrationStatus === 'pending' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">Pending Verification</span>
                </div>
                <p className="text-yellow-700 mt-2">
                  Our auditors are reviewing your submission. This typically takes 24-48 hours.
                </p>
              </div>
            )}
            
            {registrationStatus === 'rejected' && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
                <div className="flex items-center">
                  <X className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Verification Failed</span>
                </div>
                <p className="text-red-700 mt-2">
                  Unfortunately, your submission did not meet our requirements. Please review the feedback below and submit again.
                </p>
                <div className="mt-4 bg-white p-3 rounded-md border border-red-200">
                  <h3 className="text-sm font-medium text-gray-700">Auditor Feedback:</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    The sustainable practices selected don't match the images provided. Please ensure your farm demonstrates these practices and provide clearer images.
                  </p>
                </div>
              </div>
            )}
            
            {/* For demonstration purposes, adding buttons to simulate auditor decisions */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Demonstration Controls:</h3>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition flex-1"
                  onClick={() => simulateAuditorDecision('approved')}
                >
                  Simulate Approval
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition flex-1"
                  onClick={() => simulateAuditorDecision('rejected')}
                >
                  Simulate Rejection
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: These buttons are for demonstration purposes only and simulate auditor decisions.
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-green-800 mb-4">Marketplace Status</h2>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Verification Approved!</span>
              </div>
              <p className="text-green-700 mt-2">
                Your crop has been verified and is now listed on our marketplace for investors.
              </p>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-700">Sales Progress</h3>
                <span className="text-green-600 font-semibold">{salesProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${salesProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {salesProgress < 100 
                  ? `${salesProgress}% of your crop tokens have been purchased by investors.`
                  : 'Congratulations! 100% of your crop tokens have been sold.'}
              </p>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-700 mb-4">Your Crop Tokens</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Archive className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {formData.cropType ? formData.cropType.charAt(0).toUpperCase() + formData.cropType.slice(1) : 'Coffee'} Harvest {new Date().getFullYear()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.quantity || '1000'} kg - Due on {formData.harvestDate || '2025-10-15'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ClipboardCheck className="h-5 w-5 text-green-600 mr-1" />
                      <span className="text-sm text-gray-600">Verified by SafeSeed</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {salesProgress < 100 ? 'Active' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center"
              >
                <User className="mr-2 h-5 w-5" />
                Create Account to Track Progress
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Create an account to track your crops and receive payments directly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafeSeedApp;