import { REFRESH_INTERVAL } from '@/constants/api';
import { combineMarketData } from '@/helpers/market';
import { MarketDataModel } from '@/models/MarketDataModel';
import { fetchCombinedMarketData, fetchMarketSummaries } from '@/services/api';
import { MarketDataType } from '@/types/market';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadMarketData();

    intervalRef.current = setInterval(() => {
      refreshSummariesOnly();
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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

  const refreshSummariesOnly = async () => {
    try {
      const summaries = await fetchMarketSummaries();

      setMarketData((currentData) => {
        if (currentData.length === 0) return currentData;

        const pairs = currentData.map((item) => {
          return MarketDataModel.getPairs(item);
        });

        return combineMarketData(pairs, summaries);
      });
    } catch (err) {
      console.warn('Auto-refresh failed:', err);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.warn('Auto-refresh stopped due to repeated failures');
      }
    }
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    marketData,
    loading,
    error,
    refetch: loadMarketData,
    refreshInterval: REFRESH_INTERVAL,
    stopAutoRefresh,
  };
}
