import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { criarDemanda, listarMinhasDemandas } from '@/services/demandas';
import { demandasKeys } from '@/services/demandas/queryKeys';
import { useAuthStore } from '@/stores/auth-store';
import type { NovaDemandaPayload } from '@/types/demanda';

export function useMinhasDemandas() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: demandasKeys.minhas(userId ?? ''),
    queryFn: () => listarMinhasDemandas(userId as string),
    enabled: Boolean(userId),
  });
}

export function useCriarDemanda() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NovaDemandaPayload) => criarDemanda(userId as string, payload),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: demandasKeys.minhas(userId) });
      }
    },
  });
}
