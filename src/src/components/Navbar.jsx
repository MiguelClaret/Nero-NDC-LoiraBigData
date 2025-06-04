import React, { useState } from 'react';
// Importação direta do logo
import logoSvg from '../assets/logo_svg.svg';

const Navbar = ({ openWalletModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/95 shadow-sm">
      <div className="flex items-center gap-2">
        <img src={logoSvg} alt="SeedSafe" className="h-10" />
        <span className="font-bold text-3xl">
          Seed<em className="text-green-700 not-italic">Safe</em>
        </span>
      </div>
      <div className={`md:flex gap-8 ${isMobileMenuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-white shadow-md p-4' : 'hidden'} md:static md:flex-row md:bg-transparent md:shadow-none md:p-0`}>
        <a href="#how-it-works" className="font-medium relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all">
          How It Works
        </a>
        <a href="#benefits" className="font-medium relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all">
          Benefits
        </a>
        <a href="#products" className="font-medium relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all">
          Products
        </a>
        <a href="#testimonials" className="font-medium relative hover:text-green-700 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all">
          Testimonials
        </a>
      </div>
      <div className={`md:flex gap-4 ${isMobileMenuOpen ? 'flex flex-col mt-4 absolute top-40 left-0 w-full bg-white shadow-md p-4' : 'hidden'} md:static md:flex-row md:bg-transparent md:shadow-none md:p-0 md:mt-0`}>
        <button className="py-2 px-6 rounded-md font-semibold border-2 border-gray-200 hover:border-green-700 hover:text-green-700 hover:-translate-y-0.5 transition-all">
          Login
        </button>
        <button
          onClick={openWalletModal}
          className="py-2 px-6 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all"
        >
          Connect Wallet
        </button>
      </div>
      <div className="md:hidden text-xl" onClick={toggleMobileMenu}>
        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>
    </nav>
  );
};

export default Navbar;