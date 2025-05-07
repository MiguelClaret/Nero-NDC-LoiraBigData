import React, { useEffect } from 'react';

const TransactionPopup = ({ isVisible, transactionHash, onClose }) => {
  // Adicione um efeito para logging quando o componente receber props
  useEffect(() => {
    if (isVisible) {
      console.log("TransactionPopup está visível agora");
      console.log("Hash da transação:", transactionHash);
    }
  }, [isVisible, transactionHash]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md mx-4 transform transition-all"
        style={{ 
          animation: 'scale-in 0.3s ease-out forwards',
        }}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          Transaction Completed
        </h3>
        
        <p className="text-gray-600 text-center mb-3">
          Your transaction was processed successfully.
        </p>
        
        {transactionHash && (
          <p className="text-xs text-gray-500 text-center mb-4 break-all bg-gray-100 p-2 rounded">
            Hash: {transactionHash}
          </p>
        )}
        
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
      
      {/* Adicione este estilo para a animação */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionPopup;