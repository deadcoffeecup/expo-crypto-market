import { MarketDataType, MarketPair } from '@/types/market';

export enum PRICE_MODE {
  HIGHEST_BID = 'highest_bid',
  LOWEST_ASK = 'lowest_ask',
}

export class MarketDataModel {
  private data: MarketDataType;

  constructor(data: MarketDataType) {
    this.data = data;
  }

  private formatPrice(price: string | null): string {
    if (price === null || price === '') return '-';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '-';
    return numPrice.toFixed(numPrice < 1 ? 6 : 2);
  }
  public getPrice(mode: PRICE_MODE): string {
    if (mode === 'highest_bid') {
      return this.formatPrice(this.data.highest_bid);
    } else {
      return this.formatPrice(this.data.lowest_ask);
    }
  }
  public getSpread(): string {
    return this.formatSpread(this.data.spread_percentage);
  }

  private formatSpread(spread: number | null): string {
    if (spread === null) return '-';
    return `${spread.toFixed(2)}%`;
  }
  public getTickerText(): string {
    return this.data.ticker_id.replace('_', '/');
  }

  public getRAGColor() {
    switch (this.data.rag_status) {
      case 'green':
        return '#4CAF50';
      case 'amber':
        return '#FF9800';
      case 'red':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }
  static getPairs(item: MarketDataType): MarketPair {
    return {
      ticker_id: item.ticker_id,
      base: item.ticker_id.split('_')[0],
      target: item.ticker_id.split('_')[1],
    };
  }
}
