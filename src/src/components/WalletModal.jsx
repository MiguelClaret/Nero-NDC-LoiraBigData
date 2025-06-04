import React, { useEffect } from 'react';
// Importação direta dos ícones
import metamaskIcon from '../assets/metamask.svg';
import walletConnectIcon from '../assets/walletconnect.svg';
import coinbaseIcon from '../assets/coinbase.svg';

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
    
    // Desabilitar o scroll quando o modal estiver aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      // Restaurar o scroll quando o modal for fechado
      document.body.style.overflow = 'auto';
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
    { icon: metamaskIcon, name: 'MetaMask' },
    { icon: walletConnectIcon, name: 'WalletConnect' },
    { icon: coinbaseIcon, name: 'Coinbase Wallet' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-auto my-auto overflow-hidden animate-fadeIn"
        style={{
          animation: 'fadeIn 0.3s ease-out',
          maxHeight: '90vh', // Limita a altura máxima em telas pequenas
          position: 'relative', // Garante que o modal fique posicionado corretamente
        }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold m-0">Connect Wallet</h3>
          <button
            className="bg-transparent border-none text-xl text-gray-500 p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
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