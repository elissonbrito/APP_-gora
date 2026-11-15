import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { demandaCategoriaLabel } from '@/features/demandas/categoria';
import { useRascunhoEmEdicao } from '@/features/rascunhos/em-edicao-store';
import { useExcluirRascunho, useRascunho } from '@/features/rascunhos/hooks';
import { tituloDoRascunho } from '@/types/rascunho';
import { formatarDataHora } from '@/utils/date';

function Campo({ rotulo, valor }: { rotulo: string; valor?: string }) {
  return (
    <View style={styles.campo}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="default" themeColor={valor ? 'text' : 'textSecondary'}>
        {valor || 'Não preenchido'}
      </ThemedText>
    </View>
  );
}

export default function RascunhoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rascunhoId = Number(id);
  const { data: rascunho, isLoading, isError, refetch } = useRascunho(rascunhoId);
  const excluir = useExcluirRascunho();
  const abrirNaNova = useRascunhoEmEdicao((state) => state.abrir);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  async function handleExcluir() {
    // Exclusão em dois toques, sem diálogo: o primeiro pede confirmação.
    if (!confirmandoExclusao) {
      setConfirmandoExclusao(true);
      return;
    }
    await excluir.mutateAsync(rascunhoId);
    router.back();
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Rascunho' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        {isLoading ? (
          <View style={styles.content}>
            <Skeleton height={28} width="70%" />
            <Skeleton height={200} />
          </View>
        ) : isError || !rascunho ? (
          <ErrorState
            message={
              isError ? 'Não foi possível abrir o rascunho.' : 'Este rascunho não existe mais.'
            }
            onRetry={isError ? () => refetch() : undefined}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <ThemedText type="subtitle">{tituloDoRascunho(rascunho.dados)}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Editado em {formatarDataHora(rascunho.atualizadoEm)}
            </ThemedText>

            <Card style={styles.card}>
              <Campo
                rotulo="Categoria"
                valor={
                  rascunho.dados.categoria
                    ? demandaCategoriaLabel[rascunho.dados.categoria]
                    : undefined
                }
              />
              <Campo rotulo="Descrição" valor={rascunho.dados.descricao} />
              <Campo rotulo="Endereço" valor={rascunho.dados.localizacao?.endereco} />
              <Campo
                rotulo="Fotos"
                valor={
                  rascunho.dados.fotos?.length
                    ? `${rascunho.dados.fotos.length} anexada(s)`
                    : undefined
                }
              />
            </Card>

            <Button
              label="Continuar editando"
              onPress={() => {
                abrirNaNova(rascunho.id);
                // Fecha Rascunhos e Detalhe e volta à aba Nova já aberta.
                router.dismissTo('/nova');
              }}
            />
            <Button
              label={confirmandoExclusao ? 'Toque de novo para excluir' : 'Excluir rascunho'}
              variant={confirmandoExclusao ? 'destructive' : 'ghost'}
              loading={excluir.isPending}
              onPress={handleExcluir}
            />
          </ScrollView>
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
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  card: {
    gap: Spacing.three,
  },
  campo: {
    gap: Spacing.half,
  },
});
