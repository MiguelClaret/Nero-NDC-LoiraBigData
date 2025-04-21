import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createSmartAccountClient, toSimpleSmartAccount } from 'permissionless';
import { NERO_CHAIN_CONFIG } from '../config/chainConfig';

// 🎯 EntryPoint e Fábrica padrão da NERO (Testnet)
const ENTRY_POINT_ADDRESS_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const FACTORY_ADDRESS_V06 = '0x9406Cc6185a346906296840746125a0E44976454';

// 1️⃣ Gera ou recupera chave privada e salva no localStorage
function getOrCreatePrivateKey() {
  let key = localStorage.getItem('nero_private_key');
  if (!key) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    key = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('nero_private_key', key);
    console.log('🔑 Nova private key gerada e salva:', key);
  } else {
    console.log('🔐 Private key recuperada do localStorage:', key);
  }
  return key;
}

// 2️⃣ Cria o signer a partir da private key
export function getSignerFromLocalStorage() {
  const privateKey = getOrCreatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  console.log('👤 Signer gerado com endereço:', account.address);
  return account;
}

// 3️⃣ Cria Viem client comum
export function getViemClient() {
  const account = getSignerFromLocalStorage();
  const client = createWalletClient({
    account,
    chain: {
      id: NERO_CHAIN_CONFIG.chainId,
      rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
    },
    transport: http(NERO_CHAIN_CONFIG.rpcUrl),
  });

  console.log('📡 Viem client criado com:', {
    chainId: NERO_CHAIN_CONFIG.chainId,
    rpcUrl: NERO_CHAIN_CONFIG.rpcUrl,
    address: account.address,
  });

  return client;
}

// 4️⃣ Cria Smart Wallet Client com toSimpleSmartAccount()
export async function initSmartWalletClient() {
  const viemClient = getViemClient();
  const owner = getSignerFromLocalStorage();

  // 🧱 Cria a SmartAccount com a fábrica e EntryPoint v0.6
  const simpleAccount = await toSimpleSmartAccount({
    client: viemClient,
    owner,
    entryPoint: {
      address: ENTRY_POINT_ADDRESS_V06,
      version: '0.6',
    },
    factory: {
      address: FACTORY_ADDRESS_V06,
    },
  });

  // 🚀 Cria o SmartAccountClient com bundler e paymaster da NERO
  const client = createSmartAccountClient({
    account: simpleAccount,
    chain: {
      id: NERO_CHAIN_CONFIG.chainId,
      rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
    },
    transport: http(NERO_CHAIN_CONFIG.rpcUrl),
    entryPoint: ENTRY_POINT_ADDRESS_V06,
    bundlerTransport: http(NERO_CHAIN_CONFIG.bundlerRpc),
    sponsor: {
      paymasterRpc: NERO_CHAIN_CONFIG.paymasterRpc,
    },
  });

  console.log('🧠 Smart Wallet Client criado com sucesso:', {
    address: simpleAccount.address,
    entryPoint: ENTRY_POINT_ADDRESS_V06,
    factory: FACTORY_ADDRESS_V06,
  });

  return client;
}












 
