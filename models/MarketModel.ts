import { RAGStatus } from '@/types/market';

export const formatPrice = (price: string | null): string => {
  if (price === null || price === '') return '-';

  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '-';

  return numPrice.toFixed(numPrice < 1 ? 6 : 2);
};

export const formatSpread = (spread: number | null): string => {
  if (spread === null) return '-';
  return `${spread.toFixed(2)}%`;
};

export const getRAGColor = (status: RAGStatus): string => {
  switch (status) {
    case 'green':
      return '#4CAF50';
    case 'amber':
      return '#FF9800';
    case 'red':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};
