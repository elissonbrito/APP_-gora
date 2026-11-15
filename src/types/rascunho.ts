import type { NovaDemandaFormValues } from '@/schemas/demanda';

/**
 * Rascunho de uma Nova Demanda guardado só no aparelho. Os campos podem estar
 * incompletos — a validação completa acontece apenas no envio.
 */
export type RascunhoDados = Partial<NovaDemandaFormValues>;

export type Rascunho = {
  id: number;
  dados: RascunhoDados;
  /** ISO 8601 */
  atualizadoEm: string;
};

/** Título exibido na lista: o assunto, ou um texto padrão se ainda vazio. */
export function tituloDoRascunho(dados: RascunhoDados): string {
  return dados.assunto?.trim() || 'Rascunho sem assunto';
}
