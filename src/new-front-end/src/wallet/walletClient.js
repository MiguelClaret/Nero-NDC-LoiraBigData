import { createSmartAccountClient } from 'userop'
import { ethers } from 'ethers'

const paymasterUrl = "https://paymaster.stackup.sh/api/0x5a6680dFd4a77FEea0A7be291147768EaA2414ad" // substitua com sua key da NERO

export async function initSmartWallet() {
  // 1. Conecta com Metamask
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  // 2. Cria a smart wallet com paymaster
  const smartAccount = await createSmartAccountClient({
    signer,
    chain: {
      id: 11155111, // substitua com o chainId da NERO se necessário
      rpcUrl: 'https://rpc.nero.blockchain/', // ajuste aqui com o RPC correto
    },
    paymaster: paymasterUrl,
  })

  return smartAccount
}
