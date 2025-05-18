"use client"

import { useState, useEffect, useRef } from "react"

const Tooltip = ({ content, position, arrowPosition, onClose, onNext, onPrevious, currentStep, totalSteps }) => {
  return (
    <div 
      className="absolute z-50 bg-white rounded-lg shadow-xl p-3 w-52 animate-fadeIn"
      style={position}
    >
      {/* Arrow */}
      <div 
        className="absolute w-3 h-3 bg-white rotate-45 transform"
        style={arrowPosition}
      ></div>
      
      {/* Content */}
      <div className="relative">
        <div className="mb-3 text-xs">
          {content}
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {currentStep} of {totalSteps}
          </div>
          <div className="flex gap-1">
            {currentStep > 1 && (
              <button 
                onClick={onPrevious}
                className="text-xs py-1 px-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < totalSteps ? (
              <button 
                onClick={onNext}
                className="text-xs py-1 px-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="text-xs py-1 px-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>
  )
}

const GuidedTour = ({ userType, isActive, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [targetElement, setTargetElement] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 })
  
  // Define the tour steps based on user type
  const tourSteps = userType === "producer" 
    ? [
      { 
        selector: "#how-it-works", 
        content: (
          <div>
            <p className="font-semibold mb-1">How It Works</p>
            <p className="text-sm">Learn about the step-by-step process of registering your crop and getting funded.</p>
          </div>
        ),
      },
      { 
        selector: "#benefits", 
        content: (
          <div>
            <p className="font-semibold mb-1">Producer Benefits</p>
            <p className="text-sm">Discover the advantages of using SeedSafe for your agricultural financing needs.</p>
          </div>
        ),
      },
      { 
        selector: "#products", 
        content: (
          <div>
            <p className="font-semibold mb-1">Platform Products</p>
            <p className="text-sm">Explore our FutureHarvest tokens and carbon credit system.</p>
          </div>
        ),
      },
      { 
        selector: ".agrobot-button", // This will target the AgroBot button
        content: (
          <div>
            <p className="font-semibold mb-1">AgroBot Assistant</p>
            <p className="text-sm">Have questions? Our virtual assistant is here to help you understand the platform and blockchain technology.</p>
          </div>
        ),
      },
      { 
        selector: "button:contains('Register Your Crop')", 
        content: (
          <div>
            <p className="font-semibold mb-1">Get Started</p>
            <p className="text-sm">Click here to register your crop and begin the process of tokenization.</p>
          </div>
        ),
      }
    ]
    : [
      { 
        selector: "#how-it-works", 
        content: (
          <div>
            <p className="font-semibold mb-1">How It Works</p>
            <p className="text-sm">Learn about the investment process and how our platform ensures transparency and security.</p>
          </div>
        ),
      },
      { 
        selector: "#benefits", 
        content: (
          <div>
            <p className="font-semibold mb-1">Investor Benefits</p>
            <p className="text-sm">Discover how investing in agriculture through SeedSafe can diversify your portfolio while making a positive impact.</p>
          </div>
        ),
      },
      { 
        selector: "#products", 
        content: (
          <div>
            <p className="font-semibold mb-1">Investment Products</p>
            <p className="text-sm">Explore our unique ComboNFTs that combine agricultural investments with carbon credits.</p>
          </div>
        ),
      },
      { 
        selector: ".agrobot-button", // This will target the AgroBot button
        content: (
          <div>
            <p className="font-semibold mb-1">AgroBot Assistant</p>
            <p className="text-sm">Have questions about investments or blockchain technology? Our virtual assistant can help.</p>
          </div>
        ),
      },
      { 
        selector: "button:contains('Connect Wallet')", 
        content: (
          <div>
            <p className="font-semibold mb-1">Get Started</p>
            <p className="text-sm">Connect your wallet to start exploring investment opportunities in sustainable agriculture.</p>
          </div>
        ),
      }
    ]

  useEffect(() => {
    if (!isActive) return
    
    // Start the tour immediately
    navigateToStep(1)
    
    // Save to localStorage to not show again
    localStorage.setItem("seedsafe_guided_tour_shown", "true")
    
    // Function to handle escape key
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        completeTour()
      }
    }
    
    window.addEventListener("keydown", handleEscKey)
    window.addEventListener("resize", updateTooltipPosition)
    
    return () => {
      window.removeEventListener("keydown", handleEscKey)
      window.removeEventListener("resize", updateTooltipPosition)
    }
  }, [isActive])
  
  const navigateToStep = (stepNumber) => {
    // Validate step number
    if (stepNumber < 1 || stepNumber > tourSteps.length) return
    
    setCurrentStep(stepNumber)
    
    // Get the target element
    const step = tourSteps[stepNumber - 1]
    
    // Query the element
    let element
    
    if (step.selector.includes(":contains")) {
      // Handle special case for finding elements containing text
      const parts = step.selector.match(/(.*):contains\(['"](.*)['"]/)
      if (parts && parts.length === 3) {
        const elementType = parts[1]
        const text = parts[2]
        
        // Find all elements of that type
        const elements = document.querySelectorAll(elementType)
        
        // Find the one with the matching text
        element = Array.from(elements).find(el => el.textContent.includes(text))
      }
    } else {
      element = document.querySelector(step.selector)
    }
    
    if (element) {
      setTargetElement(element)
      
      // Scroll element into view with some padding
      const rect = element.getBoundingClientRect()
      const scrollY = window.scrollY + rect.top - 100 // 100px padding
      window.scrollTo({ top: scrollY, behavior: "smooth" })
      
      // Update tooltip position immediately
      setTimeout(() => {
        updateTooltipPosition()
      }, 100)
    } else {
      console.warn(`Element not found for selector: ${step.selector}`)
      // Try to move to the next step
      if (stepNumber < tourSteps.length) {
        navigateToStep(stepNumber + 1)
      } else {
        completeTour()
      }
    }
  }
  
  const updateTooltipPosition = () => {
    if (!targetElement) return
    
    const rect = targetElement.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Default position is below the element
    let tooltipPos = {
      top: `${rect.bottom + window.scrollY + 15}px`,
      left: `${rect.left + window.scrollX + (rect.width / 2) - 104}px`, // Center the 208px tooltip
    }
    
    let arrowPos = {
      top: "-6px",
      left: "104px", // Center of tooltip
    }
    
    // Check if tooltip would go off the bottom
    if (rect.bottom + 200 > viewportHeight) {
      // Position above the element
      tooltipPos = {
        bottom: `${window.innerHeight - rect.top - window.scrollY + 15}px`,
        left: `${rect.left + window.scrollX + (rect.width / 2) - 104}px`,
      }
      arrowPos = {
        bottom: "-6px",
        left: "104px",
      }
    }
    
    // Check if tooltip would go off the sides
    if (rect.left + (rect.width / 2) - 104 < 10) {
      // Too far left
      tooltipPos.left = "10px"
      arrowPos.left = `${rect.left + (rect.width / 2) - 10}px`
    } else if (rect.left + (rect.width / 2) + 104 > viewportWidth - 10) {
      // Too far right
      tooltipPos.left = `${viewportWidth - 218}px`
      arrowPos.left = `${rect.left + (rect.width / 2) - (viewportWidth - 218)}px`
    }
    
    setTooltipPosition(tooltipPos)
    setArrowPosition(arrowPos)
  }
  
  const handleNext = () => {
    navigateToStep(currentStep + 1)
  }
  
  const handlePrevious = () => {
    navigateToStep(currentStep - 1)
  }
  
  const completeTour = () => {
    if (onComplete) onComplete()
  }
  
  if (!isActive) return null
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/30 pointer-events-none"
        onClick={completeTour}
      ></div>
      
      {/* Target highlight */}
      {targetElement && (
        <div 
          className="fixed z-40 pointer-events-none border-2 border-green-500 rounded-md animate-pulse"
          style={{
            top: `${targetElement.getBoundingClientRect().top + window.scrollY}px`,
            left: `${targetElement.getBoundingClientRect().left + window.scrollX}px`,
            width: `${targetElement.getBoundingClientRect().width}px`,
            height: `${targetElement.getBoundingClientRect().height}px`,
          }}
        ></div>
      )}
      
      {/* Tooltip */}
      {targetElement && (
        <Tooltip 
          content={tourSteps[currentStep - 1].content}
          position={tooltipPosition}
          arrowPosition={arrowPosition}
          onClose={completeTour}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentStep={currentStep}
          totalSteps={tourSteps.length}
        />
      )}
    </>
  )
}

export default GuidedTour