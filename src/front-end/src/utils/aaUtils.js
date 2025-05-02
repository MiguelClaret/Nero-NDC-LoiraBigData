// aaUtils.js
// Esta função retorna o signer da carteira EOA (MetaMask) conectada no navegador
// Ele será usado para derivar a carteira abstrata (SimpleAccount) usada nas UserOperations

import { ethers } from 'ethers';

export const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask não encontrada. Instale e conecte sua carteira.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Solicita acesso à conta do usuário
  return provider.getSigner(); // Retorna o signer da EOA
};
