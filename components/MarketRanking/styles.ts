import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet } from 'react-native';

export function useThemedStyles() {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const borderLightColor = useThemeColor({}, 'borderLight');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const inputBorderColor = useThemeColor({}, 'inputBorder');
  const buttonBackground = useThemeColor({}, 'button');
  const buttonActiveBackground = useThemeColor({}, 'buttonActive');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const textMutedColor = useThemeColor({}, 'textMuted');
  const errorColor = useThemeColor({}, 'error');

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor,
    },
    searchContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
      backgroundColor: cardBackground,
    },
    searchInput: {
      height: 40,
      borderWidth: 1,
      borderColor: inputBorderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: inputBackground,
      color: textColor,
    },
    sortContainer: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
      backgroundColor: cardBackground,
    },
    sortButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: buttonBackground,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    sortButtonActive: {
      backgroundColor: buttonActiveBackground,
    },
    sortButtonText: {
      fontSize: 14,
      color: textSecondaryColor,
      fontWeight: '500',
    },
    sortButtonTextActive: {
      color: '#fff',
    },
    headerRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
      minHeight: 44,
    },
    headerText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: textSecondaryColor,
      textAlign: 'center',
    },
    headerMarket: {
      flex: 2, // 40% width
      fontSize: 12,
      fontWeight: 'bold',
      color: textSecondaryColor,
      textAlign: 'left',
    },
    headerBid: {
      flex: 1, // 20% width
      fontSize: 12,
      fontWeight: 'bold',
      color: textSecondaryColor,
      textAlign: 'center',
    },
    headerAsk: {
      flex: 1, // 20% width
      fontSize: 12,
      fontWeight: 'bold',
      color: textSecondaryColor,
      textAlign: 'center',
    },
    headerSpread: {
      flex: 1.2, // 24% width
      fontSize: 12,
      fontWeight: 'bold',
      color: textSecondaryColor,
      textAlign: 'center',
    },
    headerRag: {
      width: 40, // Fixed width for header alignment
      fontSize: 12,
      fontWeight: 'bold',
      color: textSecondaryColor,
      textAlign: 'center',
    },
    marketRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderLightColor,
      alignItems: 'center',
      backgroundColor,
      minHeight: 48,
    },
    tickerText: {
      flex: 2, // 40% width
      fontSize: 14,
      fontWeight: '600',
      color: textColor,
      textAlign: 'left',
    },
    priceText: {
      flex: 1, // 20% width
      fontSize: 14,
      color: textSecondaryColor,
      textAlign: 'center',
    },
    spreadText: {
      flex: 1.2, // 24% width
      fontSize: 14,
      color: textColor,
      textAlign: 'center',
      fontWeight: '500',
    },
    ragIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: textSecondaryColor,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    listContainer: {
      paddingBottom: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: textSecondaryColor,
    },
    errorText: {
      fontSize: 16,
      color: errorColor,
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: buttonActiveBackground,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
  });
}
