import { rascunhosRepository } from '@/features/rascunhos/repository';

/**
 * Banco SQLite falso em memória: guarda as linhas num array e responde às
 * mesmas consultas que o repositório faz.
 */
jest.mock('@/lib/database', () => {
  let linhas: { id: number; dados: string; atualizado_em: string }[] = [];
  let proximoId = 1;
  const db = {
    getAllAsync: jest.fn(async () =>
      [...linhas].sort((a, b) => b.atualizado_em.localeCompare(a.atualizado_em)),
    ),
    getFirstAsync: jest.fn(async (_sql: string, [id]: [number]) =>
      linhas.find((l) => l.id === id) ?? null,
    ),
    runAsync: jest.fn(async (sql: string, params: (string | number)[]) => {
      if (sql.startsWith('INSERT')) {
        const id = proximoId++;
        linhas.push({ id, dados: params[0] as string, atualizado_em: params[1] as string });
        return { lastInsertRowId: id, changes: 1 };
      }
      if (sql.startsWith('UPDATE')) {
        const linha = linhas.find((l) => l.id === params[2]);
        if (!linha) return { lastInsertRowId: 0, changes: 0 };
        linha.dados = params[0] as string;
        linha.atualizado_em = params[1] as string;
        return { lastInsertRowId: 0, changes: 1 };
      }
      const antes = linhas.length;
      linhas = linhas.filter((l) => l.id !== params[0]);
      return { lastInsertRowId: 0, changes: antes - linhas.length };
    }),
  };
  return { getDatabase: async () => db };
});

describe('rascunhosRepository (SQLite)', () => {
  test('salva, lista, atualiza e remove um rascunho', async () => {
    const id = await rascunhosRepository.salvar({ assunto: 'Poste apagado' });
    expect(await rascunhosRepository.obter(id)).toMatchObject({
      id,
      dados: { assunto: 'Poste apagado' },
    });

    const mesmoId = await rascunhosRepository.salvar({ assunto: 'Poste apagado na praça' }, id);
    expect(mesmoId).toBe(id);
    expect(await rascunhosRepository.listar()).toHaveLength(1);

    await rascunhosRepository.remover(id);
    expect(await rascunhosRepository.obter(id)).toBeNull();
  });

  test('atualizar um id que não existe cria um novo rascunho', async () => {
    const id = await rascunhosRepository.salvar({ assunto: 'Buraco' }, 999);
    expect(id).not.toBe(999);
    expect(await rascunhosRepository.obter(id)).not.toBeNull();
  });
});
