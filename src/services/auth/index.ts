import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import {
  mockAlterarSenha,
  mockAtualizarPerfil,
  mockFetchProfile,
  mockLogin,
  mockRegister,
  mockRequestPasswordReset,
} from '@/services/api/mock/auth.mock';
import type {
  AlterarSenhaPayload,
  AtualizarPerfilPayload,
  AuthTokens,
  LoginCredentials,
  RegisterPayload,
  User,
} from '@/types/auth';

type AuthResult = { user: User; tokens: AuthTokens };

/**
 * Camada de serviço de autenticação. Telas e hooks só devem falar com estas
 * funções — nunca com axios ou com o mock diretamente. Quando env.apiMode
 * for 'http', os endpoints abaixo (/auth/login, /auth/register, /auth/me) são placeholders a validar contra a API real do ÁGORA (REGRA 1/2).
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  if (env.apiMode === 'mock') return mockLogin(credentials);
  const { data } = await apiClient.post<AuthResult>('/auth/login', credentials);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  if (env.apiMode === 'mock') return mockRegister(payload);
  const { data } = await apiClient.post<AuthResult>('/auth/register', payload);
  return data;
}

/**
 * Usado ao reabrir o app (restoreSession): nesse momento a store ainda não tem
 * o token em memória, então o interceptor não o injetaria — por isso o token
 * salvo no SecureStore vai explicitamente no cabeçalho.
 */
export async function fetchProfile(accessToken: string): Promise<User> {
  if (env.apiMode === 'mock') return mockFetchProfile(accessToken);
  const { data } = await apiClient.get<User>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (env.apiMode === 'mock') return mockRequestPasswordReset(email);
  await apiClient.post('/auth/forgot-password', { email });
}

export async function atualizarPerfil(
  userId: string,
  payload: AtualizarPerfilPayload,
): Promise<User> {
  if (env.apiMode === 'mock') return mockAtualizarPerfil(userId, payload);
  const { data } = await apiClient.patch<User>('/auth/me', payload);
  return data;
}

export async function alterarSenha(userId: string, payload: AlterarSenhaPayload): Promise<void> {
  if (env.apiMode === 'mock') return mockAlterarSenha(userId, payload);
  await apiClient.post('/auth/alterar-senha', payload);
}
