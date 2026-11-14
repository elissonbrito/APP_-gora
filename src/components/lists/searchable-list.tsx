import { useState, type ReactElement } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/loading/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import { AppError } from '@/services/api/errors';
import { filtrarPorNome } from '@/services/localidades';

export type SearchableListProps<T extends { nome: string }> = {
  /** Resultado do useQuery da tela. */
  data: T[] | undefined;
  isLoading: boolean;
  error: unknown;
  isRefetching: boolean;
  refetch: () => unknown;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement;
  searchLabel: string;
  emptyTitle: string;
  emptyDescription?: string;
};

/**
 * Lista com busca local que cobre os 4 estados de uma tela com dados:
 * carregando → erro → vazio → sucesso (com puxar para atualizar).
 */
export function SearchableList<T extends { nome: string }>({
  data,
  isLoading,
  error,
  isRefetching,
  refetch,
  keyExtractor,
  renderItem,
  searchLabel,
  emptyTitle,
  emptyDescription,
}: SearchableListProps<T>) {
  const [busca, setBusca] = useState('');

  if (isLoading) {
    return (
      <View style={styles.gap}>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} height={56} />
        ))}
      </View>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error instanceof AppError ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const filtrados = filtrarPorNome(data, busca);

  return (
    <FlatList
      data={filtrados}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
      contentContainerStyle={styles.gap}
      keyboardShouldPersistTaps="handled"
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      initialNumToRender={20}
      ListHeaderComponent={
        <View style={styles.header}>
          <Input
            label={searchLabel}
            placeholder="Digite para filtrar"
            value={busca}
            onChangeText={setBusca}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          <ThemedText type="small" themeColor="textSecondary">
            {filtrados.length} de {data.length}
          </ThemedText>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          title="Nada encontrado"
          description={`Nenhum resultado para "${busca.trim()}".`}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: Spacing.two,
  },
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
});
