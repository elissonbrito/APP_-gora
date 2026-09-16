import type { DemandaCategoria } from '@/types/demanda';

export const demandaCategoriaLabel: Record<DemandaCategoria, string> = {
  iluminacao_publica: 'Iluminação pública',
  buracos_via: 'Buracos na via',
  coleta_lixo: 'Coleta de lixo',
  poda_arvore: 'Poda de árvore',
  saneamento: 'Saneamento',
  outros: 'Outros',
};

export const demandaCategorias = Object.keys(demandaCategoriaLabel) as DemandaCategoria[];
