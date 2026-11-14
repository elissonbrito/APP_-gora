import { useQuery } from '@tanstack/react-query';

import { buscarEnderecoPorCep, normalizarCep } from '@/services/enderecos';
import { enderecosKeys } from '@/services/enderecos/queryKeys';

/**
 * Busca o endereço assim que o CEP tiver 8 dígitos. Um CEP não muda de
 * endereço, então o resultado fica em cache durante toda a sessão.
 */
export function useEnderecoPorCep(cep: string) {
  const digitos = normalizarCep(cep);

  return useQuery({
    queryKey: enderecosKeys.cep(digitos),
    queryFn: () => buscarEnderecoPorCep(digitos),
    enabled: digitos.length === 8,
    staleTime: Infinity,
    retry: false,
  });
}
