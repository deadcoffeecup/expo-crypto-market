import { fetchCombinedMarketData } from '@/services/api';
import { combineMarketData, MarketData } from '@/types/market';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PairTile } from './PairTile';
import { styles } from './styles';

type SortOption = 'name' | 'spread';
type SortDirection = 'asc' | 'desc';

export function MarketRanking() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { pairs, summaries } = await fetchCombinedMarketData();
      const combinedData = combineMarketData(pairs, summaries);
      setMarketData(combinedData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load market data';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSort = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  const renderMarketItem = ({ item }: { item: MarketData }) => {
    return (
      <View style={styles.marketRow}>
        <Text style={styles.tickerText}>
          {item.ticker_id.replace('_', '/')}
        </Text>
        <Text style={styles.priceText}>{formatPrice(item.highest_bid)}</Text>
        <Text style={styles.priceText}>{formatPrice(item.lowest_ask)}</Text>
        <Text style={styles.spreadText}>
          {formatSpread(item.spread_percentage)}
        </Text>
        <View
          style={[
            styles.ragIndicator,
            { backgroundColor: getRAGColor(item.rag_status) },
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={styles.loadingText}>Loading market data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMarketData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search markets...'
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor='#666'
        />
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === 'name' && styles.sortButtonActive,
          ]}
          onPress={() => handleSort('name')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOption === 'name' && styles.sortButtonTextActive,
            ]}
          >
            Name{' '}
            {sortOption === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === 'spread' && styles.sortButtonActive,
          ]}
          onPress={() => handleSort('spread')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOption === 'spread' && styles.sortButtonTextActive,
            ]}
          >
            Spread{' '}
            {sortOption === 'spread' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={{ ...styles.headerText, width: '25%' }}>Market</Text>
        <Text style={styles.headerText}>BID</Text>
        <Text style={styles.headerText}>ASK</Text>
        <Text style={styles.headerText}>Spread</Text>
        <Text style={styles.headerText}>RAG</Text>
      </View>

      <FlatList
        data={filteredAndSortedData}
        initialNumToRender={20}
        removeClippedSubviews
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 56,
          offset: 56 * index,
          index,
        })}
        keyExtractor={(item) => item.ticker_id}
        renderItem={({ item }) => <PairTile item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

export const formatPrice = (price: string | null): string => {
  if (price === null || price === '') return '-';

  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '-';

  return numPrice.toFixed(numPrice < 1 ? 6 : 2);
};

export const formatSpread = (spread: number | null): string => {
  if (spread === null) return '-';
  return `${spread.toFixed(2)}%`;
};
export const getRAGColor = (status: string): string => {
  switch (status) {
    case 'green':
      return '#4CAF50';
    case 'amber':
      return '#FF9800';
    case 'red':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};
