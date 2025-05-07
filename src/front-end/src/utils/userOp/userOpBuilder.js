// src/userOp/userOpBuilder.js
import { Presets } from "userop";
import { CONTRACT_ADDRESSES, NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const getSimpleAccountBuilder = async (signer) => {
  return await Presets.Builder.SimpleAccount.init(signer, NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    factory: CONTRACT_ADDRESSES.accountFactory,
  });
};
  
  


  
  
    






