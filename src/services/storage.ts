import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper tipado sobre o AsyncStorage: esconde o JSON.stringify/parse em um
 * lugar só. Use para dados NÃO sensíveis (cache, preferências). Tokens e
 * credenciais vão no secureStorage (lib/secure-storage).
 *
 * Todas as chaves ganham o prefixo versionado "agora.v1." — se o formato de
 * algum dado mudar, basta subir a versão para não ler dados antigos.
 */
const PREFIXO = 'agora.v1.';

export const storage = {
  async get<T>(chave: string, padrao: T): Promise<T> {
    try {
      const bruto = await AsyncStorage.getItem(PREFIXO + chave);
      return bruto ? (JSON.parse(bruto) as T) : padrao;
    } catch {
      // Dado corrompido ou leitura falhou: segue com o valor padrão.
      return padrao;
    }
  },

  async set<T>(chave: string, valor: T): Promise<void> {
    await AsyncStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  },

  async remove(chave: string): Promise<void> {
    await AsyncStorage.removeItem(PREFIXO + chave);
  },
};
