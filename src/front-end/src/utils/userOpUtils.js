// userOpUtils.js
// Este utilitário permite registrar e comprar colheitas usando Account Abstraction (UserOperations)
// Toda transação usa o modelo Type 0 (100% patrocinado pela Paymaster)

import { Client, Presets } from 'userop';           // SDK do UserOperation da NERO Chain
import { ethers } from 'ethers';
import abiHarvest from '../abi/abiHarvest.json';     // ABI do contrato que contém createHarvest e buyToken

// URLs e endereços para a testnet da NERO Chain
const RPC_URL = 'https://rpc-testnet.nerochain.io';
const ENTRYPOINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const FACTORY = '0x9406Cc6185a346906296840746125a0E44976454';
const BUNDLER = 'https://bundler.service.nerochain.io';
const PAYMASTER = 'https://paymaster-testnet.nerochain.io';
const API_KEY = '47cf84d0847b40b59a241cb3ca7dbb6e'; // <- Coloque aqui sua chave da Paymaster

// Inicializa a AA Wallet a partir do signer (MetaMask)
async function getBuilder(signer) {
  return await Presets.Builder.SimpleAccount.init(signer, RPC_URL, {
    entryPoint: ENTRYPOINT,
    factory: FACTORY,
    overrideBundlerRpc: BUNDLER,
  });
}

// Fazendeiro registra uma colheita
export const registerHarvestUserOp = async (
  signer,
  contractAddress,
  crop,
  quantity,
  price,
  deliveryDate,
  doc
) => {
  console.log("✅ VERSÃO NOVA DO registerHarvestUserOp ATIVADA");

  const builder = await getBuilder(signer);
  builder.setPaymasterOptions({ rpc: PAYMASTER, apikey: API_KEY });

  const contract = new ethers.utils.Interface(JSON.parse(JSON.stringify(abiHarvest)));

  console.log("Registrando safra com os dados:");
  console.log("crop:", crop);
  console.log("quantity:", quantity);
  console.log("price:", price);
  console.log("deliveryDate:", deliveryDate);
  console.log("doc:", doc);

  const bnQuantity = ethers.BigNumber.isBigNumber(quantity) ? quantity : ethers.BigNumber.from(quantity);
  const bnPrice = ethers.BigNumber.isBigNumber(price) ? price : ethers.BigNumber.from(price);
  const bnDeliveryDate = ethers.BigNumber.isBigNumber(deliveryDate) ? deliveryDate : ethers.BigNumber.from(deliveryDate);

  console.log("🧪 Tipos reais enviados:");
  console.log("crop:", typeof crop, crop);
  console.log("quantity:", bnQuantity._isBigNumber, bnQuantity.toString());
  console.log("price:", bnPrice._isBigNumber, bnPrice.toString());
  console.log("deliveryDate:", bnDeliveryDate._isBigNumber, bnDeliveryDate.toString());
  console.log("doc:", typeof doc, doc);

  const calldata = contract.encodeFunctionData("createHarvest", [
    crop,
    bnQuantity,
    bnPrice,
    bnDeliveryDate,
    doc
  ]);

  const op = await builder.execute(contractAddress, calldata);
  const client = await Client.init(RPC_URL, {
    overrideBundlerRpc: BUNDLER,
    entryPoint: ENTRYPOINT,
  });

  const result = await client.sendUserOperation(op);
  const receipt = await result.wait();
  return receipt.transactionHash;
};

// Investidor compra parte da colheita
export const buyHarvestUserOp = async (
  signer,
  contractAddress,
  harvestId,     // uint - id da colheita que deseja comprar
  amount,        // uint - quantidade em kg
  valueInWei     // uint - valor total em wei a ser pago
) => {
  const builder = await getBuilder(signer);
  builder.setPaymasterOptions({ rpc: PAYMASTER, apikey: API_KEY }); // usa paymaster type 0

  const contract = new ethers.utils.Interface(JSON.parse(JSON.stringify(abiHarvest)));
  const calldata = contract.encodeFunctionData('buyToken', [
    harvestId,
    amount,
  ]);

  const op = await builder.execute(contractAddress, calldata, {
    value: ethers.BigNumber.from(valueInWei), // necessário pois buyToken é payable
  });

  const client = await Client.init(RPC_URL, {
    overrideBundlerRpc: BUNDLER,
    entryPoint: ENTRYPOINT,
  });

  const result = await client.sendUserOperation(op); // envia para o bundler
  const receipt = await result.wait(); // espera a confirmação
  return receipt.transactionHash; // retorna o hash da transação
};