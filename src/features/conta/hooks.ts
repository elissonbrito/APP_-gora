import { useMutation } from '@tanstack/react-query';

import { excluirConta, exportarMeusDados } from '@/services/conta';
import { useAuthStore } from '@/stores/auth-store';

export function useExportarMeusDados() {
  const userId = useAuthStore((state) => state.user?.id);
  return useMutation({ mutationFn: () => exportarMeusDados(userId as string) });
}

/** Ao excluir, encerra a sessão e apaga do aparelho os dados do usuário. */
export function useExcluirConta() {
  const userId = useAuthStore((state) => state.user?.id);
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: (senha: string) => excluirConta(userId as string, senha),
    onSuccess: () => logout(),
  });
}
