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
  const [formData, setFormData] = useState({
    cropType: "",
    quantity: "",
    harvestDate: "",
    location: "",
    area: "",
    sustainablePractices: [],
    pricePerUnit: "0",
    paymentType: "0",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [salesProgress, setSalesProgress] = useState(0);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sustainablePractices: checked
        ? [...prev.sustainablePractices, value]
        : prev.sustainablePractices.filter((p) => p !== value),
    }));
  }, []);

  const handleStepOneSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!web3authProvider || !userAddress) {
      alert('Conecte sua carteira Web3Auth para registrar a safra.');
      return;
    }
  
    console.log('[RegistrationProcess] Preparing to submit...');
    console.log('📦 formData:', formData);
    console.log('🔍 paymentType usado:', formData.paymentType);
  
    const cropData = {
      crop: formData.cropType,
      quantity: parseInt(formData.quantity),
      price: formData.pricePerUnit || "0",
      deliveryDate: Math.floor(new Date(formData.harvestDate).getTime() / 1000),
      doc: `Produtor: ${userAddress}, Localização: ${formData.location || 'N/A'}, Área: ${formData.area || 'N/A'}ha, Práticas: ${formData.sustainablePractices.join(',') || 'Nenhuma'}`,
      paymentType: formData.paymentType || "0", // <-- ESSENCIAL
    };
  
    setIsProcessing(true);
    setRegistrationComplete(false);
    setTransactionHash(null);
  
    try {
      const receivedTransactionHash = await registerHarvestUserOp(web3authProvider, cropData);
      if (receivedTransactionHash) {
        console.log("✅ Safra registrada! Hash da Transação:", receivedTransactionHash);
        setTransactionHash(receivedTransactionHash);
        setRegistrationComplete(true);
      } else {
        throw new Error("Falha ao obter o hash da transação final.");
      }
    } catch (err) {
      if (!err.message?.includes('AA21')) {
        alert("Erro ao registrar safra:\n" + (err?.message || "Erro desconhecido"));
      }
      console.error("Erro durante o registro da safra:", err);
      setTransactionHash(null);
      setRegistrationComplete(false);
    } finally {
      setIsProcessing(false);
    }
  }, [web3authProvider, userAddress, formData]);
  

  const handleNextStep = () => setShowTransactionPopup(true);
  const handleTransactionPopupClose = () => {
    if (setCurrentPage) setCurrentPage("marketplace");
  };

  const simulateAuditorDecision = useCallback((decision) => {
    if (decision === "approved") {
      setCurrentStep(3);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress > 100) progress = 100;
        setSalesProgress(progress);
        if (progress === 100) clearInterval(interval);
      }, 2000);
    }
  }, []);

  const calculateCarbonCredits = useCallback(() => {
    const practiceCredits = {
      organic: 1.2,
      conservation: 0.8,
      rotation: 0.6,
      water: 0.4,
    };
    const area = parseFloat(formData.area) || 1;
    return (
      formData.sustainablePractices.reduce(
        (sum, p) => sum + (practiceCredits[p] || 0),
        0
      ) * area
    ).toFixed(2);
  }, [formData.sustainablePractices, formData.area]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <WalletConnect />

      <TransactionPopup
        isVisible={showTransactionPopup}
        transactionHash={transactionHash}
        onClose={handleTransactionPopupClose}
      />

      <div className="bg-white rounded-lg shadow-lg mb-5 pt-4 border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-black text-center">Register Your Crop</h1>
        <StepCircles currentStep={currentStep} registrationStatus={registrationStatus} />
      </div>

      <div className="bg-white rounded-lg shadow-lg md:p-6 border border-gray-100">
        {currentStep === 1 && (
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
