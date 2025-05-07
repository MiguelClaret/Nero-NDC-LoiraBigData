"use client";

import { useEffect, useState } from "react";
import { getSigner, getAAWalletAddress, isAAWalletDeployed } from "../utils/aaUtils";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import metamaskIcon from "../assets/metamask.svg";
import coinbaseIcon from "../assets/coinbase.svg";
import { Loader2 } from "lucide-react";

const WalletModal = ({ isOpen, onClose, onLogin }) => {
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [walletDetected, setWalletDetected] = useState({
    metamask: false,
    coinbase: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWalletDetected({
        metamask: !!window.ethereum,
        coinbase: true, // Coinbase SDK doesn't need injection
      });
    }
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const connectMetaMask = async () => {
    setError(null);
    setConnecting("metamask");
    try {
      const signer = await getSigner();
      const eoaAddress = await signer.getAddress();
      const aaAddress = await getAAWalletAddress(signer);
      const deployed = await isAAWalletDeployed(aaAddress);

      console.log("🟢 Conectado com MetaMask (EOA):", eoaAddress);
      console.log("🟢 Endereço da AA Wallet:", aaAddress);
      console.log("🟢 Status da AA Wallet:", deployed ? "Implantada" : "Não implantada");

      if (onLogin) onLogin("investor"); // ou "producer", conforme o fluxo desejado
      onClose();
    } catch (err) {
      console.error("MetaMask connection error:", err);
      setError(err.message || "Failed to connect to MetaMask");
    } finally {
      setConnecting(false);
    }
  };

  const createSmartAccount = () => {
    if (onLogin) onLogin("producer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6 transform transition-all scale-100 animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Connect Your Wallet</h2>

        <div className="space-y-4">
          <button
            onClick={connectMetaMask}
            disabled={!!connecting || !walletDetected.metamask}
            className={`w-full flex items-center gap-3 p-3 border border-gray-300 rounded-xl transition-all ${
              walletDetected.metamask
                ? "hover:border-green-700 hover:bg-green-50"
                : "opacity-60 cursor-not-allowed bg-gray-100"
            }`}
          >
            <img src={metamaskIcon || "/placeholder.svg"} alt="MetaMask" className="h-6 w-6" />
            <span className="flex-grow text-left">
              {walletDetected.metamask ? "MetaMask" : "MetaMask (Not Detected)"}
            </span>
            {connecting === "metamask" && <Loader2 className="h-5 w-5 animate-spin text-green-600" />}
          </button>

          <div className="mt-8 p-6 bg-gray-100 rounded-md text-center">
            <h4 className="text-lg font-bold mb-2">New to crypto?</h4>
            <p className="text-sm mb-4">Create a free Smart Account, without gas fees</p>
            <button
              onClick={createSmartAccount}
              className="w-full py-3 px-4 rounded-md font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Create Smart Account <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-md border border-red-200">
            <p className="font-medium">Connection Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletModal;

