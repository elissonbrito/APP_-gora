/** Arquivo com todos os dados do titular (LGPD, art. 18 — acesso e portabilidade). */
export type ExportacaoDeDados = {
  geradoEm: string;
  usuario: Record<string, unknown>;
  demandas: Record<string, unknown>[];
  notificacoes: Record<string, unknown>[];
};
