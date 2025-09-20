import { fetchCombinedMarketData } from '@/services/api';
import { combineMarketData, MarketDataType } from '@/types/market';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    marketData,
    loading,
    error,
    refetch: loadMarketData,
  };
}
