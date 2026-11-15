import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type FaqItemProps = {
  pergunta: string;
  resposta: string;
};

/** Pergunta que expande para mostrar a resposta ao ser tocada. */
export function FaqItem({ pergunta, resposta }: FaqItemProps) {
  const theme = useTheme();
  const [aberto, setAberto] = useState(false);

  return (
    <View style={[styles.item, { backgroundColor: theme.backgroundElement }]}>
      <Pressable
        onPress={() => setAberto((valor) => !valor)}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
        style={styles.cabecalho}>
        <ThemedText type="default" style={styles.pergunta}>
          {pergunta}
        </ThemedText>
        <ThemedText type="subtitle" themeColor="primary" style={styles.icone}>
          {aberto ? '−' : '+'}
        </ThemedText>
      </Pressable>
      {aberto ? (
        <ThemedText type="default" themeColor="textSecondary" style={styles.resposta}>
          {resposta}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: Radius.medium,
    overflow: 'hidden',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  pergunta: {
    flex: 1,
    fontWeight: '600',
  },
  icone: {
    width: 24,
    textAlign: 'center',
  },
  resposta: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
