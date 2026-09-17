import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const NOTAS = [1, 2, 3, 4, 5];

export type StarRatingProps = {
  value: number;
  onChange?: (nota: number) => void;
  readOnly?: boolean;
  size?: number;
};

export function StarRating({ value, onChange, readOnly = false, size = 28 }: StarRatingProps) {
  const theme = useTheme();

  return (
    <View style={styles.row} accessibilityLabel={`Nota ${value} de 5`}>
      {NOTAS.map((nota) => {
        const preenchida = nota <= value;
        const estrela = (
          <ThemedText style={{ fontSize: size, color: preenchida ? theme.primary : theme.border }}>
            {preenchida ? '★' : '☆'}
          </ThemedText>
        );

        if (readOnly) {
          return <View key={nota}>{estrela}</View>;
        }

        return (
          <Pressable
            key={nota}
            onPress={() => onChange?.(nota)}
            accessibilityRole="button"
            accessibilityLabel={`Nota ${nota} de 5`}
            hitSlop={6}>
            {estrela}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
});
