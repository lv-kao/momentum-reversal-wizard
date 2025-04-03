
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StockTable from '@/components/dashboard/StockTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { calculateAllAlphaFactors, AlphaFactorResult } from '@/services/alphaFactorService';

const StockRanking = () => {
  const [stocks, setStocks] = useState<AlphaFactorResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      try {
        const results = calculateAllAlphaFactors();
        setStocks(results);
        setLoading(false);
      } catch (error) {
        console.error("Error calculating alpha factors:", error);
        setLoading(false);
      }
    }, 800);
  }, []);

  const getBuyStocks = () => stocks.filter(stock => stock.signal === 'buy')
    .sort((a, b) => b.alphaScore - a.alphaScore);
  
  const getSellStocks = () => stocks.filter(stock => stock.signal === 'sell')
    .sort((a, b) => a.alphaScore - b.alphaScore);
  
  const getNeutralStocks = () => stocks.filter(stock => stock.signal === 'neutral');

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 border-4 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading ranking data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const buyStocks = getBuyStocks();
  const sellStocks = getSellStocks();
  const neutralStocks = getNeutralStocks();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Ranking</h1>
          <p className="text-muted-foreground">
            View stocks ranked by the Alpha Factor score
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Buy Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-finance-buy">{buyStocks.length}</div>
              <Progress value={(buyStocks.length / stocks.length) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sell Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-finance-sell">{sellStocks.length}</div>
              <Progress value={(sellStocks.length / stocks.length) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Neutral Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-finance-neutral">{neutralStocks.length}</div>
              <Progress value={(neutralStocks.length / stocks.length) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Stocks</TabsTrigger>
            <TabsTrigger value="buy">Buy Signals</TabsTrigger>
            <TabsTrigger value="sell">Sell Signals</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <StockTable stocks={stocks} />
          </TabsContent>
          <TabsContent value="buy" className="space-y-4">
            <StockTable stocks={buyStocks} />
          </TabsContent>
          <TabsContent value="sell" className="space-y-4">
            <StockTable stocks={sellStocks} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StockRanking;
