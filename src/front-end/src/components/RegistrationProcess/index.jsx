import React, { useState, useEffect } from 'react';
import StepCircles from './StepCircles';
import CropForm from './CropForm';
import LoginForm from './LoginForm';
import VerificationStatus from './VerificationStatus';
import MarketplaceStatus from './MarketplaceStatus';
import WalletConnect from '../WalletConnect';
import { getSigner } from "../../utils/aaUtils";
import { ethers } from "ethers";
import { registerHarvestUserOp } from "../../utils/userOp/registerHarvestUserOp";


const RegistrationProcess = ({ setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
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
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [salesProgress, setSalesProgress] = useState(0); // Percentage of crop sold
  
  // New states for handling transaction processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Function to handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  // Function to handle login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  // Function to handle form submission for step 1
  const handleStepOneSubmit = async (e) => {
    e.preventDefault();
    
    // Set processing state to true
    setIsProcessing(true);
  
    try {
      const signer = await getSigner();
  
      const crop = formData.cropType;
      const quantity = parseInt(formData.quantity);
      const price = 25;
      const deliveryDate = Math.floor(new Date(formData.harvestDate).getTime() / 1000);
      const doc = formData.location || "doc://placeholder";
  
      const userOpHash = await registerHarvestUserOp(signer, {
        crop,
        quantity,
        price,
        deliveryDate,
        doc,
      });
  
      console.log("✅ Safra registrada com UserOperation:", userOpHash);
      
      // Store the transaction hash and set registration as complete
      setTransactionHash(userOpHash);
      setRegistrationComplete(true);
      setIsProcessing(false);
      
    } catch (err) {
      console.error("Erro ao registrar safra:", err);
      alert("Erro ao registrar safra:\n" + (err?.message || "sem mensagem"));
      setIsProcessing(false);
    }
  };
  
  // Function to proceed to next step after registration is complete
  const handleNextStep = () => {
    setShowLogin(true);
  };
  
  // Continue to verification after login
  useEffect(() => {
    if (isLoggedIn && showLogin === false && currentStep === 1) {
      setCurrentStep(2);
      setRegistrationStatus("pending");
    }
  }, [isLoggedIn, showLogin, currentStep]);

  // Simulate auditor decision (approve/reject)
  const simulateAuditorDecision = (decision) => {
    setRegistrationStatus(decision);
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
  };


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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedPractices = [...formData.sustainablePractices];

    if (checked) {
      updatedPractices.push(value);
    } else {
      updatedPractices = updatedPractices.filter(
        (practice) => practice !== value
      );
    }

    setFormData({
      ...formData,
      sustainablePractices: updatedPractices,
    });
  };

  // Calcular os créditos de carbono com base nas práticas sustentáveis
  const calculateCarbonCredits = () => {
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
  };

  return (
    <div className="max-w-4xl mx-auto py-8">

    
    <WalletConnect />


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
            salesProgress={salesProgress}
            carbonCredits={calculateCarbonCredits()}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationProcess;