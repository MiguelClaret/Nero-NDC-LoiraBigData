// services/neroConverter.js

/**
 * Serviço unificado para conversão entre USD e NERO
 * Integrado com API real de taxas de câmbio
 */

// Taxas de conversão padrão (fallback)
const DEFAULT_USD_TO_NERO_RATE = 1; // 1 USD = 2.45 NERO
const DEFAULT_NERO_TO_USD_RATE = 1 / DEFAULT_USD_TO_NERO_RATE; // 1 NERO = ~0.408 USD

// API configs
// Nota: Em produção, você deve usar uma API verdadeira para taxas de criptomoedas
// Exemplos: CoinGecko, CoinMarketCap, Binance, etc.
const API_CONFIG = {
  // CoinGecko API (gratuita, mas com limites de requisição)
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    endpoints: {
      // Substitua 'nerochain' com o ID real da moeda na API
      price: '/simple/price?ids=nerochain&vs_currencies=usd',
    },
    enabled: false // Desabilitado até a moeda estar listada
  },
  // Exemplo de API alternativa
  CUSTOM_API: {
    baseUrl: 'https://api.example.com/v1',
    endpoints: {
      price: '/exchange-rates/nerochain/usd',
    },
    headers: {
      'X-API-Key': process.env.NEXT_PUBLIC_EXCHANGE_API_KEY || '',
    },
    enabled: false // Habilitar quando tiver uma API real
  }
};

// Cache para a taxa
let cachedRate = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Tenta obter a taxa de conversão da API CoinGecko
 * @returns {Promise<number|null>} Taxa de conversão ou null se falhar
 */
async function fetchRateFromCoinGecko() {
  if (!API_CONFIG.COINGECKO.enabled) {
    return null;
  }

  try {
    const url = `${API_CONFIG.COINGECKO.baseUrl}${API_CONFIG.COINGECKO.endpoints.price}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Formato da resposta: { "nerochain": { "usd": 0.408 } }
    // Onde 0.408 é o preço de 1 NERO em USD
    const neroUsdPrice = data?.nerochain?.usd;
    
    if (!neroUsdPrice) {
      throw new Error('Invalid API response format');
    }
    
    // Calculamos a taxa inversa (1 USD = X NERO)
    return 1 / neroUsdPrice;
  } catch (error) {
    console.error('Error fetching rate from CoinGecko:', error);
    return null;
  }
}

/**
 * Tenta obter a taxa de conversão da API personalizada
 * @returns {Promise<number|null>} Taxa de conversão ou null se falhar
 */
async function fetchRateFromCustomAPI() {
  if (!API_CONFIG.CUSTOM_API.enabled) {
    return null;
  }

  try {
    const url = `${API_CONFIG.CUSTOM_API.baseUrl}${API_CONFIG.CUSTOM_API.endpoints.price}`;
    const response = await fetch(url, {
      headers: API_CONFIG.CUSTOM_API.headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Formato hipotético da resposta: { "rate": 2.45, "timestamp": 1621234567 }
    // Onde 2.45 é quantos NERO você obtém por 1 USD
    const usdToNeroRate = data?.rate;
    
    if (!usdToNeroRate) {
      throw new Error('Invalid API response format');
    }
    
    return usdToNeroRate;
  } catch (error) {
    console.error('Error fetching rate from Custom API:', error);
    return null;
  }
}

/**
 * Gera uma taxa simulada com base na taxa padrão
 * Usado quando as APIs falham ou estão desabilitadas
 * @returns {Promise<number>} Taxa simulada
 */
async function getSimulatedRate() {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Adiciona uma pequena variação para simular mudanças de mercado
  const variation = (Math.random() * 0.1) - 0.05; // ±5%
  return DEFAULT_USD_TO_NERO_RATE * (1 + variation);
}

/**
 * Busca a taxa de conversão USD para NERO
 * Tenta múltiplas fontes de dados e implementa fallback
 * @returns {Promise<number>} Taxa de conversão (1 USD = X NERO)
 */
export async function getNeroRate() {
  const now = Date.now();
  
  // Retorna o cache se for válido
  if (cachedRate && now - lastFetchTime < CACHE_DURATION) {
    return cachedRate;
  }

  // Tenta obter da CoinGecko primeiro
  let rate = await fetchRateFromCoinGecko();
  
  // Tenta a API personalizada se a CoinGecko falhar
  if (!rate) {
    rate = await fetchRateFromCustomAPI();
  }
  
  // Se ambas as APIs falharem, usa a taxa simulada
  if (!rate) {
    rate = await getSimulatedRate();
  }
  
  // Atualiza o cache
  cachedRate = rate;
  lastFetchTime = now;
  
  return rate;
}

/**
 * Converte USD para NERO
 * @param {number} usdAmount - Valor em USD
 * @param {number} rate - Taxa de conversão (opcional)
 * @returns {number} Valor em NERO
 */
export function convertUsdToNero(usdAmount, rate = DEFAULT_USD_TO_NERO_RATE) {
  if (!usdAmount || isNaN(usdAmount)) return 0;
  return usdAmount * rate;
}

/**
 * Converte NERO para USD
 * @param {number} neroAmount - Valor em NERO
 * @param {number} rate - Taxa de conversão (opcional)
 * @returns {number} Valor em USD
 */
export function convertNeroToUsd(neroAmount, rate = DEFAULT_NERO_TO_USD_RATE) {
  if (!neroAmount || isNaN(neroAmount)) return 0;
  return neroAmount * rate;
}

/**
 * Formata um valor em NERO
 * @param {number} amount - Valor a ser formatado
 * @returns {string} Valor formatado com símbolo da moeda
 */
export function formatNero(amount) {
  if (!amount || isNaN(amount)) return "0.00 NERO";
  return `${parseFloat(amount).toFixed(2)} NERO`;
}

/**
 * Formata um valor em USD
 * @param {number} amount - Valor a ser formatado
 * @returns {string} Valor formatado com símbolo da moeda
 */
export function formatUsd(amount) {
  if (!amount || isNaN(amount)) return "$0.00";
  return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Obtem as taxas de conversão atual
 * @returns {Object} Objeto com taxas de conversão
 */
export function getConversionRates() {
  return {
    usdToNero: cachedRate || DEFAULT_USD_TO_NERO_RATE,
    neroToUsd: 1 / (cachedRate || DEFAULT_USD_TO_NERO_RATE)
  };
}

/**
 * Verifica se a API está habilitada e funcionando
 * @returns {Promise<{ working: boolean, source: string, message: string }>} Status da API
 */
export async function checkApiStatus() {
  try {
    // Tenta obter a taxa da API primária
    const coinGeckoRate = await fetchRateFromCoinGecko();
    if (coinGeckoRate) {
      return { 
        working: true, 
        source: 'CoinGecko', 
        message: 'API is working properly'
      };
    }
    
    // Tenta a API secundária
    const customApiRate = await fetchRateFromCustomAPI();
    if (customApiRate) {
      return { 
        working: true, 
        source: 'Custom API', 
        message: 'API is working properly'
      };
    }
    
    // Se nenhuma API estiver funcionando
    return { 
      working: false, 
      source: 'Simulation', 
      message: 'Using simulated exchange rates - no API available'
    };
  } catch (error) {
    return { 
      working: false, 
      source: 'Error', 
      message: error.message
    };
  }
}

// Não podemos usar JSX em arquivos .js, então fornecemos as props para SVG
// que os componentes podem usar diretamente
export const NEROCHAIN_ICON_SVG = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  children: [
    { tag: 'circle', props: { cx: "12", cy: "12", r: "10" } },
    { tag: 'path', props: { d: "M8 14l4-4 4 4" } },
    { tag: 'path', props: { d: "M9 9h6" } }
  ]
};

export const REFRESH_CW_ICON_SVG = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  children: [
    { tag: 'path', props: { d: "M21 2v6h-6" } },
    { tag: 'path', props: { d: "M3 12a9 9 0 0 1 15-6.7L21 8" } },
    { tag: 'path', props: { d: "M3 22v-6h6" } },
    { tag: 'path', props: { d: "M21 12a9 9 0 0 1-15 6.7L3 16" } }
  ]
};