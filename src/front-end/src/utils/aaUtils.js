// src/utils/aaUtils.js
import { ethers } from "ethers";
import { Presets } from "userop";
import { NERO_CHAIN_CONFIG, CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../config/neroConfig";

export const getSigner = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Nenhuma wallet Web3 encontrada. Instale a MetaMask.");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

export const getAAWalletAddress = async (signer) => {
  const builder = await Presets.Builder.SimpleAccount.init(signer, NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    factory: CONTRACT_ADDRESSES.accountFactory,
  });

  return await builder.getSender();
};

export const isAAWalletDeployed = async (aaAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
  const code = await provider.getCode(aaAddress);
  return code && code !== "0x";
};

export const approveTokenForPaymaster = async (signer, tokenAddress, amount) => {
  try {
    if (!tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Endereço do token não é válido.");
    }

    const erc20Interface = new ethers.utils.Interface([
      "function approve(address spender, uint256 amount) public returns (bool)"
    ]);

    console.log("🔗 Aprovando token para Paymaster...");
    const tx = await signer.sendTransaction({
      to: tokenAddress,
      data: erc20Interface.encodeFunctionData("approve", [
        AA_PLATFORM_CONFIG.paymasterAddress,
        amount,
      ]),
    });

    console.log("✅ Token aprovado para Paymaster: ", tx.hash);
    await tx.wait();
  } catch (error) {
    console.error("❌ Erro ao aprovar token: ", error);
  }
};

export const getSupportedTokens = async (signer) => {
  const provider = new ethers.providers.JsonRpcProvider(AA_PLATFORM_CONFIG.paymasterRpc);
  const senderAddress = await getAAWalletAddress(signer);

  const minimalUserOp = {
    sender: senderAddress,
    nonce: "0x0",
    initCode: "0x",
    callData: "0x",
    callGasLimit: "0x0",
    verificationGasLimit: "0x0",
    preVerificationGas: "0x0",
    maxFeePerGas: "0x0",
    maxPriorityFeePerGas: "0x0",
    paymasterAndData: "0x",
    signature: "0x"
  };

  const tokensResponse = await provider.send("pm_supported_tokens", [
    minimalUserOp,
    AA_PLATFORM_CONFIG.apiKey,
    CONTRACT_ADDRESSES.entryPoint
  ]);

  console.log("🪙 Tokens suportados pelo Paymaster:", tokensResponse);
  return tokensResponse;
};





