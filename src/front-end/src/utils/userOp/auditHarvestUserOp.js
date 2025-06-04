import { ethers } from "ethers";
import { getUserOperationClient } from "./userOpClient";
import { getSimpleAccountBuilder } from "./userOpBuilder";
import { CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const auditHarvestUserOp = async (
  signer,
  {
    harvestId,
    action, // 'approve' or 'reject'
    tco2Amount = "0", // Only used in approval
    paymentType = "0",
    toAddress = ""
  }
) => {
  try {
    const contractAddress = CONTRACT_ADDRESSES.harvestManager.address;
    const contractAbi = CONTRACT_ADDRESSES.harvestManager.abi;

    const client = await getUserOperationClient();
    const builder = await getSimpleAccountBuilder(signer);

    const paymentTypeNumber = Number(paymentType || "0");
    builder.setPaymasterOptions({
      type: paymentTypeNumber,
      apikey: AA_PLATFORM_CONFIG.apiKey,
      rpc: AA_PLATFORM_CONFIG.paymasterRpc,
      paymasterAddress: AA_PLATFORM_CONFIG.paymasterAddress,
    });

    builder.setCallGasLimit(800_000);
    builder.setVerificationGasLimit(500_000);
    builder.setPreVerificationGas(50_000);

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let calldata;

    if (action === "approve") {
      if (!ethers.utils.isAddress(toAddress)) {
        throw new Error(`Endereço inválido: ${toAddress}`);
      }

      calldata = contract.interface.encodeFunctionData("mintHarvest", [
        toAddress,
        harvestId,
        ethers.utils.parseUnits(String(tco2Amount).replace(",", "."), 18)
      ]);
    } else if (action === "reject") {
      calldata = contract.interface.encodeFunctionData("rejectHarvest", [harvestId]);
    } else {
      throw new Error("Ação inválida. Use 'approve' ou 'reject'.");
    }

    const userOp = await builder.execute(contractAddress, 0, calldata);
    const res = await client.sendUserOperation(userOp);
    const receipt = await res.wait();

    console.log("Safra auditada. Tx Hash:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (err) {
    console.error("Erro ao auditar safra:", err);
    throw err;
  }
};
