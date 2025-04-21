"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [userRole, setUserRole] = useState(null); // 'producer', 'investor', 'auditor'

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

  const backgroundStyle = !isMobile ? {
  backgroundImage: `url(${bgPattern})`,
  backgroundSize: "auto",
  backgroundPosition: "center",
} : {};

  return (
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
                  <Marketplace />
                </div>
              }
            />{" "}
            <Route
              path="/register"
              element={
                <RegistrationProcess
                  setCurrentPage={setCurrentPage}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <Route
              path="/auditor"
              element={
                isLoggedIn && userRole === "auditor" ? (
                  <Auditor />
                ) : (
                  <Navigate to="/" replace />
                )
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

        <ChatbotWidget />
      </div>
    </Router>
  );
}

export default App;
