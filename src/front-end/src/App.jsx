"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { Web3AuthProvider } from "./components/Web3AuthContext";
import { WalletInfoProvider } from "./contexts/WalletInfoContext";
import OverlayProviders from "./components/neroOverlay/OverlayProviders";
import OverlayApp from "./components/neroOverlay/OverlayApp";

// Componentes principais
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import WalletModal from "./components/WalletModal";

// Marketplace e outras rotas
import Marketplace from "./components/Marketplace/Index";
import RegistrationProcess from "./components/RegistrationProcess";
import Auditor from "./components/Auditor";

// 🚀 Importando o painel de pagamento
import ERC20PaymentPanel from "./components/payments/ERC20PaymentPanel";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <WalletInfoProvider>
      <Web3AuthProvider>
        <Router>
          <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
            {/* 🔥 Overlay de Wallet */}
            <div style={{ position: 'fixed', top: 24, left: 24, zIndex: 9999 }}>
              <OverlayProviders>
                <OverlayApp mode='sidebar' />
              </OverlayProviders>
            </div>

            {/* 🔥 Navbar */}
            <header
              className={`${
                isMobile
                  ? "bg-gradient-to-r from-white/95 to-white/90"
                  : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
              } pb-12 md:pb-24 relative`}
            >
              <Navbar />
              <Routes>
                <Route path="/" element={<Hero />} />
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
                      <CTASection />
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
                    >
                      <Marketplace />
                    </div>
                  }
                />

                <Route
                  path="/register"
                  element={
                    <div className="bg-white">
                      <RegistrationProcess />
                    </div>
                  }
                />

                <Route
                  path="/auditor"
                  element={
                    <div className="bg-white">
                      <Auditor />
                    </div>
                  }
                />

                {/* 🚀 Nova Rota para o Painel de Pagamento */}
                <Route
                  path="/payments"
                  element={
                    <div className="bg-white p-10">
                      <h2 className="text-2xl mb-4">Painel de Pagamento ERC20</h2>
                      <ERC20PaymentPanel />
                    </div>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* 🔥 Footer sempre visível */}
            <Footer />
          </div>
        </Router>
      </Web3AuthProvider>
    </WalletInfoProvider>
  );
}

export default App;
