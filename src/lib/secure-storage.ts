import * as SecureStore from 'expo-secure-store';

/**
 * Wrapper tipado sobre o expo-secure-store. Use para qualquer dado sensível
 * (tokens de sessão, credenciais). Para preferências não sensíveis, prefira
 * AsyncStorage.
 */
export const secureStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
