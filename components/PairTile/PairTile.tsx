import { MarketDataType } from '@/types/market';
import React from 'react';
import { MarketDataModel, PRICE_MODE } from '../../models/MarketDataModel';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { useThemedStyles } from './styles';

export const PairTile = ({ item }: { item: MarketDataType }) => {
  const marketDataModel = new MarketDataModel(item);
  const styles = useThemedStyles();
  return (
    <ThemedView style={styles.marketRow}>
      <ThemedText style={styles.tickerText}>
        {marketDataModel.getTickerText()}
      </ThemedText>
      <ThemedText style={styles.priceText}>
        {marketDataModel.getPrice(PRICE_MODE.HIGHEST_BID)}
      </ThemedText>
      <ThemedText style={styles.priceText}>
        {marketDataModel.getPrice(PRICE_MODE.LOWEST_ASK)}
      </ThemedText>
      <ThemedText style={styles.spreadText}>
        {marketDataModel.getSpread()}
      </ThemedText>
      <ThemedView
        style={[
          styles.ragIndicator,
          { backgroundColor: marketDataModel.getRAGColor() },
        ]}
      />
    </ThemedView>
  );
};
