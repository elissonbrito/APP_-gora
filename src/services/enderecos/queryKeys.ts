export const enderecosKeys = {
  all: ['enderecos'] as const,
  cep: (cep: string) => [...enderecosKeys.all, 'cep', cep] as const,
};
