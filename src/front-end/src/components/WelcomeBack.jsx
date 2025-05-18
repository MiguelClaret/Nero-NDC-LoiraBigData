"use client"

import { useState, useEffect } from "react"

const WelcomeBack = ({ userRole, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [visits, setVisits] = useState(0)
  
  useEffect(() => {
    // Check if this is a returning user
    const visitCount = parseInt(localStorage.getItem("seedsafe_visit_count") || "0")
    
    // Update visit count
    const newVisitCount = visitCount + 1
    localStorage.setItem("seedsafe_visit_count", newVisitCount.toString())
    setVisits(newVisitCount)
    
    // Only show for returning users (visit count > 1) and when logged in
    if (newVisitCount > 1 && userRole) {
      // Show immediately - minimal delay to ensure UI is ready
      setTimeout(() => {
        setIsVisible(true)
      }, 300)
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 8000)
      
      return () => clearTimeout(timer)
    }
  }, [userRole])
  
  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }
  
  const getWelcomeMessage = () => {
    if (visits === 2) {
      return "Welcome back! Great to see you again."
    } else if (visits >= 3 && visits <= 5) {
      return `Welcome back for visit #${visits}! We appreciate your continued interest.`
    } else {
      return `Welcome back! You've visited us ${visits} times. Thanks for being a loyal user!`
    }
  }
  
  const getActionText = () => {
    if (userRole === "producer") {
      if (visits === 2) {
        return "Have you registered your first crop yet?"
      } else {
        return "Ready to register another crop?"
      }
    } else if (userRole === "investor") {
      if (visits === 2) {
        return "Have you explored our marketplace yet?"
      } else {
        return "Check out our newest harvest opportunities!"
      }
    } else {
      return "Ready to get started?"
    }
  }
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-20 right-4 z-50 w-64 transition-all duration-300 transform animate-slideInUp">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-200">
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-2 flex justify-between items-center">
          <h3 className="font-bold text-sm">SeedSafe</h3>
          <button 
            onClick={handleClose}
            className="text-white/80 hover:text-white focus:outline-none"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-3">
          <p className="font-medium text-sm mb-1">{getWelcomeMessage()}</p>
          <p className="text-xs text-gray-600 mb-3">{getActionText()}</p>
          
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className={`py-1.5 px-3 rounded-md text-xs font-medium ${
                userRole === "producer" 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-amber-600 text-white hover:bg-amber-700"
              } transition-colors`}
            >
              {userRole === "producer" ? "Register Crop" : "View Marketplace"}
            </button>
            <button
              onClick={handleClose}
              className="py-1.5 px-3 rounded-md text-xs font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBack