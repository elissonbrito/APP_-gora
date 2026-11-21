import AsyncStorage from '@react-native-async-storage/async-storage';

import { useOnboardingStore } from '@/stores/onboarding-store';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('onboarding-store', () => {
  test('começa como não visto', () => {
    expect(useOnboardingStore.getState().visto).toBe(false);
  });

  test('concluir marca como visto e grava no AsyncStorage', async () => {
    useOnboardingStore.getState().concluir();
    expect(useOnboardingStore.getState().visto).toBe(true);

    const salvo = JSON.parse((await AsyncStorage.getItem('agora.onboarding')) ?? '{}');
    expect(salvo.state.visto).toBe(true);
  });
});
