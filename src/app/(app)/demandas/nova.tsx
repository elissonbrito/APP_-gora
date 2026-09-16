import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Placeholder — o formulário completo (categoria, descrição, localização,
 * anexos) entra em um próximo passo. Esta tela existe para o botão "Nova
 * demanda" da Home já ter um destino de navegação válido.
 */
export default function NovaDemandaScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Nova demanda' }} />
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Nova demanda</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          O formulário de abertura de demanda está em construção.
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
