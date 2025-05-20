import { Presets } from "userop";
import { CONTRACT_ADDRESSES, NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const getSimpleAccountBuilder = async (signer, tokenAddress, type) => {
  const builder = await Presets.Builder.SimpleAccount.init(signer, NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    factory: CONTRACT_ADDRESSES.accountFactory,
  });

  // Aqui montamos o paymasterAndData com o token e o tipo de pagamento
  const paymasterData = `0x${AA_PLATFORM_CONFIG.paymasterAddress}${type}${tokenAddress.replace("0x", "")}`;
  console.log("🔗 Paymaster Data gerado:", paymasterData);

  // Adiciona o Paymaster à operação
  builder.setPaymasterOptions({
    apikey: AA_PLATFORM_CONFIG.apiKey,
    rpc: AA_PLATFORM_CONFIG.paymasterRpc,
    paymasterAndData: paymasterData,
  });

  return builder;
};

  


  
  
    






