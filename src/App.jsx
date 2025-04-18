import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import RegistrationProcess from './components/RegistrationProcess';
import UserTypeSelection from './components/UserTypeSection';
import Marketplace from './components/Marketplace';
import AuditorDashboard from './components/Auditor';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'farmer', 'investor', or 'auditor'
  
  // Return to home and reset user type
  const handleLogoClick = () => {
    setCurrentPage('home');
    setUserType(null);
  };
  
  // Render the appropriate page content
  const renderPageContent = () => {
    switch(currentPage) {
      case 'userTypeSelection':
        return <UserTypeSelection setUserType={setUserType} setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegistrationProcess setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
      case 'marketplace':
        return <Marketplace />;
      case 'auditor':
        return <AuditorDashboard />;
      default:
        return <HeroSection setCurrentPage={setCurrentPage} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-green-800 text-gray-800 flex flex-col">
      <Header setCurrentPage={handleLogoClick} isLoggedIn={isLoggedIn} />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto p-4">
          {renderPageContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;