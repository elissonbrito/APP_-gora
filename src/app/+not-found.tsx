import { Link, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';

/** Exibida quando um link (ou deep link agoraapp://...) aponta para uma rota inexistente. */
export default function NotFoundScreen() {
  const theme = useTheme();
  // A Home é protegida: sem sessão, o caminho de volta é o login.
  const logado = useAuthStore((state) => state.status === 'signed-in');

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <SymbolView
            name={{ ios: 'map', android: 'explore_off', web: 'explore_off' }}
            size={56}
            tintColor={theme.primary}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <ThemedText type="title" style={styles.codigo}>
            404
          </ThemedText>
          <ThemedText type="subtitle" style={styles.centro}>
            Página não encontrada
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.centro}>
            O endereço que você abriu não existe ou foi removido do ÁGORA.
          </ThemedText>
        </View>
        <Link href={logado ? '/' : '/login'} replace asChild>
          <Button label={logado ? 'Voltar ao início' : 'Ir para o login'} />
        </Link>
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
    gap: Spacing.four,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  codigo: {
    fontSize: 64,
    lineHeight: 72,
  },
  centro: {
    textAlign: 'center',
  },
});
