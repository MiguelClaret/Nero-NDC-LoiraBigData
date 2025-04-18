import React from 'react';
import { AlertCircle, X, Check } from 'lucide-react';

const VerificationStatus = ({ registrationStatus, simulateAuditorDecision }) => {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Verification Status</h2>
      
      {registrationStatus === 'pending' && (
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
      
      {registrationStatus === 'rejected' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <X className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Verification Failed</span>
          </div>
          <p className="text-gray-600 mt-2">
            Unfortunately, your submission did not meet our requirements. Please review the feedback below and submit again.
          </p>
          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Auditor Feedback:</h3>
            <p className="text-sm text-gray-600 mt-1">
              The sustainable practices selected need more supporting documentation. Please provide more details about your farming practices.
            </p>
          </div>
        </div>
      )}
      
      {/* For demonstration purposes, adding buttons to simulate auditor decisions */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Demonstration Controls:</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition flex-1 flex items-center justify-center transform hover:scale-105"
            onClick={() => simulateAuditorDecision('approved')}
          >
            <Check className="mr-2 h-5 w-5" />
            Simulate Approval
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition flex-1 flex items-center justify-center transform hover:scale-105"
            onClick={() => simulateAuditorDecision('rejected')}
          >
            <X className="mr-2 h-5 w-5" />
            Simulate Rejection
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: These buttons are for demonstration purposes only and simulate auditor decisions.
        </p>
      </div>
    </div>
  );
};

export default VerificationStatus;