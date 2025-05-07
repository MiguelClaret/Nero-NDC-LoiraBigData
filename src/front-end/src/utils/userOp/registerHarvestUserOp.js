// src/userOp/registerHarvestUserOp.js
import { ethers } from "ethers";
import HarvestManagerAbi from "../../abi/abiHarvest.json";
import { getUserOperationClient } from "./userOpClient";
import { getSimpleAccountBuilder } from "./userOpBuilder";
import { CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const registerHarvestUserOp = async (
  signer,
  { crop, quantity, price, deliveryDate, doc }
) => {
  try {
    const contractAddress = CONTRACT_ADDRESSES.harvestManager;
    const client = await getUserOperationClient();
    const builder = await getSimpleAccountBuilder(signer);

    // Configuração robusta do paymaster
    builder.setPaymasterOptions({
      type: 0,
      apikey: AA_PLATFORM_CONFIG.apiKey,
      rpc: AA_PLATFORM_CONFIG.paymasterRpc,
      paymasterAddress: AA_PLATFORM_CONFIG.paymasterAddress,
    });

    // Limites de gas recomendados pela doc
    builder.setCallGasLimit(300000);
    builder.setVerificationGasLimit(2000000);
    builder.setPreVerificationGas(100000);

    const contract = new ethers.Contract(contractAddress, HarvestManagerAbi);
    const calldata = contract.interface.encodeFunctionData("createHarvest", [
      crop,
      quantity,
      ethers.utils.parseUnits(String(price), 18),
      deliveryDate,
      doc,
    ]);

    const userOp = await builder.execute(contractAddress, 0, calldata);

    console.log("UserOp gerada:", userOp);
    console.log("paymasterAndData final:", builder.getPaymasterAndData());

    const res = await client.sendUserOperation(userOp);
    console.log("UserOperation enviada:", res.userOpHash);
    const receipt = await res.wait();
    console.log("Receipt:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (err) {
    if (err.message && err.message.includes('AA21')) {
      alert('O Paymaster não patrocinou a transação (AA21). Verifique saldo e configuração do paymaster na plataforma NERO.');
    }
    console.error("Erro ao enviar UserOp:", err);
    throw err;
  }
};





