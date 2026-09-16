// MOCK CONTRACT — ver services/api/mock/auth.mock.ts. Dados fictícios até que
// a API real do ÁGORA esteja disponível para este projeto.
import type { DemandaResumo } from '@/types/demanda';

import { mockDelay } from './network';

const mockDemandasPorUsuario: Record<string, DemandaResumo[]> = {
  usr_cidadao_1: [
    {
      id: 'dem_1',
      protocolo: 'AG-2026-000123',
      assunto: 'Poste sem iluminação na Rua das Flores',
      categoria: 'iluminacao_publica',
      status: 'em_andamento',
      criadaEm: '2026-08-20T13:00:00.000Z',
      atualizadaEm: '2026-09-10T09:30:00.000Z',
    },
    {
      id: 'dem_2',
      protocolo: 'AG-2026-000098',
      assunto: 'Buraco na Av. Central altura do número 450',
      categoria: 'buracos_via',
      status: 'em_analise',
      criadaEm: '2026-08-05T11:00:00.000Z',
      atualizadaEm: '2026-08-22T15:45:00.000Z',
    },
    {
      id: 'dem_3',
      protocolo: 'AG-2026-000041',
      assunto: 'Coleta de lixo atrasada no bairro Centro',
      categoria: 'coleta_lixo',
      status: 'concluida',
      criadaEm: '2026-06-01T10:00:00.000Z',
      atualizadaEm: '2026-06-10T17:20:00.000Z',
    },
  ],
};

export async function mockListarMinhasDemandas(userId: string): Promise<DemandaResumo[]> {
  const demandas = mockDemandasPorUsuario[userId] ?? [];
  return mockDelay(demandas);
}
