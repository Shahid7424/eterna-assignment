import { useState, useCallback, useMemo } from 'react';
import { Token, SortField, SortOrder } from '../types/token';

export const useSorting = (tokens: Token[]) => {
  const [sortField, setSortField] = useState<SortField>('age');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * multiplier;
    });
  }, [tokens, sortField, sortOrder]);

  return {
    sortField,
    sortOrder,
    sortedTokens,
    handleSort,
  };
};