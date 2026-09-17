export const demandasKeys = {
  all: ['demandas'] as const,
  minhas: (userId: string) => [...demandasKeys.all, 'minhas', userId] as const,
  detalhe: (id: string) => [...demandasKeys.all, 'detalhe', id] as const,
};
