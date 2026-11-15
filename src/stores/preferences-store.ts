import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Municipio } from '@/types/localidade';

/** 'sistema' segue o tema do aparelho; os outros dois o sobrepõem. */
export type TemaPreferido = 'sistema' | 'claro' | 'escuro';

type PreferencesState = {
  notificacoesAtivadas: boolean;
  setNotificacoesAtivadas: (ativadas: boolean) => void;
  /** Município do cidadão, escolhido na lista do IBGE. */
  cidade: Municipio | null;
  setCidade: (cidade: Municipio | null) => void;
  tema: TemaPreferido;
  setTema: (tema: TemaPreferido) => void;
};

/**
 * Preferências não sensíveis do dispositivo — não precisam de SecureStore.
 * Diferente da sessão (services/api/session.ts + stores/auth-store.ts), este
 * estado não afeta autenticação nem autorização.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notificacoesAtivadas: true,
      setNotificacoesAtivadas: (ativadas) => set({ notificacoesAtivadas: ativadas }),
      cidade: null,
      setCidade: (cidade) => set({ cidade }),
      tema: 'sistema',
      setTema: (tema) => set({ tema }),
    }),
    {
      name: 'agora.preferencias',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
