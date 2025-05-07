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
    builder.setPaymasterOptions({
      type: 0,
      apikey: '47cf84d0847b40b59a241cb3ca7dbb6e',
      rpc: 'https://paymaster-testnet.nerochain.io',
    })

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
    console.error("Erro ao enviar UserOp:", err);
    throw err;
  }
};





