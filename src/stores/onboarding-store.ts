import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
  /** O cidadão já passou pelas boas-vindas neste aparelho. */
  visto: boolean;
  concluir: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      visto: false,
      concluir: () => set({ visto: true }),
    }),
    {
      name: 'agora.onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/**
 * true depois que o valor salvo foi lido do AsyncStorage ("hidratação"). Até
 * lá o app não decide a primeira tela, para não mostrar o login e logo em
 * seguida trocar pelas boas-vindas.
 */
export function useOnboardingHidratado(): boolean {
  return useSyncExternalStore(
    (avisar) => useOnboardingStore.persist.onFinishHydration(avisar),
    () => useOnboardingStore.persist.hasHydrated(),
    () => false,
  );
}
