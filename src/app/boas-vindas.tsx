import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useOnboardingStore } from '@/stores/onboarding-store';

type Pagina = {
  id: string;
  icone: SymbolViewProps['name'];
  titulo: string;
  texto: string;
};

const PAGINAS: Pagina[] = [
  {
    id: 'registre',
    icone: { ios: 'megaphone', android: 'campaign', web: 'campaign' },
    titulo: 'Sua voz na cidade',
    texto:
      'Viu um poste apagado, um buraco ou lixo acumulado? Registre em poucos toques, com foto e endereço pelo CEP ou GPS.',
  },
  {
    id: 'acompanhe',
    icone: { ios: 'doc.text.magnifyingglass', android: 'manage_search', web: 'manage_search' },
    titulo: 'Acompanhe pelo protocolo',
    texto:
      'Cada demanda ganha um protocolo. Veja a linha do tempo do atendimento e receba avisos quando algo mudar.',
  },
  {
    id: 'avalie',
    icone: { ios: 'star.bubble', android: 'reviews', web: 'reviews' },
    titulo: 'Avalie o atendimento',
    texto:
      'Quando a demanda for concluída, dê sua nota. Sua avaliação ajuda a melhorar o serviço público.',
  },
];

export default function BoasVindasScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const larguraPagina = Math.min(width, MaxContentWidth);
  const concluir = useOnboardingStore((state) => state.concluir);
  const lista = useRef<FlatList<Pagina>>(null);
  const [atual, setAtual] = useState(0);
  const ultima = atual === PAGINAS.length - 1;

  function handleRolagem(evento: NativeSyntheticEvent<NativeScrollEvent>) {
    setAtual(Math.round(evento.nativeEvent.contentOffset.x / larguraPagina));
  }

  function handleProximo() {
    if (ultima) {
      // Ao concluir, a regra de rotas do layout raiz leva ao login sozinha.
      concluir();
      return;
    }
    lista.current?.scrollToIndex({ index: atual + 1, animated: true });
    setAtual(atual + 1);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <ThemedText type="smallBold" themeColor="primary" style={styles.marca}>
            ÁGORA
          </ThemedText>
          {!ultima ? (
            <Pressable onPress={concluir} accessibilityRole="button" hitSlop={12}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                Pular
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        <FlatList
          ref={lista}
          data={PAGINAS}
          keyExtractor={(pagina) => pagina.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleRolagem}
          getItemLayout={(_, index) => ({
            length: larguraPagina,
            offset: larguraPagina * index,
            index,
          })}
          style={styles.lista}
          renderItem={({ item }) => (
            <View style={[styles.pagina, { width: larguraPagina }]}>
              <View style={[styles.circulo, { backgroundColor: theme.primarySoft }]}>
                <SymbolView
                  name={item.icone}
                  size={64}
                  tintColor={theme.primary}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              </View>
              <ThemedText type="subtitle" style={styles.centro}>
                {item.titulo}
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.centro}>
                {item.texto}
              </ThemedText>
            </View>
          )}
        />

        <View style={styles.rodape}>
          <View
            style={styles.pontos}
            accessibilityLabel={`Página ${atual + 1} de ${PAGINAS.length}`}>
            {PAGINAS.map((pagina, index) => (
              <View
                key={pagina.id}
                style={[
                  styles.ponto,
                  { backgroundColor: index === atual ? theme.primary : theme.border },
                  index === atual && styles.pontoAtivo,
                ]}
              />
            ))}
          </View>
          <Button label={ultima ? 'Começar' : 'Próximo'} onPress={handleProximo} />
        </View>
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  marca: {
    letterSpacing: 3,
  },
  lista: {
    flex: 1,
  },
  pagina: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.five,
  },
  circulo: {
    width: 140,
    height: 140,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  centro: {
    textAlign: 'center',
  },
  rodape: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  pontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  pontoAtivo: {
    width: 24,
  },
});
