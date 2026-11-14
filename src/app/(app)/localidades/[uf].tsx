import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchableList } from '@/components/lists/searchable-list';
import { ThemedView } from '@/components/themed-view';
import { ListItem } from '@/components/ui/list-item';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMunicipios } from '@/features/localidades/hooks';
import { usePreferencesStore } from '@/stores/preferences-store';
import type { Municipio } from '@/types/localidade';

export default function MunicipiosScreen() {
  const { uf, nome } = useLocalSearchParams<{ uf: string; nome?: string }>();
  const sigla = uf?.toUpperCase();
  const municipios = useMunicipios(sigla);
  const cidadeAtual = usePreferencesStore((state) => state.cidade);
  const setCidade = usePreferencesStore((state) => state.setCidade);

  function handleEscolher(municipio: Municipio) {
    setCidade(municipio);
    // Fecha estado e município de uma vez e volta ao Perfil.
    router.dismissTo('/perfil');
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: nome ?? `Municípios de ${sigla}` }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <SearchableList
          data={municipios.data}
          isLoading={municipios.isLoading}
          error={municipios.error}
          isRefetching={municipios.isRefetching}
          refetch={municipios.refetch}
          keyExtractor={(m) => String(m.id)}
          renderItem={(m) => (
            <ListItem
              title={m.nome}
              trailing={m.uf}
              selected={cidadeAtual?.id === m.id}
              onPress={() => handleEscolher(m)}
            />
          )}
          searchLabel="Buscar município"
          emptyTitle="Nenhum município encontrado"
          emptyDescription={`O IBGE não retornou municípios para "${sigla}". Confira a sigla do estado.`}
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
