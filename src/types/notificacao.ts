export type NotificacaoTipo =
  | 'atualizacao_status'
  | 'resposta_setor'
  | 'solicitacao_informacao'
  | 'conclusao'
  | 'aviso_geral';

export type Notificacao = {
  id: string;
  tipo: NotificacaoTipo;
  titulo: string;
  corpo: string;
  lida: boolean;
  criadaEm: string;
  demandaId?: string;
};
