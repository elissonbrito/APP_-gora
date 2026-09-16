import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { demandaCategoriaLabel, demandaCategorias } from '@/features/demandas/categoria';
import { useTheme } from '@/hooks/use-theme';
import type { DemandaCategoria } from '@/types/demanda';

export type CategoriaSelectProps = {
  value?: DemandaCategoria;
  onChange: (categoria: DemandaCategoria) => void;
  errorMessage?: string;
};

export function CategoriaSelect({ value, onChange, errorMessage }: CategoriaSelectProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Categoria</ThemedText>
      <View style={styles.chips}>
        {demandaCategorias.map((categoria) => {
          const selected = categoria === value;
          return (
            <Pressable
              key={categoria}
              onPress={() => onChange(categoria)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={demandaCategoriaLabel[categoria]}
              style={[
                styles.chip,
                {
                  borderColor: selected ? theme.primary : theme.border,
                  backgroundColor: selected ? theme.primarySoft : theme.backgroundElement,
                },
              ]}>
              <ThemedText type="small" style={{ color: selected ? theme.primary : theme.text }}>
                {demandaCategoriaLabel[categoria]}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      {errorMessage ? (
        <ThemedText type="small" themeColor="danger">
          {errorMessage}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
  },
});
