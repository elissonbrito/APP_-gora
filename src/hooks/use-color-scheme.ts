import { useColorScheme as useSystemColorScheme } from 'react-native';

import { usePreferencesStore } from '@/stores/preferences-store';

/**
 * Tema efetivo do app: a escolha do cidadão (tela Aparência) vence; com
 * "sistema", segue o tema do aparelho.
 */
export function useColorScheme(): 'light' | 'dark' {
  const sistema = useSystemColorScheme();
  const tema = usePreferencesStore((state) => state.tema);

  if (tema === 'claro') return 'light';
  if (tema === 'escuro') return 'dark';
  // RN 0.88: o sistema devolve null quando não informa o tema → claro.
  return sistema ?? 'light';
}
