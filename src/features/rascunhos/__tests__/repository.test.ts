import AsyncStorage from '@react-native-async-storage/async-storage';

import { rascunhosRepository } from '@/features/rascunhos/repository';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(() => AsyncStorage.clear());

describe('rascunhosRepository (AsyncStorage)', () => {
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

  test('lista do mais recente para o mais antigo', async () => {
    const agora = jest.spyOn(Date.prototype, 'toISOString');
    agora.mockReturnValueOnce('2026-11-20T10:00:00.000Z');
    const antigo = await rascunhosRepository.salvar({ assunto: 'Antigo' });
    agora.mockReturnValueOnce('2026-11-21T10:00:00.000Z');
    const novo = await rascunhosRepository.salvar({ assunto: 'Novo' });
    agora.mockRestore();

    expect((await rascunhosRepository.listar()).map((r) => r.id)).toEqual([novo, antigo]);
  });

  test('limparTudo apaga todos os rascunhos', async () => {
    await rascunhosRepository.salvar({ assunto: 'A' });
    await rascunhosRepository.salvar({ assunto: 'B' });
    await rascunhosRepository.limparTudo();
    expect(await rascunhosRepository.listar()).toEqual([]);
  });
});
