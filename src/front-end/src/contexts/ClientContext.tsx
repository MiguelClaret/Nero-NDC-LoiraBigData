import React, { createContext, useState, useEffect, useContext } from 'react'
import { Client } from 'userop'
import { ConfigContext } from './ConfigContext'
import { ProviderProps } from '@/types'
import { AA_PLATFORM_CONFIG } from '@/config/neroConfig'

export const ClientContext = createContext<Client | null>(null)

export const ClientProvider: React.FC<ProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null)
  const configContextValue = useContext(ConfigContext)

  const rpcUrl = configContextValue?.rpcUrl
  const bundlerUrl = configContextValue?.bundlerUrl
  const entryPoint = configContextValue?.entryPoint
  const paymasterRpcUrl = AA_PLATFORM_CONFIG.paymasterRpc

  useEffect(() => {
    let isMounted = true;

    const initClient = async () => {
      if (!rpcUrl || !bundlerUrl || !entryPoint || !paymasterRpcUrl) {
        console.warn('Client initialization skipped: Missing config values');
        return;
      }

      try {
        console.log('Initializing userop Client...');
        const clientInstance = await Client.init(rpcUrl, {
          entryPoint,
          overrideBundlerRpc: bundlerUrl,
        });
        
        if (isMounted) {
          setClient(clientInstance);
          console.log('Userop Client initialized successfully.');
        }
      } catch (error) {
        console.error('Failed to initialize userop client:', error);
      }
    };

    initClient();

    return () => {
      isMounted = false;
    };
  }, [configContextValue, rpcUrl, bundlerUrl, entryPoint, paymasterRpcUrl]);

  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
}
