import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useNotificationDeepLink } from '@/features/notificacoes/use-notification-deep-link';
import { queryClient } from '@/lib/query-client';
import { solicitarPermissaoNotificacoes } from '@/lib/notifications';
import { useAuthStore } from '@/stores/auth-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);

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
