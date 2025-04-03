
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StockTable from '@/components/dashboard/StockTable';
import StockChart from '@/components/dashboard/StockChart';
import AlphaFactorCard from '@/components/dashboard/AlphaFactorCard';
import { calculateAllAlphaFactors, getHistoricalData, AlphaFactorResult } from '@/services/alphaFactorService';

const Dashboard = () => {
  const [stocks, setStocks] = useState<AlphaFactorResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockData, setSelectedStockData] = useState<any[]>([]);
  const [selectedAlphaResult, setSelectedAlphaResult] = useState<AlphaFactorResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      try {
        const results = calculateAllAlphaFactors();
        setStocks(results);
        
        // Set first stock as selected by default
        if (results.length > 0) {
          setSelectedStock(results[0].ticker);
          setSelectedAlphaResult(results[0]);
          const historicalData = getHistoricalData(results[0].ticker);
          setSelectedStockData(historicalData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error calculating alpha factors:", error);
        setLoading(false);
      }
    }, 800);
  }, []);

  const handleStockSelect = (ticker: string) => {
    setSelectedStock(ticker);
    const historicalData = getHistoricalData(ticker);
    setSelectedStockData(historicalData);
    
    const alphaResult = stocks.find(stock => stock.ticker === ticker);
    if (alphaResult) {
      setSelectedAlphaResult(alphaResult);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 border-4 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading market data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Alpha Factor Analysis: Short-term Reversal + Momentum Strategy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selectedStock && selectedStockData.length > 0 ? (
              <StockChart ticker={selectedStock} data={selectedStockData} />
            ) : (
              <div className="h-[350px] border rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Select a stock to view chart</p>
              </div>
            )}
          </div>
          <div>
            {selectedAlphaResult ? (
              <AlphaFactorCard result={selectedAlphaResult} />
            ) : (
              <div className="h-[350px] border rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No stock selected</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Stock Rankings</h2>
          <StockTable stocks={stocks} onStockSelect={handleStockSelect} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
