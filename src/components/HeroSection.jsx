import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ setCurrentPage }) => {
  const handleGetStarted = () => {
    setCurrentPage('userTypeSelection');
  };

  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Sustainable Agriculture Meets Blockchain
        </h1>
        <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-10">
          SafeSeed connects farmers, investors, and auditors through a transparent platform that tokenizes future crops and carbon credits to create positive environmental impact.
        </p>
        
        <button 
          onClick={handleGetStarted}
          className="bg-white hover:bg-gray-100 text-green-700 px-8 py-4 rounded-lg font-medium shadow-lg transition duration-300 flex items-center mx-auto text-lg"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
      
      <div className="w-full max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Farmer Highlight */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md transition-all duration-300 border border-white/20 text-white">
          <h3 className="font-semibold text-xl mb-3 text-white">For Farmers</h3>
          <p className="text-green-100 mb-3">
            Register your crops, implement sustainable practices, and receive funding before harvest.
          </p>
          <ul className="text-sm space-y-2 text-left">
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Tokenize future harvests
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Earn carbon credits
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Get paid in advance
            </li>
          </ul>
        </div>
        
        {/* Investor Highlight */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md transition-all duration-300 border border-white/20 text-white">
          <h3 className="font-semibold text-xl mb-3 text-white">For Investors</h3>
          <p className="text-green-100 mb-3">
            Fund sustainable agriculture and receive both commodity returns and carbon credit tokens.
          </p>
          <ul className="text-sm space-y-2 text-left">
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Diversify with agricultural assets
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Support sustainable farming
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Earn NFT Combo tokens
            </li>
          </ul>
        </div>
        
        {/* Auditor Highlight */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md transition-all duration-300 border border-white/20 text-white">
          <h3 className="font-semibold text-xl mb-3 text-white">For Auditors</h3>
          <p className="text-green-100 mb-3">
            Verify sustainable practices and authorize listings for the marketplace.
          </p>
          <ul className="text-sm space-y-2 text-left">
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Validate carbon credit claims
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Ensure marketplace integrity
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span> Support transparent agriculture
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;