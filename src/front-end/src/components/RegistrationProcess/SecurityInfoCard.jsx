import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Database, 
  Zap, 
  Globe, 
  FileCheck, 
  ChevronDown, 
  ChevronUp, 
  Coins 
} from 'lucide-react';

const SecurityInfoCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg overflow-hidden border border-blue-200 shadow-sm mb-6 transition-all duration-300">
      {/* Card header - always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-blue-900">Blockchain Security & Web3 Benefits</h3>
          </div>
          
          <button className="text-blue-600">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Expandable content - modified to use max-height large enough to contain all content */}
      <div 
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 bg-white/60">
          <p className="text-gray-600 mb-4">
            SeedSafe leverages blockchain technology to ensure your farm data is secure, transparent, and valuable:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SecurityFeatureCard 
              icon={<Lock className="h-5 w-5 text-blue-600" />}
              title="Immutable Records"
              description="Once recorded, your crop information cannot be altered, providing a permanent and verifiable record."
            />
            
            <SecurityFeatureCard 
              icon={<Database className="h-5 w-5 text-blue-600" />}
              title="Distributed Storage"
              description="Your data is stored across a global network of computers, eliminating single points of failure."
            />
            
            <SecurityFeatureCard 
              icon={<Zap className="h-5 w-5 text-blue-600" />}
              title="Gasless Transactions"
              description="Thanks to Account Abstraction and our CustomPaymaster, you never have to pay for blockchain fees."
            />
            
            <SecurityFeatureCard 
              icon={<Globe className="h-5 w-5 text-blue-600" />}
              title="Global Access"
              description="Connect directly with investors worldwide without intermediaries or high fees."
            />
            
            <SecurityFeatureCard 
              icon={<FileCheck className="h-5 w-5 text-blue-600" />}
              title="Smart Contracts"
              description="Automated agreements ensure all parties fulfill their obligations without requiring trust."
            />
            
            <SecurityFeatureCard 
              icon={<Coins className="h-5 w-5 text-blue-600" />}
              title="Tokenized Assets"
              description="Convert your future harvest into digital tokens that can be sold in fractions for better liquidity."
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-2">
              <Shield className="h-4 w-4" /> 
              NERO Chain Security
            </h4>
            <p className="text-sm text-blue-700">
              Your registration data is secured by NERO Chain's advanced cryptography and consensus mechanisms. 
              The blockchain ensures that no one—not even us—can alter or tamper with your information once recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security feature card component
const SecurityFeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
      <div className="p-2 bg-blue-50 rounded-full flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default SecurityInfoCard;