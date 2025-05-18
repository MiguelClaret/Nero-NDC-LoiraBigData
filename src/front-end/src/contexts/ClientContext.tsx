import React, { createContext, useState, useEffect } from 'react'
import { Client } from 'userop'
import { useConfig } from '@/hooks'
import { ProviderProps } from '@/types'
import { AA_PLATFORM_CONFIG } from '@/config/neroConfig'

export const ClientContext = createContext<Client | null>(null)

export const ClientProvider: React.FC<ProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null)
  const { rpcUrl, bundlerUrl, entryPoint } = useConfig()
  const paymasterRpcUrl = AA_PLATFORM_CONFIG.paymasterRpc

  useEffect(() => {
    const initClient = async () => {
      try {
        console.log('Initializing userop Client with:')
        console.log('  RPC URL:', rpcUrl)
        console.log('  Bundler URL:', bundlerUrl)
        console.log('  EntryPoint:', entryPoint)
        console.log('  Paymaster RPC:', paymasterRpcUrl)

        const clientInstance = await Client.init(rpcUrl, {
          entryPoint,
          overrideBundlerRpc: bundlerUrl,
          paymasterRpc: paymasterRpcUrl,
        })
        setClient(clientInstance)
        console.log('Userop Client initialized successfully.')
      } catch (error) {
        console.error('Failed to initialize userop client:', error)
      }
    }
    if (rpcUrl && bundlerUrl && entryPoint && paymasterRpcUrl) {
      initClient()
    } else {
      console.warn('Client initialization skipped: Missing required config values.')
    }
  }, [entryPoint, rpcUrl, bundlerUrl, paymasterRpcUrl])

  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
}
