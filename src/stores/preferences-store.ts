import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PreferencesState = {
  notificacoesAtivadas: boolean;
  setNotificacoesAtivadas: (ativadas: boolean) => void;
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
    }),
    {
      name: 'agora.preferencias',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
