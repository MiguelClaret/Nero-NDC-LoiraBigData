// services/simpleNeroConverter.js

/**
 * Serviço simplificado para conversão USD para Nerochain
 */

import { mockExchangeRates } from '../components/Marketplace/mockData';

// Valor padrão de conversão (fallback)
const DEFAULT_RATE = mockExchangeRates?.USD_TO_NERO || 2.45; // 1 USD = 2.45 NERO

// Cache para a taxa
let cachedRate = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Busca a taxa de conversão USD para NERO
 * Em produção, isso seria uma chamada a uma API externa
 * @returns {Promise<number>} Taxa de conversão (1 USD = X NERO)
 */
export async function getNeroRate() {
  const now = Date.now();
  
  // Retorna o cache se for válido
  if (cachedRate && now - lastFetchTime < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    // Simula busca na API
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula atraso de rede
    
    // Usa a taxa do mockExchangeRates com uma pequena variação
    const baseRate = mockExchangeRates.USD_TO_NERO;
    const variation = (Math.random() * 0.1) - 0.05; // Variação de ±5%
    
    cachedRate = baseRate + variation;
    lastFetchTime = now;
    
    return cachedRate;
  } catch (error) {
    console.log('Erro ao buscar taxa. Usando valor padrão:', error);
    
    // Em caso de erro, usa o valor padrão
    if (!cachedRate) {
      cachedRate = DEFAULT_RATE;
      lastFetchTime = now;
    }
    
    return cachedRate;
  }
}

/**
 * Converte USD para NERO
 * @param {number} usdAmount - Valor em USD
 * @param {number} rate - Taxa de conversão (opcional)
 * @returns {number} Valor em NERO
 */
export function convertToNero(usdAmount, rate = DEFAULT_RATE) {
  return usdAmount * rate;
}

/**
 * Formata um valor em NERO
 * @param {number} amount - Valor a ser formatado
 * @returns {string} Valor formatado com símbolo da moeda
 */
export function formatNero(amount) {
  return `${amount.toFixed(2)} NERO`;
}

/**
 * Formata um valor em USD
 * @param {number} amount - Valor a ser formatado
 * @returns {string} Valor formatado com símbolo da moeda
 */
export function formatUsd(amount) {
  return `$${amount.toFixed(2)}`;
}