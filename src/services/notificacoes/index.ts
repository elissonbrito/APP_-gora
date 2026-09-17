import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import {
  mockListarNotificacoes,
  mockMarcarNotificacaoComoLida,
} from '@/services/api/mock/notificacoes.mock';
import type { Notificacao } from '@/types/notificacao';

export async function listarNotificacoes(userId: string): Promise<Notificacao[]> {
  if (env.apiMode === 'mock') return mockListarNotificacoes(userId);
  const { data } = await apiClient.get<Notificacao[]>('/notificacoes');
  return data;
}

export async function marcarNotificacaoComoLida(userId: string, id: string): Promise<void> {
  if (env.apiMode === 'mock') return mockMarcarNotificacaoComoLida(userId, id);
  await apiClient.post(`/notificacoes/${id}/lida`);
}
