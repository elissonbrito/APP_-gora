import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/constants/theme';
import { demandaCategoriaLabel, demandaCategorias } from '@/features/demandas/categoria';
import type { DemandaCategoria } from '@/types/demanda';

export type CategoriaSelectProps = {
  value?: DemandaCategoria;
  onChange: (categoria: DemandaCategoria) => void;
  errorMessage?: string;
};

export function CategoriaSelect({ value, onChange, errorMessage }: CategoriaSelectProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Categoria</ThemedText>
      <View style={styles.chips}>
        {demandaCategorias.map((categoria) => (
          <Chip
            key={categoria}
            label={demandaCategoriaLabel[categoria]}
            selected={categoria === value}
            onPress={() => onChange(categoria)}
          />
        ))}
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
});
