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

export function calculateSpreadPercentage(
  ask: string | null,
  bid: string | null
): number | null {
  if (ask === null || bid === null || ask === '' || bid === '') {
    return null;
  }

  const askNum = parseFloat(ask);
  const bidNum = parseFloat(bid);

  if (isNaN(askNum) || isNaN(bidNum) || askNum <= 0 || bidNum <= 0) {
    return null;
  }

  const spread = askNum - bidNum;
  const average = 0.5 * (askNum + bidNum);
  const spreadPercentage = (spread / average) * 100;

  return Math.max(0, spreadPercentage);
}

export function getRAGStatus(spreadPercentage: number | null): RAGStatus {
  if (spreadPercentage === null) {
    return 'red';
  }

  if (spreadPercentage <= 2) {
    return 'green';
  }
  return 'amber';
}

export function combineMarketData(
  pairs: MarketPair[],
  summaries: SummaryType[]
): MarketDataType[] {
  const summaryMap = new Map<string, SummaryType>();
  summaries.forEach((summary) => {
    summaryMap.set(summary.trading_pairs, summary);
  });

  return pairs.map((pair) => {
    const summary = summaryMap.get(pair.ticker_id.replace('_', '-'));
    const spreadPercentage = calculateSpreadPercentage(
      summary?.lowest_ask || null,
      summary?.highest_bid || null
    );

    const ragStatus = getRAGStatus(spreadPercentage);

    return {
      ticker_id: pair.ticker_id,
      highest_bid: summary?.highest_bid || null,
      lowest_ask: summary?.lowest_ask || null,
      spread_percentage: spreadPercentage,
      rag_status: ragStatus,
    };
  });
}
