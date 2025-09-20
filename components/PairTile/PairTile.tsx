import { MarketData } from '@/types/market';
import React from 'react';
import { Text, View } from 'react-native';
import { formatPrice, formatSpread, getRAGColor } from '../MarketRanking';
import { styles } from './styles';

export const PairTile = ({ item }: { item: MarketData }) => {
  return (
    <View style={styles.marketRow}>
      <Text style={styles.tickerText}>{item.ticker_id.replace('_', '/')}</Text>
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
