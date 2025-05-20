import React, { createContext, useCallback, useEffect, useState, useContext } from 'react'
import { useAccount } from 'wagmi'
import { getPaymaster } from '@/helper/getPaymaster'
import { SimpleAccount } from '@/helper/simpleAccount'
import { useEthersSigner } from '@/hooks'
import { ConfigContext } from './ConfigContext'
import WalletInfoContext from './WalletInfoContext'
import { SignatureContextProps, ProviderProps } from '@/types'

export const SignatureContext = createContext<SignatureContextProps | undefined>(undefined)

export const SignatureProvider: React.FC<ProviderProps> = ({ children }) => {
  const configContextValue = useContext(ConfigContext)
  const walletInfoContextValue = useContext(WalletInfoContext)

  if (!configContextValue) {
    throw new Error('SignatureProvider must be used within a ConfigProvider. Make sure ConfigProvider is an ancestor.')
  }
  const { rpcUrl, bundlerUrl, entryPoint, accountFactory, projectId } = configContextValue

  const [loading, setLoading] = useState(false)
  const [AAaddress, setAAaddress] = useState<string>('0x')
  const [simpleAccountInstance, setSimpleAccountInstance] = useState<SimpleAccount | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  // Get EOA signer from wagmi if no main app signer is available
  const ethersSignerHookResult = useEthersSigner();
  const eoaSigner = ethersSignerHookResult?.signer;

  // Prioritize signer from WalletInfoContext (main application)
  const activeSigner = walletInfoContextValue?.signer || eoaSigner;
  const mainAppAddress = walletInfoContextValue?.address;
  const mainAppEoaAddress = walletInfoContextValue?.eoaAddress;

  const initSimpleAccount = useCallback(async () => {
    setError(null)
    if (!activeSigner) {
      console.warn('[SignatureContext] No active signer available to initialize SimpleAccount.')
      setIsConnected(false)
      return
    }
    if (!rpcUrl || !bundlerUrl || !entryPoint || !accountFactory) {
      console.error(
        '[SignatureContext] Missing crucial config for SimpleAccount init:',
        { rpcUrl, bundlerUrl, entryPoint, accountFactory }
      )
      setError('Missing configuration for smart account initialization.')
      setIsConnected(false)
      return
    }

    setLoading(true)
    try {
      const instance = await SimpleAccount.init(activeSigner, rpcUrl, {
        entryPoint,
        factory: accountFactory,
        overrideBundlerRpc: bundlerUrl,
      })
      setSimpleAccountInstance(instance)
      const senderAddress = await instance.getSender()
      setAAaddress(senderAddress)
      setIsConnected(true)
      console.log('[SignatureContext] SimpleAccount initialized successfully:', senderAddress)
    } catch (e: any) {
      console.error('[SignatureContext] Error initializing SimpleAccount:', e)
      setError(`Error initializing SimpleAccount: ${e.message}`)
      setAAaddress('0x')
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [activeSigner, rpcUrl, bundlerUrl, entryPoint, accountFactory])

  // Efeito unificado para inicialização e status de conexão
  useEffect(() => {
    if (!configContextValue || !walletInfoContextValue) {
      console.warn('[SignatureContext] Missing required contexts');
      return;
    }

    const wagmiConnected = walletInfoContextValue?.address && 
                          walletInfoContextValue?.eoaAddress === walletInfoContextValue?.address;

    if (activeSigner && rpcUrl && bundlerUrl && entryPoint && accountFactory) {
      initSimpleAccount();
    } else if (wagmiConnected) {
      setIsConnected(true);
      console.log("[SignatureContext] Connected via EOA:", walletInfoContextValue.address);
    } else {
      setAAaddress('0x');
      setSimpleAccountInstance(null);
      setIsConnected(false);
      console.log("[SignatureContext] Disconnected");
    }
  }, [initSimpleAccount, activeSigner, rpcUrl, bundlerUrl, entryPoint, accountFactory, walletInfoContextValue]);

  const signMessage = useCallback(
    async (message: string | Uint8Array) => {
      if (!simpleAccountInstance) {
        throw new Error('SimpleAccount not initialized')
      }
      if (!rpcUrl || !bundlerUrl || !entryPoint || !accountFactory) {
        throw new Error('Configuration for smart account is not available.')
      }
      return simpleAccountInstance.signMessage(message)
    },
    [simpleAccountInstance, rpcUrl, bundlerUrl, entryPoint, accountFactory]
  )

  return (
    <SignatureContext.Provider
      value={{
        loading,
        AAaddress,
        simpleAccountInstance,
        signMessage,
        error,
        isConnected,
        initSimpleAccount,
      }}
    >
      {children}
    </SignatureContext.Provider>
  )
}
