import { router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificacaoCard } from '@/components/cards/notificacao-card';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  useMarcarNotificacaoComoLida,
  useMarcarTodasComoLidas,
  useNotificacoes,
} from '@/features/notificacoes/hooks';
import { useTheme } from '@/hooks/use-theme';
import type { Notificacao } from '@/types/notificacao';

export default function NotificacoesScreen() {
  const { data: notificacoes, isLoading, isError, isRefetching, refetch } = useNotificacoes();
  const marcarComoLida = useMarcarNotificacaoComoLida();
  const marcarTodas = useMarcarTodasComoLidas();
  const theme = useTheme();
  const naoLidas = notificacoes?.filter((notificacao) => !notificacao.lida).length ?? 0;

  function handlePress(notificacao: Notificacao) {
    if (!notificacao.lida) {
      marcarComoLida.mutate(notificacao.id);
    }
    if (notificacao.demandaId) {
      router.push({ pathname: '/demandas/[id]', params: { id: notificacao.demandaId } });
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.cabecalho}>
          <ThemedText type="title" style={styles.title}>
            Notificações
          </ThemedText>
          {naoLidas > 0 ? (
            <Pressable
              onPress={() => marcarTodas.mutate()}
              disabled={marcarTodas.isPending}
              accessibilityRole="button"
              hitSlop={8}>
              <ThemedText type="smallBold" themeColor="primary">
                Marcar todas como lidas
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={90} />
            <Skeleton height={90} />
          </View>
        ) : isError ? (
          <ErrorState
            message="Não foi possível carregar suas notificações."
            onRetry={() => refetch()}
          />
        ) : !notificacoes?.length ? (
          <EmptyState
            title="Nenhuma notificação por aqui"
            description="Quando houver novidades sobre suas solicitações, elas aparecem aqui."
          />
        ) : (
          <FlatList
            data={notificacoes}
            keyExtractor={(notificacao) => notificacao.id}
            renderItem={({ item }) => (
              <NotificacaoCard notificacao={item} onPress={() => handlePress(item)} />
            )}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetch();
                }}
                tintColor={theme.primary}
                colors={[theme.primary]}
              />
            }
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
    gap: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  cabecalho: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'left',
  },
  list: {
    gap: Spacing.three,
  },
});
