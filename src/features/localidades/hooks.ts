import { useQuery } from '@tanstack/react-query';

import { listarEstados, listarMunicipios } from '@/services/localidades';
import { localidadesKeys } from '@/services/localidades/queryKeys';

/** Estados e municípios quase nunca mudam: uma hora de cache é suficiente. */
const UMA_HORA = 60 * 60 * 1000;

export function useEstados() {
  return useQuery({
    queryKey: localidadesKeys.estados(),
    queryFn: listarEstados,
    staleTime: UMA_HORA,
  });
}

export function useMunicipios(uf: string | undefined) {
  return useQuery({
    queryKey: localidadesKeys.municipios(uf ?? ''),
    queryFn: () => listarMunicipios(uf as string),
    enabled: Boolean(uf),
    staleTime: UMA_HORA,
  });
}
