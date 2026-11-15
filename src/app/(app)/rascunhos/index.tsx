import { router, Stack } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ListItem } from '@/components/ui/list-item';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { demandaCategoriaLabel } from '@/features/demandas/categoria';
import { useRascunhos } from '@/features/rascunhos/hooks';
import { tituloDoRascunho } from '@/types/rascunho';
import { formatarDataHora } from '@/utils/date';

export default function RascunhosScreen() {
  const { data: rascunhos, isLoading, isError, isRefetching, refetch } = useRascunhos();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Rascunhos' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={64} />
            <Skeleton height={64} />
            <Skeleton height={64} />
          </View>
        ) : isError ? (
          <ErrorState
            message="Não foi possível ler os rascunhos salvos no aparelho."
            onRetry={() => refetch()}
          />
        ) : !rascunhos?.length ? (
          <EmptyState
            title="Nenhum rascunho salvo"
            description="Na Nova Demanda, toque em “Salvar rascunho” para terminar depois — mesmo sem internet."
            actionLabel="Começar uma demanda"
            onAction={() => router.dismissTo('/nova')}
          />
        ) : (
          <FlatList
            data={rascunhos}
            keyExtractor={(r) => String(r.id)}
            contentContainerStyle={styles.list}
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            ListHeaderComponent={
              <ThemedText type="small" themeColor="textSecondary">
                Guardados só neste aparelho. {rascunhos.length}{' '}
                {rascunhos.length === 1 ? 'rascunho' : 'rascunhos'}.
              </ThemedText>
            }
            renderItem={({ item }) => (
              <ListItem
                title={tituloDoRascunho(item.dados)}
                subtitle={[
                  item.dados.categoria ? demandaCategoriaLabel[item.dados.categoria] : null,
                  `Editado em ${formatarDataHora(item.atualizadoEm)}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                trailing="›"
                onPress={() =>
                  router.push({ pathname: '/rascunhos/[id]', params: { id: String(item.id) } })
                }
              />
            )}
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
    paddingTop: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
});
