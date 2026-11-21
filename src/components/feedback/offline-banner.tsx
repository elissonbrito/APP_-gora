import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useOnline } from '@/hooks/use-online';
import { useTheme } from '@/hooks/use-theme';

/**
 * Aviso flutuante exibido enquanto o aparelho está sem internet. Fica por cima
 * das telas (position: absolute) e não bloqueia toques (pointerEvents none).
 */
export function OfflineBanner() {
  const online = useOnline();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (online) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { top: insets.top + Spacing.two }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert">
      <View
        style={[styles.pill, { backgroundColor: theme.warningSoft, borderColor: theme.warning }]}>
        <View style={[styles.ponto, { backgroundColor: theme.warning }]} />
        <ThemedText type="smallBold" style={{ color: theme.warning }}>
          Você está offline — mostrando dados salvos
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
});
