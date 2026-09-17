import {
  mockAlterarSenha,
  mockAtualizarPerfil,
  mockFetchProfile,
  mockLogin,
  mockRefreshSession,
  mockRegister,
} from '@/services/api/mock/auth.mock';
import { AppError } from '@/services/api/errors';

describe('mockLogin', () => {
  test('autentica um usuário seed com credenciais corretas', async () => {
    const { user, tokens } = await mockLogin({ email: 'cidadao@agora.dev', senha: '123456' });
    expect(user.role).toBe('cidadao');
    expect(user).not.toHaveProperty('senha');
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
  });

  test('rejeita senha incorreta com AppError "auth"', async () => {
    await expect(
      mockLogin({ email: 'cidadao@agora.dev', senha: 'senha-errada' }),
    ).rejects.toMatchObject({ kind: 'auth' });
  });

  test('rejeita e-mail não cadastrado com AppError "auth"', async () => {
    await expect(
      mockLogin({ email: 'ninguem@agora.dev', senha: '123456' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe('mockRegister', () => {
  test('cria um novo cidadão com sucesso', async () => {
    const { user } = await mockRegister({
      nome: 'Novo Usuário Teste',
      email: `teste-${Date.now()}@agora.dev`,
      senha: '123456',
    });
    expect(user.role).toBe('cidadao');
    expect(user.permissions).toContain('demandas:criar');
  });

  test('rejeita e-mail já cadastrado', async () => {
    await expect(
      mockRegister({ nome: 'Duplicado', email: 'cidadao@agora.dev', senha: '123456' }),
    ).rejects.toMatchObject({ kind: 'validation' });
  });
});

describe('mockFetchProfile / mockRefreshSession', () => {
  test('retorna o perfil correspondente ao token de acesso', async () => {
    const { tokens } = await mockLogin({ email: 'gestor@agora.dev', senha: '123456' });
    const perfil = await mockFetchProfile(tokens.accessToken);
    expect(perfil.role).toBe('gestor');
  });

  test('renova a sessão a partir de um refresh token válido', async () => {
    const { tokens } = await mockLogin({ email: 'colaborador@agora.dev', senha: '123456' });
    const novosTokens = await mockRefreshSession(tokens.refreshToken);
    expect(novosTokens.accessToken).toBeTruthy();
  });

  test('rejeita refresh token inválido', async () => {
    await expect(mockRefreshSession('token-invalido')).rejects.toMatchObject({ kind: 'auth' });
  });
});

describe('mockAtualizarPerfil / mockAlterarSenha', () => {
  test('atualiza nome e telefone do usuário', async () => {
    const { user } = await mockLogin({ email: 'cidadao@agora.dev', senha: '123456' });
    const atualizado = await mockAtualizarPerfil(user.id, {
      nome: 'Maria Atualizada',
      telefone: '(22) 98888-0000',
    });
    expect(atualizado.nome).toBe('Maria Atualizada');
    expect(atualizado.telefone).toBe('(22) 98888-0000');
  });

  test('rejeita alteração de senha com senha atual incorreta', async () => {
    const { user } = await mockLogin({ email: 'cidadao@agora.dev', senha: '123456' });
    await expect(
      mockAlterarSenha(user.id, { senhaAtual: 'errada', novaSenha: 'novaSenha123' }),
    ).rejects.toMatchObject({ kind: 'validation' });
  });
});
