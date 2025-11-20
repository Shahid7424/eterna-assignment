"use client";
import React, { useState } from 'react';
import { AlertCircle, Zap, ChevronDown } from 'lucide-react';
import { Token } from '@/lib/types/token';
import { Modal } from '../../components/Modal';
import { PriceChange } from '../../components/PriceChange';
import { formatNumber, formatPrice, truncateAddress } from '@/lib/utils/format';

interface QuickBuyModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickBuyModal: React.FC<QuickBuyModalProps> = ({ token, isOpen, onClose }) => {
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slippage, setSlippage] = useState('0.5');

  if (!token) return null;

  const presets = [0.01, 0.1, 0.5, 1];
  
  // Calculate estimated tokens
  const estimatedTokens = buyAmount ? (parseFloat(buyAmount) / token.price).toFixed(2) : '0.00';
  const estimatedPrice = buyAmount ? (parseFloat(buyAmount) * (1 + parseFloat(slippage) / 100)).toFixed(4) : '0.00';

  const handlePreset = (amount: number) => {
    setBuyAmount(amount.toString());
    setSelectedPreset(amount);
  };

  const handleQuickBuy = () => {
    if (buyAmount && parseFloat(buyAmount) > 0) {
      alert(`Buy order submitted: ${buyAmount} SOL\nEstimated tokens: ${estimatedTokens} ${token.symbol}`);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-0">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 -m-6 mb-6 rounded-t-lg border-b border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
              {token.symbol.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{token.name}</h3>
              <p className="text-xs text-slate-400">{token.symbol}</p>
            </div>
          </div>
          
          {/* Price Display */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Current Price</p>
              <p className="text-2xl font-bold text-white">{formatPrice(token.price)}</p>
            </div>
            <div>
              <PriceChange value={token.priceChange24h} />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 px-6 mb-6">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Market Cap</p>
            <p className="text-sm font-bold text-white">{formatNumber(token.marketCap)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Liquidity</p>
            <p className="text-sm font-bold text-white">{formatNumber(token.liquidity)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">24h Volume</p>
            <p className="text-sm font-bold text-white">{formatNumber(token.volume24h)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Holders</p>
            <p className="text-sm font-bold text-white">{token.holders.toLocaleString()}</p>
          </div>
        </div>

        {/* Trading Section */}
        <div className="px-6 pb-6 space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Amount (SOL)</label>
            <div className="relative">
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => {
                  setBuyAmount(e.target.value);
                  setSelectedPreset(null);
                }}
                placeholder="0.0"
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">SOL</span>
            </div>
          </div>

          {/* Preset Amounts */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Quick select</p>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handlePreset(amount)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    selectedPreset === amount
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Output */}
          {buyAmount && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">You will receive</span>
                  <span className="text-sm font-semibold text-cyan-400">{estimatedTokens} {token.symbol}</span>
                </div>
                <div className="h-px bg-slate-700" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Price with slippage</span>
                  <span className="text-xs font-semibold text-white">{estimatedPrice} SOL</span>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <span className="text-sm font-semibold text-white">Advanced Settings</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-white">Slippage Tolerance</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-white text-sm font-medium transition-colors">
                    %
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Common settings</p>
                <div className="flex gap-2">
                  {['0.1', '0.5', '1'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSlippage(val)}
                      className="flex-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded transition-colors text-slate-300"
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-200 mb-1">Always DYOR</p>
                <p className="text-xs text-yellow-200/80">
                  This token has not been audited. High risk. Trade at your own risk.
                </p>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-xs font-semibold text-white mb-3">Risk Profile</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Dev Holdings</span>
                <span className={token.devHoldingPercent > 10 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                  {token.devHoldingPercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Top 10 Holders</span>
                <span className="text-white font-semibold">{token.top10HoldersPercent.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Buy/Sell Ratio</span>
                <span className="text-cyan-400 font-semibold">{(token.buys / token.sells).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all font-semibold border border-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleQuickBuy}
            disabled={!buyAmount || parseFloat(buyAmount) <= 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg transition-all font-semibold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-500/50"
          >
            <Zap className="w-4 h-4" />
            Buy {token.symbol}
          </button>
        </div>
      </div>
    </Modal>
  );
};