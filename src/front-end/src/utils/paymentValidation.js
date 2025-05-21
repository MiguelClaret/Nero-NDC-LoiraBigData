import { ethers } from 'ethers';
import { AA_PLATFORM_CONFIG } from '../config/neroConfig';

export const validatePayment = async (amount, paymentType) => {
    try {
        // Verificar se o valor está dentro dos limites
        const amountInNero = ethers.utils.formatEther(amount);
        if (parseFloat(amountInNero) > parseFloat(AA_PLATFORM_CONFIG.maxTransactionValue)) {
            throw new Error(`Valor da transação excede o limite máximo de ${AA_PLATFORM_CONFIG.maxTransactionValue} NERO`);
        }

        // Verificar o status do Paymaster
        const paymasterStatus = await checkPaymasterStatus();
        if (!paymasterStatus || !paymasterStatus.active) {
            throw new Error('Paymaster não está ativo no momento');
        }

        // Verificar o tipo de pagamento
        if (paymentType === '0') {
            // Verificar saldo do Paymaster para gas patrocinado
            if (parseFloat(paymasterStatus.balance) < parseFloat(AA_PLATFORM_CONFIG.minBalance)) {
                throw new Error('Saldo insuficiente no Paymaster para gas patrocinado');
            }
        }

        return true;
    } catch (error) {
        console.error('❌ Erro na validação do pagamento:', error);
        throw error;
    }
};

export const checkPaymasterStatus = async () => {
    try {
        const response = await fetch(`${AA_PLATFORM_CONFIG.paymasterRpc}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': AA_PLATFORM_CONFIG.apiKey
            },
            timeout: AA_PLATFORM_CONFIG.requestTimeout
        });

        if (!response.ok) {
            throw new Error(`Falha na verificação do status do Paymaster: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Erro ao verificar status do Paymaster:', error);
        return null;
    }
};

export const getPaymentErrorMessage = (error) => {
    if (error.message.includes('AA21')) {
        return 'O Paymaster não patrocinou a transação. Verifique o saldo e a configuração.';
    }
    if (error.message.includes('insufficient balance')) {
        return 'Saldo insuficiente para realizar a transação.';
    }
    if (error.message.includes('timeout')) {
        return 'Tempo limite excedido. Tente novamente.';
    }
    return error.message || 'Erro desconhecido na transação';
}; 