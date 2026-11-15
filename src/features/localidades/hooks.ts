import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { comCache } from '@/services/cache';
import { listarEstados, listarMunicipios } from '@/services/localidades';
import { localidadesKeys } from '@/services/localidades/queryKeys';

/** Estados e municípios quase nunca mudam: o cache no aparelho vale um dia. */
const UM_DIA = 24 * 60 * 60 * 1000;

/**
 * Consulta com cache persistido (comCache): abre na hora com o que já está no
 * aparelho e continua funcionando offline. "Puxar para atualizar" e "Tentar
 * novamente" ignoram a validade e vão à API.
 */
function useConsultaComCache<T>(
  queryKey: readonly unknown[],
  chaveCache: string,
  buscar: () => Promise<T>,
  enabled = true,
) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey,
    queryFn: () => comCache(chaveCache, buscar, UM_DIA),
    enabled,
    staleTime: UM_DIA,
  });
  const [atualizando, setAtualizando] = useState(false);

  async function atualizar() {
    // Sem dados na tela (erro): refaz a consulta normal para exibir o resultado.
    if (!query.data) {
      await query.refetch();
      return;
    }
    setAtualizando(true);
    try {
      const dados = await comCache(chaveCache, buscar, 0);
      queryClient.setQueryData(queryKey, dados);
    } finally {
      setAtualizando(false);
    }
  }

  return { ...query, isRefetching: atualizando || query.isRefetching, refetch: atualizar };
}

export function useEstados() {
  return useConsultaComCache(localidadesKeys.estados(), 'ibge:estados', listarEstados);
}

export function useMunicipios(uf: string | undefined) {
  return useConsultaComCache(
    localidadesKeys.municipios(uf ?? ''),
    `ibge:municipios:${uf}`,
    () => listarMunicipios(uf as string),
    Boolean(uf),
  );
}
