import { MarketRanking } from '@/components/MarketRanking/MarketRanking';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <MarketRanking />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
