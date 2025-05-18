"use client"

import { useState, useEffect } from "react"

const ButtonTooltip = ({ children, text, position = "top" }) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2"
      case "bottom":
        return "top-full mt-2"
      case "left":
        return "right-full mr-2"
      case "right":
        return "left-full ml-2"
      default:
        return "bottom-full mb-2"
    }
  }
  
  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${getPositionClasses()} w-max max-w-xs bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50`}>
        {text}
      </div>
    </div>
  )
}

const ButtonTooltips = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltips, setTooltips] = useState([])
  
  useEffect(() => {
    // Only show tooltips for first-time users
    const hasCompletedOnboarding = localStorage.getItem("seedsafe_onboarding_completed")
    
    if (!hasCompletedOnboarding) {
      // Find all target buttons immediately - just a minimal delay to ensure DOM is loaded
      setTimeout(() => {
        identifyButtons()
        setIsVisible(true)
        
        // Hide tooltips after 15 seconds
        const timer = setTimeout(() => {
          setIsVisible(false)
        }, 15000)
        
        return () => clearTimeout(timer)
      }, 300) // Very short delay to ensure DOM is loaded
    }
  }, [])
  
  const identifyButtons = () => {
    const newTooltips = []
    
    // Producer button
    const producerButton = document.querySelector('a[href="/register"]')
    if (producerButton) {
      newTooltips.push({
        element: producerButton,
        text: "Register your crop to receive advance financing and generate carbon credits",
        position: { top: producerButton.getBoundingClientRect().top, left: producerButton.getBoundingClientRect().left },
        width: producerButton.offsetWidth,
        height: producerButton.offsetHeight
      })
    }
    
    // Investor button
    const investorButton = document.querySelector('a[href="/marketplace"]')
    if (investorButton) {
      newTooltips.push({
        element: investorButton,
        text: "Browse tokenized harvests and sustainable investment opportunities",
        position: { top: investorButton.getBoundingClientRect().top, left: investorButton.getBoundingClientRect().left },
        width: investorButton.offsetWidth,
        height: investorButton.offsetHeight
      })
    }
    
    // Connect wallet button
    const connectButton = document.querySelector('button:has(i.fa-wallet), button:contains("Connect Wallet")')
    if (connectButton) {
      newTooltips.push({
        element: connectButton,
        text: "Connect your crypto wallet or create a free Smart Account",
        position: { top: connectButton.getBoundingClientRect().top, left: connectButton.getBoundingClientRect().left },
        width: connectButton.offsetWidth,
        height: connectButton.offsetHeight
      })
    }
    
    setTooltips(newTooltips)
  }
  
  if (!isVisible) return null
  
  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {tooltips.map((tooltip, index) => (
        <div
          key={index}
          className="absolute animate-pulse"
          style={{
            top: `${tooltip.position.top + window.scrollY}px`,
            left: `${tooltip.position.left + window.scrollX}px`,
            width: `${tooltip.width}px`,
            height: `${tooltip.height}px`
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full border-2 border-green-500 rounded-md"></div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-2 rounded shadow-lg text-sm max-w-[200px] text-center">
            {tooltip.text}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ButtonTooltips
export { ButtonTooltip }