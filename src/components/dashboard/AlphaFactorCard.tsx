
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlphaFactorResult } from '@/services/alphaFactorService';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';

interface AlphaFactorCardProps {
  result: AlphaFactorResult;
}

const AlphaFactorCard: React.FC<AlphaFactorCardProps> = ({ result }) => {
  // Helper function to get styled components based on signal
  const getSignalDisplay = () => {
    switch (result.signal) {
      case 'buy':
        return {
          icon: <ArrowUpCircle className="h-12 w-12 text-finance-buy" />,
          textColor: 'text-finance-buy',
          bgColor: 'bg-green-900/20'
        };
      case 'sell':
        return {
          icon: <ArrowDownCircle className="h-12 w-12 text-finance-sell" />,
          textColor: 'text-finance-sell',
          bgColor: 'bg-red-900/20'
        };
      default:
        return {
          icon: <MinusCircle className="h-12 w-12 text-finance-neutral" />,
          textColor: 'text-finance-neutral',
          bgColor: 'bg-gray-900/20'
        };
    }
  };

  const signalDisplay = getSignalDisplay();

  return (
    <Card className={`border-2 ${signalDisplay.bgColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>{result.ticker}</span>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${signalDisplay.textColor}`}>
            {result.signal.toUpperCase()}
          </div>
        </CardTitle>
        <CardDescription>
          Current Price: ${result.close.toFixed(2)}
          <span className={`ml-2 ${result.changePercent > 0 ? 'text-finance-buy' : 'text-finance-sell'}`}>
            ({result.changePercent > 0 ? '+' : ''}{result.changePercent.toFixed(2)}%)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Alpha Factor Score</p>
              <p className="text-2xl font-bold">{result.alphaScore.toFixed(2)}</p>
            </div>
            {signalDisplay.icon}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Reversal Component</p>
              <p className="text-lg font-semibold">{result.reversal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Momentum Component</p>
              <p className="text-lg font-semibold">{result.momentum.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Alpha Factor = -rank(ts_sum((close-low)/(high-close),3)) * rank(ts_delta(close,3))
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlphaFactorCard;
