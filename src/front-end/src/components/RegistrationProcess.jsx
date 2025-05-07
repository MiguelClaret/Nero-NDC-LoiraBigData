import React, { useState, useEffect } from 'react';
import StepCircles from './RegistrationProcess/StepCircles';
import CropForm from './RegistrationProcess/CropForm';
import LoginForm from './RegistrationProcess/LoginForm';
import VerificationStatus from './RegistrationProcess/VerificationStatus';
import MarketplaceStatus from './RegistrationProcess/MarketplaceStatus';
import { ethers } from "ethers";
import { registerHarvestUserOp } from "../utils/userOp/registerHarvestUserOp";
import { isValidEthereumAddress } from "../utils/ethersHelpers";
import { CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react';
import { parseToTokenUnits, formatFromTokenUnits } from '../utils/ethersHelpers';
import { getAAWalletAddress, isAAWalletDeployed } from '../utils/aaUtils';
import { useWeb3Auth } from "./Web3AuthContext";
import { getUserOperationClient } from '../utils/userOp/userOpClient';
import { getSimpleAccountBuilder } from '../utils/userOp/userOpBuilder';
import { AA_PLATFORM_CONFIG } from "../config/neroConfig";

// NERO Chain Contract address
const HARVEST_MANAGER_ADDRESS = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836';

const RegistrationProcess = ({ setCurrentPage }) => {
  const { web3authProvider, userAddress, isLoggedIn } = useWeb3Auth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    harvestDate: '',
    location: '',
    area: '',
    sustainablePractices: []
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [salesProgress, setSalesProgress] = useState(0);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('');

  // Função para obter o signer do Web3Auth
  const getWeb3AuthSigner = async () => {
    if (!web3authProvider) {
      throw new Error("Provedor Web3Auth não disponível");
    }

    let ethersProvider;
    if (ethers.providers && ethers.providers.Web3Provider) {
      ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
    } else if (ethers.BrowserProvider) {
      ethersProvider = new ethers.BrowserProvider(web3authProvider);
    } else {
      throw new Error("Versão do ethers não suportada");
    }

    return await ethersProvider.getSigner();
  };

  // Função para validar os dados do formulário
  const validateFormData = async () => {
    if (!web3authProvider) {
      throw new Error("Por favor, conecte sua carteira primeiro");
    }

    if (!formData.cropType || !formData.quantity || !formData.harvestDate || !formData.location || !formData.area) {
      throw new Error("Por favor, preencha todos os campos obrigatórios");
    }

    const signer = await getWeb3AuthSigner();
    const address = await signer.getAddress();

    if (!isValidEthereumAddress(address)) {
      throw new Error("Endereço da carteira inválido");
    }

    return true;
  };

  // Função para lidar com o envio do formulário
  const handleStepOneSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await validateFormData();
      const signer = await getWeb3AuthSigner();

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
      setShowLogin(true);

    } catch (err) {
      console.error("Erro ao registrar safra:", err);
      setError(err.message || "Erro ao registrar safra");
    }
  };

  // Form event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'sustainablePractices') {
      setFormData(prev => {
        let updatedPractices = [...prev.sustainablePractices];
        if (checked) {
          updatedPractices.push(value);
        } else {
          updatedPractices = updatedPractices.filter(practice => practice !== value);
        }
        return { ...prev, sustainablePractices: updatedPractices };
      });
    }
  };

  // Verificar se a conta AA está implantada
  const checkAAWalletDeployment = async () => {
    try {
      if (!web3authProvider) {
        throw new Error("Endereço da carteira não disponível");
      }

      const isDeployed = await isAAWalletDeployed(web3authProvider);
      if (!isDeployed) {
        throw new Error("Conta AA ainda não está implantada. Por favor, aguarde a implantação.");
      }
      return true;
    } catch (error) {
      console.error("Erro ao verificar implantação da conta AA:", error);
      throw error;
    }
  };

  // Handle form submission using the NERO AA-specific SimpleAccount
  const handleCropSubmit = async (e, submittedData = null) => {
    e.preventDefault();
    setError(null);
    setTxStatus('submitting');
    setTxHash('');
    
    try {
      console.log("Iniciando processo de registro de safra com NERO AA...");
      
      const dataToProcess = submittedData || formData;
      console.log("Dados do formulário para processamento:", dataToProcess);
      
      // Validar dados
      await validateFormData();
      
      // Converter preço para unidades de token usando a função utilitária
      const priceInTokens = parseToTokenUnits(dataToProcess.pricePerUnitUSD);
      console.log("Preço convertido para unidades de token:", priceInTokens);
      
      // Criar string de documentação
      const documentation = `Produtor: ${userAddress}, ` +
                           `Localização: ${dataToProcess.location}, ` +
                           `Área: ${dataToProcess.area}ha, ` +
                           `Práticas: ${dataToProcess.sustainablePractices.join(',')}`;
      
      console.log("String de documentação:", documentation);
      
      // Calcular timestamp da data de colheita
      const harvestDateTimestamp = Math.floor(new Date(dataToProcess.harvestDate).getTime() / 1000);
      
      // Obter o assinante do walletInfo
      const simpleAccount = await getWeb3AuthSigner();
      
      // Interface do contrato
      const iface = new ethers.utils.Interface([
        "function createHarvest(string crop, uint256 quantity, uint256 pricePerUnit, uint256 deliveryDate, string documentation)"
      ]);
      
      const callData = iface.encodeFunctionData("createHarvest", [
        dataToProcess.cropType,
        dataToProcess.quantity,
        priceInTokens,
        harvestDateTimestamp,
        documentation
      ]);
      
      console.log("CallData codificado:", callData);
      
      setTxStatus('pending');
      
      // Criar e executar a transação usando o SDK NERO AA com Paymaster
      try {
        const client = await getUserOperationClient();
        const builder = await getSimpleAccountBuilder(simpleAccount);
        // Configurar paymaster para patrocinar o gás
        builder.setPaymasterOptions({
          type: 0,
          apikey: AA_PLATFORM_CONFIG.apiKey,
          rpc: AA_PLATFORM_CONFIG.paymasterRpc,
          paymasterAddress: AA_PLATFORM_CONFIG.paymasterAddress,
        });
        const userOp = await builder.execute(HARVEST_MANAGER_ADDRESS, 0, callData);
        console.log("UserOperation enviada:", userOp.userOpHash || userOp.hash);
        const res = await client.sendUserOperation(userOp);
        console.log("UserOperation enviada (res.userOpHash):", res.userOpHash);
        const receipt = await res.wait();
        console.log("Receipt (receipt.transactionHash):", receipt.transactionHash);
        setTxHash(receipt.transactionHash);
        setTxStatus('confirmed');
        setRegistrationStatus({
          success: true,
          cropId: receipt?.logs?.[0]?.topics?.[1] || Math.floor(Math.random() * 1000).toString(),
          timestamp: new Date().toISOString(),
          transactionHash: receipt?.transactionHash
        });
      } catch (txError) {
        console.error("Erro na execução da transação:", txError);
        setTxStatus('failed');
        throw new Error(`Falha na execução da transação: ${txError.message}`);
      }
      
    } catch (err) {
      console.error("Erro no registro da safra (outer catch):", err);
      setError(err.message || "Falha ao registrar safra");
      setTxStatus('failed');
    }
  };

  // Helper function to safely convert objects to strings for display
  const safeStringify = (obj) => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return obj.toString();
    try {
      // Try to convert to a string representation
      return JSON.stringify(obj);
    } catch (e) {
      return '[Complex Object]'; // Fallback for circular references
    }
  };

  // Props for CropForm
  const isProcessingProp = txStatus === 'submitting' || txStatus === 'pending';
  const registrationCompleteProp = txStatus === 'confirmed' && !!registrationStatus?.success;
  const transactionHashProp = txHash; // txHash is updated upon successful transaction

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center animate-fadeIn">
        Register Your Crop
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <StepCircles currentStep={currentStep} registrationStatus={registrationStatus} />
      
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn">
        {showLogin && (
          <LoginForm 
            loginData={loginData} 
            handleLoginChange={handleInputChange} 
            handleLoginSubmit={handleStepOneSubmit} 
          />
        )}
        
        {currentStep === 1 && !showLogin && (
          <CropForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleCheckboxChange={handleCheckboxChange} 
            handleStepOneSubmit={handleCropSubmit}
            isProcessing={isProcessingProp}
            registrationComplete={registrationCompleteProp}
            transactionHash={transactionHashProp}
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