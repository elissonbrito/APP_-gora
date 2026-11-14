/**
 * Versão web do secureStorage. O expo-secure-store não existe no navegador
 * (não há Keychain/Keystore) e gravar o token em localStorage o deixaria
 * legível por qualquer script da página. Por isso, na web a sessão fica só em
 * memória: sobrevive à navegação, mas recarregar a página exige novo login.
 */
const memoria = new Map<string, string>();

export const secureStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = memoria.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    memoria.set(key, JSON.stringify(value));
  },

  async removeItem(key: string): Promise<void> {
    memoria.delete(key);
  },
};
