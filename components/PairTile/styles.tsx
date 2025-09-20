import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  marketRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  tickerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  spreadText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  ragIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
