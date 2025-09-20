import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet } from 'react-native';

export function useThemedStyles() {
  const backgroundColor = useThemeColor({}, 'background');
  const borderLightColor = useThemeColor({}, 'borderLight');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  return StyleSheet.create({
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
      flex: 2, // 40% width - matches header
      fontSize: 14,
      fontWeight: '600',
      color: textColor,
      textAlign: 'left',
    },
    priceText: {
      flex: 1, // 20% width - matches header
      fontSize: 14,
      color: textSecondaryColor,
      textAlign: 'center',
    },
    spreadText: {
      flex: 1.2, // 24% width - matches header
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
  });
}
