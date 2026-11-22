import { onlineManager } from '@tanstack/react-query';
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

describe('toAppError com resposta do backend do ÁGORA', () => {
  function comMensagem(status: number, mensagem: unknown): AxiosError {
    const error = new AxiosError('erro de teste');
    error.response = {
      status,
      data: { mensagem },
      statusText: '',
      headers: {},
      config: {} as never,
    };
    return error;
  }

  test('usa a mensagem em português enviada pelo servidor', () => {
    const erro = toAppError(comMensagem(401, 'E-mail ou senha inválidos.'));
    expect(erro.kind).toBe('auth');
    expect(erro.message).toBe('E-mail ou senha inválidos.');
  });

  test('ignora mensagem que não seja texto', () => {
    expect(toAppError(comMensagem(422, { campo: 'x' })).message).toBe(
      'Verifique os dados informados e tente novamente.',
    );
  });

  test('nunca exibe o texto de um erro 500', () => {
    const erro = toAppError(comMensagem(500, 'relation "demandas" does not exist'));
    expect(erro.message).not.toContain('relation');
  });
});

describe('toAppError sem resposta do servidor', () => {
  afterEach(() => onlineManager.setOnline(true));

  test('aparelho offline: "Sem conexão com a internet"', () => {
    onlineManager.setOnline(false);
    expect(toAppError(new AxiosError('Network Error')).message).toMatch(/Sem conexão/);
  });

  test('aparelho online: avisa que o servidor não respondeu, não que falta internet', () => {
    onlineManager.setOnline(true);
    const erro = new AxiosError('Network Error');
    erro.config = { baseURL: 'http://192.168.0.101:3333', headers: {} as never };
    const appError = toAppError(erro);
    expect(appError.kind).toBe('network');
    expect(appError.message).toMatch(/servidor do ÁGORA/);
    expect(appError.message).toContain('http://192.168.0.101:3333');
    expect(appError.message).not.toMatch(/Sem conexão/);
  });
});
