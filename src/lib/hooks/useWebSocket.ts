"use client";
import { useEffect, useCallback, useRef, useState } from 'react';
import { Token } from '../types/token';
import { PriceUpdate } from '../services/websocket';
import { getMockWebSocketService } from '../services/mockWebSocket';

export const useWebSocket = (
  tokens: Token[],
  onPriceUpdate: (tokenId: string, updates: Partial<Token>) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<any>(null);
  const priceHistoryRef = useRef<Map<string, number[]>>(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = getMockWebSocketService();
    wsRef.current = ws;

    ws.connect()
      .then(() => {
        setIsConnected(true);
        setConnectionError(null);
      })
      .catch((error) => {
        console.error('WebSocket connection failed:', error);
        setConnectionError('Failed to connect to price feed');
        setIsConnected(false);
      });

    return () => {
      ws.disconnect();
    };
  }, []);

  // Handle price updates
  const handlePriceUpdate = useCallback((message: any) => {
    if (message.type === 'bulkUpdate') {
      const updates = message.data as PriceUpdate[];
      
      updates.forEach((update) => {
        const token = tokens.find(t => t.id === update.tokenId);
        if (!token) return;

        // Calculate new price based on percentage change
        const priceMultiplier = 1 + (update.priceChange24h / 100);
        const newPrice = token.price * priceMultiplier;

        // Calculate new volume
        const volumeMultiplier = 1 + ((Math.random() - 0.5) * 0.1);
        const newVolume = token.volume24h * volumeMultiplier;

        // Store price history for trend analysis
        const history = priceHistoryRef.current.get(update.tokenId) || [];
        history.push(newPrice);
        if (history.length > 20) history.shift(); // Keep last 20 prices
        priceHistoryRef.current.set(update.tokenId, history);

        // Calculate 24h change based on history
        const oldestPrice = history[0];
        const priceChange = history.length > 1 
          ? ((newPrice - oldestPrice) / oldestPrice) * 100
          : token.priceChange24h;

        onPriceUpdate(update.tokenId, {
          price: newPrice,
          priceChange24h: priceChange,
          volume24h: newVolume,
        });
      });
    } else if (message.type === 'priceUpdate') {
      const update = message.data as PriceUpdate;
      const token = tokens.find(t => t.id === update.tokenId);
      
      if (token) {
        const priceMultiplier = 1 + (update.priceChange24h / 100);
        const newPrice = token.price * priceMultiplier;

        onPriceUpdate(update.tokenId, {
          price: newPrice,
          priceChange24h: update.priceChange24h,
        });
      }
    }
  }, [tokens, onPriceUpdate]);

  // Subscribe to token updates
  useEffect(() => {
    if (!wsRef.current || tokens.length === 0) return;

    const tokenIds = tokens.map(t => t.id);
    
    // Subscribe to tokens
    wsRef.current.subscribe(tokenIds);
    
    // Listen for updates
    wsRef.current.on('message', handlePriceUpdate);

    return () => {
      wsRef.current.off('message', handlePriceUpdate);
      wsRef.current.unsubscribe(tokenIds);
    };
  }, [tokens, handlePriceUpdate]);

  // Handle connection status
  useEffect(() => {
    if (!wsRef.current) return;

    const handleConnection = () => setIsConnected(true);
    const handleError = (error: any) => {
      setConnectionError(error.message || 'Connection error');
      setIsConnected(false);
    };

    wsRef.current.on('connection', handleConnection);
    wsRef.current.on('error', handleError);

    return () => {
      wsRef.current.off('connection', handleConnection);
      wsRef.current.off('error', handleError);
    };
  }, []);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current.connect()
        .then(() => {
          setIsConnected(true);
          setConnectionError(null);
        })
        .catch(() => {
          setConnectionError('Failed to reconnect');
        });
    }
  }, []);

  return {
    isConnected,
    connectionError,
    reconnect,
  };
};