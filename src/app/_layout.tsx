import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotificationDeepLink } from '@/features/notificacoes/use-notification-deep-link';
import { queryClient } from '@/lib/query-client';
import { solicitarPermissaoNotificacoes } from '@/lib/notifications';
import { useAuthStore } from '@/stores/auth-store';
import { usePreferencesStore } from '@/stores/preferences-store';

const esquemaNativo = { sistema: 'unspecified', claro: 'light', escuro: 'dark' } as const;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const tema = usePreferencesStore((state) => state.tema);

  // No celular, avisa o sistema do tema escolhido para que componentes nativos
  // (abas, Switch, teclado) também troquem de cor.
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(esquemaNativo[tema]);
    }
  }, [tema]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (status === 'signed-in') {
      solicitarPermissaoNotificacoes();
    }
  }, [status]);

  useNotificationDeepLink();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {status !== 'checking' && (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={status === 'signed-in'}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Protected guard={status !== 'signed-in'}>
              <Stack.Screen name="login" />
              <Stack.Screen name="cadastro" />
              <Stack.Screen name="recuperar-senha" />
            </Stack.Protected>
          </Stack>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
