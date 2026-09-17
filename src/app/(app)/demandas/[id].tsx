import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Placeholder — a tela completa (timeline, anexos, respostas) entra em um
 * próximo passo. Existe para os cards de demanda já terem destino de navegação.
 */
export default function DemandaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Detalhe da demanda' }} />
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Detalhe da demanda</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          O acompanhamento completo (linha do tempo, respostas, anexos) está em construção.
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          ID: {id}
        </ThemedText>
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
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
