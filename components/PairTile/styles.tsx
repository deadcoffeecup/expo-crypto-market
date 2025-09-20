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
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderLightColor,
      alignItems: 'center',
      backgroundColor,
    },
    tickerText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: textColor,
    },
    priceText: {
      flex: 1,
      fontSize: 14,
      color: textSecondaryColor,
      textAlign: 'center',
    },
    spreadText: {
      flex: 1,
      fontSize: 14,
      color: textColor,
      textAlign: 'center',
      fontWeight: '500',
    },
    ragIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
  });
}
