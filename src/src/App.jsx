import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import ChatbotFeature from './components/ChatbotFeature';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import WalletModal from './components/WalletModal';

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  return (
    <div className="font-poppins text-slate-800">
      <header className="bg-gradient-to-r from-white/95 to-white/80 bg-[url('./assets/bg-pattern.svg')] bg-cover pb-24">
        <Navbar openWalletModal={openWalletModal} />
        <Hero openWalletModal={openWalletModal} />
      </header>

      <HowItWorks />
      <Benefits />
      <Products />
      <Testimonials />
      <ChatbotFeature />
      <CTASection openWalletModal={openWalletModal} />
      <Footer />

      <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
    </div>
  );
}

export default App;