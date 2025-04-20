export async function waitForUserOperationReceipt(bundlerClient, { hash }, interval = 2000, timeout = 30000) {
    const start = Date.now();
  
    while (Date.now() - start < timeout) {
      const receipt = await bundlerClient.getUserOperationReceipt({ hash });
      if (receipt) return receipt;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  
    throw new Error('⏰ Timeout esperando recibo da operação do usuário');
  }
  