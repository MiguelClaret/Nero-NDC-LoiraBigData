import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createSmartAccountClient } from 'userop';
import { NERO_CHAIN_CONFIG } from '../config/chainConfig';

const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454';

// 1️⃣ Gera ou recupera a chave privada
function getOrCreatePrivateKey() {
  let key = localStorage.getItem('nero_private_key');
  if (!key) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    key = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('nero_private_key', key);
    console.log('🔑 Nova chave gerada:', key);
  } else {
    console.log('🔐 Chave recuperada:', key);
  }
  return key;
}

// 2️⃣ Gera account do signer via viem
export function getSignerFromLocalStorage() {
  const privateKey = getOrCreatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  console.log('👤 Signer:', account.address);
  return account;
}

// 3️⃣ Viem client padrão
export function getViemClient() {
  const account = getSignerFromLocalStorage();
  return createWalletClient({
    account,
    chain: {
      id: NERO_CHAIN_CONFIG.chainId,
      rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
    },
    transport: http(NERO_CHAIN_CONFIG.rpcUrl),
  });
}

// 4️⃣ Criação do Smart Account Client usando SDK oficial
export async function initSmartWalletClient() {
  const account = getSignerFromLocalStorage();

  const client = await createSmartAccountClient({
    account,
    chain: {
      id: NERO_CHAIN_CONFIG.chainId,
      rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
    },
    transport: http(NERO_CHAIN_CONFIG.rpcUrl),
    entryPoint: ENTRY_POINT_ADDRESS,
    bundlerTransport: http(NERO_CHAIN_CONFIG.bundlerRpc),
    accountFactory: FACTORY_ADDRESS,
    sponsor: {
      paymasterRpc: NERO_CHAIN_CONFIG.paymasterRpc,
    },
  });

  console.log('🧠 Smart Wallet Client criado com sucesso:', {
    address: account.address,
    entryPoint: ENTRY_POINT_ADDRESS,
    factory: FACTORY_ADDRESS,
  });

  return client;
}














 
