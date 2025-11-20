import React, { memo } from 'react';
import { FilterState } from '@/lib/types/token';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

export const FilterPanel = memo(({ filters, onFilterChange, onReset }: FilterPanelProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Advanced Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Liquidity Range */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Liquidity Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minLiquidity || ''}
            onChange={(e) => onFilterChange({ minLiquidity: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxLiquidity || ''}
            onChange={(e) => onFilterChange({ maxLiquidity: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Volume Range */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">24h Volume Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minVolume || ''}
            onChange={(e) => onFilterChange({ minVolume: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxVolume || ''}
            onChange={(e) => onFilterChange({ maxVolume: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Market Cap Range */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Market Cap Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minMarketCap || ''}
            onChange={(e) => onFilterChange({ minMarketCap: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxMarketCap || ''}
            onChange={(e) => onFilterChange({ maxMarketCap: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Holders Range */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Holder Count</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minHolders || ''}
            onChange={(e) => onFilterChange({ minHolders: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxHolders || ''}
            onChange={(e) => onFilterChange({ maxHolders: Number(e.target.value) })}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 pt-2 border-t border-gray-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.excludeHoneypot}
            onChange={(e) => onFilterChange({ excludeHoneypot: e.target.checked })}
            className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-300">Exclude Honeypots</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
            className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-300">Verified Tokens Only</span>
        </label>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';