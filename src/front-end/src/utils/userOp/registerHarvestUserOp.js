// src/userOp/registerHarvestUserOp.js
import { ethers } from "ethers";
import HarvestManagerAbi from "../../abi/abiHarvest.json";
import { getUserOperationClient } from "./userOpClient";
import { getSimpleAccountBuilder } from "./userOpBuilder";
import { CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const registerHarvestUserOp = async (
  signer,
  { crop, quantity, price, deliveryDate, doc, paymentType = '0' }
) => {
  try {
    const contractAddress = CONTRACT_ADDRESSES.harvestManager;
    const client = await getUserOperationClient();
    const builder = await getSimpleAccountBuilder(signer);

    const paymentTypeNumber = Number(paymentType || '0');
    console.log("📦 Registrando safra com tipo de pagamento:", paymentTypeNumber);

    builder.setPaymasterOptions({
      type: paymentTypeNumber,
      apikey: AA_PLATFORM_CONFIG.apiKey,
      rpc: AA_PLATFORM_CONFIG.paymasterRpc,
      paymasterAddress: AA_PLATFORM_CONFIG.paymasterAddress,
    });

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

    console.log("📤 CallData codificado:", calldata);

    const userOp = await builder.execute(contractAddress, 0, calldata);
    console.log("🛠️ UserOperation montada:", userOp);
    console.log("🧾 paymasterAndData:", builder.getPaymasterAndData());

    const res = await client.sendUserOperation(userOp);
    console.log("📨 userOpHash:", res.userOpHash);
    const receipt = await res.wait();
    console.log("✅ Transaction Hash confirmada:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (err) {
    if (err.message && err.message.includes("AA21")) {
      alert("O Paymaster não patrocinou a transação (AA21). Verifique saldo e configuração do paymaster.");
    }
    console.error("❌ Erro ao enviar UserOp:", err);
    throw err;
  }
};






