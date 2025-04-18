import React from 'react';
import { UserCircle, TrendingUp, Shield } from 'lucide-react';

const UserTypeCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 bg-green-100 p-4 rounded-full">
          <Icon className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const UserTypeSelection = ({ setUserType, setCurrentPage }) => {
  const handleFarmerClick = () => {
    setUserType('farmer');
    setCurrentPage('register');
  };

  const handleInvestorClick = () => {
    setUserType('investor');
    setCurrentPage('marketplace');
  };

  const handleAuditorClick = () => {
    setUserType('auditor');
    setCurrentPage('auditor');
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fadeIn">
        Welcome to SafeSeed
      </h1>
      
      <p className="text-xl text-white text-center mb-12">
        Select how you would like to use the platform
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UserTypeCard 
          icon={UserCircle}
          title="I am a Farmer"
          description="Register your crops, implement sustainable practices, and get funded"
          onClick={handleFarmerClick}
        />
        
        <UserTypeCard 
          icon={TrendingUp}
          title="I am an Investor"
          description="Browse opportunities to fund sustainable agriculture and earn carbon credits"
          onClick={handleInvestorClick}
        />
        
        <UserTypeCard 
          icon={Shield}
          title="I am an Auditor"
          description="Verify farming practices and authorize tokens for the marketplace"
          onClick={handleAuditorClick}
        />
      </div>
    </div>
  );
};

export default UserTypeSelection;