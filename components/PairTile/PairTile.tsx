import { MarketDataType } from '@/types/market';
import React from 'react';
import { Text, View } from 'react-native';
import { MarketDataModel, PRICE_MODE } from '../../models/MarketDataModel';
import { styles } from './styles';

export const PairTile = ({ item }: { item: MarketDataType }) => {
  const marketDataModel = new MarketDataModel(item);
  return (
    <View style={styles.marketRow}>
      <Text style={styles.tickerText}>{marketDataModel.getTickerText()}</Text>
      <Text style={styles.priceText}>
        {marketDataModel.getPrice(PRICE_MODE.HIGHEST_BID)}
      </Text>
      <Text style={styles.priceText}>
        {marketDataModel.getPrice(PRICE_MODE.LOWEST_ASK)}
      </Text>
      <Text style={styles.spreadText}>{marketDataModel.getSpread()}</Text>
      <View
        style={[
          styles.ragIndicator,
          { backgroundColor: marketDataModel.getRAGColor() },
        ]}
      />
    </View>
  );
};
