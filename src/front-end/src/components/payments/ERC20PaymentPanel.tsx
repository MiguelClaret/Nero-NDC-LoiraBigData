import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getSigner, getAAWalletAddress, approveTokenForPaymaster } from "../../utils/aaUtils";
import { getSupportedTokens } from "@/utils/aaUtils";
import { getSimpleAccountBuilder } from "../../utils/userOp/userOpBuilder";
import { sendUserOperation } from "../../utils/userOp/userOpClient";

const ERC20PaymentPanel = () => {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [paymentType, setPaymentType] = useState("1");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTokens = async () => {
      const supportedTokens = await getSupportedTokens();
      setTokens(supportedTokens);
    };
    loadTokens();
  }, []);

  const handleApprove = async () => {
    try {
      setLoading(true);
      const signer = await getSigner();
      await approveTokenForPaymaster(signer, selectedToken, ethers.constants.MaxUint256);
      alert("Token aprovado com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar token: ", error);
      alert("Erro ao aprovar token");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    try {
      setLoading(true);
      const signer = await getSigner();
      const paymasterData = `0x${selectedToken}${paymentType}`;
      const builder = await getSimpleAccountBuilder(signer, paymasterData);

      // Construindo o UserOperation
      const userOperation = await builder.buildOp({
        target: "0xDestinoDaTransacao",
        data: "0x", // Coloque os dados da chamada do contrato aqui
        value: ethers.utils.parseEther(amount),
      });

      // Enviando a transação
      const result = await sendUserOperation(userOperation);
      alert(`Transação enviada! Hash: ${result.userOpHash}`);
    } catch (error) {
      console.error("Erro ao enviar transação: ", error);
      alert("Erro ao enviar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Seleção de Pagamento ERC20</h3>
      
      <label>Tipo de Pagamento:</label>
      <select onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
        <option value="1">Prepay (Type 1)</option>
        <option value="2">Postpay (Type 2)</option>
      </select>

      <label>Token ERC20:</label>
      <select onChange={(e) => setSelectedToken(e.target.value)} value={selectedToken}>
        {tokens.map((token, index) => (
          <option key={index} value={token.token}>
            {token.symbol}
          </option>
        ))}
      </select>

      <label>Valor (em NERO):</label>
      <input 
        type="text" 
        placeholder="0.0" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />

      <button disabled={loading} onClick={handleApprove}>
        {loading ? "Aprovando..." : "Aprovar Token"}
      </button>

      <button disabled={loading} onClick={handleSendTransaction}>
        {loading ? "Enviando..." : "Enviar Transação"}
      </button>
    </div>
  );
};

export default ERC20PaymentPanel;
