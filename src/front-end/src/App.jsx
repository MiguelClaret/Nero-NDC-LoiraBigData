"use client";

import React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import './index.css'; // Global styles aqui
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAccount, useDisconnect } from 'wagmi';
import { useEthersSigner } from './hooks/account/useGetSigner'; // Import useEthersSigner
import { Web3AuthProvider, useWeb3Auth } from './components/Web3AuthContext'; // Import useWeb3Auth
import { WalletInfoProvider } from './contexts/WalletInfoContext';
import OverlayProviders from './components/neroOverlay/OverlayProviders';
import OverlayApp from './components/neroOverlay/OverlayApp';
import { ethers } from "ethers";

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

// Web3Auth and UserOp imports for session persistence
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Presets } from "userop";
import { getAAWalletAddress, isAAWalletDeployed } from './utils/aaUtils'; // Assuming aaUtils.js is in src/utils

// --- Configuration Constants (ensure these are top-level or properly scoped) ---
const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
// ... (all other config constants like rpcUrl, chainId, entryPointAddress, etc.)
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
let chainId = 689; // Default value - ensure this aligns with your config
const envChainId = process.env.NEXT_PUBLIC_CHAIN_ID;
if (envChainId) {
  const parsed = parseInt(envChainId);
  if (!isNaN(parsed)) {
    chainId = parsed;
  }
}
const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;
const simpleAccountFactoryAddress = process.env.NEXT_PUBLIC_SIMPLE_ACCOUNT_FACTORY_ADDRESS;
const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL;

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

// New component to contain the main app logic
function AppContent() {
  // All state, effects, and functions from App component moved here
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const handleStartOnboarding = () => setShowOnboarding(true);
  const handleOnboardingComplete = () => { setShowOnboarding(false); localStorage.setItem("seedsafe_onboarding_completed", "true"); };
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [walletInfo, setWalletInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [web3authInstanceForApp, setWeb3authInstanceForApp] = useState(null);
  const { login: loginToWeb3AuthContext } = useWeb3Auth(); // Now this is called inside Web3AuthProvider

  const { address: eoaAddress, isConnected: isEoaConnected, connector } = useAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();
  const eoaSigner = useEthersSigner({ chainId: connector?.chains?.[0]?.id });

  const handleLogin = useCallback((role, connectionDetails) => {
    console.log(`Login successful as ${role}:`, connectionDetails);
    setWalletInfo({ ...connectionDetails, role: role });
    setIsLoggedIn(true);
  }, [setIsLoggedIn, setWalletInfo]);

  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    if (walletInfo?.isSmartAccount) {
      if (web3authInstanceForApp && web3authInstanceForApp.status === 'connected') {
        web3authInstanceForApp.logout(); // Logout from Web3Auth instance if it was used
      }
      // Also call logout from Web3AuthContext if it holds relevant state
      // const { logout: logoutFromWeb3AuthCtx } = useWeb3Auth(); // This might cause issues if called during render
      // if (logoutFromWeb3AuthCtx) logoutFromWeb3AuthCtx();
    } else {
      disconnectWagmi();
    }
    setWalletInfo(null);
    setIsLoggedIn(false);
  }, [disconnectWagmi, walletInfo, setIsLoggedIn, setWalletInfo, web3authInstanceForApp]);

  // Initialize Web3Auth for App component (primarily for session check)
  useEffect(() => {
    const initAppWeb3Auth = async () => {
      // ... (Web3Auth initialization logic - ensure config constants are accessible)
      if (!web3AuthClientId || !rpcUrl) {
        console.error("[AppContent] Web3Auth Client ID or RPC URL not configured.");
        return;
      }
      try {
        const chainIdHex = '0x' + chainId.toString(16);
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: chainIdHex, rpcTarget: rpcUrl,
          displayName: "Nerochain Testnet", blockExplorer: "https://testnet.neroscan.com",
          ticker: "NERO", tickerName: "Nero",
        };
        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
        const web3auth = new Web3Auth({
          clientId: web3AuthClientId, web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          chainConfig: chainConfig, privateKeyProvider: privateKeyProvider,
          uiConfig: { appName: "SeedSafe" }
        });
        await web3auth.init();
        setWeb3authInstanceForApp(web3auth);
        console.log("[AppContent] App-level Web3Auth initialized.");
      } catch (err) {
        console.error("[AppContent] App-level Web3Auth init error:", err);
      }
    };
    initAppWeb3Auth();
  }, []); // Empty dependency: runs once

  // Effect to restore Web3Auth/Smart Account session
  useEffect(() => {
    const restoreWeb3AuthSession = async () => {
      if (web3authInstanceForApp && !walletInfo) {
        console.log(`[AppContent] Attempting to restore session. Web3Auth status: ${web3authInstanceForApp.status}`);
        let provider = null;
        try {
          if (web3authInstanceForApp.status === "connected") {
            console.log("[AppContent] Web3Auth status is 'connected'. Calling connect() to ensure provider is active.");
            provider = await web3authInstanceForApp.connect();
          } else {
            console.log(`[AppContent] Web3Auth status is ${web3authInstanceForApp.status}. Not attempting session restore via connect().`);
            return;
          }
        } catch (connectError) {
          console.error("[AppContent] Error during web3authInstanceForApp.connect() in session restore:", connectError);
          return;
        }

        if (provider) {
          console.log("[AppContent] Provider obtained from Web3Auth. Proceeding with ethers.");
          try {
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const accounts = await ethersProvider.listAccounts();
            console.log("[AppContent] Accounts from ethersProvider:", accounts);

            if (accounts.length === 0) {
              console.error("[AppContent] No accounts found on ethersProvider after Web3Auth connect. Cannot restore session.");
              return;
            }
            
            const eoaSignerRestored = ethersProvider.getSigner(); // Default (account 0)
            const eoaAddressRestored = await eoaSignerRestored.getAddress();
            console.log("[AppContent] Successfully got eoaAddressRestored:", eoaAddressRestored);

            const aaAddressRestored = await getAAWalletAddress(eoaSignerRestored);
            if (!aaAddressRestored) throw new Error("Failed to get AA address for restored session.");
            
            const accountOptions = { entryPoint: entryPointAddress, factory: simpleAccountFactoryAddress, overrideBundlerRpc: bundlerUrl };
            const simpleAccountRestored = await Presets.Builder.SimpleAccount.init(eoaSignerRestored, rpcUrl, accountOptions);
            const isDeployedRestored = await isAAWalletDeployed(aaAddressRestored);
            
            handleLogin("producer", {
              address: aaAddressRestored,
              signer: simpleAccountRestored,
              provider: ethersProvider,
              eoaAddress: eoaAddressRestored,
              eoaSigner: eoaSignerRestored,
              chainId: chainId,
              isSmartAccount: true,
              isDeployed: isDeployedRestored
            });
            await loginToWeb3AuthContext(provider, aaAddressRestored); // Pass the active provider
            console.log("[AppContent] Smart Account session restored.");
          } catch (error) {
            console.error("[AppContent] Error restoring Smart Account session with ethers:", error);
            if (error.code) console.error(`[AppContent] Error code: ${error.code}, reason: ${error.reason}, operation: ${error.operation}`);
          }
        } else {
          console.log("[AppContent] No provider obtained from Web3Auth after connect() attempt. Cannot restore session.");
        }
      }
    };
    if (!walletInfo && web3authInstanceForApp) { restoreWeb3AuthSession(); }
  }, [web3authInstanceForApp, walletInfo, handleLogin, loginToWeb3AuthContext]);

  // Effect to handle EOA login via RainbowKit/Wagmi
  useEffect(() => {
    // ... (EOA login logic - this uses handleLogin)
    if (isEoaConnected && eoaAddress && eoaSigner && (!walletInfo || walletInfo.isSmartAccount)) {
      console.log("[AppContent] Wagmi EOA connected:", eoaAddress, "Signer present:", !!eoaSigner);
      handleLogin("investor", {
        address: eoaAddress,
        signer: eoaSigner,
        eoaAddress: eoaAddress,
        eoaSigner: eoaSigner,
        chainId: connector?.chains?.[0]?.id,
        isSmartAccount: false
      });
    }
  }, [isEoaConnected, eoaAddress, eoaSigner, walletInfo, connector, handleLogin]);
  
  // --- UI State & Styling Effects and Functions (handleResize, addGlobalStyles, open/closeWalletModal) ---
  useEffect(() => { addGlobalStyles(); const handleResize = () => setIsMobile(window.innerWidth < 768); window.addEventListener("resize", handleResize); handleResize(); return () => window.removeEventListener("resize", handleResize);}, []);
  useEffect(() => { setPageLoaded(true); if (!localStorage.getItem("seedsafe_onboarding_completed")) { setShowOnboarding(true); }}, []);
  const openWalletModal = () => { setIsWalletModalOpen(true); document.body.style.overflow = "hidden"; };
  const closeWalletModal = () => { setIsWalletModalOpen(false); document.body.style.overflow = "auto"; };

  const backgroundStyle = !isMobile ? { backgroundImage: `url(${bgPattern})`, backgroundSize: "auto", backgroundPosition: "center" } : {};
  const userRole = walletInfo?.role;

  const RequireAuth = ({ children, requiredRole }) => {
    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
    return children;
  };

  const walletContextValueForProvider = useMemo(() => ({
    address: walletInfo?.address,
    signer: walletInfo?.signer,
    provider: walletInfo?.provider,
    chainId: walletInfo?.chainId,
    role: walletInfo?.role,
    isSmartAccount: walletInfo?.isSmartAccount,
    eoaAddress: walletInfo?.eoaAddress,
    eoaSigner: walletInfo?.eoaSigner,
    logout: handleLogout
  }), [walletInfo, handleLogout]);

  // The Router and all page content previously in App's return statement goes here
  return (
    <WalletInfoProvider value={walletContextValueForProvider}>
      <div style={{ position: 'fixed', top: 24, left: 24, zIndex: 9999 }}>
        <OverlayProviders>
          <OverlayApp mode='sidebar' />
        </OverlayProviders>
      </div>
      {/* Web3AuthProvider is now an ancestor, so AppContent can use useWeb3Auth() */}
      <Router>
        {/* ... The rest of the div.font-poppins, header, main, Footer, WalletModal, Onboarding etc. ... */}
        <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
            <header
              className={`${ isMobile ? "bg-gradient-to-r from-white/95 to-white/90" : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"} pb-12 md:pb-24 relative`}
              style={{ backgroundImage: isMobile ? "none" : `url(${bgPattern})`, backgroundSize: "auto", backgroundPosition: "center" }}
            >
              <Navbar openWalletModal={openWalletModal} isLoggedIn={isLoggedIn} userRole={userRole} userAddress={walletInfo?.address} onLogout={handleLogout} />
              <Routes><Route path="/" element={<Hero openWalletModal={openWalletModal} walletInfo={walletInfo} />} /></Routes>
            </header>
            <main className="w-full">
              <Routes>
                <Route path="/" element={<><HowItWorks /><Benefits /><Products /><Testimonials /><CTASection openWalletModal={openWalletModal} /></>} />
                <Route path="/marketplace" element={<div className={`${isMobile ? "bg-gradient-to-r from-white/95 to-white/90" : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"}`} style={backgroundStyle}><Marketplace /></div>} />
                <Route path="/register" element={<RequireAuth requiredRole="producer"><div className="bg-white"><RegistrationProcess walletInfo={walletInfo} setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></div></RequireAuth>} />
                <Route path="/auditor" element={<RequireAuth requiredRole="auditor"><Auditor /></RequireAuth>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            {isWalletModalOpen && (<WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} onLogin={handleLogin} />)}
        </div>
        {pageLoaded && (<><Onboarding isOpen={showOnboarding} onComplete={handleOnboardingComplete} /><OnboardingButton onClick={handleStartOnboarding} /><div className="agrobot-button"><ChatbotWidget /></div></>)}
      </Router>
    </WalletInfoProvider>
  );
}

// Original App component now just sets up providers and renders AppContent
function App() {
  return (
    // WalletInfoProvider is moved inside AppContent as it depends on state now in AppContent
    // Or, walletContextValue could be prepared in AppContent and passed down if App remains the provider
    // For simplicity, AppContent will now include WalletInfoProvider.
    // If WalletInfoProvider itself doesn't call useWeb3Auth or other hooks that need to be deeply nested, it can stay here.
    // Let's assume WalletInfoProvider should wrap AppContent directly.
    <Web3AuthProvider>
      <AppContent />
    </Web3AuthProvider>
  );
}

export default App;