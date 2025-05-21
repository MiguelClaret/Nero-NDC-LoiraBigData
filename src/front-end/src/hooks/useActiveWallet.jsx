import { useWalletInfo } from '../contexts/WalletInfoContext';

/**
 * Hook to get the currently active wallet information (address, type, etc.)
 * regardless of whether it's an EOA (Metamask/Wagmi) or Smart Account (Web3Auth).
 */
export const useActiveWallet = () => {
  const walletInfo = useWalletInfo();

  // Return the whole walletInfo object, or specific parts as needed
  // For example, just the address:
  // return { activeAddress: walletInfo?.address }; 
  
  // Returning the whole object gives components more flexibility
  return walletInfo; 
};

// If you want to keep the name useSignature but use the new context:
// export const useSignature = useActiveWallet; 