import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // vite config
    define: {
      // Make env variables available in the client-side code 
      // Important: Ensure sensitive keys are not exposed this way
      // For this project, NEXT_PUBLIC_ prefixes are used similar to Next.js convention
      'process.env.NEXT_PUBLIC_RPC_URL': JSON.stringify(env.NEXT_PUBLIC_RPC_URL),
      'process.env.NEXT_PUBLIC_CHAIN_ID': JSON.stringify(env.NEXT_PUBLIC_CHAIN_ID),
      'process.env.NEXT_PUBLIC_BUNDLER_URL': JSON.stringify(env.NEXT_PUBLIC_BUNDLER_URL),
      'process.env.NEXT_PUBLIC_PAYMASTER_URL': JSON.stringify(env.NEXT_PUBLIC_PAYMASTER_URL),
      'process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS': JSON.stringify(env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS),
      'process.env.NEXT_PUBLIC_SIMPLE_ACCOUNT_FACTORY_ADDRESS': JSON.stringify(env.NEXT_PUBLIC_SIMPLE_ACCOUNT_FACTORY_ADDRESS),
      'process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID': JSON.stringify(env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID),
      'process.env.NEXT_PUBLIC_PAYMASTER_API_KEY': JSON.stringify(env.NEXT_PUBLIC_PAYMASTER_API_KEY),
      'process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID': JSON.stringify(env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID),
      // Define global for Buffer polyfill
      'global': 'globalThis',
    },
    plugins: [
      react(),
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        // Useful if they conflict with other dependencies.
        exclude: [],
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    resolve: {
      alias: {
        // Add alias for Buffer if needed, though nodePolyfills should handle it
        // 'buffer': 'buffer/', 
        // Alias to resolve @/ paths like in the nero-aa-wallet example
        '@/': '/src/' 
      }
    }
  }
});

