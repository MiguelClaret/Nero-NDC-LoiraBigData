import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  FileCheck,
  Zap, 
  Leaf,
  UserCheck,
  // Added Wallet as a potential replacement for any Coin usage
  Wallet
} from 'lucide-react';

const BlockchainSecurityInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-amber-500/10 rounded-lg overflow-hidden border border-blue-200 shadow-sm mb-4 transition-all duration-300">
      {/* Card header - always visible */}
      <div 
        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-full">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900 text-sm">Blockchain Security & Transparent Transactions</h3>
        </div>
        
        <button className="text-blue-600">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Expandable content */}
      <div 
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pt-0 pb-3 bg-white/80">
          <p className="text-gray-600 mb-3 text-sm">
            Your marketplace transactions are protected by blockchain technology, ensuring security, transparency, and trust:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {/* Security features grid */}
            <SecurityFeature 
              icon={<Lock className="h-4 w-4 text-blue-600" />}
              title="Cryptographic Security"
              description="All transactions are secured by military-grade encryption and cannot be altered once recorded."
            />
            
            <SecurityFeature 
              icon={<FileCheck className="h-4 w-4 text-blue-600" />}
              title="Smart Contracts"
              description="Automated agreements ensure fair transactions without intermediaries for both buyers and farmers."
            />
            
            <SecurityFeature 
              icon={<Zap className="h-4 w-4 text-amber-600" />}
              title="Gasless Transactions"
              description="Our Account Abstraction technology means you never pay blockchain gas fees."
            />
            
            <SecurityFeature 
              icon={<UserCheck className="h-4 w-4 text-blue-600" />}
              title="Verified Farmers"
              description="All marketplace participants are verified through a rigorous onboarding process."
            />
            
            <SecurityFeature 
              icon={<Leaf className="h-4 w-4 text-green-600" />}
              title="Verified Carbon Credits"
              description="All carbon credits are audited by third parties and tokenized on the blockchain."
            />
            
            <SecurityFeature 
              icon={<Check className="h-4 w-4 text-amber-600" />}
              title="Guarantee Fund"
              description="Your investment is protected against harvest failures with our smart-contract based insurance."
            />
          </div>
          
          {/* NFT combo visualization */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-sm">
                <h4 className="font-medium text-gray-800">ComboNFT</h4>
                <p className="text-xs text-gray-600">Each purchase includes a unique NFT that combines crop tokens and carbon credits</p>
              </div>
            </div>
            <div className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded">
              Blockchain Secured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security feature card component
const SecurityFeature = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-2 bg-white rounded-md p-2 shadow-sm border border-gray-100">
      <div className="p-1 bg-gray-100 rounded-full flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800 text-xs">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default BlockchainSecurityInfo;