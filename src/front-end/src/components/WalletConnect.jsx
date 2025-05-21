import React, { useContext } from "react";
import { WalletInfoContext } from "../contexts/WalletInfoContext";

const WalletConnect = () => {
  const walletInfo = useContext(WalletInfoContext);

  const eoa = walletInfo?.eoaAddress || walletInfo?.address;
  const aa = walletInfo?.isSmartAccount ? walletInfo?.address : walletInfo?.aaWalletAddress;
  const isConnected = !!walletInfo?.address;

  const handleLogout = walletInfo?.logout;

  const handleConnectClick = () => {
    console.log("Connect button clicked - App should open WalletModal.");
  };

  return (
    <div className="p-4">
      {!isConnected ? (
        <button onClick={handleConnectClick} className="bg-blue-600 text-white px-4 py-2 rounded">
          Conectar Wallet
        </button>
      ) : (
        <>
          <div className="mt-4 text-sm">
            {eoa && <p><strong>EOA:</strong> {eoa}</p>}
            {aa && <p><strong>AA Wallet:</strong> {aa}</p>}
          </div>
          {handleLogout && (
            <button onClick={handleLogout} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">
              Desconectar
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default WalletConnect;
