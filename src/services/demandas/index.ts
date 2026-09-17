import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import {
  mockCriarDemanda,
  mockListarMinhasDemandas,
  mockObterDemanda,
} from '@/services/api/mock/demandas.mock';
import type { DemandaDetalhe, DemandaResumo, NovaDemandaPayload } from '@/types/demanda';

export async function listarMinhasDemandas(userId: string): Promise<DemandaResumo[]> {
  if (env.apiMode === 'mock') return mockListarMinhasDemandas(userId);
  const { data } = await apiClient.get<DemandaResumo[]>('/demandas/minhas');
  return data;
}

export async function criarDemanda(
  userId: string,
  payload: NovaDemandaPayload,
): Promise<DemandaResumo> {
  if (env.apiMode === 'mock') return mockCriarDemanda(userId, payload);
  const { data } = await apiClient.post<DemandaResumo>('/demandas', payload);
  return data;
}

export async function obterDemanda(id: string): Promise<DemandaDetalhe> {
  if (env.apiMode === 'mock') return mockObterDemanda(id);
  const { data } = await apiClient.get<DemandaDetalhe>(`/demandas/${id}`);
  return data;
}
