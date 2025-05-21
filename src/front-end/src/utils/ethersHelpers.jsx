/**
 * Utilitários para trabalhar com a biblioteca ethers.js
 * Fornece funções que funcionam com ethers v5 e v6
 */

/**
 * Converte um valor decimal para unidades de token (com 18 casas decimais)
 * Funciona independente da versão do ethers disponível
 * 
 * @param {number|string} value - Valor a ser convertido
 * @param {number} decimals - Número de casas decimais (padrão: 18)
 * @returns {string} - Valor convertido como string
 */
export const parseToTokenUnits = (value, decimals = 18) => {
    if (!value && value !== 0) return "0";
    
    try {
      // Primeiro tente importar ethers (se disponível no escopo)
      const ethers = window.ethers || global.ethers;
      
      // Verificar disponibilidade de funções do ethers
      if (ethers) {
        // Garantir que o valor seja uma string e substitua vírgulas por pontos
        const valueStr = value.toString().replace(',', '.');
        
        // Para ethers v6
        if (typeof ethers.parseUnits === 'function') {
          console.log("Usando ethers.parseUnits (v6)");
          return ethers.parseUnits(valueStr, decimals).toString();
        }
        
        // Para ethers v5
        if (ethers.utils && typeof ethers.utils.parseUnits === 'function') {
          console.log("Usando ethers.utils.parseUnits (v5)");
          return ethers.utils.parseUnits(valueStr, decimals).toString();
        }
        
        // Fallback para parseEther (equivalente a parseUnits com 18 decimais)
        if (decimals === 18) {
          if (typeof ethers.parseEther === 'function') {
            console.log("Usando ethers.parseEther (v6)");
            return ethers.parseEther(valueStr).toString();
          }
          
          if (ethers.utils && typeof ethers.utils.parseEther === 'function') {
            console.log("Usando ethers.utils.parseEther (v5)");
            return ethers.utils.parseEther(valueStr).toString();
          }
        }
      }
      
      // Implementação manual como último recurso
      console.log("Usando implementação manual para conversão de unidades");
      const valueFloat = parseFloat(value.toString().replace(',', '.'));
      if (isNaN(valueFloat)) return "0";
      
      const multiplier = Math.pow(10, decimals);
      const valueInWei = BigInt(Math.floor(valueFloat * multiplier));
      return valueInWei.toString();
      
    } catch (error) {
      console.error("Erro ao converter valor para unidades de token:", error);
      // Retorne zero em caso de erro
      return "0";
    }
  };
  
  /**
   * Converte um valor em unidades de token (wei) para um valor decimal
   * 
   * @param {string|bigint} valueInWei - Valor em wei (unidades de token)
   * @param {number} decimals - Número de casas decimais (padrão: 18) 
   * @param {number} displayDecimals - Número de casas decimais a exibir (padrão: 4)
   * @returns {string} - Valor formatado como string
   */
  export const formatFromTokenUnits = (valueInWei, decimals = 18, displayDecimals = 4) => {
    if (!valueInWei) return "0";
    
    try {
      // Primeiro tente importar ethers (se disponível no escopo)
      const ethers = window.ethers || global.ethers;
      
      // Verificar disponibilidade de funções do ethers
      if (ethers) {
        // Para ethers v6
        if (typeof ethers.formatUnits === 'function') {
          const formatted = ethers.formatUnits(valueInWei, decimals);
          return Number(formatted).toFixed(displayDecimals);
        }
        
        // Para ethers v5
        if (ethers.utils && typeof ethers.utils.formatUnits === 'function') {
          const formatted = ethers.utils.formatUnits(valueInWei, decimals);
          return Number(formatted).toFixed(displayDecimals);
        }
      }
      
      // Implementação manual como último recurso
      console.log("Usando implementação manual para formatação de unidades");
      const divisor = Math.pow(10, decimals);
      // Converter para BigInt se for string
      const bigIntValue = typeof valueInWei === 'string' 
        ? BigInt(valueInWei)
        : valueInWei;
      
      // Converter BigInt para número e formatar
      const valueAsNumber = Number(bigIntValue) / divisor;
      return valueAsNumber.toFixed(displayDecimals);
      
    } catch (error) {
      console.error("Erro ao formatar valor de unidades de token:", error);
      return "0";
    }
  };
  
  /**
   * Verifica se um endereço Ethereum é válido
   * 
   * @param {string} address - Endereço a ser verificado
   * @returns {boolean} - true se o endereço for válido
   */
  export const isValidEthereumAddress = (address) => {
    try {
      // Validações básicas
      if (!address) {
        console.warn("Endereço vazio ou undefined");
        return false;
      }

      if (typeof address !== 'string') {
        console.warn(`Tipo inválido de endereço: ${typeof address}`);
        return false;
      }

      if (!address.startsWith('0x')) {
        console.warn("Endereço não começa com '0x'");
        return false;
      }

      if (address.length !== 42) {
        console.warn(`Comprimento inválido do endereço: ${address.length}`);
        return false;
      }

      // Tentar usar ethers.js para validação
      const ethers = window.ethers || global.ethers;
      
      if (ethers) {
      // Para ethers v6
      if (typeof ethers.isAddress === 'function') {
          const isValid = ethers.isAddress(address);
          if (!isValid) {
            console.warn("Endereço inválido (ethers v6)");
          }
          return isValid;
      }
      
      // Para ethers v5
      if (ethers.utils && typeof ethers.utils.isAddress === 'function') {
          const isValid = ethers.utils.isAddress(address);
          if (!isValid) {
            console.warn("Endereço inválido (ethers v5)");
          }
          return isValid;
        }
      }
      
      // Implementação básica de fallback - verificar formato
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
      if (!isValid) {
        console.warn("Endereço não corresponde ao formato esperado");
      }
      return isValid;
      
    } catch (error) {
      console.error("Erro ao verificar endereço Ethereum:", error);
      return false;
    }
  };
  
  export default {
    parseToTokenUnits,
    formatFromTokenUnits,
    isValidEthereumAddress
  };