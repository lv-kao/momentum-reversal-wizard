
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockData } from '@/services/alphaFactorService';

interface StockChartProps {
  ticker: string;
  data: StockData[];
}

const StockChart: React.FC<StockChartProps> = ({ ticker, data }) => {
  // Prepare chart data - only use last 30 days for better visualization
  const chartData = data.slice(-30).map(item => ({
    date: item.date,
    close: +item.close.toFixed(2),
    high: +item.high.toFixed(2),
    low: +item.low.toFixed(2)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker} Price History</CardTitle>
        <CardDescription>
          The last 30 days of price movement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth()+1}/${d.getDate()}`;
                }}
                stroke="#a0aec0"
              />
              <YAxis 
                domain={['auto', 'auto']}
                stroke="#a0aec0" 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1a202c', 
                  border: '1px solid #2d3748',
                  borderRadius: '0.375rem' 
                }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#3182ce" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#68d391" 
                strokeWidth={1} 
                dot={false} 
                strokeDasharray="3 3"
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="#fc8181" 
                strokeWidth={1} 
                dot={false}
                strokeDasharray="3 3" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
