import React from 'react';
import { Check, Archive, ClipboardCheck, FileText, DollarSign, Leaf, Award } from 'lucide-react';

const MarketplaceStatus = ({ formData, salesProgress }) => {
  // Calculate carbon credits based on sustainable practices
  const getCarbonCredits = () => {
    const practices = formData.sustainablePractices || [];
    // Each practice contributes to carbon credits
    const baseCredits = 0.5; // Base credits per ton
    const practiceMultipliers = {
      organic: 0.3,
      conservation: 0.2,
      rotation: 0.2,
      water: 0.1
    };
    
    let multiplier = 1;
    practices.forEach(practice => {
      if (practiceMultipliers[practice]) {
        multiplier += practiceMultipliers[practice];
      }
    });
    
    const quantity = formData.quantity || 1000;
    // Calculate tons of CO2 equivalent (TCO2e)
    return (quantity / 1000 * baseCredits * multiplier).toFixed(2);
  };
  
  const carbonCredits = getCarbonCredits();
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Marketplace Status</h2>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
        <div className="flex items-center">
          <Check className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Verification Approved!</span>
        </div>
        <p className="text-gray-600 mt-2">
          Your crop has been verified and is now listed on our marketplace for investors.
        </p>
      </div>
      
      {/* Token Combo Information */}
      <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow">
        <h3 className="text-md font-medium text-green-800 flex items-center mb-3">
          <Award className="h-5 w-5 mr-2 text-amber-500" />
          NFT Combo Generated
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center mb-2">
              <Archive className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Crop Token</span>
            </div>
            <p className="text-xs text-gray-600">
              {formData.quantity || '1000'}kg of {formData.cropType ? formData.cropType.charAt(0).toUpperCase() + formData.cropType.slice(1) : 'Coffee'}
            </p>
            <div className="mt-2 text-xs bg-white rounded p-1 text-center text-gray-600 border border-gray-200">
              Token ID: #CF{Math.floor(Math.random() * 10000)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center mb-2">
              <Leaf className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Carbon Credit</span>
            </div>
            <p className="text-xs text-gray-600">
              {carbonCredits} TCO2e from {formData.sustainablePractices?.length || 0} sustainable practices
            </p>
            <div className="mt-2 text-xs bg-white rounded p-1 text-center text-gray-600 border border-gray-200">
              Token ID: #CC{Math.floor(Math.random() * 10000)}
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-green-600 text-center">
          Combined in NFT Combo #{Math.floor(Math.random() * 100000)} on chain
        </div>
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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg">
          <div className="p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Archive className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {formData.cropType ? formData.cropType.charAt(0).toUpperCase() + formData.cropType.slice(1) : 'Coffee'} Harvest {new Date().getFullYear()}
                </h4>
                <p className="text-sm text-gray-500">
                  {formData.quantity || '1000'} kg - Due on {formData.harvestDate || '2025-10-15'}
                </p>
                <div className="flex mt-2">
                  <span className="text-xs bg-green-50 rounded-full px-2 py-1 text-green-700 mr-2 flex items-center">
                    <Leaf className="h-3 w-3 mr-1" />
                    {carbonCredits} TCO2e
                  </span>
                  <span className="text-xs bg-amber-50 rounded-full px-2 py-1 text-amber-700 flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    NFT Combo
                  </span>
                </div>
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
        <div className="flex justify-between gap-4">
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center transform hover:scale-105"
            onClick={() => window.open('#', '_blank')}
          >
            <FileText className="mr-2 h-5 w-5" />
            View Certificate
          </button>
          
          <button
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center transform hover:scale-105"
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Track Revenue
          </button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Your smart contract address: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">0x7a3d...92f1</span>
        </p>
      </div>
    </div>
  );
};

export default MarketplaceStatus;