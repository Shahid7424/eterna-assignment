import React, { memo } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string | null;
  onReconnect: () => void;
}

export const ConnectionStatus = memo(({ isConnected, error, onReconnect }: ConnectionStatusProps) => {
  if (isConnected) {
    return (
      <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <Wifi className="w-4 h-4" />
        Live
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg text-sm flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        {error || 'Disconnected'}
      </div>
      <button
        onClick={onReconnect}
        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Reconnect
      </button>
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';