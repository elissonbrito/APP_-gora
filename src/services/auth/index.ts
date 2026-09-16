import { env } from '@/config/env';
import { apiClient } from '@/services/api/client';
import {
  mockFetchProfile,
  mockLogin,
  mockRefreshSession,
  mockRegister,
  mockRequestPasswordReset,
} from '@/services/api/mock/auth.mock';
import type { AuthTokens, LoginCredentials, RegisterPayload, User } from '@/types/auth';

type AuthResult = { user: User; tokens: AuthTokens };

/**
 * Camada de serviço de autenticação. Telas e hooks só devem falar com estas
 * funções — nunca com axios ou com o mock diretamente. Quando env.apiMode
 * for 'http', os endpoints abaixo (/auth/login, /auth/register, /auth/refresh,
 * /auth/me) são placeholders a validar contra a API real do ÁGORA (REGRA 1/2).
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

export async function refreshSession(refreshToken: string): Promise<AuthTokens> {
  if (env.apiMode === 'mock') return mockRefreshSession(refreshToken);
  const { data } = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
  return data;
}

/**
 * accessToken só é usado no modo mock (não há interceptor de fato injetando
 * header). No modo http o interceptor de services/api/interceptors.ts cuida
 * disso e o parâmetro é ignorado.
 */
export async function fetchProfile(accessToken: string): Promise<User> {
  if (env.apiMode === 'mock') return mockFetchProfile(accessToken);
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (env.apiMode === 'mock') return mockRequestPasswordReset(email);
  await apiClient.post('/auth/forgot-password', { email });
}
