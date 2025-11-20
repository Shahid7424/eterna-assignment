"use client";
import React, { useState } from 'react';
import { 
  Shield, AlertCircle, ExternalLink, Zap, TrendingUp, TrendingDown,
  BarChart3, Users, Activity, Copy, ChevronRight
} from 'lucide-react';
import { Token } from '@/lib/types/token';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { CopyButton } from '../../components/CopyButton';
import { PriceChange } from '../../components/PriceChange';
import { formatNumber, formatPrice, truncateAddress } from '@/lib/utils/format';

interface TokenDetailsModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickBuy: () => void;
}

export const TokenDetailsModal: React.FC<TokenDetailsModalProps> = ({ 
  token, 
  isOpen, 
  onClose,
  onQuickBuy 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!token) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trades', label: 'Trades', icon: Activity },
    { id: 'holders', label: 'Holders', icon: Users },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-0">
        {/* Header with Chart */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 -m-6 mb-6 rounded-t-lg border-b border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-500/20">
                {token.symbol.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white">{token.name}</h3>
                  {token.isVerified && (
                    <div title="Verified">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                  {token.isHoneypot && (
                    <div title="Honeypot">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                  )}
                </div>
                <div className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="font-semibold">{token.symbol}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-xs">{truncateAddress(token.address)}</span>
                  <CopyButton text={token.address} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{formatPrice(token.price)}</div>
              <PriceChange value={token.priceChange24h} />
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-20 bg-slate-900/50 rounded-lg overflow-hidden">
            <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <polyline points="0,45 10,40 20,35 30,30 40,32 50,28 60,25 70,22 80,20 90,18 100,16 110,15 120,14 130,13 140,15 150,18 160,20 170,22 180,20 190,18 200,15" fill="none" stroke="#06b6d4" strokeWidth="2" />
              <polygon points="0,45 10,40 20,35 30,30 40,32 50,28 60,25 70,22 80,20 90,18 100,16 110,15 120,14 130,13 140,15 150,18 160,20 170,22 180,20 190,18 200,15 200,60 0,60" fill="url(#chartGrad)" />
            </svg>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6 px-6">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Market Cap</div>
            <div className="text-sm font-bold text-white">{formatNumber(token.marketCap)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">24h Volume</div>
            <div className="text-sm font-bold text-white">{formatNumber(token.volume24h)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Liquidity</div>
            <div className="text-sm font-bold text-white">{formatNumber(token.liquidity)}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Holders</div>
            <div className="text-sm font-bold text-white">{token.holders.toLocaleString()}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 px-6 mb-6 gap-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Trading Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="text-xs text-slate-400 mb-2">Transactions</div>
                    <div className="text-lg font-bold text-white mb-2">{token.transactions.toLocaleString()}</div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="text-xs text-slate-400 mb-2">Buy/Sell Ratio</div>
                    <div className="text-lg font-bold text-white mb-2">{(token.buys / token.sells).toFixed(2)}</div>
                    <div className="flex gap-1 text-xs">
                      <span className="text-green-400">Buy {Math.round((token.buys / (token.buys + token.sells)) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Risk Profile</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400 text-sm">Dev Holdings</div>
                      <Badge variant={token.devHoldingPercent > 10 ? 'danger' : 'success'}>
                        {token.devHoldingPercent > 10 ? 'High' : 'Low'}
                      </Badge>
                    </div>
                    <span className={`font-bold text-sm ${token.devHoldingPercent > 10 ? 'text-red-400' : 'text-green-400'}`}>
                      {token.devHoldingPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <span className="text-slate-400 text-sm">Top 10 Holders</span>
                    <span className="font-bold text-sm text-white">{token.top10HoldersPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <span className="text-slate-400 text-sm">Snipers</span>
                    <span className={`font-bold text-sm ${token.snipersPercent > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {token.snipersPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trades Tab */}
          {activeTab === 'trades' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Recent trading activity</p>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">
                        {i % 2 === 0 ? '🟢 Buy' : '🔴 Sell'} {Math.random().toFixed(2)} SOL
                      </p>
                      <p className="text-xs text-slate-500">09:{String(18 + i).padStart(2, '0')}:45</p>
                    </div>
                    <div className={`text-sm font-bold ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {i % 2 === 0 ? '+' : '-'}${(Math.random() * 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Holders Tab */}
          {activeTab === 'holders' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Top token holders</p>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold">
                        {i}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Holder #{i}</p>
                        <p className="text-xs text-slate-500">0x{i}a2b...{i}c3d</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">{(Math.random() * 10).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 border border-slate-600">
            <ExternalLink className="w-4 h-4" />
            Explorer
          </button>
          <button
            onClick={onQuickBuy}
            disabled={token.isHoneypot}
            className={`flex-1 px-6 py-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-2 border ${
              token.isHoneypot
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-600'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 border-cyan-500/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            Trade Now
          </button>
        </div>
      </div>
    </Modal>
  );
};