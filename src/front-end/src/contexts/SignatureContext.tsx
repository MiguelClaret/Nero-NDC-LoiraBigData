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
  const [eoaForInitAddress, setEoaForInitAddress] = useState<string | null>(null); // Added state for EOA address

  // Get EOA signer from wagmi if no main app signer is available
  const ethersSignerHookResult = useEthersSigner();
  const eoaSigner = ethersSignerHookResult?.signer; // Safely access signer

  // Prioritize signer from WalletInfoContext (main application)
  const activeSignerFromWalletInfo = walletInfoContextValue?.signer;
  const eoaSignerFromWalletInfo = walletInfoContextValue?.eoaSigner; // Get EOA signer if available from WalletInfo
  const mainAppAddress = walletInfoContextValue?.address; // This could be AA or EOA from main app
  const mainAppEoaAddress = walletInfoContextValue?.eoaAddress; // Specifically EOA from main app

  const eoaSignerForInitialization = eoaSignerFromWalletInfo || eoaSigner;

  // Effect to derive and store the address of the EOA signer for initialization
  useEffect(() => {
    const getAddr = async () => {
      if (eoaSignerForInitialization) {
        try {
          const addr = await eoaSignerForInitialization.getAddress();
          setEoaForInitAddress(addr);
          console.log('[SignatureContext] Derived eoaForInitAddress:', addr);
        } catch (err) {
          console.error("[SignatureContext] Error getting address from eoaSignerForInitialization", err);
          setEoaForInitAddress(null);
        }
      } else {
        setEoaForInitAddress(null);
        console.log('[SignatureContext] eoaSignerForInitialization is null, clearing eoaForInitAddress.');
      }
    };
    getAddr();
  }, [eoaSignerForInitialization]);

  const initSimpleAccount = useCallback(async () => {
    if (loading) {
      console.warn('[SignatureContext] initSimpleAccount called while already loading. Aborting.');
      return;
    }
    setError(null);

    if (!eoaSignerForInitialization || !eoaForInitAddress) { // Check both signer object and its derived address
      console.warn('[SignatureContext] No EOA signer or its address available to initialize SimpleAccount.', { hasSigner: !!eoaSignerForInitialization, hasAddress: !!eoaForInitAddress });
      setIsConnected(false); // Ensure disconnected state if prerequisite is missing
      // setAAaddress('0x'); // Reset AA address if signer is lost
      // setSimpleAccountInstance(null);
      return;
    }
    if (!rpcUrl || !bundlerUrl || !entryPoint || !accountFactory) {
      console.error(
        '[SignatureContext] Missing crucial config for SimpleAccount init:',
        { rpcUrl, bundlerUrl, entryPoint, accountFactory },
      );
      setError('Missing configuration for smart account initialization.');
      setIsConnected(false);
      return;
    }

    console.log('[SignatureContext] Attempting to initialize SimpleAccount with EOA address:', eoaForInitAddress, 'and config:', { rpcUrl, bundlerUrl, entryPoint, accountFactory, projectId });
    setLoading(true);

    try {
      const instance = await SimpleAccount.init(eoaSignerForInitialization, rpcUrl, {
        entryPoint,
        factory: accountFactory,
        overrideBundlerRpc: bundlerUrl,
      });
      console.log('[SignatureContext] SimpleAccount instance created:', instance);
      setSimpleAccountInstance(instance);
      const senderAddress = await instance.getSender();
      console.log('[SignatureContext] SimpleAccount sender address (AAaddress):', senderAddress);
      setAAaddress(senderAddress);
      setIsConnected(true); // AA is connected
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error('[SignatureContext] Error initializing SimpleAccount:', e);
      setError(`Error initializing SimpleAccount: ${e.message}`);
      setAAaddress('0x');
      setSimpleAccountInstance(null);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [
    eoaSignerForInitialization,
    eoaForInitAddress, // Added derived address to dependency
    rpcUrl,
    bundlerUrl,
    entryPoint,
    accountFactory,
    projectId, // Though not directly used in init, it's part of config context logic
    loading, // Added loading state to prevent re-entrancy
    // mainAppAddress and mainAppEoaAddress were in old deps but not used directly in logic, removed for simplicity unless a clear need is found
  ]);

  useEffect(() => {
    // Log context values on mount and when they change (can be noisy, use for debugging)
    // console.log('[SignatureContext] useEffect: WalletInfoContext value:', walletInfoContextValue);
    // console.log('[SignatureContext] useEffect: ConfigContext value:', configContextValue);
    // console.log('[SignatureContext] useEffect: eoaForInitAddress:', eoaForInitAddress);

    const M_canInitialize = eoaForInitAddress && rpcUrl && bundlerUrl && entryPoint && accountFactory;

    if (M_canInitialize) {
      if ((!AAaddress || AAaddress === '0x') && !loading) {
        console.log('[SignatureContext] Main useEffect: Dependencies met, AA not yet initialized, not loading. Calling initSimpleAccount.');
        initSimpleAccount();
      } else if (loading) {
        console.log('[SignatureContext] Main useEffect: Dependencies met, but currently loading.');
      } else if (AAaddress && AAaddress !== '0x') {
        console.log('[SignatureContext] Main useEffect: Dependencies met, AAaddress already exists:', AAaddress);
        // Optional: Could add a check here if eoaForInitAddress has changed from the one that initialized current AAaddress
        // This would handle cases where the EOA changes and AA needs re-init, but be careful of loops.
        // For now, if AA is initialized, we assume it's for the current valid EOA.
      }
    } else {
      console.warn('[SignatureContext] Main useEffect: Conditions not met for initSimpleAccount. Current state:', {
        eoaForInitAddress: !!eoaForInitAddress,
        rpcUrl: !!rpcUrl,
        bundlerUrl: !!bundlerUrl,
        entryPoint: !!entryPoint,
        accountFactory: !!accountFactory,
        isLoading: loading,
        currentAA: AAaddress
      });
      // If conditions to initialize are not met, and we are not loading, reset AA state.
      // This handles cases like EOA disconnecting.
      if (!loading) {
        setAAaddress('0x');
        setSimpleAccountInstance(null);
        // setIsConnected(false); // This will be handled by the isConnected useEffect below
        if (error === null && !eoaForInitAddress && (walletInfoContextValue?.eoaSigner || eoaSigner)) {
          // If there was an EOA signer but we couldn't get its address, or it disappeared.
          setError('EOA signer present but its address could not be determined or is missing.');
        } else if (error === null && (!rpcUrl || !bundlerUrl || !entryPoint || !accountFactory)) {
          setError('Essential configuration for smart account is missing.');
        }
      }
    }
  }, [
    eoaForInitAddress,
    rpcUrl,
    bundlerUrl,
    entryPoint,
    accountFactory,
    initSimpleAccount, // useCallback, stable if its own deps are stable
    AAaddress,         // To check if already initialized
    loading,           // To avoid calling initSimpleAccount if already in progress
    // walletInfoContextValue and configContextValue are not directly in deps,
    // their relevant parts (rpcUrl, eoaSignerForInitialization->eoaForInitAddress) are.
    // eoaSigner is also not direct, eoaSignerForInitialization -> eoaForInitAddress is used.
    error // Added error to potentially clear it if conditions become valid
  ]);

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
  useEffect(() => {
    const wagmiEoaIsConnected = walletInfoContextValue?.address &&
                             walletInfoContextValue?.eoaAddress === walletInfoContextValue?.address &&
                             !!walletInfoContextValue?.eoaSigner; // Check for actual signer too

    if (AAaddress && AAaddress !== '0x' && simpleAccountInstance) {
      setIsConnected(true);
      console.log("[SignatureContext] Overall connected: AA initialized (Address:", AAaddress, ")");
    } else if (wagmiEoaIsConnected) {
      setIsConnected(true);
      console.log("[SignatureContext] Overall connected: EOA connected via WalletInfoContext (Address:", walletInfoContextValue.address, ")");
    } else {
      setIsConnected(false);
      console.log("[SignatureContext] Overall disconnected: No AA and no EOA from WalletInfoContext. Current AA:", AAaddress, "Wagmi EOA Address:", walletInfoContextValue?.address);
    }
  }, [AAaddress, simpleAccountInstance, walletInfoContextValue]);


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
