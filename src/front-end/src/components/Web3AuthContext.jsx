import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto
const Web3AuthContext = createContext();

// Provider do contexto
export const Web3AuthProvider = ({ children }) => {
  const [web3authProvider, setWeb3authProvider] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para atualizar o provider e endereço
  const login = async (provider, address) => {
    setWeb3authProvider(provider);
    setUserAddress(address);
    setIsLoggedIn(!!provider && !!address);
  };

  // Função para logout
  const logout = () => {
    setWeb3authProvider(null);
    setUserAddress(null);
    setIsLoggedIn(false);
  };

  // Exemplo: restaurar login do localStorage (opcional)
  useEffect(() => {
    // Aqui você pode restaurar o login se salvar no localStorage
  }, []);

  return (
    <Web3AuthContext.Provider value={{ web3authProvider, userAddress, isLoggedIn, login, logout }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useWeb3Auth = () => useContext(Web3AuthContext); 