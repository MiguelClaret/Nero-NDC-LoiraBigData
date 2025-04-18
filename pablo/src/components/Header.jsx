import React from 'react';
import { Leaf, Settings, User, LogIn } from 'lucide-react';

const Header = ({ setCurrentPage, isLoggedIn }) => {
  return (
    <header className="bg-green-700 shadow-lg">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer transition-transform duration-300 hover:scale-105" 
          onClick={() => setCurrentPage('home')}
        >
          <Leaf className="h-6 w-6 text-white" />
          <span className="font-bold text-xl text-white">SafeSeed</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-green-600 transition-colors duration-300">
            <Settings className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-md">
              {isLoggedIn ? (
                <User className="h-5 w-5 text-green-700" />
              ) : (
                <LogIn className="h-5 w-5 text-green-700" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;