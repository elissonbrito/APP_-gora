import { useMutation } from '@tanstack/react-query';

import type { AtualizarPerfilFormValues, LoginFormValues, RegisterFormValues } from '@/schemas/auth';
import * as authService from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import type { AlterarSenhaPayload } from '@/types/auth';

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
  });
}

export function useRegister() {
  const register = useAuthStore((state) => state.register);
  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      register({
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        senha: values.senha,
      }),
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
}

export function useAtualizarPerfil() {
  const userId = useAuthStore((state) => state.user?.id);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (values: AtualizarPerfilFormValues) =>
      authService.atualizarPerfil(userId as string, values),
    onSuccess: (user) => setUser(user),
  });
}

export function useAlterarSenha() {
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (payload: AlterarSenhaPayload) => authService.alterarSenha(userId as string, payload),
  });
}
