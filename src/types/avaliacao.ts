export type Avaliacao = {
  id: string;
  demandaId: string;
  nota: number;
  comentario?: string;
  criadaEm: string;
};

export type NovaAvaliacaoPayload = {
  nota: number;
  comentario?: string;
};
