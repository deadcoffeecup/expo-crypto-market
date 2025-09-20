import { BASE_URL } from '@/constants/api';
import {
  MarketPair,
  SummaryType,
  TradingSummaryResponse,
} from '@/types/market';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getMarketPairs: builder.query<MarketPair[], void>({
      query: () => '/market/pairs',
      transformResponse: (response: MarketPair[]) => response || [],
    }),
    getMarketSummaries: builder.query<SummaryType[], void>({
      query: () => '/market/summary',
      transformResponse: (response: TradingSummaryResponse) =>
        response.summary || [],
    }),
    getCombinedMarketData: builder.query<
      {
        pairs: MarketPair[];
        summaries: SummaryType[];
      },
      void
    >({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const [pairsResult, summariesResult] = await Promise.all([
          fetchWithBQ('/market/pairs'),
          fetchWithBQ('/market/summary'),
        ]);

        if (pairsResult.error) {
          return { error: pairsResult.error };
        }

        if (summariesResult.error) {
          return { error: summariesResult.error };
        }

        const pairs = (pairsResult.data as MarketPair[]) || [];
        const summariesResponse =
          summariesResult.data as TradingSummaryResponse;
        const summaries = summariesResponse.summary || [];

        return {
          data: { pairs, summaries },
        };
      },
    }),
  }),
});

export const {
  useGetMarketPairsQuery,
  useGetMarketSummariesQuery,
  useGetCombinedMarketDataQuery,
} = marketApi;
