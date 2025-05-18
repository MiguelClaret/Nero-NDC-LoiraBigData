"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Onboarding component with step-by-step guide
const Onboarding = ({ isOpen = false, onComplete }) => {
  // Local state to handle internal component state
  const [currentStep, setCurrentStep] = useState(0)
  const [userType, setUserType] = useState(null)
  const navigate = useNavigate()

  // Reset component state when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setUserType(null)
    }
  }, [isOpen])

  const completeOnboarding = () => {
    localStorage.setItem("seedsafe_onboarding_completed", "true")
    if (onComplete) onComplete()
  }

  const skipOnboarding = () => {
    localStorage.setItem("seedsafe_onboarding_completed", "true")
    if (onComplete) onComplete()
  }

  const handleUserTypeSelection = (type) => {
    setUserType(type)
    setCurrentStep(currentStep + 1)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
      
      // Redirect based on user type
      if (userType === "producer") {
        navigate("/register")
      } else if (userType === "investor") {
        navigate("/marketplace")
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Define onboarding steps
  const steps = [
    // Step 1: Welcome & User Type Selection
    {
      title: "Welcome to SeedSafe",
      content: (
        <div className="text-center">
          <p className="mb-3 text-sm">
            We're excited to help you get started with our platform for sustainable agricultural financing.
          </p>
          <p className="font-semibold mb-4 text-sm">First, tell us who you are:</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleUserTypeSelection("producer")}
              className="flex flex-col items-center p-3 border-2 border-green-100 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-2">
                <i className="fas fa-tractor text-xl"></i>
              </div>
              <span className="font-bold">I'm a Producer</span>
              <span className="text-xs text-gray-500 mt-1">Register crops and get funding</span>
            </button>
            
            <button
              onClick={() => handleUserTypeSelection("investor")}
              className="flex flex-col items-center p-3 border-2 border-amber-100 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mb-2">
                <i className="fas fa-chart-pie text-xl"></i>
              </div>
              <span className="font-bold">I'm an Investor</span>
              <span className="text-xs text-gray-500 mt-1">Support producers and earn returns</span>
            </button>
          </div>
        </div>
      )
    },
    
    // Step 2: For Producers - explaining their journey
    ...(userType === "producer" ? [
      {
        title: "How SeedSafe Works for Producers",
        content: (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-user-plus text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Create Smart Account</h4>
                  <p className="text-xs text-gray-600">Register with zero gas fees</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-seedling text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Register your crop</h4>
                  <p className="text-xs text-gray-600">Set type, quantity and price</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-check-circle text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Auditor validation</h4>
                  <p className="text-xs text-gray-600">Verify sustainable practices</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-coins text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Receive funding</h4>
                  <p className="text-xs text-gray-600">Get advance capital</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-2 rounded-lg flex items-start gap-2 mb-3">
              <div className="text-green-700">
                <i className="fas fa-info-circle"></i>
              </div>
              <p className="text-xs">You earn both advance capital for your harvest plus carbon credits you can sell on our marketplace!</p>
            </div>
          </div>
        )
      }
    ] : []),
    
    // Step 2: For Investors - explaining their journey
    ...(userType === "investor" ? [
      {
        title: "How SeedSafe Works for Investors",
        content: (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-wallet text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Connect wallet</h4>
                  <p className="text-xs text-gray-600">Use MetaMask or create a Smart Account</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-search text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Browse opportunities</h4>
                  <p className="text-xs text-gray-600">Explore verified crops and impact</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-hand-holding-usd text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Invest in fractions</h4>
                  <p className="text-xs text-gray-600">Buy tokens for harvests and carbon credits</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-certificate text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-xs">Receive ComboNFT</h4>
                  <p className="text-xs text-gray-600">Get proof of investment and impact</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-2 rounded-lg flex items-start gap-2 mb-3">
              <div className="text-amber-700">
                <i className="fas fa-shield-alt"></i>
              </div>
              <p className="text-xs">Your investment is protected by our Guarantee Fund, providing compensation in case of crop failure!</p>
            </div>
          </div>
        )
      }
    ] : []),
    
    // Step 3: Platform Features (for both user types)
    {
      title: "Platform Features",
      content: (
        <div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                  <i className="fas fa-robot text-xs"></i>
                </div>
                <h4 className="font-semibold text-xs">AgroBot</h4>
              </div>
              <p className="text-xs text-gray-600">Our chatbot helps with Web3 and blockchain questions</p>
            </div>
            
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                  <i className="fas fa-gas-pump text-xs"></i>
                </div>
                <h4 className="font-semibold text-xs">Gasless</h4>
              </div>
              <p className="text-xs text-gray-600">Zero fees using NERO Chain technology</p>
            </div>
            
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <i className="fas fa-leaf text-xs"></i>
                </div>
                <h4 className="font-semibold text-xs">Carbon Credits</h4>
              </div>
              <p className="text-xs text-gray-600">TCO₂ tokens for sustainable farming</p>
            </div>
            
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                  <i className="fas fa-shield-alt text-xs"></i>
                </div>
                <h4 className="font-semibold text-xs">Guarantee Fund</h4>
              </div>
              <p className="text-xs text-gray-600">Protection for investors in case of crop failures</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-2 rounded-lg flex items-start gap-2">
            <div className="text-blue-700">
              <i className="fas fa-question-circle"></i>
            </div>
            <p className="text-xs">Have questions? Click the chat icon at the bottom right to talk with AgroBot!</p>
          </div>
        </div>
      )
    },
    
    // Step 4: Final step - Get Started
    {
      title: userType === "producer" ? "Ready to register your crop?" : "Ready to explore investments?",
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 mx-auto mb-3">
            <i className="fas fa-check text-2xl"></i>
          </div>
          
          <p className="mb-4 text-sm">
            {userType === "producer" 
              ? "You're all set to start your journey with SeedSafe! Register your crop and get advance capital without abusive interest rates." 
              : "You're all set to start your journey with SeedSafe! Explore verified agricultural investment opportunities with positive environmental impact."}
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className={`py-2 px-6 rounded-md text-sm font-semibold ${
                userType === "producer" 
                  ? "bg-green-700 text-white hover:bg-green-800" 
                  : "bg-amber-600 text-white hover:bg-amber-700"
              } hover:-translate-y-0.5 transition-all`}
            >
              {userType === "producer" ? "Register My Crop" : "View Marketplace"}
            </button>
          </div>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md transform transition-all scale-100 animate-fadeIn">
        {/* Top bar with progress indicator */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          <button
            onClick={skipOnboarding}
            className="text-gray-400 hover:text-gray-600 focus:outline-none text-sm"
          >
            Skip
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-1 bg-gray-200">
          <div 
            className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {steps[currentStep].content}
        </div>
        
        {/* Footer with buttons */}
        <div className="flex justify-between p-4 border-t">
          {currentStep > 0 ? (
            <button
              onClick={handlePrevious}
              className="py-1.5 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
          
          {currentStep < steps.length - 1 && currentStep > 0 && (
            <button
              onClick={handleNext}
              className="py-1.5 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2 text-sm"
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding