// src/pages/UserOpTestPage.jsx
import React, { useState } from 'react';
import { getSigner } from '../utils/aaUtils';
import { registerHarvestUserOp, buyHarvestUserOp } from '../utils/userOpUtils';
import { ethers } from 'ethers';

const UserOpTestPage = () => {
  const [txHashRegister, setTxHashRegister] = useState(null);
  const [txHashBuy, setTxHashBuy] = useState(null);
  const [loading, setLoading] = useState(false);

  // Atualize com o endereço do seu contrato HarvestManager
  const contractAddress = "0x0fC5025C764cE34df352757e82f7B5c4Df39A836";

  const handleRegister = async () => {
    try {
      const signer = await getSigner(); // sua função de conectar AA Wallet
      const result = await registerHarvestUserOp(
        signer,
        contractAddress,
        "Milho",
        1000,
        20,
        Math.floor(Date.now() / 1000),
        "teste"
      );
      alert(`Safra registrada! txHash: ${result}`);
    } catch (err) {
      alert("Erro ao registrar safra: " + err.message);
      console.error(err);
    }
  };
  

  const handleBuy = async () => {
    try {
      setLoading(true);
      const signer = await getSigner();

      const txHash = await buyHarvestUserOp(
        signer,
        contractAddress,
        0,  // harvestId (teste)
        100, // quantidade comprada
        ethers.utils.parseEther("0.1") // valor em NERO (wei)
      );

      setTxHashBuy(txHash);
      alert("✅ Compra feita!\nTxHash: " + txHash);
    } catch (err) {
      console.error(err);
      alert("Erro na compra: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧪 Tela de Teste de UserOperations</h2>

      <button onClick={handleRegister} disabled={loading}>
        1️⃣ Registrar Safra (UserOp)
      </button>

      {txHashRegister && (
        <p>Tx de Registro: <a href={"https://testnet.neroscan.io/tx/" + txHashRegister} target="_blank" rel="noreferrer">{txHashRegister}</a></p>
      )}

      <hr />

      <button onClick={handleBuy} disabled={loading}>
        2️⃣ Comprar Safra ID 0 (UserOp)
      </button>

      {txHashBuy && (
        <p>Tx de Compra: <a href={"https://testnet.neroscan.io/tx/" + txHashBuy} target="_blank" rel="noreferrer">{txHashBuy}</a></p>
      )}
    </div>
  );
};

export default UserOpTestPage;
