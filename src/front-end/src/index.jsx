import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './wagmiConfig'; // Assuming wagmiConfig.js is in the same directory

// Import RainbowKit styles AFTER your own global styles (index.css)
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* You might need additional context providers here for AA state management */}
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);

