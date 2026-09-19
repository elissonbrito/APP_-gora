import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvaliacaoSection } from '@/components/cards/avaliacao-section';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusTimeline } from '@/components/timeline/status-timeline';
import { Radius, Spacing } from '@/constants/theme';
import { demandaCategoriaLabel } from '@/features/demandas/categoria';
import { useDemanda } from '@/features/demandas/hooks';
import { demandaStatusLabel, demandaStatusTone } from '@/features/demandas/status';
import { formatarData } from '@/utils/date';

export default function DemandaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: demanda, isLoading, isError, refetch } = useDemanda(id);
  const [copiado, setCopiado] = useState(false);

  async function handleCopiarProtocolo() {
    if (!demanda) return;
    try {
      await Clipboard.setStringAsync(demanda.protocolo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Copiar é uma conveniência — se falhar, o protocolo continua visível
      // na tela para o cidadão anotar manualmente.
    }
  }

  async function handleCompartilhar() {
    if (!demanda) return;
    try {
      await Share.share({
        message: `Protocolo ÁGORA ${demanda.protocolo}: ${demanda.assunto}`,
      });
    } catch {
      // Compartilhar é opcional — cancelar ou falhar não deve gerar erro.
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Detalhe da demanda' }} />
      <SafeAreaView style={styles.safeArea}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Skeleton height={28} width="60%" />
            <Skeleton height={80} />
            <Skeleton height={160} />
          </View>
        ) : isError || !demanda ? (
          <ErrorState
            message="Não foi possível carregar esta demanda."
            onRetry={() => refetch()}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerRow}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                {demanda.protocolo}
              </ThemedText>
              <Badge
                label={demandaStatusLabel[demanda.status]}
                tone={demandaStatusTone[demanda.status]}
              />
            </View>

            <ThemedText type="subtitle">{demanda.assunto}</ThemedText>

            <View style={styles.actionsRow}>
              <Button
                label={copiado ? 'Protocolo copiado' : 'Copiar protocolo'}
                variant="secondary"
                onPress={handleCopiarProtocolo}
                fullWidth={false}
              />
              <Button
                label="Compartilhar"
                variant="ghost"
                onPress={handleCompartilhar}
                fullWidth={false}
              />
            </View>

            <Card>
              <InfoRow label="Categoria" value={demandaCategoriaLabel[demanda.categoria]} />
              <InfoRow label="Aberta em" value={formatarData(demanda.criadaEm)} />
              <InfoRow label="Endereço" value={demanda.localizacao.endereco} />
              {demanda.setorResponsavel ? (
                <InfoRow label="Setor responsável" value={demanda.setorResponsavel} />
              ) : null}
            </Card>

            <View style={styles.section}>
              <ThemedText type="smallBold">Descrição</ThemedText>
              <ThemedText type="default">{demanda.descricao}</ThemedText>
            </View>

            {demanda.fotos.length > 0 ? (
              <View style={styles.section}>
                <ThemedText type="smallBold">Fotos</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.photosRow}>
                    {demanda.fotos.map((uri) => (
                      <Image key={uri} source={{ uri }} style={styles.photo} contentFit="cover" />
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Acompanhamento
              </ThemedText>
              <StatusTimeline historico={demanda.historico} />
            </View>

            {demanda.status === 'concluida' ? (
              <AvaliacaoSection demandaId={demanda.id} avaliacao={demanda.avaliacao} />
            ) : null}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="small">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  photosRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: Radius.medium,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
});
