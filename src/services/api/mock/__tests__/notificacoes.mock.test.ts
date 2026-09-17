import {
  mockListarNotificacoes,
  mockMarcarNotificacaoComoLida,
} from '@/services/api/mock/notificacoes.mock';

const USER_ID = 'usr_cidadao_1';

describe('mockListarNotificacoes', () => {
  test('retorna as notificações ordenadas da mais recente para a mais antiga', async () => {
    const lista = await mockListarNotificacoes(USER_ID);
    const datas = lista.map((item) => new Date(item.criadaEm).getTime());
    const ordenadas = [...datas].sort((a, b) => b - a);
    expect(datas).toEqual(ordenadas);
  });

  test('usuário sem notificações recebe lista vazia', async () => {
    const lista = await mockListarNotificacoes('usr_sem_notificacoes');
    expect(lista).toEqual([]);
  });
});

describe('mockMarcarNotificacaoComoLida', () => {
  test('marca a notificação como lida', async () => {
    const [primeira] = await mockListarNotificacoes(USER_ID);
    expect(primeira.lida).toBe(false);

    await mockMarcarNotificacaoComoLida(USER_ID, primeira.id);

    const listaAtualizada = await mockListarNotificacoes(USER_ID);
    const atualizada = listaAtualizada.find((item) => item.id === primeira.id);
    expect(atualizada?.lida).toBe(true);
  });
});
