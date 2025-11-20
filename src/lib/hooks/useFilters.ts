import { useState, useCallback, useMemo } from 'react';
import { Token, FilterState } from '../types/token';

const initialFilters: FilterState = {
  minLiquidity: 0,
  maxLiquidity: 0,
  minVolume: 0,
  maxVolume: 0,
  minMarketCap: 0,
  maxMarketCap: 0,
  minHolders: 0,
  maxHolders: 0,
  excludeHoneypot: false,
  verifiedOnly: false,
  searchQuery: '',
};

export const useFilters = (tokens: Token[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      if (filters.searchQuery && 
          !token.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
          !token.symbol.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.minLiquidity && token.liquidity < filters.minLiquidity) return false;
      if (filters.maxLiquidity && token.liquidity > filters.maxLiquidity) return false;
      if (filters.minVolume && token.volume24h < filters.minVolume) return false;
      if (filters.maxVolume && token.volume24h > filters.maxVolume) return false;
      if (filters.minMarketCap && token.marketCap < filters.minMarketCap) return false;
      if (filters.maxMarketCap && token.marketCap > filters.maxMarketCap) return false;
      if (filters.minHolders && token.holders < filters.minHolders) return false;
      if (filters.maxHolders && token.holders > filters.maxHolders) return false;
      if (filters.excludeHoneypot && token.isHoneypot) return false;
      if (filters.verifiedOnly && !token.isVerified) return false;
      return true;
    });
  }, [tokens, filters]);

  return {
    filters,
    filteredTokens,
    handleFilterChange,
    handleResetFilters,
  };
};