
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { AlphaFactorResult } from '@/services/alphaFactorService';
import { cn } from '@/lib/utils';

interface StockTableProps {
  stocks: AlphaFactorResult[];
  onStockSelect?: (ticker: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, onStockSelect }) => {
  const [sortField, setSortField] = useState<keyof AlphaFactorResult>('alphaScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: keyof AlphaFactorResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredStocks = stocks.filter(stock => 
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const getSortIcon = (field: keyof AlphaFactorResult) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4" /> 
      : <ArrowDown className="ml-1 h-4 w-4" />;
  };

  const formatNumber = (num: number, precision: number = 2) => {
    return num.toFixed(precision);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[200px] lg:w-[250px]"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredStocks.length} stocks found
        </div>
      </div>
      <div className="max-h-[500px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[80px] cursor-pointer"
                onClick={() => handleSort('ticker')}
              >
                <div className="flex items-center">
                  Ticker
                  {getSortIcon('ticker')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('alphaScore')}
              >
                <div className="flex items-center">
                  Alpha Score
                  {getSortIcon('alphaScore')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('reversal')}
              >
                <div className="flex items-center">
                  Reversal
                  {getSortIcon('reversal')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('momentum')}
              >
                <div className="flex items-center">
                  Momentum
                  {getSortIcon('momentum')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('signal')}
              >
                <div className="flex items-center">
                  Signal
                  {getSortIcon('signal')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('close')}
              >
                <div className="flex items-center">
                  Price
                  {getSortIcon('close')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('changePercent')}
              >
                <div className="flex items-center">
                  Change%
                  {getSortIcon('changePercent')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.map((stock) => (
              <TableRow 
                key={stock.ticker}
                className="cursor-pointer hover:bg-accent"
                onClick={() => onStockSelect?.(stock.ticker)}
              >
                <TableCell className="font-medium">{stock.ticker}</TableCell>
                <TableCell>{formatNumber(stock.alphaScore)}</TableCell>
                <TableCell>{formatNumber(stock.reversal)}</TableCell>
                <TableCell>{formatNumber(stock.momentum)}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    stock.signal === 'buy' 
                      ? "bg-green-100 text-green-800" 
                      : stock.signal === 'sell' 
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  )}>
                    {stock.signal.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>${formatNumber(stock.close)}</TableCell>
                <TableCell className={cn(
                  stock.changePercent > 0 ? "text-finance-buy" : 
                  stock.changePercent < 0 ? "text-finance-sell" : ""
                )}>
                  {stock.changePercent > 0 ? "+" : ""}
                  {formatNumber(stock.changePercent)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockTable;
