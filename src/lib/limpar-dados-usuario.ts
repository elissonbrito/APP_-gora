import { rascunhosRepository } from '@/features/rascunhos/repository';
import { useRascunhoEmEdicao } from '@/features/rascunhos/em-edicao-store';
import { queryClient } from '@/lib/query-client';

/**
 * Apaga do aparelho o que pertence ao usuário que saiu, para o próximo a
 * entrar não ver dados alheios (Aula 10 — "limpe no logout"):
 * - demandas e notificações em memória (cache do React Query);
 * - rascunhos de demanda (descrição, endereço e fotos).
 * Preferências do aparelho (tema, cidade) e o cache público do IBGE ficam.
 */
export async function limparDadosDoUsuario(): Promise<void> {
  queryClient.clear();
  useRascunhoEmEdicao.getState().limpar();
  try {
    await rascunhosRepository.limparTudo();
  } catch {
    // Falhar aqui não pode impedir o logout.
  }
}
