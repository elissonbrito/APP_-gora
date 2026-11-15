import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { RascunhoDados } from '@/types/rascunho';

import { rascunhosRepository } from './repository';

export const rascunhosKeys = {
  all: ['rascunhos'] as const,
  lista: () => [...rascunhosKeys.all, 'lista'] as const,
  detalhe: (id: number) => [...rascunhosKeys.all, 'detalhe', id] as const,
};

export function useRascunhos() {
  return useQuery({ queryKey: rascunhosKeys.lista(), queryFn: rascunhosRepository.listar });
}

export function useRascunho(id: number | undefined) {
  return useQuery({
    queryKey: rascunhosKeys.detalhe(id ?? 0),
    queryFn: () => rascunhosRepository.obter(id as number),
    enabled: id != null && !Number.isNaN(id),
  });
}

export function useSalvarRascunho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dados, id }: { dados: RascunhoDados; id?: number }) =>
      rascunhosRepository.salvar(dados, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rascunhosKeys.all }),
  });
}

export function useExcluirRascunho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rascunhosRepository.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rascunhosKeys.all }),
  });
}
