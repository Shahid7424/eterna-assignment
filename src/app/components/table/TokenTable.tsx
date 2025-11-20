"use client";

import React, { useState } from "react";
import { Search, Filter, X, AlertCircle } from "lucide-react";
import { TabType } from "../../../lib/types/token";
import { useTokenData } from "../../../lib/hooks/useTokenData";
import { useFilters } from "../../../lib/hooks/useFilters";
import { useSorting } from "../../../lib/hooks/useSorting";
import { TableHeader } from "./TableHeader";
import { TokenRow } from "./TokenRow";
import { SkeletonRow } from "../../components/SkeletonRow";
import { Popover } from "../../components/Popover";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { QuickBuyModal } from "../../components/modals/QuickBuyModal";
import { TokenDetailsModal } from "../../components/modals/TokenDetailsModal";

// ⭐ NEW
import { useLivePrices } from "../../../lib/hooks/useLivePrices";

export default function TokenTable() {
  const [activeTab, setActiveTab] = useState<TabType>("new");
  const { tokens, isLoading } = useTokenData(activeTab);

  const {
    filters,
    filteredTokens,
    handleFilterChange,
    handleResetFilters,
  } = useFilters(tokens[activeTab]);

  const {
    sortField,
    sortOrder,
    sortedTokens,
    handleSort,
  } = useSorting(filteredTokens);

  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [showQuickBuy, setShowQuickBuy] = useState<any>(null);

  // ⭐ addresses for WS (normalized)
  const addresses = sortedTokens.map((t) => t.address.toLowerCase());

  // ⭐ live updates keyed by address
  const liveUpdates = useLivePrices(addresses);

  // ⭐ merge static data + live WS data
  const liveTokens = sortedTokens.map((token) => {
    const addr = token.address.toLowerCase();
    return {
      ...token,
      ...(liveUpdates[addr] || {}),
    };
  });

  const tabConfig = [
    { id: "new" as TabType, label: "New Pairs", count: tokens.new.length },
    { id: "final" as TabType, label: "Final Stretch", count: tokens.final.length },
    { id: "migrated" as TabType, label: "Migrated", count: tokens.migrated.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Token Discovery
              </h1>
              <p className="text-gray-400">
                Real-time token tracking and analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-750"
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-black/30 rounded text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens by name or symbol..."
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange({ searchQuery: e.target.value })
                }
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => handleFilterChange({ searchQuery: "" })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <Popover
              trigger={
                <button className="px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {(filters.excludeHoneypot ||
                    filters.verifiedOnly ||
                    filters.minLiquidity > 0) && (
                    <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </button>
              }
              content={
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              }
              align="right"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                showBondingColumn={activeTab === "final"}
              />
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : liveTokens.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-12 h-12 text-gray-600" />
                        <div className="text-gray-400">
                          No tokens found matching your criteria
                        </div>
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  liveTokens.map((token) => (
                    <TokenRow
                      key={token.id}
                      token={token}
                      onQuickBuy={(t) => setShowQuickBuy(t)}
                      onViewDetails={(t) => setSelectedToken(t)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && liveTokens.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Showing {liveTokens.length} of {tokens[activeTab].length} tokens
          </div>
        )}
      </div>

      {/* Modals */}
      <QuickBuyModal
        token={showQuickBuy}
        isOpen={!!showQuickBuy}
        onClose={() => setShowQuickBuy(null)}
      />

      <TokenDetailsModal
        token={selectedToken}
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
        onQuickBuy={() => {
          setShowQuickBuy(selectedToken);
          setSelectedToken(null);
        }}
      />
    </div>
  );
}
