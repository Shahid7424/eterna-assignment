export interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  holders: number;
  transactions: number;
  buys: number;
  sells: number;
  age: number;
  top10HoldersPercent: number;
  devHoldingPercent: number;
  snipersPercent: number;
  insidersPercent: number;
  bondingProgress?: number;
  isHoneypot: boolean;
  isVerified: boolean;
  migrationTime?: number;
}

export type TabType = 'new' | 'final' | 'migrated';
export type SortField = 'age' | 'price' | 'volume24h' | 'liquidity' | 'marketCap' | 'holders' | 'transactions';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  minLiquidity: number;
  maxLiquidity: number;
  minVolume: number;
  maxVolume: number;
  minMarketCap: number;
  maxMarketCap: number;
  minHolders: number;
  maxHolders: number;
  excludeHoneypot: boolean;
  verifiedOnly: boolean;
  searchQuery: string;
}