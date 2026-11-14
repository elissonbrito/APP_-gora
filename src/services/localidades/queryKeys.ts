export const localidadesKeys = {
  all: ['localidades'] as const,
  estados: () => [...localidadesKeys.all, 'estados'] as const,
  municipios: (uf: string) => [...localidadesKeys.all, 'municipios', uf] as const,
};
