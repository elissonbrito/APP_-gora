/**
 * Estados possíveis de uma demanda, conforme a especificação do produto.
 * Não inventar novos status aqui — devem ser derivados do que a API real do
 * ÁGORA vier a retornar.
 */
export type DemandaStatus = 'recebida' | 'em_analise' | 'em_andamento' | 'concluida';

export type DemandaCategoria =
  | 'iluminacao_publica'
  | 'buracos_via'
  | 'coleta_lixo'
  | 'poda_arvore'
  | 'saneamento'
  | 'outros';

export type DemandaResumo = {
  id: string;
  protocolo: string;
  assunto: string;
  categoria: DemandaCategoria;
  status: DemandaStatus;
  criadaEm: string;
  atualizadaEm: string;
};

export type DemandaLocalizacao = {
  endereco: string;
  latitude?: number;
  longitude?: number;
};

export type NovaDemandaPayload = {
  categoria: DemandaCategoria;
  assunto: string;
  descricao: string;
  localizacao: DemandaLocalizacao;
};
