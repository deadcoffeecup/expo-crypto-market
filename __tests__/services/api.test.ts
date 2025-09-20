import {
  fetchCombinedMarketData,
  fetchMarketPairs,
  fetchMarketSummaries,
} from '@/services/api';

jest.mock('@/constants/api', () => ({
  BASE_URL: 'https://api.example.com',
}));

describe('fetchMarketPairs', () => {
  const mockPairs = [
    { ticker_id: 'BTC_USD', base: 'BTC', target: 'USD' },
    { ticker_id: 'ETH_USD', base: 'ETH', target: 'USD' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch market pairs successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPairs),
    });

    const result = await fetchMarketPairs();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/market/pairs'
    );
    expect(result).toEqual(mockPairs);
  });

  it('should return empty array when API returns empty response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(null),
    });

    const result = await fetchMarketPairs();

    expect(result).toEqual([]);
  });

  it('should throw error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchMarketPairs()).rejects.toThrow('HTTP error! status: 404');
  });

  it('should throw error when fetch fails', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchMarketPairs()).rejects.toThrow('Network error');
  });

  it('should log error when fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchMarketPairs()).rejects.toThrow('Network error');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching market pairs:',
      networkError
    );
    consoleSpy.mockRestore();
  });
});

describe('fetchMarketSummaries', () => {
  const mockResponse = {
    timestamp: '2024-01-01T00:00:00Z',
    summary: [
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
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch market summaries successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchMarketSummaries();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/market/summary'
    );
    expect(result).toEqual(mockResponse.summary);
  });

  it('should return empty array when API returns null summary', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        timestamp: '2024-01-01T00:00:00Z',
        summary: null,
      }),
    });

    const result = await fetchMarketSummaries();

    expect(result).toEqual([]);
  });

  it('should return empty array when API returns undefined summary', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ timestamp: '2024-01-01T00:00:00Z' }),
    });

    const result = await fetchMarketSummaries();

    expect(result).toEqual([]);
  });

  it('should throw error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchMarketSummaries()).rejects.toThrow(
      'HTTP error! status: 500'
    );
  });

  it('should throw error when fetch fails', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchMarketSummaries()).rejects.toThrow('Network error');
  });

  it('should log error when fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchMarketSummaries()).rejects.toThrow('Network error');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching market summaries:',
      networkError
    );
    consoleSpy.mockRestore();
  });
});

describe('fetchCombinedMarketData', () => {
  const mockPairs = [
    { ticker_id: 'BTC_USD', base: 'BTC', target: 'USD' },
    { ticker_id: 'ETH_USD', base: 'ETH', target: 'USD' },
  ];

  const mockSummariesResponse = {
    timestamp: '2024-01-01T00:00:00Z',
    summary: [
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
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch combined market data successfully', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPairs),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSummariesResponse),
      });

    const result = await fetchCombinedMarketData();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/market/pairs'
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/market/summary'
    );
    expect(result).toEqual({
      pairs: mockPairs,
      summaries: mockSummariesResponse.summary,
    });
  });

  it('should throw error when fetching pairs fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Pairs fetch failed')
    );

    await expect(fetchCombinedMarketData()).rejects.toThrow(
      'Pairs fetch failed'
    );
  });

  it('should throw error when fetching summaries fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPairs),
      })
      .mockRejectedValueOnce(new Error('Summaries fetch failed'));

    await expect(fetchCombinedMarketData()).rejects.toThrow(
      'Summaries fetch failed'
    );
  });

  it('should log error when combined fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchCombinedMarketData()).rejects.toThrow('Network error');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching combined market data:',
      networkError
    );
    consoleSpy.mockRestore();
  });

  it('should handle Promise.all failure gracefully', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPairs),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

    await expect(fetchCombinedMarketData()).rejects.toThrow(
      'HTTP error! status: 500'
    );
  });
});
