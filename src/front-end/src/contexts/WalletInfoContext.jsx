import React, { createContext, useContext } from 'react';

// Create the context with a default value (null or an empty object)
const WalletInfoContext = createContext(null);

// Create a custom hook to use the WalletInfoContext
export const useWalletInfo = () => {
  const context = useContext(WalletInfoContext);
  if (context === undefined) {
    // This error means you tried to use the context outside of its provider
    // Usually, this means wrapping your App component or relevant part with WalletInfoProvider
    // Since App.jsx will wrap everything, this check might be overly cautious but good practice.
    // console.warn("useWalletInfo must be used within a WalletInfoProvider");
    // Returning null might be preferable to throwing an error in some cases.
    return null;
  }
  return context;
};

// Create the Provider component
export const WalletInfoProvider = ({ children, value }) => {
  return (
    <WalletInfoContext.Provider value={value}>
      {children}
    </WalletInfoContext.Provider>
  );
};

// Export the context itself if needed elsewhere, though the hook is preferred
export default WalletInfoContext; 