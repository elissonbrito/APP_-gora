import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ListItem } from '@/components/ui/list-item';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePreferencesStore, type TemaPreferido } from '@/stores/preferences-store';

const OPCOES: { valor: TemaPreferido; titulo: string; descricao: string }[] = [
  {
    valor: 'sistema',
    titulo: 'Igual ao aparelho',
    descricao: 'Muda sozinho quando o celular troca de tema',
  },
  { valor: 'claro', titulo: 'Claro', descricao: 'Fundo branco, ideal durante o dia' },
  { valor: 'escuro', titulo: 'Escuro', descricao: 'Cansa menos a vista à noite' },
];

export default function AparenciaScreen() {
  const tema = usePreferencesStore((state) => state.tema);
  const setTema = usePreferencesStore((state) => state.setTema);
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Aparência' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="default" themeColor="textSecondary">
            Escolha como o ÁGORA aparece para você. A escolha fica salva neste aparelho.
          </ThemedText>

          <View style={styles.opcoes} accessibilityRole="radiogroup">
            {OPCOES.map((opcao) => (
              <ListItem
                key={opcao.valor}
                title={opcao.titulo}
                subtitle={opcao.descricao}
                trailing={tema === opcao.valor ? '✓' : undefined}
                selected={tema === opcao.valor}
                onPress={() => setTema(opcao.valor)}
              />
            ))}
          </View>

          <ThemedText type="smallBold">Prévia</ThemedText>
          <Card>
            <View style={styles.previewHeader}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                AGO-2026-000123
              </ThemedText>
              <Badge label="Em andamento" tone="info" />
            </View>
            <ThemedText type="subtitle">Poste apagado na praça</ThemedText>
            <View style={styles.paleta}>
              {[theme.primary, theme.success, theme.warning, theme.danger, theme.info].map(
                (cor) => (
                  <View key={cor} style={[styles.cor, { backgroundColor: cor }]} />
                ),
              )}
            </View>
          </Card>
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
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  opcoes: {
    gap: Spacing.two,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paleta: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  cor: {
    flex: 1,
    height: 24,
    borderRadius: Radius.small,
  },
});
