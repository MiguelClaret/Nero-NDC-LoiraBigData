import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Wallet,
  Filter,
  Search,
  CreditCard,
  Leaf,
  ArrowRight,
  X,
  Info,
  DollarSign,
  BarChart
} from 'lucide-react';

const MarketplaceOnboarding = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animateExit, setAnimateExit] = useState(false);
  
  // Reset the component when activated
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnimateExit(false);
      // Enable scrolling when onboarding is open
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);
  
  // Always define this effect for scrolling, but removed element highlighting
  useEffect(() => {
    // Removed highlighting code, keeping only step tracking
  }, [currentStep, isOpen]);
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    // Mark guide as completed in localStorage
    localStorage.setItem("seedsafe_marketplace_guide_completed", "true");
    
    // Animate exit
    setAnimateExit(true);
    
    // Close after animation completes
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };
  
  const handleSkip = () => {
    localStorage.setItem("seedsafe_marketplace_guide_completed", "true");
    setAnimateExit(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };
  
  // Define the steps of the guide
  const steps = [
    {
      title: "Welcome to the Marketplace",
      description: "Discover sustainable farming investments with blockchain-secured transactions and transparent environmental impact.",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: null
    },
    {
      title: "Secure Blockchain Transactions",
      description: "All marketplace transactions are secured by NERO Chain's advanced cryptography. Every purchase is verified and immutable.",
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      position: "center",
      securityInfo: "Smart contracts automatically handle all transactions without intermediaries, reducing costs and increasing transparency."
    },
    {
      title: "Carbon Credit Tokens",
      description: "Each crop includes carbon credits based on the farmer's sustainable practices. These are bundled with harvest tokens.",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Carbon credits are verified by third-party auditors and recorded on the blockchain for maximum transparency."
    },
    {
      title: "Search and Filters",
      description: "Easily find the perfect investment by searching for specific crops, farmers, or locations.",
      icon: <Search className="h-8 w-8 text-gray-600" />,
      position: "center",
      securityInfo: "All search queries are processed securely without tracking."
    },
    {
      title: "Advanced Filtering",
      description: "Filter by sustainability practices, crop types, and harvest dates to find investments that match your values.",
      icon: <Filter className="h-8 w-8 text-gray-600" />,
      position: "center",
      securityInfo: "All listing information is verified by auditors before being published to the marketplace."
    },
    {
      title: "Gasless Transactions",
      description: "Thanks to Account Abstraction and our CustomPaymaster, you never pay blockchain gas fees.",
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      position: "center",
      securityInfo: "We cover all transaction fees, making the marketplace accessible regardless of your crypto experience."
    },
    {
      title: "Combo NFTs",
      description: "Each purchase includes a unique NFT combining both the crop harvest token and carbon credit certification.",
      icon: <Wallet className="h-8 w-8 text-amber-600" />,
      position: "center",
      securityInfo: "Your NFT is backed by real-world assets and verified carbon credits, all secured on the blockchain."
    },
    {
      title: "Invest With Confidence",
      description: "All crops are backed by our Guarantee Fund to protect investors against harvest failures.",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Smart contracts ensure automatic compensation if a harvest fails to meet its promised yield."
    },
    {
      title: "You're Ready to Invest!",
      description: "Start exploring sustainable agriculture investments that benefit farmers, the environment, and your portfolio.",
      icon: <ArrowRight className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: null
    }
  ];
  
  // If no guide should be shown, render nothing
  if (!isOpen) return null;
  
  // Get current step
  const step = steps[currentStep];
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip}></div>
      
      {/* Tooltip/card for current step - center positioned */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl p-4 max-w-md transition-all duration-500 z-[120] ${
          animateExit ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-gray-100">
            {step.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-3 text-sm">{step.description}</p>
        
        {/* Security information block */}
        {step.securityInfo && (
          <div className="bg-blue-50 p-2 rounded-lg mb-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">{step.securityInfo}</p>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-amber-600' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            Skip tour
          </button>
          
          <button
            onClick={handleNextStep}
            className="bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all hover:translate-y-[-2px] text-sm"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MarketplaceOnboarding;