// components/ApiStatusBadge.jsx

import { useState, useEffect } from 'react';
import { AlertCircle, Check, RefreshCw } from 'lucide-react';
import { checkApiStatus } from '../services/NeroConverter';

/**
 * Componente que exibe o status da API de taxas de conversão
 * Útil para debugging e monitoramento
 */
const ApiStatusBadge = () => {
  const [status, setStatus] = useState({
    working: false,
    source: 'Loading',
    message: 'Checking API status...'
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const result = await checkApiStatus();
      setStatus(result);
    } catch (error) {
      setStatus({
        working: false,
        source: 'Error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Verificar status da API a cada 30 minutos
    const interval = setInterval(checkStatus, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Determinar cores com base no status
  const getBadgeColors = () => {
    if (isLoading) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (status.working) return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <div className={`flex items-center space-x-1 py-1 px-2 rounded-full text-xs border ${getBadgeColors()}`}>
      {isLoading ? (
        <RefreshCw className="h-3 w-3 animate-spin" />
      ) : status.working ? (
        <Check className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      <span>{status.source}</span>
      <button 
        onClick={checkStatus} 
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
        disabled={isLoading}
        title="Refresh API status"
      >
        <RefreshCw className="h-2.5 w-2.5" />
      </button>
    </div>
  );
};

export default ApiStatusBadge;