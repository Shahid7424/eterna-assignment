"use client";
import React, { memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortField, SortOrder } from '@/lib/types/token';

interface TableHeaderProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  showBondingColumn: boolean;
}

export const TableHeader = memo(({ sortField, sortOrder, onSort, showBondingColumn }: TableHeaderProps) => {
  const SortButton = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group"
      >
        <span className={isActive ? 'text-white font-semibold' : ''}>{label}</span>
        {isActive && (
          sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </button>
    );
  };

  return (
    <thead className="bg-gray-900/80 sticky top-0 z-10">
      <tr className="border-b border-gray-800">
        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-400">Token</th>
        <th className="px-3 py-4 text-left text-sm font-semibold">
          <SortButton field="price" label="Price" />
        </th>
        <th className="px-3 py-4 text-left text-sm font-semibold">
          <SortButton field="volume24h" label="24h Volume" />
        </th>
        <th className="px-3 py-4 text-left text-sm font-semibold">
          <SortButton field="liquidity" label="Liquidity" />
        </th>
        <th className="px-3 py-4 text-left text-sm font-semibold">
          <SortButton field="marketCap" label="Market Cap" />
        </th>
        <th className="px-3 py-4 text-left text-sm font-semibold">
          <SortButton field="holders" label="Holders" />
        </th>
        <th className="px-3 py-4 text-left text-sm font-semibold">
          <SortButton field="age" label="Age" />
        </th>
        {showBondingColumn && (
          <th className="px-3 py-4 text-left text-sm font-semibold text-gray-400">Bonding</th>
        )}
        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-400">Risk</th>
        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-400">Buy</th>
        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
      </tr>
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';