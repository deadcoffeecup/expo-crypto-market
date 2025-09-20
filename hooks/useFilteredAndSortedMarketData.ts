import { MarketDataType } from '@/types/market';
import { useMemo } from 'react';

export type SortOption = 'name' | 'spread';
export type SortDirection = 'asc' | 'desc';

type UseFilteredAndSortedMarketDataArgs = {
  marketData: MarketDataType[];
  searchQuery: string;
  sortOption: SortOption;
  sortDirection: SortDirection;
};

export function useFilteredAndSortedMarketData({
  marketData,
  searchQuery,
  sortOption,
  sortDirection,
}: UseFilteredAndSortedMarketDataArgs): MarketDataType[] {
  const filteredAndSortedData = useMemo(() => {
    let filtered = marketData;

    if (searchQuery.trim()) {
      filtered = marketData.filter((item) =>
        item.ticker_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;

      switch (sortOption) {
        case 'name':
          aValue = a.ticker_id.toLowerCase();
          bValue = b.ticker_id.toLowerCase();
          break;
        case 'spread':
          aValue = a.spread_percentage;
          bValue = b.spread_percentage;
          break;
        default:
          return 0;
      }

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null) return sortDirection === 'asc' ? -1 : 1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [marketData, searchQuery, sortOption, sortDirection]);

  return filteredAndSortedData;
}
