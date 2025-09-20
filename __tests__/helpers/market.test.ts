import {
  calculateSpreadPercentage,
  combineMarketData,
  getRAGStatus,
} from '@/helpers/market';
import { MarketPair, SummaryType } from '@/types/market';

describe('calculateSpreadPercentage', () => {
  it('should return null when ask is null', () => {
    expect(calculateSpreadPercentage(null, '100')).toBeNull();
  });

  it('should return null when bid is null', () => {
    expect(calculateSpreadPercentage('100', null)).toBeNull();
  });

  it('should return null when ask is empty string', () => {
    expect(calculateSpreadPercentage('', '100')).toBeNull();
  });

  it('should return null when bid is empty string', () => {
    expect(calculateSpreadPercentage('100', '')).toBeNull();
  });

  it('should return null when ask is not a valid number', () => {
    expect(calculateSpreadPercentage('invalid', '100')).toBeNull();
  });

  it('should return null when bid is not a valid number', () => {
    expect(calculateSpreadPercentage('100', 'invalid')).toBeNull();
  });

  it('should return null when ask is zero or negative', () => {
    expect(calculateSpreadPercentage('0', '100')).toBeNull();
    expect(calculateSpreadPercentage('-10', '100')).toBeNull();
  });

  it('should return null when bid is zero or negative', () => {
    expect(calculateSpreadPercentage('100', '0')).toBeNull();
    expect(calculateSpreadPercentage('100', '-10')).toBeNull();
  });

  it('should calculate correct spread percentage', () => {
    expect(calculateSpreadPercentage('110', '100')).toBeCloseTo(9.52, 2);
  });

  it('should return 0 when spread is 0', () => {
    expect(calculateSpreadPercentage('100', '100')).toBe(0);
  });

  it('should handle decimal values correctly', () => {
    expect(calculateSpreadPercentage('1.10', '1.00')).toBeCloseTo(9.52, 2);
  });
});

describe('getRAGStatus', () => {
  it('should return red when spreadPercentage is null', () => {
    expect(getRAGStatus(null)).toBe('red');
  });

  it('should return green when spreadPercentage is less than or equal to 2', () => {
    expect(getRAGStatus(2)).toBe('green');
    expect(getRAGStatus(1.5)).toBe('green');
    expect(getRAGStatus(0)).toBe('green');
  });

  it('should return amber when spreadPercentage is greater than 2', () => {
    expect(getRAGStatus(2.1)).toBe('amber');
    expect(getRAGStatus(5)).toBe('amber');
    expect(getRAGStatus(10)).toBe('amber');
  });
});

describe('combineMarketData', () => {
  const mockPairs: MarketPair[] = [
    { ticker_id: 'BTC_USD', base: 'BTC', target: 'USD' },
    { ticker_id: 'ETH_USD', base: 'ETH', target: 'USD' },
    { ticker_id: 'LTC_USD', base: 'LTC', target: 'USD' },
  ];

  const mockSummaries: SummaryType[] = [
    {
      trading_pairs: 'BTC-USD',
      lowest_price_24h: '95000',
      highest_price_24h: '100000',
      highest_bid: '99500',
      lowest_ask: '99600',
      base_volume: '100',
      quote_volume: '10000000',
      last_price: '99550',
      price_change_percent_24h: '2.5',
    },
    {
      trading_pairs: 'ETH-USD',
      lowest_price_24h: '3000',
      highest_price_24h: '3200',
      highest_bid: '3150',
      lowest_ask: '3160',
      base_volume: '500',
      quote_volume: '1600000',
      last_price: '3155',
      price_change_percent_24h: '1.8',
    },
  ];

  it('should combine pairs and summaries correctly', () => {
    const result = combineMarketData(mockPairs, mockSummaries);

    expect(result).toHaveLength(3);

    const btcData = result.find((item) => item.ticker_id === 'BTC_USD');
    expect(btcData).toBeDefined();
    expect(btcData?.highest_bid).toBe('99500');
    expect(btcData?.lowest_ask).toBe('99600');
    expect(btcData?.spread_percentage).toBeCloseTo(0.1, 2);
    expect(btcData?.rag_status).toBe('green');

    const ethData = result.find((item) => item.ticker_id === 'ETH_USD');
    expect(ethData).toBeDefined();
    expect(ethData?.highest_bid).toBe('3150');
    expect(ethData?.lowest_ask).toBe('3160');
    expect(ethData?.spread_percentage).toBeCloseTo(0.32, 2);
    expect(ethData?.rag_status).toBe('green');

    const ltcData = result.find((item) => item.ticker_id === 'LTC_USD');
    expect(ltcData).toBeDefined();
    expect(ltcData?.highest_bid).toBeNull();
    expect(ltcData?.lowest_ask).toBeNull();
    expect(ltcData?.spread_percentage).toBeNull();
    expect(ltcData?.rag_status).toBe('red');
  });

  it('should handle empty pairs array', () => {
    const result = combineMarketData([], mockSummaries);
    expect(result).toHaveLength(0);
  });

  it('should handle empty summaries array', () => {
    const result = combineMarketData(mockPairs, []);
    expect(result).toHaveLength(3);

    result.forEach((item) => {
      expect(item.highest_bid).toBeNull();
      expect(item.lowest_ask).toBeNull();
      expect(item.spread_percentage).toBeNull();
      expect(item.rag_status).toBe('red');
    });
  });

  it('should handle pairs with no matching summaries', () => {
    const pairsWithoutMatches: MarketPair[] = [
      { ticker_id: 'UNKNOWN_USD', base: 'UNKNOWN', target: 'USD' },
    ];

    const result = combineMarketData(pairsWithoutMatches, mockSummaries);
    expect(result).toHaveLength(1);

    const item = result[0];
    expect(item.ticker_id).toBe('UNKNOWN_USD');
    expect(item.highest_bid).toBeNull();
    expect(item.lowest_ask).toBeNull();
    expect(item.spread_percentage).toBeNull();
    expect(item.rag_status).toBe('red');
  });

  it('should handle high spread percentages that result in amber status', () => {
    const highSpreadSummaries: SummaryType[] = [
      {
        trading_pairs: 'BTC-USD',
        lowest_price_24h: '95000',
        highest_price_24h: '100000',
        highest_bid: '90000',
        lowest_ask: '99600',
        base_volume: '100',
        quote_volume: '10000000',
        last_price: '99550',
        price_change_percent_24h: '2.5',
      },
    ];

    const result = combineMarketData(mockPairs, highSpreadSummaries);

    const btcData = result.find((item) => item.ticker_id === 'BTC_USD');
    expect(btcData?.spread_percentage).toBeGreaterThan(2);
    expect(btcData?.rag_status).toBe('amber');
  });
});
