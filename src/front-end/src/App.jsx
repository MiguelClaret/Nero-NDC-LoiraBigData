"use client";

import React from 'react';
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAccount, useDisconnect } from 'wagmi';
import { Web3AuthProvider } from './components/Web3AuthContext';
import OverlayProviders from './components/neroOverlay/OverlayProviders';
import OverlayApp from './components/neroOverlay/OverlayApp';

// Importação direta dos assets
import bgPattern from "./assets/bg-pattern.svg";

// Importação dos componentes principais
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import WalletModal from "./components/WalletModal";
import ChatbotWidget from "./components/ChatbotWidget";

// Novas rotas de telas adicionais
import Marketplace from "./components/Marketplace/Index";
import RegistrationProcess from "./components/RegistrationProcess";
import Auditor from "./components/Auditor";

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Replace simple boolean with wallet details
  const [walletInfo, setWalletInfo] = useState(null); // Stores { address, signer, provider, chainId, role, isSmartAccount, eoaAddress? }
  const [currentPage, setCurrentPage] = useState("home");

  // Wagmi hooks for EOA connection state
  const { address: eoaAddress, isConnected: isEoaConnected, connector } = useAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();

  // --- Login/Logout Logic --- 

  // Called by WalletModal upon successful connection (both AA and EOA)
  const handleLogin = (role, connectionDetails) => {
    console.log(`Login successful as ${role}:`, connectionDetails);
    setWalletInfo({ 
      ...connectionDetails, 
      role: role 
    });
    setIsWalletModalOpen(false); // Close modal on successful login
    document.body.style.overflow = "auto";
  };

  // Unified logout function
  const handleLogout = () => {
    console.log("Logging out...");
    if (walletInfo?.isSmartAccount) {
      // Logout from Web3Auth if it was used for AA
      console.log("Web3Auth logout should be handled here if applicable.");
    } else {
      // Disconnect EOA wallet using Wagmi
      disconnectWagmi();
    }
    setWalletInfo(null); // Clear wallet info
  };

  // Effect to handle EOA login via RainbowKit/Wagmi
  useEffect(() => {
    // If Wagmi connects an EOA and no walletInfo is set yet (or previous was AA)
    if (isEoaConnected && eoaAddress && (!walletInfo || walletInfo.isSmartAccount)) {
      console.log("Wagmi EOA connected:", eoaAddress);
      // Default login as investor for EOA wallets
      handleLogin("investor", { 
        address: eoaAddress, 
        // Safely access chainId using optional chaining
        chainId: connector?.chains?.[0]?.id,
        isSmartAccount: false 
      });
    }
  }, [isEoaConnected, eoaAddress, walletInfo, connector]);

  // --- UI State & Styling --- 
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const backgroundStyle = !isMobile ? {
    backgroundImage: `url(${bgPattern})`,
    backgroundSize: "auto",
    backgroundPosition: "center",
  } : {};

  const isLoggedIn = !!walletInfo;
  const userRole = walletInfo?.role;

  // Redirect handler for routes that require authentication
  const RequireAuth = ({ children, requiredRole }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <>
      {/* Overlay Sidebar Wallet acima de todas as páginas */}
      <div style={{ position: 'fixed', top: 24, left: 24, zIndex: 9999 }}>
        <OverlayProviders>
          <OverlayApp mode='sidebar' />
        </OverlayProviders>
      </div>
      <Web3AuthProvider>
        <Router>
          <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
            <header
              className={`${
                isMobile
                  ? "bg-gradient-to-r from-white/95 to-white/90"
                  : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
              } pb-12 md:pb-24 relative`}
              style={{
                backgroundImage: isMobile ? "none" : `url(${bgPattern})`,
                backgroundSize: "auto",
                backgroundPosition: "center",
              }}
            >
              <Navbar
                openWalletModal={openWalletModal}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                userAddress={walletInfo?.address}
                onLogout={handleLogout}
              />

              {/* Renderizar Hero apenas na página inicial */}
              <Routes>
                <Route
                  path="/"
                  element={<Hero openWalletModal={openWalletModal} />}
                />
              </Routes>
            </header>

            <main className="w-full">
              <Routes>
                {/* Home page */}
                <Route
                  path="/"
                  element={
                    <>
                      <HowItWorks />
                      <Benefits />
                      <Products />
                      <Testimonials />
                      <CTASection openWalletModal={openWalletModal} />
                    </>
                  }
                />
                
                {/* Marketplace - accessible to all */}
                <Route
                  path="/marketplace"
                  element={
                    <div
                      className={`${
                        isMobile
                          ? "bg-gradient-to-r from-white/95 to-white/90"
                          : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
                      }`}
                      style={backgroundStyle}
                    >
                      <Marketplace walletInfo={walletInfo} />
                    </div>
                  }
                />
                
                {/* Crop Registration - only for producers */}
                <Route
                  path="/register"
                  element={
                    <RequireAuth requiredRole="producer">
                      <div className="bg-white">
                        <RegistrationProcess walletInfo={walletInfo} />
                      </div>
                    </RequireAuth>
                  }
                />
                
                {/* Auditor Panel - only for auditors */}
                <Route
                  path="/auditor"
                  element={
                    <RequireAuth requiredRole="auditor">
                      <Auditor walletInfo={walletInfo} />
                    </RequireAuth>
                  }
                />
                
                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {/* Modal de Carteira */}
            {isWalletModalOpen && (
              <WalletModal
                isOpen={isWalletModalOpen}
                onClose={closeWalletModal}
                onLogin={handleLogin}
              />
            )}

            <ChatbotWidget />
          </div>
        </Router>
      </Web3AuthProvider>
    </>
  );
}

export default App;