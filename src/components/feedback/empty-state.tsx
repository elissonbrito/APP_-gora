import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <SymbolView
        name={{ ios: 'tray', android: 'inbox', web: 'inbox' }}
        size={40}
        tintColor={theme.textSecondary}
      />
      <ThemedText type="subtitle" style={styles.centerText}>
        {title}
      </ThemedText>
      {description ? (
        <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
          {description}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.actionWrapper}>
          <Button label={actionLabel} onPress={onAction} />
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
