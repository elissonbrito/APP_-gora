import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = 'Não foi possível carregar as informações.',
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <SymbolView
        name={{ ios: 'exclamationmark.triangle', android: 'error_outline', web: 'error_outline' }}
        size={40}
        tintColor={theme.danger}
      />
      <ThemedText type="default" style={styles.centerText}>
        {message}
      </ThemedText>
      {onRetry ? (
        <View style={styles.actionWrapper}>
          <Button label="Tentar novamente" variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.five,
  },
  centerText: {
    textAlign: 'center',
  },
  actionWrapper: {
    marginTop: Spacing.three,
    alignSelf: 'stretch',
  },
});
