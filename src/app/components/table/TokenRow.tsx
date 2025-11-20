"use client";
import React, { memo, useState, useEffect } from 'react';
import { Shield, AlertCircle, Info, Zap, ExternalLink } from 'lucide-react';
import { Token } from '@/lib/types/token';
import { formatNumber, formatPrice, formatTimeAgo, truncateAddress } from '@/lib/utils/format';
import { Badge } from '../../components/Badge';
import { Tooltip } from '../../components/Tooltip';
import { Popover } from '../../components/Popover';
import { CopyButton } from '../../components/CopyButton';
import { PriceChange } from '../../components/PriceChange';

interface TokenRowProps {
  token: Token;
  onQuickBuy: (token: Token) => void;
  onViewDetails: (token: Token) => void;
}

export const TokenRow = memo(({ token, onQuickBuy, onViewDetails }: TokenRowProps) => {
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPriceFlash(Math.random() > 0.5 ? 'up' : 'down');
        setTimeout(() => setPriceFlash(null), 300);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors group">
      {/* Token Info */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onViewDetails(token)}
          >
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold hover:text-purple-400 cursor-pointer transition-colors" onClick={() => onViewDetails(token)}>
                {token.name}
              </span>
              {token.isVerified && (
                <Tooltip content="Verified Token">
                  <Shield className="w-4 h-4 text-blue-400" />
                </Tooltip>
              )}
              {token.isHoneypot && (
                <Tooltip content="Potential Honeypot Risk">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </Tooltip>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              {token.symbol}
              <span className="text-gray-600">•</span>
              <span className="hover:text-purple-400 cursor-pointer">{truncateAddress(token.address)}</span>
              <CopyButton text={token.address} />
            </div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-3 py-4">
        <div className={`transition-colors duration-300 ${
          priceFlash === 'up' ? 'text-green-400' : priceFlash === 'down' ? 'text-red-400' : 'text-white'
        }`}>
          <div className="font-medium">{formatPrice(token.price)}</div>
          <PriceChange value={token.priceChange24h} />
        </div>
      </td>

      {/* Volume */}
      <td className="px-3 py-4">
        <div className="text-white font-medium">{formatNumber(token.volume24h)}</div>
        <div className="text-xs text-gray-400">{token.transactions.toLocaleString()} txns</div>
      </td>

      {/* Liquidity */}
      <td className="px-3 py-4">
        <div className="text-white font-medium">{formatNumber(token.liquidity)}</div>
      </td>

      {/* Market Cap */}
      <td className="px-3 py-4">
        <div className="text-white font-medium">{formatNumber(token.marketCap)}</div>
      </td>

      {/* Holders */}
      <td className="px-3 py-4">
        <div className="text-white font-medium">{token.holders.toLocaleString()}</div>
        <div className="text-xs text-gray-400">Top 10: {token.top10HoldersPercent.toFixed(1)}%</div>
      </td>

      {/* Age */}
      <td className="px-3 py-4">
        <Badge>{formatTimeAgo(token.age)}</Badge>
      </td>

      {/* Bonding Progress */}
      {token.bondingProgress !== undefined && (
        <td className="px-3 py-4">
          <div className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{token.bondingProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${token.bondingProgress}%` }}
              />
            </div>
          </div>
        </td>
      )}

      {/* Risk Metrics */}
      <td className="px-3 py-4">
        <Popover
          trigger={
            <button className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded">
              <Info className="w-5 h-5" />
            </button>
          }
          content={
            <div className="p-4">
              <h3 className="text-white font-semibold mb-3">Risk Metrics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dev Holding:</span>
                  <span className={`font-medium ${token.devHoldingPercent > 10 ? 'text-red-400' : 'text-green-400'}`}>
                    {token.devHoldingPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Snipers:</span>
                  <span className={`font-medium ${token.snipersPercent > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {token.snipersPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Insiders:</span>
                  <span className={`font-medium ${token.insidersPercent > 10 ? 'text-red-400' : 'text-green-400'}`}>
                    {token.insidersPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          }
        />
      </td>

      {/* Quick Buy */}
      <td className="px-3 py-4">
        <Tooltip content="Quick Buy">
          <button
            onClick={() => onQuickBuy(token)}
            disabled={token.isHoneypot}
            className={`p-2 rounded-lg transition-all ${
              token.isHoneypot 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105'
            }`}
          >
            <Zap className="w-5 h-5" />
          </button>
        </Tooltip>
      </td>

      {/* Actions */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content="View on Explorer">
            <button className="p-1 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded">
              <ExternalLink className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
});

TokenRow.displayName = 'TokenRow';