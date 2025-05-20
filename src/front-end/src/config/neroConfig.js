import abiAgri from '../abi/abiAgri.json';
import abiHarvest from '../abi/abiHarvest.json';
import abiNft from '../abi/abiNft.json';
import abiTco2 from '../abi/abiTco2.json';

export const NERO_CHAIN_CONFIG = {
    chainId: 689,
    rpcUrl: "https://rpc-testnet.nerochain.io",
    chainName: "NERO Testnet",
    explorer: "https://testnet.neroscan.io",
    currency: "NERO",
  };

export const CONTRACT_ADDRESSES = {
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  accountFactory: "0x9406Cc6185a346906296840746125a0E44976454",
  harvestManager: {
    address: '0xEe67dd5D4291ed74279C0BC1Fa52386aA3834dba',
    abi: abiHarvest
  },
  tco2Token: {
    address: '0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3',
    abi: abiTco2
  },
  nftCombo: {
    address: '0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d',
    abi: abiNft
  },
  agriFinance: {
    address: '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99',
    abi: abiAgri
  },
  paymasterRpc: "https://paymaster-testnet.nerochain.io",
  bundlerRpc: "https://bundler.service.nerochain.io"
};

  
  export const AA_PLATFORM_CONFIG = {
    bundlerRpc: "https://bundler.service.nerochain.io",
    paymasterRpc: "https://paymaster-testnet.nerochain.io",
    apiKey: import.meta.env.VITE_PAYMASTER_API_KEY, // Vite-style .env
  };

  console.log("🔑 API Key carregada:", import.meta.env.VITE_PAYMASTER_API_KEY);