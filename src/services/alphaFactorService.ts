
// This service would connect to real data in production, but for demo we'll use mock data

export type StockData = {
  ticker: string;
  date: string;
  close: number;
  high: number;
  low: number;
  volume: number;
};

export type AlphaFactorResult = {
  ticker: string;
  alphaScore: number;
  reversal: number;
  momentum: number;
  signal: 'buy' | 'sell' | 'neutral';
  close: number;
  change: number;
  changePercent: number;
};

// Mock data generation
const generateMockStockData = (ticker: string, days: number = 30): StockData[] => {
  const data: StockData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let basePrice = 50 + Math.random() * 150;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Generate realistic price movement
    const dailyChange = (Math.random() - 0.48) * 2; // Slightly bullish bias
    basePrice = basePrice * (1 + dailyChange / 100);
    
    const high = basePrice * (1 + Math.random() * 0.015);
    const low = basePrice * (1 - Math.random() * 0.015);
    const close = low + Math.random() * (high - low);
    const volume = Math.floor(100000 + Math.random() * 900000);
    
    data.push({
      ticker,
      date: date.toISOString().split('T')[0],
      close,
      high,
      low,
      volume
    });
  }
  
  return data;
};

const tickers = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 
  'V', 'WMT', 'PG', 'JNJ', 'UNH', 'HD', 'BAC', 'XOM', 'CVX', 'MA',
  'ADBE', 'CRM', 'NFLX', 'INTC', 'VZ', 'CSCO', 'DIS', 'PEP', 'KO',
  'CMCSA', 'T', 'ABT'
];

// Generate mock data for all tickers
export const mockStockData: Record<string, StockData[]> = {};

tickers.forEach(ticker => {
  mockStockData[ticker] = generateMockStockData(ticker);
});

// Calculate reversal component: -rank(ts_sum((close-low)/(high-close),3))
const calculateReversalComponent = (data: StockData[]): number => {
  if (data.length < 3) return 0;

  const recentData = data.slice(-3); // Get the last 3 days
  let sum = 0;

  recentData.forEach(day => {
    const ratio = (day.close - day.low) / (day.high - day.close);
    if (isNaN(ratio) || !isFinite(ratio)) return 0; // Handle potential division by zero
    sum += ratio;
  });

  return -sum; // We're inverting the sum as per formula
};

// Calculate momentum component: rank(ts_delta(close,3))
const calculateMomentumComponent = (data: StockData[]): number => {
  if (data.length < 4) return 0;

  const currentClose = data[data.length - 1].close;
  const previousClose = data[data.length - 4].close; // 3 days back

  return currentClose - previousClose;
};

// Calculate the alpha factor
export const calculateAlphaFactor = (ticker: string): AlphaFactorResult => {
  const stockData = mockStockData[ticker];
  if (!stockData || stockData.length < 4) {
    throw new Error(`Insufficient data for ${ticker}`);
  }

  const reversal = calculateReversalComponent(stockData);
  const momentum = calculateMomentumComponent(stockData);
  
  // The final alpha score is the product of the two components
  const alphaScore = reversal * momentum;
  
  const latestData = stockData[stockData.length - 1];
  const previousData = stockData[stockData.length - 2];
  const change = latestData.close - previousData.close;
  const changePercent = (change / previousData.close) * 100;
  
  // Determine buy/sell signal based on alpha score
  let signal: 'buy' | 'sell' | 'neutral';
  if (alphaScore > 0.5) {
    signal = 'buy';
  } else if (alphaScore < -0.5) {
    signal = 'sell';
  } else {
    signal = 'neutral';
  }
  
  return {
    ticker,
    alphaScore,
    reversal,
    momentum,
    signal,
    close: latestData.close,
    change,
    changePercent
  };
};

// Calculate alpha factors for all stocks
export const calculateAllAlphaFactors = (): AlphaFactorResult[] => {
  return tickers.map(ticker => calculateAlphaFactor(ticker));
};

// Get historical stock data
export const getHistoricalData = (ticker: string): StockData[] => {
  return mockStockData[ticker] || [];
};

// Get all available tickers
export const getAllTickers = (): string[] => {
  return tickers;
};
