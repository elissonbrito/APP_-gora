import axios from 'axios';

export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'auth'
  | 'forbidden'
  | 'validation'
  | 'not_found'
  | 'server'
  | 'unknown';

const FRIENDLY_MESSAGES: Record<AppErrorKind, string> = {
  network: 'Sem conexão com a internet. Verifique sua rede e tente novamente.',
  timeout: 'A solicitação demorou mais que o esperado. Tente novamente.',
  auth: 'Sua sessão expirou. Faça login novamente.',
  forbidden: 'Você não tem permissão para realizar esta ação.',
  validation: 'Verifique os dados informados e tente novamente.',
  not_found: 'Não encontramos o que você procura.',
  server: 'Não foi possível concluir sua solicitação. Tente novamente em instantes.',
  unknown: 'Algo deu errado. Tente novamente.',
};

/**
 * Erro de aplicação com uma mensagem já em português, segura para exibir ao
 * cidadão (nunca "AxiosError 500"). Toda a camada de serviços deve lançar
 * AppError em vez de deixar vazar erros técnicos (Axios, fetch, etc.) para a UI.
 */
export class AppError extends Error {
  readonly kind: AppErrorKind;

  constructor(kind: AppErrorKind, message?: string) {
    super(message ?? FRIENDLY_MESSAGES[kind]);
    this.name = 'AppError';
    this.kind = kind;
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new AppError('timeout');
    }
    if (!error.response) {
      return new AppError('network');
    }

    const status = error.response.status;
    if (status === 401) return new AppError('auth');
    if (status === 403) return new AppError('forbidden');
    if (status === 404) return new AppError('not_found');
    if (status === 400 || status === 422) return new AppError('validation');
    if (status >= 500) return new AppError('server');
    return new AppError('unknown');
  }

  return new AppError('unknown');
}
