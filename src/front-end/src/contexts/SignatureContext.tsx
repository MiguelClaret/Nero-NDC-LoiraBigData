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
  const eoaSigner = ethersSignerHookResult?.signer; // Safely access signer

  // Prioritize signer from WalletInfoContext (main application)
  const activeSignerFromWalletInfo = walletInfoContextValue?.signer;
  const eoaSignerFromWalletInfo = walletInfoContextValue?.eoaSigner; // Get EOA signer if available from WalletInfo
  const mainAppAddress = walletInfoContextValue?.address; // This could be AA or EOA from main app
  const mainAppEoaAddress = walletInfoContextValue?.eoaAddress; // Specifically EOA from main app

  // Determine the EOA signer to be used for initializing SimpleAccount
  // This should be the EOA that owns/will own the SimpleAccount
  const eoaSignerForInitialization = eoaSignerFromWalletInfo || eoaSigner;

  const initSimpleAccount = useCallback(async () => {
    setError(null)
    if (!eoaSignerForInitialization) {
      console.warn('[SignatureContext] No EOA signer available (from WalletInfo or local hook) to initialize SimpleAccount.')
      setIsConnected(false)
      return
    }
    if (!rpcUrl || !bundlerUrl || !entryPoint || !accountFactory) {
      console.error(
        '[SignatureContext] Missing crucial config for SimpleAccount init:',
        {
          rpcUrl,
          bundlerUrl,
          entryPoint,
          accountFactory,
        },
      )
      setError('Missing configuration for smart account initialization.')
      setIsConnected(false)
      return
    }

    console.log('[SignatureContext] Initializing SimpleAccount with EOA signer:', {
      eoaSignerForInit: eoaSignerForInitialization ? 'present' : 'absent',
      mainAppAddress,
      mainAppEoaAddress,
      rpcUrl,
      bundlerUrl,
      entryPoint,
      accountFactory,
      projectId,
    });

    // ---- START DEBUG LOGS ----
    if (eoaSignerForInitialization) {
      console.log('[SignatureContext] typeof eoaSignerForInitialization:', typeof eoaSignerForInitialization);
      console.log('[SignatureContext] eoaSignerForInitialization object:', eoaSignerForInitialization);
      console.log('[SignatureContext] eoaSignerForInitialization.getAddress type:', typeof eoaSignerForInitialization.getAddress);
      console.log('[SignatureContext] eoaSignerForInitialization._isSigner:', eoaSignerForInitialization._isSigner);
      if (eoaSignerFromWalletInfo === eoaSignerForInitialization) {
        console.log('[SignatureContext] eoaSignerForInitialization came from WalletInfoContext.eoaSigner');
      } else if (eoaSigner === eoaSignerForInitialization) {
        console.log('[SignatureContext] eoaSignerForInitialization came from local eoaSigner hook');
      }
    } else {
      console.warn('[SignatureContext] eoaSignerForInitialization is NOT present for SimpleAccount.init');
    }
    // ---- END DEBUG LOGS ----

    setLoading(true)
    try {
      const instance = await SimpleAccount.init(eoaSignerForInitialization, rpcUrl, {
        entryPoint,
        factory: accountFactory,
        overrideBundlerRpc: bundlerUrl,
        // salt: '0x123', // Optional salt
      })
      console.log('[SignatureContext] SimpleAccount instance created:', instance)
      setSimpleAccountInstance(instance)
      const senderAddress = await instance.getSender()
      console.log('[SignatureContext] SimpleAccount sender address (AAaddress):', senderAddress)
      setAAaddress(senderAddress)
      setIsConnected(true)
    } catch (e: any) {
      console.error('[SignatureContext] Error initializing SimpleAccount:', e)
      setError(`Error initializing SimpleAccount: ${e.message}`)
      setAAaddress('0x')
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [eoaSignerForInitialization, rpcUrl, bundlerUrl, entryPoint, accountFactory, projectId, mainAppAddress, mainAppEoaAddress])

  useEffect(() => {
    // Log context values on mount and when they change
    console.log('[SignatureContext] useEffect: WalletInfoContext value:', walletInfoContextValue);
    console.log('[SignatureContext] useEffect: ConfigContext value:', configContextValue);
    console.log('[SignatureContext] useEffect: eoaSignerForInitialization:', eoaSignerForInitialization ? 'present' : 'absent');
    console.log('[SignatureContext] useEffect: EOA signer from useEthersSigner():', eoaSigner ? 'present' : 'absent');

    if (eoaSignerForInitialization && rpcUrl && bundlerUrl && entryPoint && accountFactory) {
      console.log('[SignatureContext] useEffect: Dependencies met, calling initSimpleAccount.')
      initSimpleAccount()
    } else {
      console.warn('[SignatureContext] useEffect: Conditions not met for initSimpleAccount. Checking signer sources:', {
        walletInfoContextEoaSigner: walletInfoContextValue?.eoaSigner ? 'present' : 'absent',
        eoaSignerFromHook: eoaSigner ? 'present' : 'absent',
      });
      console.warn('[SignatureContext] useEffect: Detailed conditions:', {
        eoaSignerForInit: !!eoaSignerForInitialization,
        rpcUrl: !!rpcUrl,
        bundlerUrl: !!bundlerUrl,
        entryPoint: !!entryPoint,
        accountFactory: !!accountFactory,
      });
      setAAaddress('0x') // Reset if conditions are not met
      setSimpleAccountInstance(null)
      setIsConnected(false)
    }
  }, [initSimpleAccount, eoaSignerForInitialization, rpcUrl, bundlerUrl, entryPoint, accountFactory, walletInfoContextValue, configContextValue, eoaSigner])

  const signMessage = useCallback(
    async (message: string | Uint8Array) => {
      if (!simpleAccountInstance) {
        console.error('[SignatureContext] signMessage error: SimpleAccount not initialized.')
        throw new Error('SimpleAccount not initialized')
      }
      if (!rpcUrl || !bundlerUrl || !entryPoint || !accountFactory) {
        console.error(
          '[SignatureContext] signMessage skipped: Required config values (rpcUrl, bundlerUrl, entryPoint, accountFactory) are missing or not yet available from ConfigContext. Current config from context: ',
          configContextValue
        )
        throw new Error('Configuration for smart account is not available.')
      }
      return simpleAccountInstance.signMessage(message)
    },
    [simpleAccountInstance, rpcUrl, bundlerUrl, entryPoint, accountFactory, configContextValue],
  )

  // Determine overall connectedness for the overlay
  // This could mean either EOA from RainbowKit is connected, or our AA is initialized
  useEffect(() => {
    // Reflect RainbowKit's EOA connection status if no AA address is yet derived.
    // Or if an AA address IS derived, that means we are 'connected' in the AA sense.
    const wagmiConnected = walletInfoContextValue?.address && walletInfoContextValue?.eoaAddress === walletInfoContextValue?.address;
    if (AAaddress && AAaddress !== '0x') {
      setIsConnected(true);
      console.log("[SignatureContext] Overall connected: AA Address available (", AAaddress, ")");
    } else if (wagmiConnected) {
      // If main app has a simple EOA connected via RainbowKit, reflect that. Overlay might just show EOA.
      setIsConnected(true);
      console.log("[SignatureContext] Overall connected: EOA connected via WalletInfoContext (", walletInfoContextValue.address, ")");
    } else {
      setIsConnected(false);
      console.log("[SignatureContext] Overall disconnected: No AA address and no EOA from WalletInfoContext.");
    }
  }, [AAaddress, walletInfoContextValue]);


  return (
    <SignatureContext.Provider
      value={{
        loading,
        AAaddress,
        simpleAccountInstance,
        signMessage,
        error,
        isConnected,
        initSimpleAccount, // Expose init function if needed externally
      }}
    >
      {children}
    </SignatureContext.Provider>
  )
}
