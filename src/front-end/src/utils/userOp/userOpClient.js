import { Client } from "userop";
import { NERO_CHAIN_CONFIG, CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const getUserOperationClient = async () => {
  return await Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
  });
};

export const sendUserOperation = async (userOperation) => {
  const client = await getUserOperationClient();
  
  try {
    const result = await client.sendUserOperation(userOperation);
    console.log("🚀 Transação enviada! Hash: ", result.userOpHash);
    return result;
  } catch (error) {
    console.error("❌ Erro ao enviar UserOperation:", error);
  }
};





