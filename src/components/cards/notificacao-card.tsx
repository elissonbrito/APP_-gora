import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Notificacao } from '@/types/notificacao';
import { formatarDataHora } from '@/utils/date';

export function NotificacaoCard({
  notificacao,
  onPress,
}: {
  notificacao: Notificacao;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={notificacao.titulo}
      accessibilityState={{ selected: notificacao.lida }}>
      <Card>
        <View style={styles.headerRow}>
          <ThemedText type={notificacao.lida ? 'default' : 'smallBold'} style={styles.title}>
            {notificacao.titulo}
          </ThemedText>
          {!notificacao.lida ? (
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          ) : null}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {notificacao.corpo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatarDataHora(notificacao.criadaEm)}
        </ThemedText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  title: {
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    marginTop: Spacing.one,
  },
});
