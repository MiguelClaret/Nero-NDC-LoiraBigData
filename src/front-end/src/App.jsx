"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
  const style = document.createElement('style');
  style.id = 'seedsafe-global-styles';
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
  if (!document.getElementById('seedsafe-global-styles')) {
    document.head.appendChild(style);
  }
};

// Componente que remove barras à direita das URLs
function RemoveTrailingSlash() {
  const location = useLocation();
  
  // Se a URL terminar com uma barra, redirecione para a versão sem a barra
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    return <Navigate to={location.pathname.slice(0, -1) + location.search} replace />;
  }
  
  return null;
}

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [userRole, setUserRole] = useState(null); // 'producer', 'investor', 'auditor'
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Add global styles
    addGlobalStyles();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      // Clean up styles if needed
      const style = document.getElementById('seedsafe-global-styles');
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
    const hasCompletedOnboarding = localStorage.getItem("seedsafe_onboarding_completed");
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

  // Simular login para demonstração
  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  // Simular logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  const handleStartOnboarding = () => {
    // Immediately show the onboarding popup
    setShowOnboarding(true);
  };

  const backgroundStyle = !isMobile
  ? {
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url(${bgPattern})`,
      backgroundSize: "auto",
      backgroundPosition: "center",
    }
  : {};
  
  return (
    <Router>
      <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
        {/* Componente que remove barras à direita das URLs */}
        <RemoveTrailingSlash />
        
        <header
          className={`${
            isMobile
              ? "bg-gradient-to-r from-white/95 to-white/90"
              : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
          } relative`}
        >
          <Navbar
            openWalletModal={openWalletModal}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onLogout={handleLogout}
          />

          {/* Renderizar Hero apenas na página inicial */}
          <Routes>
            <Route path="/" />
          </Routes>
        </header>

        <main className="w-full">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero backgroundStyle={backgroundStyle} openWalletModal={openWalletModal} />
                  <HowItWorks />
                  <Benefits />
                  <Products />
                  <Testimonials />
                  <CTASection openWalletModal={openWalletModal} />
                </>
              }
            />
            
            {/* Rota para o Marketplace */}
            <Route
              path="/marketplace"
              element={
                <div
                  className={`${
                    isMobile
                      ? "bg-gradient-to-r from-white/95 to-white/90"
                      : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
                  } py-10`}
                  style={backgroundStyle}
                >
                  <Marketplace />
                </div>
              }
            />
            
            {/* Rota sem barra que redireciona para a rota correta */}
            <Route
              path="marketplace"
              element={<Navigate to="/marketplace" replace />}
            />
            
            <Route
              path="/register"
              element={
                <div
                  className={`${
                    isMobile
                      ? "bg-gradient-to-r from-white/95 to-white/90"
                      : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
                  } py-10`}
                  style={backgroundStyle}
                >
                  <RegistrationProcess
                    setCurrentPage={setCurrentPage}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                </div>
              }
            />
            <Route
              path="/auditor"
              element={
                <div
                  className={`${
                    isMobile
                      ? "bg-gradient-to-r from-white/95 to-white/90"
                      : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
                  } py-10`}
                  style={backgroundStyle}
                >
                  <Auditor />
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={closeWalletModal}
          onLogin={handleLogin}
        />

        {/* Only render these components after page has loaded */}
        {pageLoaded && (
          <>
            {/* Onboarding Components - only keep the main one */}
            <Onboarding 
              isOpen={showOnboarding}
              onComplete={handleOnboardingComplete} 
            />
            
            {/* Onboarding Button - persistent and always visible */}
            <OnboardingButton onClick={handleStartOnboarding} />

            {/* Chatbot Widget */}
            <div className="agrobot-button">
              <ChatbotWidget />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;