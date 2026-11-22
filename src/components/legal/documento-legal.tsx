import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { DATA_ATUALIZACAO, type DocumentoLegal } from '@/content/legal';

/** Exibe um documento legal (Termos ou Política) em seções numeradas. */
export function DocumentoLegalView({ documento }: { documento: DocumentoLegal }) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Última atualização: {DATA_ATUALIZACAO}
          </ThemedText>
          <ThemedText type="default">{documento.introducao}</ThemedText>

          {documento.secoes.map((secao) => (
            <View key={secao.titulo} style={styles.secao}>
              <ThemedText type="smallBold" accessibilityRole="header">
                {secao.titulo}
              </ThemedText>
              {secao.paragrafos.map((paragrafo) => (
                <ThemedText
                  key={paragrafo}
                  type="default"
                  themeColor="textSecondary"
                  style={paragrafo.startsWith('•') && styles.item}>
                  {paragrafo}
                </ThemedText>
              ))}
            </View>
          ))}
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
    gap: Spacing.four,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  secao: {
    gap: Spacing.two,
  },
  item: {
    paddingLeft: Spacing.two,
  },
});
