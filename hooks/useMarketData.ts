import { REFRESH_INTERVAL } from '@/constants/api';
import { combineMarketData } from '@/helpers/market';
import { useGetCombinedMarketDataQuery } from '@/store/marketApi';
import { useMemo } from 'react';
import { Alert } from 'react-native';

export function useMarketData() {
  const {
    data: combinedData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useGetCombinedMarketDataQuery(undefined, {
    pollingInterval: REFRESH_INTERVAL,
  });

  const marketData = useMemo(() => {
    if (!combinedData) return [];
    return combineMarketData(combinedData.pairs, combinedData.summaries);
  }, [combinedData]);

  const error = useMemo(() => {
    if (!queryError) return null;
    const errorMessage =
      queryError instanceof Error
        ? queryError.message
        : 'Failed to load market data';
    // Show alert for errors (similar to original behavior)
    if (queryError) {
      Alert.alert('Error', errorMessage);
    }
    return errorMessage;
  }, [queryError]);

  const stopAutoRefresh = () => {
    // RTK Query handles polling internally, we can't directly stop it from the hook
    // This method is kept for API compatibility but doesn't do anything
    console.warn(
      'Auto-refresh cannot be stopped with RTK Query polling. Use pollingInterval: 0 in query options if needed.'
    );
  };

  return {
    marketData,
    loading,
    error,
    refetch,
    refreshInterval: REFRESH_INTERVAL,
    stopAutoRefresh,
  };
}
