import React, { useEffect } from 'react';
import metamask from '../assets/metamask.svg';
import walletConnect from '../assets/walletconnect.svg';
import coinbase from '../assets/coinbase.svg';



const WalletOption = ({ icon, name, onClick }) => {
  return (
    <button
      className="w-full py-3 px-4 mb-4 border border-gray-200 rounded-md bg-white flex items-center gap-4 hover:border-green-700 hover:-translate-y-0.5 transition-all"
      onClick={onClick}
    >
      <img src={icon} alt={name} className="h-8" />
      <span>{name}</span>
    </button>
  );
};

const WalletModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const walletOptions = [
    { icon: metamask, name: 'MetaMask' },
    { icon: walletConnect, name: 'WalletConnect' },
    { icon: coinbase, name: 'Coinbase Wallet' }
  ];

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[2000]"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md overflow-hidden animate-fadeIn"
        style={{
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold m-0">Connect Wallet</h3>
          <button
            className="bg-transparent border-none text-xl text-gray-500"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6">
          {walletOptions.map((wallet, index) => (
            <WalletOption
              key={index}
              icon={wallet.icon}
              name={wallet.name}
              onClick={() => console.log(`Connecting to ${wallet.name}...`)}
            />
          ))}
          <div className="mt-8 p-6 bg-gray-100 rounded-md text-center">
            <h4 className="text-lg font-bold mb-2">New to crypto?</h4>
            <p className="text-sm mb-4">
              Create a free Smart Account, without gas fees
            </p>
            <button className="w-full py-3 px-4 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
              Create Smart Account <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;