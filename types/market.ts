export interface MarketPair {
  ticker_id: string;
  base: string;
  target: string;
}

export type SummaryType = {
  trading_pairs: string;
  lowest_price_24h: string;
  highest_price_24h: string;
  highest_bid: string;
  lowest_ask: string;
  base_volume: string;
  quote_volume: string;
  last_price: string;
  price_change_percent_24h: string;
};

export type TradingSummaryResponse = {
  timestamp: string;
  summary: SummaryType[];
};

export type RAGStatus = 'green' | 'amber' | 'red';

export interface MarketDataType {
  ticker_id: string;
  highest_bid: string | null;
  lowest_ask: string | null;
  spread_percentage: number | null;
  rag_status: RAGStatus;
}
