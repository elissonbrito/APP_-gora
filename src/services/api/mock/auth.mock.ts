// MOCK CONTRACT — não existe ainda uma API do ÁGORA acessível a este projeto.
// Este arquivo simula os contratos descritos na especificação do produto
// (login, cadastro, sessão, perfil). Ao integrar com o backend real, substitua
// apenas as implementações em services/auth/index.ts — nada na UI muda.
import { AppError } from '@/services/api/errors';
import type {
  AlterarSenhaPayload,
  AtualizarPerfilPayload,
  AuthTokens,
  LoginCredentials,
  RegisterPayload,
  User,
} from '@/types/auth';

import { mockDelay } from './network';

type MockUserRecord = User & { senha: string };

const mockUsers: MockUserRecord[] = [
  {
    id: 'usr_cidadao_1',
    nome: 'Maria da Silva',
    email: 'cidadao@agora.dev',
    senha: '123456',
    telefone: '(22) 99999-0000',
    role: 'cidadao',
    permissions: ['demandas:criar', 'demandas:visualizar_proprias'],
  },
  {
    id: 'usr_colaborador_1',
    nome: 'João Souza',
    email: 'colaborador@agora.dev',
    senha: '123456',
    role: 'colaborador',
    permissions: ['demandas:visualizar_atribuidas', 'demandas:atualizar_status'],
  },
  {
    id: 'usr_gestor_1',
    nome: 'Ana Pereira',
    email: 'gestor@agora.dev',
    senha: '123456',
    role: 'gestor',
    permissions: ['indicadores:visualizar', 'demandas:visualizar_atribuidas'],
  },
];

function issueTokens(userId: string): AuthTokens {
  return {
    accessToken: `mock-access.${userId}.${Date.now()}`,
    refreshToken: `mock-refresh.${userId}.${Date.now()}`,
  };
}

function toPublicUser(record: MockUserRecord): User {
  const { senha: _senha, ...user } = record;
  return user;
}

export async function mockLogin(
  credentials: LoginCredentials,
): Promise<{ user: User; tokens: AuthTokens }> {
  const record = mockUsers.find((candidate) => candidate.email === credentials.email);
  if (!record || record.senha !== credentials.senha) {
    throw new AppError('auth', 'E-mail ou senha inválidos.');
  }
  const user = toPublicUser(record);
  return mockDelay({ user, tokens: issueTokens(user.id) });
}

export async function mockRegister(
  payload: RegisterPayload,
): Promise<{ user: User; tokens: AuthTokens }> {
  if (mockUsers.some((candidate) => candidate.email === payload.email)) {
    throw new AppError('validation', 'Já existe uma conta cadastrada com este e-mail.');
  }
  const newUser: MockUserRecord = {
    id: `usr_${Date.now()}`,
    nome: payload.nome,
    email: payload.email,
    telefone: payload.telefone,
    senha: payload.senha,
    role: 'cidadao',
    permissions: ['demandas:criar', 'demandas:visualizar_proprias'],
  };
  mockUsers.push(newUser);
  const user = toPublicUser(newUser);
  return mockDelay({ user, tokens: issueTokens(user.id) });
}

export async function mockRefreshSession(refreshToken: string): Promise<AuthTokens> {
  const [, userId] = refreshToken.split('.');
  const record = mockUsers.find((candidate) => candidate.id === userId);
  if (!refreshToken.startsWith('mock-refresh.') || !record) {
    throw new AppError('auth');
  }
  return mockDelay(issueTokens(record.id));
}

export async function mockFetchProfile(accessToken: string): Promise<User> {
  const [, userId] = accessToken.split('.');
  const record = mockUsers.find((candidate) => candidate.id === userId);
  if (!record) {
    throw new AppError('auth');
  }
  return mockDelay(toPublicUser(record));
}

/**
 * Por segurança, não revela se o e-mail existe ou não — apenas confirma o
 * envio. Regra de negócio real (envio de e-mail, expiração de token) fica
 * inteiramente a cargo do backend quando ele existir.
 */
export async function mockRequestPasswordReset(_email: string): Promise<void> {
  await mockDelay(undefined, 500);
}

export async function mockAtualizarPerfil(
  userId: string,
  payload: AtualizarPerfilPayload,
): Promise<User> {
  const record = mockUsers.find((candidate) => candidate.id === userId);
  if (!record) {
    throw new AppError('auth');
  }
  record.nome = payload.nome;
  record.telefone = payload.telefone;
  return mockDelay(toPublicUser(record));
}

export async function mockAlterarSenha(
  userId: string,
  payload: AlterarSenhaPayload,
): Promise<void> {
  const record = mockUsers.find((candidate) => candidate.id === userId);
  if (!record || record.senha !== payload.senhaAtual) {
    throw new AppError('validation', 'Senha atual incorreta.');
  }
  record.senha = payload.novaSenha;
  await mockDelay(undefined, 500);
}
