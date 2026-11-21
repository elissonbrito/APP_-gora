import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { createContext, useContext } from 'react';
import { Pressable, View, StyleSheet, useWindowDimensions } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';

/** Abaixo desta largura (celular no navegador) a barra vai para baixo. */
const LARGURA_ESTREITA = 640;

const EstreitoContext = createContext(false);

/**
 * Abas da versão web. A barra fica no fluxo do layout (não sobrepõe as telas):
 * - tela estreita: embaixo, como num app, com os botões dividindo a largura;
 * - tela larga: no topo, com a marca — via flexDirection 'column-reverse'.
 */
export default function AppTabs() {
  const { width } = useWindowDimensions();
  const estreito = width < LARGURA_ESTREITA;

  return (
    <EstreitoContext.Provider value={estreito}>
      <Tabs style={[styles.tabs, !estreito && styles.tabsNoTopo]}>
        <TabSlot style={styles.slot} />
        <TabList asChild>
          <CustomTabList>
            <TabTrigger name="home" href="/" asChild>
              <TabButton>Home</TabButton>
            </TabTrigger>
            <TabTrigger name="demandas" href="/demandas" asChild>
              <TabButton>Demandas</TabButton>
            </TabTrigger>
            <TabTrigger name="nova" href="/nova" asChild>
              <TabButton>Nova</TabButton>
            </TabTrigger>
            <TabTrigger name="notificacoes" href="/notificacoes" asChild>
              <TabButton>{estreito ? 'Avisos' : 'Notificações'}</TabButton>
            </TabTrigger>
            <TabTrigger name="perfil" href="/perfil" asChild>
              <TabButton>Perfil</TabButton>
            </TabTrigger>
          </CustomTabList>
        </TabList>
      </Tabs>
    </EstreitoContext.Provider>
  );
}

export function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  // RN 0.88: o `ref` do TabTrigger é tipado para outro elemento e não serve ao
  // Pressable; a navegação usa só onPress/href, então ele é descartado.
  const estreito = useContext(EstreitoContext);

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [estreito && styles.botaoEstreito, pressed && styles.pressed]}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[styles.tabButtonView, estreito && styles.tabButtonViewEstreito]}>
        <ThemedText
          type="small"
          numberOfLines={1}
          style={estreito && styles.rotuloEstreito}
          themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const estreito = useContext(EstreitoContext);

  return (
    <View {...props} style={[styles.tabListContainer, estreito && styles.tabListEstreito]}>
      <ThemedView
        type="backgroundElement"
        style={[styles.innerContainer, estreito && styles.innerEstreito]}>
        {!estreito ? (
          <ThemedText type="smallBold" style={styles.brandText}>
            ÁGORA
          </ThemedText>
        ) : null}

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    flexDirection: 'column',
  },
  tabsNoTopo: {
    flexDirection: 'column-reverse',
  },
  slot: {
    flex: 1,
  },
  tabListContainer: {
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabListEstreito: {
    padding: Spacing.two,
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  innerEstreito: {
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    gap: Spacing.half,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  botaoEstreito: {
    flex: 1,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  tabButtonViewEstreito: {
    alignItems: 'center',
    paddingHorizontal: Spacing.half,
    paddingVertical: Spacing.two,
  },
  rotuloEstreito: {
    fontSize: 13,
  },
});
