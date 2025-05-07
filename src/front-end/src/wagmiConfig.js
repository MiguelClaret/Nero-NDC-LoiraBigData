import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; // Example chains, replace/add Nerochain
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Define Nerochain Testnet configuration
const neroTestnet = {
  id: 689,
  name: 'Nerochain Testnet',
  nativeCurrency: { name: 'NERO', symbol: 'NERO', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc-testnet.nerochain.io'] },
  },
  blockExplorers: {
    default: { name: 'NeroScan', url: 'https://testnet.neroscan.com' }, // Verify explorer URL
  },
  testnet: true,
};

// Get WalletConnect Project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.error('Error: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined in environment variables.');
  // Optionally throw an error or provide a default, but logging is safer for build processes
  // throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined');
}

// Configure RainbowKit/Wagmi
export const wagmiConfig = getDefaultConfig({
  appName: 'SeedSafe',
  projectId: projectId || 'DEFAULT_PROJECT_ID', // Provide a fallback or handle error
  chains: [neroTestnet, /* Add other chains if needed, e.g., mainnet, sepolia */],
  ssr: false, // Set to true if using Server-Side Rendering
  // Transports can be configured per chain if needed
  // transports: {
  //   [neroTestnet.id]: http(),
  // },
});

// Note: Web3Auth integration will be handled separately, potentially using
// a custom connector or by initializing Web3Auth and then creating a Wagmi compatible provider/signer.

