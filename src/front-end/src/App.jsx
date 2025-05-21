"use client";

import React from "react";
import { useState, useEffect } from "react";
import "./index.css"; // Global styles aqui
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { Web3AuthProvider } from "./components/Web3AuthContext";

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

// Keep the main onboarding components
import Onboarding from "./components/onboarding";
import OnboardingButton from "./components/Onboardingbutton";

// Add global styles for interactive guides
const addGlobalStyles = () => {
  const style = document.createElement("style");
  style.id = "seedsafe-global-styles";
  style.innerHTML = `
    .animation-float {
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    /* Posicionamento específico para o botão de onboarding geral */
    .onboarding-general-button {
      position: fixed !important;
      bottom: 20px !important;
      left: 16px !important;
      z-index: 50 !important;
    }
  `;

  // Only add if not already present
  if (!document.getElementById("seedsafe-global-styles")) {
    document.head.appendChild(style);
  }
};

// Componente que remove barras à direita das URLs
function RemoveTrailingSlash() {
  const location = useLocation();

  // Se a URL terminar com uma barra, redirecione para a versão sem a barra
  if (location.pathname.length > 1 && location.pathname.endsWith("/")) {
    return (
      <Navigate to={location.pathname.slice(0, -1) + location.search} replace />
    );
  }

  return null;
}

function App() {
  // Onboarding state before any UI renders
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const handleStartOnboarding = () => setShowOnboarding(true);
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("seedsafe_onboarding_completed", "true");
  };

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Replace simple boolean with wallet details
  const [walletInfo, setWalletInfo] = useState(null); // Stores { address, signer, provider, chainId, role, isSmartAccount, eoaAddress? }
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Wagmi hooks for EOA connection state
  const {
    address: eoaAddress,
    isConnected: isEoaConnected,
    connector,
  } = useAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();

  // --- Login/Logout Logic ---

  // Called by WalletModal upon successful connection (both AA and EOA)
  const handleLogin = (role, connectionDetails) => {
    console.log(`Login successful as ${role}:`, connectionDetails);
    setWalletInfo({
      ...connectionDetails,
      role: role,
    });
    setIsLoggedIn(true);
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
    setIsLoggedIn(false);
  };

  // Effect to handle EOA login via RainbowKit/Wagmi
  useEffect(() => {
    // If Wagmi connects an EOA and no walletInfo is set yet (or previous was AA)
    if (
      isEoaConnected &&
      eoaAddress &&
      (!walletInfo || walletInfo.isSmartAccount)
    ) {
      console.log("Wagmi EOA connected:", eoaAddress);
      // Default login as investor for EOA wallets
      handleLogin("investor", {
        address: eoaAddress,
        // Safely access chainId using optional chaining
        chainId: connector?.chains?.[0]?.id,
        isSmartAccount: false,
      });
    }
  }, [isEoaConnected, eoaAddress, walletInfo, connector]);

  // --- UI State & Styling ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Add global styles
    addGlobalStyles();

    return () => {
      window.removeEventListener("resize", handleResize);
      // Clean up styles if needed
      const style = document.getElementById("seedsafe-global-styles");
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Setup onboarding to show immediately on page load for first-time users
  useEffect(() => {
    // Mark page as loaded
    setPageLoaded(true);

    // Check if this is a first-time user
    const hasCompletedOnboarding = localStorage.getItem(
      "seedsafe_onboarding_completed"
    );
    if (!hasCompletedOnboarding) {
      // Show onboarding immediately without delay
      setShowOnboarding(true);
    }
  }, []);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const backgroundStyle = !isMobile
    ? {
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: "auto",
        backgroundPosition: "center",
      }
    : {};

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
                element={
                  <Hero
                    openWalletModal={openWalletModal}
                    walletInfo={walletInfo}
                  />
                }
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
                    <Benefits
                      walletInfo={walletInfo}
                      openWalletModal={openWalletModal}
                    />
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
                      <RegistrationProcess
                        walletInfo={walletInfo}
                        setCurrentPage={setCurrentPage}
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                      />
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
        </div>
        {/* Only render these components after page has loaded */}
        {pageLoaded && (
          <>
            <Onboarding
              isOpen={showOnboarding}
              onComplete={handleOnboardingComplete}
            />
            <OnboardingButton onClick={handleStartOnboarding} />
            <div className="agrobot-button">
              <ChatbotWidget />
            </div>
          </>
        )}
      </Router>
    </Web3AuthProvider>
  );
}

export default App;
