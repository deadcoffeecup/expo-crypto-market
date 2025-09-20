import { fetchCombinedMarketData } from '@/services/api';
import { combineMarketData, MarketData } from '@/types/market';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PairTile } from '../PairTile';
import { styles } from './styles';

import {
  SortDirection,
  SortOption,
  useFilteredAndSortedMarketData,
} from '@/hooks/useFilteredAndSortedMarketData';

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

  const filteredAndSortedData = useFilteredAndSortedMarketData({
    marketData,
    searchQuery,
    sortOption,
    sortDirection,
  });

  const handleSort = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
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
