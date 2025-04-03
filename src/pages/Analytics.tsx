
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateAllAlphaFactors, AlphaFactorResult } from '@/services/alphaFactorService';

const Analytics = () => {
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

  const prepareScatterData = () => {
    return stocks.map(stock => ({
      name: stock.ticker,
      reversal: stock.reversal,
      momentum: stock.momentum,
      alphaScore: Math.abs(stock.alphaScore) * 30, // Scale for better visualization
      signal: stock.signal
    }));
  };

  // Determine the color for scatter plot points based on signal
  const getScatterPointColor = (signal: string) => {
    switch (signal) {
      case 'buy': return '#4CAF50';
      case 'sell': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 border-4 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading analytics data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const scatterData = prepareScatterData();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factor Analytics</h1>
          <p className="text-muted-foreground">
            Analyze the relationship between reversal and momentum factors
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Reversal vs. Momentum Analysis</CardTitle>
            <CardDescription>
              Scatter plot showing the relationship between the reversal component (x-axis) 
              and the momentum component (y-axis). Point size represents alpha factor magnitude.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis 
                    type="number" 
                    dataKey="reversal" 
                    name="Reversal" 
                    stroke="#a0aec0"
                    domain={['auto', 'auto']}
                    label={{ 
                      value: 'Reversal Component', 
                      position: 'bottom',
                      style: { fill: '#a0aec0' } 
                    }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="momentum" 
                    name="Momentum" 
                    stroke="#a0aec0"
                    domain={['auto', 'auto']}
                    label={{ 
                      value: 'Momentum Component', 
                      angle: -90, 
                      position: 'left',
                      style: { fill: '#a0aec0' }
                    }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="alphaScore" 
                    range={[20, 100]} 
                    name="Alpha Score" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: '#1a202c', 
                      border: '1px solid #2d3748',
                      borderRadius: '0.375rem' 
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value, name) => {
                      if (typeof value === 'number') {
                        if (name === 'Reversal') return [value.toFixed(2), name];
                        if (name === 'Momentum') return [value.toFixed(2), name];
                        if (name === 'Alpha Score') return [(value / 30).toFixed(2), 'Alpha Score (actual)'];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(value) => {
                      if (typeof value === 'string') {
                        return `Ticker: ${value}`;
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  {['buy', 'sell', 'neutral'].map((signal) => (
                    <Scatter 
                      key={signal}
                      name={`${signal.charAt(0).toUpperCase() + signal.slice(1)} Signal`}
                      data={scatterData.filter(item => item.signal === signal)}
                      fill={getScatterPointColor(signal)}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
                
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Alpha Factor Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-lg font-mono">-rank(ts_sum((close-low)/(high-close),3)) * rank(ts_delta(close,3))</p>
              </div>
              <div className="mt-4 space-y-2">
                <p><strong>Reversal Component:</strong> -rank(ts_sum((close-low)/(high-close),3))</p>
                <p className="text-sm text-muted-foreground">
                  Measures how close the price is to the daily high or low over the past 3 days.
                  Negative values indicate prices near the low, positive values indicate prices near the high.
                </p>
                
                <p><strong>Momentum Component:</strong> rank(ts_delta(close,3))</p>
                <p className="text-sm text-muted-foreground">
                  Measures the price change over the past 3 days.
                  Positive values indicate rising prices, negative values indicate falling prices.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-finance-buy">Buy Signal</h3>
                <p className="text-sm">
                  Generated when a stock has been trading near its lows (reversal opportunity) 
                  but showing recent upward momentum. This combination suggests a potential reversal 
                  to the upside.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-finance-sell">Sell Signal</h3>
                <p className="text-sm">
                  Generated when a stock has been trading near its highs (potential overvaluation) 
                  and showing recent downward momentum. This combination suggests a potential reversal 
                  to the downside.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">Strategy Application</h3>
                <p className="text-sm">
                  This alpha factor combines short-term mean-reversion with momentum confirmation,
                  creating a robust signal that aims to identify stocks at turning points while 
                  filtering out false signals by requiring momentum confirmation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
