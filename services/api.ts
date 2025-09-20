import { BASE_URL } from '@/constants/api';
import { SummaryType, TradingSummaryResponse } from '@/types/market';

export interface MarketPair {
  ticker_id: string;
  base: string;
  target: string;
  pool_id?: string;
  [key: string]: any;
}

export async function fetchMarketPairs(): Promise<MarketPair[]> {
  try {
    const response = await fetch(`${BASE_URL}/market/pairs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: MarketPair[] = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching market pairs:', error);
    throw error;
  }
}

export async function fetchMarketSummaries(): Promise<SummaryType[]> {
  try {
    const response = await fetch(`${BASE_URL}/market/summary`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TradingSummaryResponse = await response.json();
    return data.summary || [];
  } catch (error) {
    console.error('Error fetching market summaries:', error);
    throw error;
  }
}

export async function fetchCombinedMarketData(): Promise<{
  pairs: MarketPair[];
  summaries: SummaryType[];
}> {
  try {
    const [pairs, summaries] = await Promise.all([
      fetchMarketPairs(),
      fetchMarketSummaries(),
    ]);

    return { pairs, summaries };
  } catch (error) {
    console.error('Error fetching combined market data:', error);
    throw error;
  }
}
