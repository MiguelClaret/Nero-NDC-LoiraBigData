import { ethers } from "ethers";
import { Client, Presets } from "userop";
import {
  NERO_CHAIN_CONFIG,
  AA_PLATFORM_CONFIG,
  CONTRACT_ADDRESSES
} from "../config/chainConfig";

// 1. Provedor RPC
export const getProvider = () =>
  new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);

// 2. Signer EOA (MetaMask)
export const getSigner = async () => {
  if (!window.ethereum) throw new Error("Instale MetaMask");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return new ethers.providers.Web3Provider(window.ethereum).getSigner();
};

// 3. Inicializa o Client AA
export const initAAClient = async () =>
  Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint
  });

// 4. Endereço counterfactual da smart wallet
export const getAAWalletAddress = async (signer: ethers.Signer) => {
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    signer,
    NERO_CHAIN_CONFIG.rpcUrl,
    {
      overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
      entryPoint: CONTRACT_ADDRESSES.entryPoint,
      factory: CONTRACT_ADDRESSES.accountFactory
    }
  );
  return simpleAccount.getSender();
};

// 5. Função genérica para enviar UserOperations
export const executeOperation = async (
  target: string,
  data: string
) => {
  const client = await initAAClient();
  const userOp = await client.createUserOperation({
    target,
    data,
    paymaster: AA_PLATFORM_CONFIG.paymasterRpc,
    paymasterInput: process.env.VITE_PAYMASTER_API_KEY!
  });
  const hash = await client.sendUserOperation(userOp);
  return client.waitForReceipt(hash);
};
