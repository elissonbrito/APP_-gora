import { useMutation } from '@tanstack/react-query';

import type { LoginFormValues, RegisterFormValues } from '@/schemas/auth';
import * as authService from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';

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
