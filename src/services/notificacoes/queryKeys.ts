export const notificacoesKeys = {
  all: ['notificacoes'] as const,
  minhas: (userId: string) => [...notificacoesKeys.all, 'minhas', userId] as const,
};
