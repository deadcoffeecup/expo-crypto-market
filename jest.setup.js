/* eslint-disable no-undef */
/* jest is only available in Jest's test environment, not in regular Node.js.*/
global.fetch = jest.fn();

const React = require('react');

jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  FlatList: 'FlatList',
  TextInput: 'TextInput',
  ActivityIndicator: 'ActivityIndicator',
  Alert: {
    alert: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((styles) => styles),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn(),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  UIManager: {
    getViewManagerConfig: jest.fn(() => ({})),
  },
  ScrollView: 'ScrollView',
  Image: 'Image',
  Modal: 'Modal',
  SafeAreaView: 'SafeAreaView',
}));

jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    platform: {},
  },
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: 'Link',
  Stack: 'Stack',
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-symbols', () => ({
  SymbolView: 'SymbolView',
}));

jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
  State: {},
}));

jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: jest.fn(() => ({})),
  useSharedValue: jest.fn(() => ({ value: 0 })),
  runOnJS: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: 'SafeAreaProvider',
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

jest.mock('react-native-web', () => ({
  Platform: {
    OS: 'web',
    select: jest.fn(),
  },
}));

jest.mock('react-native-worklets', () => ({
  Worklets: {},
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

const mockUseColorScheme = jest.fn(() => 'light');
jest.mock('./hooks/use-color-scheme', () => ({
  useColorScheme: mockUseColorScheme,
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: mockUseColorScheme,
}));

jest.mock('./components/ui/icon-symbol', () => ({
  IconSymbol: 'IconSymbol',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: 'IconSymbol',
}));

jest.mock('./hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

// Also mock with the @ alias path
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

const mockUseMarketData = jest.fn(() => ({
  marketData: [
    {
      ticker_id: 'BTC_USD',
      highest_bid: '45000.50',
      lowest_ask: '45005.25',
      spread_percentage: 0.011,
      rag_status: 'green',
    },
    {
      ticker_id: 'ETH_USD',
      highest_bid: '3200.75',
      lowest_ask: '3205.50',
      spread_percentage: 0.015,
      rag_status: 'amber',
    },
  ],
  loading: false,
  error: null,
  refetch: jest.fn(),
  refreshInterval: 30000,
  stopAutoRefresh: jest.fn(),
}));

const mockUseFilteredAndSortedMarketData = jest.fn(() => []);

jest.mock('./hooks/useMarketData', () => ({
  useMarketData: mockUseMarketData,
}));

jest.mock('./hooks/useFilteredAndSortedMarketData', () => ({
  useFilteredAndSortedMarketData: mockUseFilteredAndSortedMarketData,
}));

global.mockUseMarketData = mockUseMarketData;
global.mockUseFilteredAndSortedMarketData = mockUseFilteredAndSortedMarketData;

const mockThemedText = ({
  children,
  type,
  lightColor,
  darkColor,
  style,
  ...props
}) => {
  const themeColor = '#000000'; // Mocked theme color
  let typeStyles = {};

  switch (type) {
    case 'title':
      typeStyles = { fontSize: 32, fontWeight: 'bold', lineHeight: 32 };
      break;
    case 'subtitle':
      typeStyles = { fontSize: 20, fontWeight: 'bold' };
      break;
    case 'defaultSemiBold':
      typeStyles = { fontSize: 16, fontWeight: '600', lineHeight: 24 };
      break;
    case 'link':
      typeStyles = { lineHeight: 30, fontSize: 16, color: '#0a7ea4' };
      break;
    default:
      typeStyles = { fontSize: 16, lineHeight: 24 };
  }

  const combinedStyle = [{ color: themeColor }, typeStyles, style].filter(
    Boolean
  );

  return React.createElement(
    'Text',
    { ...props, style: combinedStyle },
    children
  );
};

const mockThemedView = ({
  children,
  lightColor,
  darkColor,
  style,
  ...props
}) => {
  const themeColor = '#000000';

  const combinedStyle = [{ backgroundColor: themeColor }, style].filter(
    Boolean
  );

  return React.createElement(
    'View',
    { ...props, style: combinedStyle },
    children
  );
};

jest.mock('@/components/themed-text', () => ({
  ThemedText: mockThemedText,
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: mockThemedView,
}));
