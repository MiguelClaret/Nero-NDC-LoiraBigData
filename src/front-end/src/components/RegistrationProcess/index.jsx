import React, { useState, useEffect, useCallback } from 'react';
import StepCircles from './StepCircles';
import CropForm from './CropForm';
import LoginForm from './LoginForm';
import VerificationStatus from './VerificationStatus';
import MarketplaceStatus from './MarketplaceStatus';
import WalletConnect from '../WalletConnect';
import TransactionPopup from './TransactionPopup'; // Importando o novo componente
import { useWeb3Auth } from '../Web3AuthContext';
import { registerHarvestUserOp } from '../../utils/userOp/registerHarvestUserOp';
import { ethers } from 'ethers';

const RegistrationProcess = ({ setCurrentPage }) => {
  const { web3authProvider, userAddress, isLoggedIn } = useWeb3Auth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    cropType: "",
    quantity: "",
    harvestDate: "",
    location: "",
    area: "", // Campo adicional para área da fazenda
    sustainablePractices: [],
    pricePerUnit: "0", // Added based on usage in handleStepOneSubmit
  });
  
  // Estado de status e progresso de registro
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [salesProgress, setSalesProgress] = useState(0); // Percentage of crop sold

  // New states for handling transaction processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Estado para controlar a visibilidade do popup de transação
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);

  // Function to handle login form changes
  const handleLoginChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [name]: value,
    }));
  }, []);

  // Function to handle login submission
  const handleLoginSubmit = useCallback((e) => {
    e.preventDefault();
    // Simula login local (pode ser integrado com backend futuramente)
    setShowLogin(false);
  }, []);

  // Function to handle form submission for step 1
  const handleStepOneSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!web3authProvider || !userAddress) {
      alert('Conecte sua carteira Web3Auth para registrar a safra.');
      return;
    }

    console.log('[RegistrationProcess] Preparing to submit...');
    // Prepare data first
    const cropData = {
      crop: formData.cropType,
      quantity: parseInt(formData.quantity),
      price: formData.pricePerUnit || "0", // Will be parsed to BigNumber in the util
      deliveryDate: Math.floor(new Date(formData.harvestDate).getTime() / 1000),
      doc: `Produtor: ${userAddress}, Localização: ${formData.location || 'N/A'}, Área: ${formData.area || 'N/A'}ha, Práticas: ${formData.sustainablePractices.join(',') || 'Nenhuma'}`,
    };

    console.log('[RegistrationProcess] Data for UserOp:', cropData);

    setIsProcessing(true);
    setRegistrationComplete(false);
    setTransactionHash(null);

    try {
      console.log('[RegistrationProcess] Calling registerHarvestUserOp...');
      const receivedTransactionHash = await registerHarvestUserOp(web3authProvider, cropData);
      // The registerHarvestUserOp now simulates the full process including wait for receipt
      // and returns the final transactionHash.

      if (receivedTransactionHash) {
        console.log("✅ Safra registrada! Hash da Transação:", receivedTransactionHash);
        setTransactionHash(receivedTransactionHash);
        setRegistrationComplete(true);
      } else {
        // This case should ideally not be reached if registerHarvestUserOp throws on error
        // or returns null/undefined explicitly on failure before receipt.
        console.error("[RegistrationProcess] Falha ao registrar a safra, não foi retornado um hash.");
        throw new Error("Falha ao obter o hash da transação final.");
      }

    } catch (err) {
      console.error("Erro durante o registro da safra (pego no RegistrationProcess):", err);
      // Alert is already handled in registerHarvestUserOp for AA21, but keep a general one here.
      if (!err.message?.includes('AA21')) {
        alert("Erro ao registrar safra:\n" + (err?.message || "Erro desconhecido"));
      }
      setTransactionHash(null);
      setRegistrationComplete(false);
    } finally {
      console.log('[RegistrationProcess] Finalizando processamento.');
      setIsProcessing(false);
    }
  }, [web3authProvider, userAddress, formData]); // Dependencies for useCallback
  
  // Function to handle transaction popup close and navigate to validation screen
  const handleTransactionPopupClose = useCallback(() => {
    console.log("Popup closed, intended to navigate to marketplace");
    if (setCurrentPage) setCurrentPage('marketplace'); // Example usage if setCurrentPage handles this
  }, [setCurrentPage]);

  // Function to proceed to next step after registration is complete
  const handleNextStep = useCallback(() => {
    setShowTransactionPopup(true);
  }, []);

  // Simulate auditor decision (approve/reject)
  const simulateAuditorDecision = useCallback((decision) => {
    if (decision === "approved") {
      setCurrentStep(3);
      // Simulate sales progress over time
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress > 100) progress = 100;
        setSalesProgress(progress);
        if (progress === 100) clearInterval(interval);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const testProvider = async () => {
      try {
        const { JsonRpcProvider } = await import("ethers");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc-testnet.nerochain.io");

        const network = await provider.getNetwork();
        console.log("🔍 Resultado do getNetwork():", network);
      } catch (err) {
        console.error("❌ Erro ao testar a RPC da NERO:", err);
      }
    };
  
    testProvider();
  }, []);
  
  // This would be called by the form to handle changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = useCallback((e) => {
    const { value, checked } = e.target;
    let updatedPractices = [...formData.sustainablePractices];
    if (checked) {
      updatedPractices.push(value);
    } else {
      updatedPractices = updatedPractices.filter(
        (practice) => practice !== value
      );
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      sustainablePractices: updatedPractices,
    }));
  }, [formData.sustainablePractices]);

  // Calcular os créditos de carbono com base nas práticas sustentáveis
  const calculateCarbonCredits = useCallback(() => {
    // Base de crédito por prática (toneladas por hectare)
    const practiceCredits = {
      organic: 1.2,
      conservation: 0.8,
      rotation: 0.6,
      water: 0.4,
    };

    // Calcular com base nas práticas e área da fazenda
    let totalCredits = 0;
    formData.sustainablePractices.forEach((practice) => {
      if (practiceCredits[practice]) {
        totalCredits += practiceCredits[practice];
      }
    });

    // Multiplicar pela área total da fazenda
    const area = parseFloat(formData.area) || 1; // Fallback para 1 se não houver área
    return (totalCredits * area).toFixed(2);
  }, [formData.sustainablePractices, formData.area]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <WalletConnect />

      {/* Popup de Transação Concluída */}
      <TransactionPopup 
        isVisible={showTransactionPopup}
        transactionHash={transactionHash}
        onClose={handleTransactionPopupClose}
      />

      {/* Step Progress Circles */}
      <div className="bg-white rounded-lg shadow-lg mb-5 pt-4 border border-gray-100 animate-fadeIn">
        <h1 className="text-2xl md:text-3xl font-bold text-black text-center animate-fadeIn">
          Register Your Crop
        </h1>
        <StepCircles
          currentStep={currentStep}
          registrationStatus={registrationStatus}
        />
      </div>

      {/* Step content based on current step */}
      <div className="bg-white rounded-lg shadow-lg md:p-6 border border-gray-100 animate-fadeIn">
        {showLogin && (
          <LoginForm
            loginData={loginData}
            handleLoginChange={handleLoginChange}
            handleLoginSubmit={handleLoginSubmit}
          />
        )}

        {currentStep === 1 && !showLogin && (
          <CropForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            handleStepOneSubmit={handleStepOneSubmit}
            isProcessing={isProcessing}
            transactionHash={transactionHash}
            registrationComplete={registrationComplete}
            handleNextStep={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <VerificationStatus
            registrationStatus={registrationStatus}
            simulateAuditorDecision={simulateAuditorDecision}
          />
        )}

        {currentStep === 3 && (
          <MarketplaceStatus
            formData={formData}
            carbonCredits={calculateCarbonCredits()}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationProcess;