import type { BadgeTone } from '@/components/ui/badge';
import type { DemandaStatus } from '@/types/demanda';

export const demandaStatusLabel: Record<DemandaStatus, string> = {
  recebida: 'Recebida',
  em_analise: 'Em análise',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

export const demandaStatusTone: Record<DemandaStatus, BadgeTone> = {
  recebida: 'neutral',
  em_analise: 'info',
  em_andamento: 'warning',
  concluida: 'success',
};
