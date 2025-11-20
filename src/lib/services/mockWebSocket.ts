import { Token } from '../types/token';
import { PriceUpdate } from './websocket';


export class MockWebSocketServer {
  private listeners: Set<(data: any) => void> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribedTokens: Set<string> = new Set();
  private isConnected = false;

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        console.log('✅ Mock WebSocket connected');
        this.emit('connection', { status: 'connected' });
        this.startPriceUpdates();
        resolve();
      }, 500);
    });
  }

  private startPriceUpdates() {
    // Send updates every 2-5 seconds
    this.updateInterval = setInterval(() => {
      if (this.subscribedTokens.size === 0) return;

      const updates: PriceUpdate[] = [];
      
      // Randomly select 1-3 tokens to update
      const tokensArray = Array.from(this.subscribedTokens);
      const numUpdates = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < Math.min(numUpdates, tokensArray.length); i++) {
        const randomToken = tokensArray[Math.floor(Math.random() * tokensArray.length)];
        
        // Generate realistic price movement (-5% to +5%)
        const priceChangePercent = (Math.random() - 0.5) * 10;
        const volumeChangePercent = (Math.random() - 0.5) * 20;
        
        updates.push({
          tokenId: randomToken,
          price: 0, // Will be calculated in the hook
          priceChange24h: priceChangePercent,
          volume24h: 0, // Will be calculated in the hook
          timestamp: Date.now(),
        });
      }

      if (updates.length > 0) {
        this.emit('bulkUpdate', updates);
      }
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds
  }

  subscribe(tokenIds: string[]) {
    tokenIds.forEach(id => this.subscribedTokens.add(id));
    console.log(`📊 Subscribed to ${tokenIds.length} tokens`);
  }

  unsubscribe(tokenIds: string[]) {
    tokenIds.forEach(id => this.subscribedTokens.delete(id));
    console.log(`🔕 Unsubscribed from ${tokenIds.length} tokens`);
  }

  on(event: string, callback: (data: any) => void) {
    this.listeners.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.forEach(callback => {
      try {
        callback({ type: event, data });
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }

  disconnect() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.subscribedTokens.clear();
    this.listeners.clear();
    this.isConnected = false;
    console.log('🔌 Mock WebSocket disconnected');
  }

  getReadyState(): number {
    return this.isConnected ? WebSocket.OPEN : WebSocket.CLOSED;
  }
}

// Singleton instance for mock server
let mockWsInstance: MockWebSocketServer | null = null;

export const getMockWebSocketService = (): MockWebSocketServer => {
  if (!mockWsInstance) {
    mockWsInstance = new MockWebSocketServer();
  }
  return mockWsInstance;
};