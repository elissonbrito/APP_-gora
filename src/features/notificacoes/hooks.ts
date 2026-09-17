import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { listarNotificacoes, marcarNotificacaoComoLida } from '@/services/notificacoes';
import { notificacoesKeys } from '@/services/notificacoes/queryKeys';
import { useAuthStore } from '@/stores/auth-store';
import type { Notificacao } from '@/types/notificacao';

export function useNotificacoes() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: notificacoesKeys.minhas(userId ?? ''),
    queryFn: () => listarNotificacoes(userId as string),
    enabled: Boolean(userId),
  });
}

export function useMarcarNotificacaoComoLida() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marcarNotificacaoComoLida(userId as string, id),
    onSuccess: (_data, id) => {
      if (!userId) return;
      queryClient.setQueryData<Notificacao[]>(notificacoesKeys.minhas(userId), (atual) =>
        atual?.map((item) => (item.id === id ? { ...item, lida: true } : item)),
      );
    },
  });
}
