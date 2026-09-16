import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import { mockListarMinhasDemandas } from '@/services/api/mock/demandas.mock';
import type { DemandaResumo } from '@/types/demanda';

export async function listarMinhasDemandas(userId: string): Promise<DemandaResumo[]> {
  if (env.apiMode === 'mock') return mockListarMinhasDemandas(userId);
  const { data } = await apiClient.get<DemandaResumo[]>('/demandas/minhas');
  return data;
}
