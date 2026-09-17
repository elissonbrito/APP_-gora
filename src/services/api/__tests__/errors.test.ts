import { AxiosError } from 'axios';

import { AppError, toAppError } from '@/services/api/errors';

function criarAxiosError(status?: number, code?: string): AxiosError {
  const error = new AxiosError('erro de teste', code);
  if (status) {
    error.response = {
      status,
      data: {},
      statusText: '',
      headers: {},
      config: {} as never,
    };
  }
  return error;
}

describe('toAppError', () => {
  test('mantém um AppError já existente', () => {
    const original = new AppError('validation', 'mensagem customizada');
    expect(toAppError(original)).toBe(original);
  });

  test('mapeia erro sem resposta para "network"', () => {
    const erro = toAppError(criarAxiosError());
    expect(erro.kind).toBe('network');
  });

  test('mapeia ECONNABORTED para "timeout"', () => {
    const erro = toAppError(criarAxiosError(undefined, 'ECONNABORTED'));
    expect(erro.kind).toBe('timeout');
  });

  test('mapeia status 401 para "auth"', () => {
    expect(toAppError(criarAxiosError(401)).kind).toBe('auth');
  });

  test('mapeia status 403 para "forbidden"', () => {
    expect(toAppError(criarAxiosError(403)).kind).toBe('forbidden');
  });

  test('mapeia status 404 para "not_found"', () => {
    expect(toAppError(criarAxiosError(404)).kind).toBe('not_found');
  });

  test('mapeia status 422 para "validation"', () => {
    expect(toAppError(criarAxiosError(422)).kind).toBe('validation');
  });

  test('mapeia status 500 para "server"', () => {
    expect(toAppError(criarAxiosError(500)).kind).toBe('server');
  });

  test('nunca expõe mensagem técnica — usa mensagens amigáveis por padrão', () => {
    const erro = toAppError(criarAxiosError(500));
    expect(erro.message).not.toMatch(/AxiosError|ECONNABORTED|status code/i);
  });

  test('erro desconhecido cai em "unknown"', () => {
    expect(toAppError(new Error('algo aleatório')).kind).toBe('unknown');
  });
});
