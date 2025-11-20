import React, { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChangeProps {
  value: number;
}

export const PriceChange = memo(({ value }: PriceChangeProps) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium">{isPositive ? '+' : ''}{value.toFixed(2)}%</span>
    </div>
  );
});

PriceChange.displayName = 'PriceChange';