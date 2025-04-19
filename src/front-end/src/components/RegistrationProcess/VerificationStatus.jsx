"use client"
import { useState } from "react"
import { AlertCircle, X, Check, Loader2 } from "lucide-react"

const VerificationStatus = ({ registrationStatus, simulateAuditorDecision }) => {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = () => {
    setIsApproving(true)
    setTimeout(() => {
      simulateAuditorDecision("approved")
      setIsApproving(false)
    }, 1500)
  }

  const handleReject = () => {
    setIsRejecting(true)
    setTimeout(() => {
      simulateAuditorDecision("rejected")
      setIsRejecting(false)
    }, 1500)
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Verification Status</h2>

      {registrationStatus === "pending" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Pending Verification</span>
          </div>
          <p className="text-gray-600 mt-2">
            Our auditors are reviewing your submission. This typically takes 24-48 hours.
          </p>
        </div>
      )}

      {registrationStatus === "rejected" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <X className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Verification Failed</span>
          </div>
          <p className="text-gray-600 mt-2">
            Unfortunately, your submission did not meet our requirements. Please review the feedback below and submit
            again.
          </p>
          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Auditor Feedback:</h3>
            <p className="text-sm text-gray-600 mt-1">
              The sustainable practices selected need more supporting documentation. Please provide more details about
              your farming practices.
            </p>
          </div>
        </div>
      )}

      {/* Redesigned buttons with better animations */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Demonstration Controls:</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            className={`relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex-1 flex items-center justify-center ${
              isApproving ? "cursor-not-allowed opacity-80" : "hover:translate-y-[-2px]"
            }`}
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
          >
            <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
            {isApproving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Check className="mr-2 h-5 w-5 animate-bounce" />
            )}
            <span className="relative z-10 font-medium">{isApproving ? "Processing..." : "Simulate Approval"}</span>
          </button>

          <button
            className={`relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex-1 flex items-center justify-center ${
              isRejecting ? "cursor-not-allowed opacity-80" : "hover:translate-y-[-2px]"
            }`}
            onClick={handleReject}
            disabled={isApproving || isRejecting}
          >
            <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
            {isRejecting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <X className="mr-2 h-5 w-5 animate-pulse" />
            )}
            <span className="relative z-10 font-medium">{isRejecting ? "Processing..." : "Simulate Rejection"}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: These buttons are for demonstration purposes only and simulate auditor decisions.
        </p>
      </div>
    </div>
  )
}

export default VerificationStatus
