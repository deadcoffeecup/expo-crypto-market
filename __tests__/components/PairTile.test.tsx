import { render } from '@testing-library/react-native';
import React from 'react';
import { PairTile } from '../../components/PairTile/PairTile';
import { MarketDataType } from '../../types/market';

// Theme hooks are mocked in jest.setup.js

// Mock the styles hook
jest.mock('../../components/PairTile/styles', () => ({
  useThemedStyles: jest.fn(() => ({
    marketRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      minHeight: 48,
    },
    tickerText: {
      flex: 2,
      fontSize: 14,
      fontWeight: '600',
      color: '#000000',
      textAlign: 'left',
    },
    priceText: {
      flex: 1,
      fontSize: 14,
      color: '#666666',
      textAlign: 'center',
    },
    spreadText: {
      flex: 1.2,
      fontSize: 14,
      color: '#000000',
      textAlign: 'center',
      fontWeight: '500',
    },
    ragIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#666666',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
    },
  })),
}));

describe('PairTile', () => {
  const mockMarketData: MarketDataType = {
    ticker_id: 'BTC_USD',
    highest_bid: '45000.123456',
    lowest_ask: '45010.654321',
    spread_percentage: 0.024,
    rag_status: 'green',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with valid market data', () => {
    const { getByText, getByTestId } = render(
      <PairTile item={mockMarketData} />
    );

    // Check ticker text (should replace _ with /)
    expect(getByText('BTC/USD')).toBeTruthy();

    // Check bid price formatting
    expect(getByText('45000.12')).toBeTruthy();

    // Check ask price formatting
    expect(getByText('45010.65')).toBeTruthy();

    // Check spread formatting
    expect(getByText('0.02%')).toBeTruthy();
  });

  it('renders correctly with null prices', () => {
    const nullPriceData: MarketDataType = {
      ...mockMarketData,
      highest_bid: null,
      lowest_ask: null,
    };

    const { queryAllByText } = render(<PairTile item={nullPriceData} />);

    // Should display '-' for null prices (both bid and ask should be '-')
    const dashes = queryAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2); // At least bid and ask
  });

  it('renders correctly with empty string prices', () => {
    const emptyPriceData: MarketDataType = {
      ...mockMarketData,
      highest_bid: '',
      lowest_ask: '',
    };

    const { queryAllByText } = render(<PairTile item={emptyPriceData} />);

    // Should display '-' for empty string prices (both bid and ask should be '-')
    const dashes = queryAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2); // At least bid and ask
  });

  it('renders correctly with null spread', () => {
    const nullSpreadData: MarketDataType = {
      ...mockMarketData,
      spread_percentage: null,
    };

    const { queryAllByText } = render(<PairTile item={nullSpreadData} />);

    // Should display '-' for null spread (only spread should be '-')
    const dashes = queryAllByText('-');
    expect(dashes.length).toBe(1); // Only spread should be '-'
  });

  it('displays RAG indicator with green color for green status', () => {
    const greenData: MarketDataType = {
      ...mockMarketData,
      rag_status: 'green',
    };

    const { UNSAFE_getByType } = render(<PairTile item={greenData} />);

    // Find the RAG indicator view
    const views = UNSAFE_getByType('View');
    const ragIndicator = views.find((view) =>
      view.props.style?.some?.(
        (style: any) => style.backgroundColor === '#4CAF50'
      )
    );

    expect(ragIndicator).toBeTruthy();
  });

  it('displays RAG indicator with amber color for amber status', () => {
    const amberData: MarketDataType = {
      ...mockMarketData,
      rag_status: 'amber',
    };

    const { UNSAFE_getByType } = render(<PairTile item={amberData} />);

    // Find the RAG indicator view
    const views = UNSAFE_getByType('View');
    const ragIndicator = views.find((view) =>
      view.props.style?.some?.(
        (style: any) => style.backgroundColor === '#FF9800'
      )
    );

    expect(ragIndicator).toBeTruthy();
  });

  it('displays RAG indicator with red color for red status', () => {
    const redData: MarketDataType = {
      ...mockMarketData,
      rag_status: 'red',
    };

    const { UNSAFE_getByType } = render(<PairTile item={redData} />);

    // Find the RAG indicator view
    const views = UNSAFE_getByType('View');
    const ragIndicator = views.find((view) =>
      view.props.style?.some?.(
        (style: any) => style.backgroundColor === '#F44336'
      )
    );

    expect(ragIndicator).toBeTruthy();
  });

  it('displays RAG indicator with default color for unknown status', () => {
    const unknownData: MarketDataType = {
      ...mockMarketData,
      rag_status: 'unknown' as any,
    };

    const { UNSAFE_getByType } = render(<PairTile item={unknownData} />);

    // Find the RAG indicator view
    const views = UNSAFE_getByType('View');
    const ragIndicator = views.find((view) =>
      view.props.style?.some?.(
        (style: any) => style.backgroundColor === '#9E9E9E'
      )
    );

    expect(ragIndicator).toBeTruthy();
  });

  it('formats prices correctly for values less than 1', () => {
    const lowPriceData: MarketDataType = {
      ...mockMarketData,
      highest_bid: '0.000123456',
      lowest_ask: '0.000234567',
    };

    const { getByText } = render(<PairTile item={lowPriceData} />);

    // Should display 6 decimal places for values < 1
    expect(getByText('0.000123')).toBeTruthy();
    expect(getByText('0.000235')).toBeTruthy();
  });

  it('formats prices correctly for values greater than or equal to 1', () => {
    const { getByText } = render(<PairTile item={mockMarketData} />);

    // Should display 2 decimal places for values >= 1
    expect(getByText('45000.12')).toBeTruthy();
    expect(getByText('45010.65')).toBeTruthy();
  });

  it('handles invalid price strings gracefully', () => {
    const invalidPriceData: MarketDataType = {
      ...mockMarketData,
      highest_bid: 'invalid',
      lowest_ask: 'not-a-number',
    };

    const { queryAllByText } = render(<PairTile item={invalidPriceData} />);

    // Should display '-' for invalid price strings (both bid and ask should be '-')
    const dashes = queryAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2); // At least bid and ask
  });
});
