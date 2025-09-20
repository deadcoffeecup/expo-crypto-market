import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { PairTile } from '../PairTile';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { useThemedStyles } from './styles';

import {
  SortDirection,
  SortOption,
  useFilteredAndSortedMarketData,
} from '@/hooks/useFilteredAndSortedMarketData';
import { useMarketData } from '@/hooks/useMarketData';

export function MarketRanking() {
  const { marketData, loading, error, refetch } = useMarketData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const styles = useThemedStyles();
  const placeholderTextColor = useThemeColor({}, 'textSecondary');

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
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size='large' color='#007AFF' />
        <ThemedText style={styles.loadingText}>
          Loading market data...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search markets...'
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={placeholderTextColor}
        />
      </ThemedView>

      <ThemedView style={styles.sortContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === 'name' && styles.sortButtonActive,
          ]}
          onPress={() => handleSort('name')}
        >
          <ThemedText
            style={[
              styles.sortButtonText,
              sortOption === 'name' && styles.sortButtonTextActive,
            ]}
          >
            Name{' '}
            {sortOption === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === 'spread' && styles.sortButtonActive,
          ]}
          onPress={() => handleSort('spread')}
        >
          <ThemedText
            style={[
              styles.sortButtonText,
              sortOption === 'spread' && styles.sortButtonTextActive,
            ]}
          >
            Spread{' '}
            {sortOption === 'spread' && (sortDirection === 'asc' ? '↑' : '↓')}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.headerRow}>
        <ThemedText style={{ ...styles.headerText, width: '25%' }}>
          Market
        </ThemedText>
        <ThemedText style={styles.headerText}>BID</ThemedText>
        <ThemedText style={styles.headerText}>ASK</ThemedText>
        <ThemedText style={styles.headerText}>Spread</ThemedText>
        <ThemedText style={styles.headerText}>RAG</ThemedText>
      </ThemedView>

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
    </ThemedView>
  );
}
