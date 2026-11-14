import { router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchableList } from '@/components/lists/searchable-list';
import { ThemedView } from '@/components/themed-view';
import { ListItem } from '@/components/ui/list-item';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useEstados } from '@/features/localidades/hooks';

export default function EstadosScreen() {
  const estados = useEstados();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Escolha seu estado' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <SearchableList
          data={estados.data}
          isLoading={estados.isLoading}
          error={estados.error}
          isRefetching={estados.isRefetching}
          refetch={estados.refetch}
          keyExtractor={(e) => e.sigla}
          renderItem={(e) => (
            <ListItem
              title={e.nome}
              subtitle={`Região ${e.regiao}`}
              trailing={e.sigla}
              onPress={() =>
                router.push({
                  pathname: '/localidades/[uf]',
                  params: { uf: e.sigla, nome: e.nome },
                })
              }
            />
          )}
          searchLabel="Buscar estado"
          emptyTitle="Nenhum estado encontrado"
        />
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
});
