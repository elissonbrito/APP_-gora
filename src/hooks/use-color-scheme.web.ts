import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { usePreferencesStore } from '@/stores/preferences-store';

const emptySubscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * useSyncExternalStore (em vez de useEffect + setState) evita o problema de
 * "cascading renders" e é a forma recomendada de expor um valor que só existe
 * após a hidratação no cliente.
 */
export function useColorScheme(): 'light' | 'dark' {
  const hasHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const colorScheme = useRNColorScheme();
  const tema = usePreferencesStore((state) => state.tema);

  if (hasHydrated) {
    if (tema === 'claro') return 'light';
    if (tema === 'escuro') return 'dark';
    return colorScheme ?? 'light';
  }

  return 'light';
}
