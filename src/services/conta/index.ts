import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import { mockDadosCadastrais, mockExcluirConta } from '@/services/api/mock/auth.mock';
import { mockListarMinhasDemandas, mockObterDemanda } from '@/services/api/mock/demandas.mock';
import { mockListarNotificacoes } from '@/services/api/mock/notificacoes.mock';
import type { ExportacaoDeDados } from '@/types/conta';

/**
 * Direitos do titular dos dados (LGPD, art. 18), exercidos pelo próprio app.
 * No modo http, o backend monta o arquivo (GET /conta/dados) e apaga a conta
 * com tudo ligado a ela (DELETE /conta).
 */
export async function exportarMeusDados(userId: string): Promise<ExportacaoDeDados> {
  if (env.apiMode === 'mock') {
    const resumos = await mockListarMinhasDemandas(userId);
    return {
      geradoEm: new Date().toISOString(),
      usuario: await mockDadosCadastrais(userId),
      demandas: await Promise.all(resumos.map((demanda) => mockObterDemanda(demanda.id))),
      notificacoes: await mockListarNotificacoes(userId),
    };
  }
  const { data } = await apiClient.get<ExportacaoDeDados>('/conta/dados');
  return data;
}

export async function excluirConta(userId: string, senha: string): Promise<void> {
  if (env.apiMode === 'mock') return mockExcluirConta(userId, senha);
  await apiClient.delete('/conta', { data: { senha } });
}
