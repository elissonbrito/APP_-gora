import { useQuery } from '@tanstack/react-query';

import { demandasKeys } from '@/services/demandas/queryKeys';
import { listarMinhasDemandas } from '@/services/demandas';
import { useAuthStore } from '@/stores/auth-store';

export function useMinhasDemandas() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: demandasKeys.minhas(userId ?? ''),
    queryFn: () => listarMinhasDemandas(userId as string),
    enabled: Boolean(userId),
  });
}
