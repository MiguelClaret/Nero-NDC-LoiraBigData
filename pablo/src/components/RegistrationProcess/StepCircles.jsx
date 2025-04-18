import React, { useState } from 'react';
import { FileText, AlertCircle, Check, X, Lock, DollarSign } from 'lucide-react';

const StepCircles = ({ currentStep, registrationStatus }) => {
  const [showTooltip, setShowTooltip] = useState({ step2: false, step3: false });
  
  return (
    <div className="flex justify-center items-center mb-12 px-4">
      {/* Step 1: Register */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-500 ${
          currentStep === 1 ? 'bg-green-500 border-green-500 text-white card-glow' : 
          currentStep > 1 ? 'bg-green-500 border-green-500 text-white' : 
          'bg-white border-gray-300 text-gray-700'
        }`}>
          <FileText className={`h-5 w-5 md:h-6 md:w-6 ${currentStep === 1 ? 'animate-pulse' : ''}`} />
        </div>
        <span className="mt-2 text-xs md:text-sm font-medium text-white">Register</span>
      </div>
      
      {/* Connector line */}
      <div className={`w-10 md:w-24 h-1 transition-colors duration-500 ${
        currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'
      }`}></div>
      
      {/* Step 2: Verification */}
      <div className="flex flex-col items-center relative">
        <div 
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-500 ${
            currentStep === 2 
              ? (registrationStatus === 'approved' ? 'bg-green-500 border-green-500 text-white card-glow' : 
                 registrationStatus === 'rejected' ? 'bg-red-500 border-red-500 text-white card-glow' : 
                 'bg-yellow-500 border-yellow-500 text-white card-glow')
              : currentStep > 2
                ? (registrationStatus === 'approved' ? 'bg-green-500 border-green-500 text-white' : 
                   'bg-red-500 border-red-500 text-white')
                : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
          onMouseEnter={() => currentStep < 2 && setShowTooltip({...showTooltip, step2: true})}
          onMouseLeave={() => setShowTooltip({...showTooltip, step2: false})}
        >
          {currentStep >= 2 && registrationStatus === 'pending' ? (
            <AlertCircle className={`h-5 w-5 md:h-6 md:w-6 ${currentStep === 2 ? 'animate-pulse' : ''}`} />
          ) : currentStep >= 2 && registrationStatus === 'approved' ? (
            <Check className={`h-5 w-5 md:h-6 md:w-6 ${currentStep === 2 ? 'animate-pulse' : ''}`} />
          ) : currentStep >= 2 && registrationStatus === 'rejected' ? (
            <X className={`h-5 w-5 md:h-6 md:w-6 ${currentStep === 2 ? 'animate-pulse' : ''}`} />
          ) : (
            <Lock className="h-5 w-5 md:h-6 md:w-6" />
          )}
          
          {/* Tooltip for locked step */}
          {showTooltip.step2 && currentStep < 2 && (
            <div className="absolute -bottom-12 w-40 bg-white text-gray-800 text-xs p-2 rounded shadow-lg z-10 border border-gray-200">
              Complete the current step to unlock this
            </div>
          )}
        </div>
        <span className="mt-2 text-xs md:text-sm font-medium text-white">Verification</span>
      </div>
      
      {/* Connector line */}
      <div className={`w-10 md:w-24 h-1 transition-colors duration-500 ${
        currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'
      }`}></div>
      
      {/* Step 3: Marketplace */}
      <div className="flex flex-col items-center relative">
        <div 
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-500 ${
            currentStep === 3 ? 'bg-green-500 border-green-500 text-white card-glow' : 
            currentStep > 3 ? 'bg-green-500 border-green-500 text-white' : 
            'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
          onMouseEnter={() => currentStep < 3 && setShowTooltip({...showTooltip, step3: true})}
          onMouseLeave={() => setShowTooltip({...showTooltip, step3: false})}
        >
          {currentStep >= 3 ? (
            <DollarSign className={`h-5 w-5 md:h-6 md:w-6 ${currentStep === 3 ? 'animate-pulse' : ''}`} />
          ) : (
            <Lock className="h-5 w-5 md:h-6 md:w-6" />
          )}
          
          {/* Tooltip for locked step */}
          {showTooltip.step3 && currentStep < 3 && (
            <div className="absolute -bottom-12 w-40 bg-white text-gray-800 text-xs p-2 rounded shadow-lg z-10 border border-gray-200">
              Complete the current step to unlock this
            </div>
          )}
        </div>
        <span className="mt-2 text-xs md:text-sm font-medium text-white">Marketplace</span>
      </div>
    </div>
  );
};

export default StepCircles;