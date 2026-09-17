import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DemandaCard } from '@/components/cards/demanda-card';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useMinhasDemandas } from '@/features/demandas/hooks';
import { useAuthStore } from '@/stores/auth-store';

const STATUS_ATIVOS = new Set(['recebida', 'em_analise', 'em_andamento']);

export default function HomeScreen() {
  const nomeCompleto = useAuthStore((state) => state.user?.nome) ?? '';
  const primeiroNome = nomeCompleto.split(' ')[0];
  const { data: demandas, isLoading, isError, refetch } = useMinhasDemandas();

  const emAndamento = demandas?.filter((demanda) => STATUS_ATIVOS.has(demanda.status)).length ?? 0;
  const concluidas = demandas?.filter((demanda) => demanda.status === 'concluida').length ?? 0;
  const ultimasAtualizacoes = [...(demandas ?? [])]
    .sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm))
    .slice(0, 3);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Olá, {primeiroNome || 'cidadão'}
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              Acompanhe suas solicitações ao ÁGORA
            </ThemedText>
          </ThemedView>

          <Link href="/demandas/nova" asChild>
            <Button label="Nova demanda" />
          </Link>

          {isLoading ? (
            <View style={styles.summaryRow}>
              <Skeleton height={72} />
              <Skeleton height={72} />
            </View>
          ) : isError ? null : (
            <View style={styles.summaryRow}>
              <Card style={styles.summaryCard}>
                <ThemedText type="title" style={styles.summaryNumber}>
                  {emAndamento}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Em andamento
                </ThemedText>
              </Card>
              <Card style={styles.summaryCard}>
                <ThemedText type="title" style={styles.summaryNumber}>
                  {concluidas}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Concluídas
                </ThemedText>
              </Card>
            </View>
          )}

          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Últimas atualizações
          </ThemedText>

          {isLoading ? (
            <View style={styles.list}>
              <Skeleton height={80} />
              <Skeleton height={80} />
            </View>
          ) : isError ? (
            <ErrorState
              message="Não foi possível carregar suas demandas."
              onRetry={() => refetch()}
            />
          ) : ultimasAtualizacoes.length === 0 ? (
            <EmptyState
              title="Você ainda não possui solicitações"
              description="Quando abrir uma demanda, o acompanhamento aparece aqui."
            />
          ) : (
            <View style={styles.list}>
              {ultimasAtualizacoes.map((demanda) => (
                <DemandaCard key={demanda.id} demanda={demanda} />
              ))}
            </View>
          )}
        </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.four,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    gap: Spacing.half,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'left',
    flexShrink: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'flex-start',
  },
  summaryNumber: {
    fontSize: 28,
    lineHeight: 32,
  },
  sectionTitle: {
    marginTop: Spacing.two,
  },
  list: {
    gap: Spacing.three,
  },
});
