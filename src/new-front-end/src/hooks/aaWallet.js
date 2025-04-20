import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createSmartAccountClient } from 'permissionless'
import { NERO_CHAIN_CONFIG } from '../config/chainConfig'
const ENTRY_POINT_ADDRESS_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'; // entry point padrão v0.6

// 1️⃣ Recupera ou gera chave privada e salva no localStorage
function getOrCreatePrivateKey() {
  let key = localStorage.getItem('nero_private_key')
  if (!key) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    key = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem('nero_private_key', key)
  }
  return key
}

// 2️⃣ Constrói a Account viem a partir da chave privada
export function getSignerFromLocalStorage() {
  const privateKey = getOrCreatePrivateKey()
  return privateKeyToAccount(privateKey)
}

// 3️⃣ Cria o client da viem com essa signer
export function getViemClient() {
  return createWalletClient({
    account: getSignerFromLocalStorage(),
    chain: {
      id: NERO_CHAIN_CONFIG.chainId,
      rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
    },
    transport: http(NERO_CHAIN_CONFIG.rpcUrl),
  })
}

// 4️⃣ Cria e exporta a Smart Wallet Client com stackup
export async function initSmartWalletClient() {
  const privateKey = getOrCreatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  // 👇 Adiciona a função necessária para o SDK
  account.getFactoryArgs = async () => {
    return [account.address]; // ← padrão para maioria das factory contracts da NERO
  };

  account.getNonce = async (entryPoint) => {
    const client = createWalletClient({
      account,
      chain: {
        id: NERO_CHAIN_CONFIG.chainId,
        rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
      },
      transport: http(NERO_CHAIN_CONFIG.rpcUrl),
    });

    return await client.getTransactionCount({ address: account.address });
  };
  
  return createSmartAccountClient({
    account,
    chain: {
      id: NERO_CHAIN_CONFIG.chainId,
      rpcUrls: { default: { http: [NERO_CHAIN_CONFIG.rpcUrl] } },
    },
    transport: http(NERO_CHAIN_CONFIG.rpcUrl),
    entryPoint: ENTRY_POINT_ADDRESS_V06,
    accountFactory: NERO_CHAIN_CONFIG.accountFactory,
    bundlerTransport: http(NERO_CHAIN_CONFIG.bundlerRpc),
    sponsor: {
      paymasterRpc: NERO_CHAIN_CONFIG.paymasterRpc,
    },
  })
}



 
