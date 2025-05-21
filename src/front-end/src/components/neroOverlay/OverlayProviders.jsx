import React from 'react';
import { 
  ConfigProvider, 
  ScreenManagerProvider, 
  SignatureProvider, 
  PaymasterProvider, 
  TokenProvider, 
  NFTProvider, 
  SendProvider, 
  MultiSendProvider, 
  SendUserOpProvider, 
  TransactionProvider, 
  ClientProvider, 
  WrapWagmiProvider 
} from '@/contexts';
import { NERO_CHAIN_CONFIG, CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from '@/config/neroConfig';

const config = {
  chains: [
    {
      chain: {
        name: NERO_CHAIN_CONFIG.chainName,
        chainId: NERO_CHAIN_CONFIG.chainId,
        rpc: NERO_CHAIN_CONFIG.rpcUrl,
        explorer: NERO_CHAIN_CONFIG.explorer,
        networkType: 'testnet',
        nativeToken: {
          decimals: 18,
          name: NERO_CHAIN_CONFIG.currency,
          symbol: NERO_CHAIN_CONFIG.currency,
        },
      },
      aa: AA_PLATFORM_CONFIG,
      aaContracts: CONTRACT_ADDRESSES,
      web3auth: {
        clientId: '',
        uiConfig: { appName: 'Nero Wallet' },
        loginConfig: {},
      },
    },
  ],
  rainbowKitProjectId: 'b1bc4993b2d7bdd859d12757a0a282a3',
  walletName: 'NERO Wallet',
  walletLogo: '',
  iconBackground: '',
  contactAs: '',
  PrivacyPolicy: '',
  ServiceTerms: '',
};

export default function OverlayProviders({ children }) {
  return (
    <ConfigProvider config={config}>
      <WrapWagmiProvider>
        <ClientProvider>
          <ScreenManagerProvider>
            <SignatureProvider>
              <PaymasterProvider>
                <TokenProvider>
                  <NFTProvider>
                    <SendProvider>
                      <MultiSendProvider>
                        <SendUserOpProvider>
                          <TransactionProvider>
                            {children}
                          </TransactionProvider>
                        </SendUserOpProvider>
                      </MultiSendProvider>
                    </SendProvider>
                  </NFTProvider>
                </TokenProvider>
              </PaymasterProvider>
            </SignatureProvider>
          </ScreenManagerProvider>
        </ClientProvider>
      </WrapWagmiProvider>
    </ConfigProvider>
  );
} 