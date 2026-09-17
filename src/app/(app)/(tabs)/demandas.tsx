import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DemandaCard } from '@/components/cards/demanda-card';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/chip';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useMinhasDemandas } from '@/features/demandas/hooks';
import { demandaStatusLabel } from '@/features/demandas/status';
import type { DemandaStatus } from '@/types/demanda';

type FiltroStatus = 'todas' | DemandaStatus;

const filtros: { value: FiltroStatus; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'recebida', label: demandaStatusLabel.recebida },
  { value: 'em_analise', label: demandaStatusLabel.em_analise },
  { value: 'em_andamento', label: demandaStatusLabel.em_andamento },
  { value: 'concluida', label: demandaStatusLabel.concluida },
];

export default function DemandasScreen() {
  const [filtro, setFiltro] = useState<FiltroStatus>('todas');
  const { data: demandas, isLoading, isError, refetch } = useMinhasDemandas();

  const demandasFiltradas = (demandas ?? []).filter(
    (demanda) => filtro === 'todas' || demanda.status === filtro,
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Demandas
          </ThemedText>

          <View style={styles.chips}>
            {filtros.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                selected={item.value === filtro}
                onPress={() => setFiltro(item.value)}
              />
            ))}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={80} />
            <Skeleton height={80} />
            <Skeleton height={80} />
          </View>
        ) : isError ? (
          <ErrorState
            message="Não foi possível carregar suas demandas."
            onRetry={() => refetch()}
          />
        ) : demandasFiltradas.length === 0 ? (
          <EmptyState
            title="Nenhuma solicitação encontrada"
            description={
              filtro === 'todas'
                ? 'Você ainda não possui solicitações.'
                : 'Não há demandas com este status.'
            }
          />
        ) : (
          <FlatList
            data={demandasFiltradas}
            keyExtractor={(demanda) => demanda.id}
            renderItem={({ item }) => <DemandaCard demanda={item} />}
            contentContainerStyle={styles.list}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'left',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.three,
  },
});
