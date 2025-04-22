import { initSmartWalletClient } from './aaWallet';
import { CONTRACTS } from '../config/contractsConfig';
import { encodeFunctionData } from 'viem';
import { waitForUserOperationReceipt } from '../utils/waitForReceipt';

// 🔹 Criação da safra pelo produtor
export async function createHarvest({ crop, quantity, price, deliveryDate, doc }) {
  const client = await initSmartWalletClient();

  const calldata = encodeFunctionData({
    abi: CONTRACTS.harvestManager.abi,
    functionName: 'createHarvest',
    args: [crop, quantity, price, deliveryDate, doc],
  });

  console.log('🚜 Criando safra - calldata gerado:', calldata);

  const userOp = await client.createSignedUserOp({
    target: CONTRACTS.harvestManager.address,
    data: calldata,
  });

  const hash = await client.sendUserOp(userOp);
  console.log('📦 Hash da UserOp enviada:', hash);

  return await waitForUserOperationReceipt(hash);
}

// 🔹 Registro da quantidade realmente colhida
export async function registerHarvestedAmount(harvestId, realAmount) {
  const client = await initSmartWalletClient();

  const calldata = encodeFunctionData({
    abi: CONTRACTS.harvestManager.abi,
    functionName: 'registerHarvestedAmount',
    args: [harvestId, realAmount],
  });

  const userOp = await client.createSignedUserOp({
    target: CONTRACTS.harvestManager.address,
    data: calldata,
  });

  const hash = await client.sendUserOp(userOp);
  return await waitForUserOperationReceipt(hash);
}

// 🔹 Distribuição proporcional da produção colhida
export async function distributeProportionally(harvestId) {
  const client = await initSmartWalletClient();

  const calldata = encodeFunctionData({
    abi: CONTRACTS.harvestManager.abi,
    functionName: 'distributeProportionally',
    args: [harvestId],
  });

  const userOp = await client.createSignedUserOp({
    target: CONTRACTS.harvestManager.address,
    data: calldata,
  });

  const hash = await client.sendUserOp(userOp);
  return await waitForUserOperationReceipt(hash);
}

// 🔹 Reporte de perda total na safra
export async function reportTotalLoss(harvestId) {
  const client = await initSmartWalletClient();

  const calldata = encodeFunctionData({
    abi: CONTRACTS.harvestManager.abi,
    functionName: 'reportTotalLoss',
    args: [harvestId],
  });

  const userOp = await client.createSignedUserOp({
    target: CONTRACTS.harvestManager.address,
    data: calldata,
  });

  const hash = await client.sendUserOp(userOp);
  return await waitForUserOperationReceipt(hash);
}

// 🔹 Consulta do status da safra (read-only)
export async function getStatusHarvest(harvestId) {
  const client = await initSmartWalletClient();

  return await client.readContract({
    address: CONTRACTS.harvestManager.address,
    abi: CONTRACTS.harvestManager.abi,
    functionName: 'getStatusHarvest',
    args: [harvestId],
  });
}

// 🔹 Lista de compradores da safra (read-only)
export async function getBuyers(harvestId) {
  const client = await initSmartWalletClient();

  return await client.readContract({
    address: CONTRACTS.harvestManager.address,
    abi: CONTRACTS.harvestManager.abi,
    functionName: 'getBuyers',
    args: [harvestId],
  });
}




