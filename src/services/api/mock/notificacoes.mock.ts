// MOCK CONTRACT — ver services/api/mock/auth.mock.ts.
import type { Notificacao } from '@/types/notificacao';

import { mockDelay } from './network';

const mockNotificacoesPorUsuario: Record<string, Notificacao[]> = {
  usr_cidadao_1: [
    {
      id: 'not_1',
      tipo: 'atualizacao_status',
      titulo: 'Sua solicitação foi atualizada',
      corpo: 'O protocolo AG-2026-000123 mudou para "Em andamento".',
      lida: false,
      criadaEm: '2026-09-10T09:30:00.000Z',
      demandaId: 'dem_1',
    },
    {
      id: 'not_2',
      tipo: 'resposta_setor',
      titulo: 'Nova resposta da Secretaria de Obras',
      corpo: 'A Secretaria de Obras respondeu ao protocolo AG-2026-000098.',
      lida: false,
      criadaEm: '2026-08-22T15:45:00.000Z',
      demandaId: 'dem_2',
    },
    {
      id: 'not_3',
      tipo: 'conclusao',
      titulo: 'Solicitação concluída',
      corpo: 'Seu protocolo AG-2026-000041 foi concluído.',
      lida: true,
      criadaEm: '2026-06-10T17:20:00.000Z',
      demandaId: 'dem_3',
    },
  ],
};

export async function mockListarNotificacoes(userId: string): Promise<Notificacao[]> {
  const lista = mockNotificacoesPorUsuario[userId] ?? [];
  return mockDelay([...lista].sort((a, b) => b.criadaEm.localeCompare(a.criadaEm)));
}

export async function mockMarcarNotificacaoComoLida(userId: string, id: string): Promise<void> {
  const notificacao = mockNotificacoesPorUsuario[userId]?.find((item) => item.id === id);
  if (notificacao) {
    notificacao.lida = true;
  }
  return mockDelay(undefined, 200);
}
