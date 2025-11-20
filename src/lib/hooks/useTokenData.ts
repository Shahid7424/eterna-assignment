import { useState, useEffect } from 'react';
import { Token, TabType } from '../types/token';
import { generateMockTokens } from '../utils/mockData';

export const useTokenData = (activeTab: TabType) => {
  const [tokens, setTokens] = useState<Record<TabType, Token[]>>({
    new: [],
    final: [],
    migrated: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API fetch
    const timer = setTimeout(() => {
      setTokens({
        new: generateMockTokens(20, 'new'),
        final: generateMockTokens(15, 'final'),
        migrated: generateMockTokens(12, 'migrated'),
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => {
        const updated = { ...prev };
        const currentTokens = updated[activeTab];
        
        if (currentTokens.length > 0) {
          const randomIndex = Math.floor(Math.random() * currentTokens.length);
          const randomToken = currentTokens[randomIndex];
          
          currentTokens[randomIndex] = {
            ...randomToken,
            price: randomToken.price * (1 + (Math.random() - 0.5) * 0.05),
            priceChange24h: randomToken.priceChange24h + (Math.random() - 0.5) * 5,
          };
        }
        
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  return { tokens, isLoading };
};