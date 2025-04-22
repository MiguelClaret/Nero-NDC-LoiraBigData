/**
 * ⏳ Espera pelo recibo da operação de usuário enviada
 * @param {object} client - Instância do Smart Wallet (SimpleAccountAPI)
 * @param {object} options - Objeto com `{ hash }`
 * @param {number} interval - Intervalo entre tentativas (ms)
 * @param {number} timeout - Tempo máximo de espera (ms)
 * @returns {Promise<object>} - Recibo da user operation
 */
export async function waitForUserOperationReceipt(client, { hash }, interval = 2000, timeout = 30000) {
    const start = Date.now();
    console.log('⌛ Aguardando receipt da operação com hash:', hash);
  
    while (Date.now() - start < timeout) {
      try {
        const receipt = await client.getUserOpReceipt(hash);
        if (receipt) {
          console.log('✅ Receipt recebido:', receipt);
          return receipt;
        }
      } catch (err) {
        console.warn('🔁 Ainda aguardando...', err.message || err);
      }
  
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  
    throw new Error('⏰ Timeout esperando receipt da operação');
  }
   new Error('⏰ Timeout esperando recibo da operação do usuário');



  