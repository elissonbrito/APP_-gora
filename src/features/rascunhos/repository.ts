import { getDatabase } from '@/lib/database';
import type { Rascunho, RascunhoDados } from '@/types/rascunho';

type Linha = { id: number; dados: string; atualizado_em: string };

function paraRascunho(linha: Linha): Rascunho {
  let dados: RascunhoDados = {};
  try {
    dados = JSON.parse(linha.dados) as RascunhoDados;
  } catch {
    // Registro corrompido: mostra vazio em vez de quebrar a lista inteira.
  }
  return { id: linha.id, dados, atualizadoEm: linha.atualizado_em };
}

/** Rascunhos da Nova Demanda guardados em SQLite (celular). */
export const rascunhosRepository = {
  async listar(): Promise<Rascunho[]> {
    const db = await getDatabase();
    const linhas = await db.getAllAsync<Linha>(
      'SELECT id, dados, atualizado_em FROM rascunhos ORDER BY atualizado_em DESC',
    );
    return linhas.map(paraRascunho);
  },

  async obter(id: number): Promise<Rascunho | null> {
    const db = await getDatabase();
    const linha = await db.getFirstAsync<Linha>(
      'SELECT id, dados, atualizado_em FROM rascunhos WHERE id = ?',
      [id],
    );
    return linha ? paraRascunho(linha) : null;
  },

  /** Cria (sem id) ou atualiza (com id). Devolve o id salvo. */
  async salvar(dados: RascunhoDados, id?: number): Promise<number> {
    const db = await getDatabase();
    const agora = new Date().toISOString();
    const json = JSON.stringify(dados);

    if (id != null) {
      const resultado = await db.runAsync(
        'UPDATE rascunhos SET dados = ?, atualizado_em = ? WHERE id = ?',
        [json, agora, id],
      );
      if (resultado.changes > 0) return id;
    }

    const resultado = await db.runAsync(
      'INSERT INTO rascunhos (dados, atualizado_em) VALUES (?, ?)',
      [json, agora],
    );
    return resultado.lastInsertRowId;
  },

  async remover(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM rascunhos WHERE id = ?', [id]);
  },

  /** Apaga todos os rascunhos (usado ao sair da conta). */
  async limparTudo(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM rascunhos');
  },
};
