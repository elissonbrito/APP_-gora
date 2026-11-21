import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Rascunho, RascunhoDados } from '@/types/rascunho';

/**
 * Versão web dos rascunhos. O SQLite do Expo na web ainda é alfa e exige
 * cabeçalhos especiais no servidor, então no navegador os rascunhos ficam no
 * AsyncStorage (localStorage). A interface é idêntica à versão SQLite.
 */
const CHAVE = 'agora.v1.rascunhos';

async function lerTodos(): Promise<Rascunho[]> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Rascunho[]) : [];
  } catch {
    return [];
  }
}

async function gravarTodos(lista: Rascunho[]) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
}

export const rascunhosRepository = {
  async listar(): Promise<Rascunho[]> {
    const lista = await lerTodos();
    return lista.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
  },

  async obter(id: number): Promise<Rascunho | null> {
    return (await lerTodos()).find((r) => r.id === id) ?? null;
  },

  async salvar(dados: RascunhoDados, id?: number): Promise<number> {
    const lista = await lerTodos();
    const atualizadoEm = new Date().toISOString();
    const existente = id != null ? lista.find((r) => r.id === id) : undefined;

    if (existente) {
      existente.dados = dados;
      existente.atualizadoEm = atualizadoEm;
      await gravarTodos(lista);
      return existente.id;
    }

    const novoId = lista.reduce((maior, r) => Math.max(maior, r.id), 0) + 1;
    await gravarTodos([...lista, { id: novoId, dados, atualizadoEm }]);
    return novoId;
  },

  async remover(id: number): Promise<void> {
    await gravarTodos((await lerTodos()).filter((r) => r.id !== id));
  },

  async limparTudo(): Promise<void> {
    await AsyncStorage.removeItem(CHAVE);
  },
};
