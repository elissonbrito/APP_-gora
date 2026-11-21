import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { ListItem } from '@/components/ui/list-item';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const FONTES_DE_DADOS = [
  {
    nome: 'ViaCEP',
    uso: 'Endereço a partir do CEP na Nova Demanda',
    url: 'https://viacep.com.br',
  },
  {
    nome: 'IBGE — API de Localidades',
    uso: 'Lista oficial de estados e municípios',
    url: 'https://servicodados.ibge.gov.br/api/docs/localidades',
  },
];

export default function SobreScreen() {
  const versao = Constants.expoConfig?.version ?? '—';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Sobre o ÁGORA' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.marca}>
            <Image
              source={require('@/assets/images/agora-marca.png')}
              style={styles.simbolo}
              accessibilityIgnoresInvertColors
            />
            <ThemedText type="title" themeColor="primary" style={styles.logo}>
              ÁGORA
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centro}>
              A praça pública no seu bolso: registre, acompanhe e avalie as demandas da sua cidade.
            </ThemedText>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Versão {versao}
            </ThemedText>
          </View>

          <Card>
            <ThemedText type="smallBold">O que você pode fazer</ThemedText>
            <ThemedText type="default">
              • Abrir demandas com foto, CEP ou GPS{'\n'}• Acompanhar cada etapa pelo protocolo
              {'\n'}• Salvar rascunhos e terminar depois, mesmo sem internet{'\n'}• Avaliar o
              atendimento quando a demanda é concluída
            </ThemedText>
          </Card>

          <View style={styles.secao}>
            <ThemedText type="smallBold">Dados públicos utilizados</ThemedText>
            {FONTES_DE_DADOS.map((fonte) => (
              <ListItem
                key={fonte.nome}
                title={fonte.nome}
                subtitle={fonte.uso}
                trailing="↗"
                onPress={() => {
                  WebBrowser.openBrowserAsync(fonte.url).catch(() => {
                    // Abrir o site é só informativo; falhar não afeta o app.
                  });
                }}
              />
            ))}
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={styles.centro}>
            Seus dados de acesso ficam protegidos no cofre do aparelho (Keychain/Keystore).
            Preferências e rascunhos ficam só neste celular.
          </ThemedText>
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
  marca: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  simbolo: {
    width: 88,
    height: 88,
  },
  logo: {
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: 4,
  },
  centro: {
    textAlign: 'center',
  },
  secao: {
    gap: Spacing.two,
  },
});
