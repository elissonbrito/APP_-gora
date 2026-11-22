import { onlineManager } from '@tanstack/react-query';
import { isAxiosError, type AxiosError } from 'axios';

export type AppErrorKind =
  'network' | 'timeout' | 'auth' | 'forbidden' | 'validation' | 'not_found' | 'server' | 'unknown';

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

/**
 * O aparelho tem internet, mas o servidor não respondeu (API desligada,
 * endereço errado, outra rede Wi-Fi, firewall). Não é "sem internet": dizer
 * isso faria o cidadão procurar o problema no lugar errado.
 */
function servidorInacessivel(error: AxiosError): AppError {
  let mensagem = 'Não foi possível falar com o servidor do ÁGORA. Tente novamente em instantes.';
  // Em desenvolvimento, mostra o endereço tentado para facilitar o diagnóstico.
  if (__DEV__ && error.config?.baseURL) {
    mensagem += ` (API: ${error.config.baseURL} — confira se o backend está rodando e se o celular está na mesma rede Wi-Fi.)`;
  }
  return new AppError('network', mensagem);
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new AppError('timeout');
    }
    if (!error.response) {
      return onlineManager.isOnline() ? servidorInacessivel(error) : new AppError('network');
    }

    const status = error.response.status;
    // O backend do ÁGORA responde { mensagem } já em português e pronta para o
    // cidadão (ex.: "E-mail ou senha inválidos."); sem ela, usa a mensagem padrão.
    const corpo = error.response.data as { mensagem?: unknown } | undefined;
    const mensagem = typeof corpo?.mensagem === 'string' ? corpo.mensagem : undefined;

    if (status === 401) return new AppError('auth', mensagem);
    if (status === 403) return new AppError('forbidden', mensagem);
    if (status === 404) return new AppError('not_found', mensagem);
    if (status === 400 || status === 422) return new AppError('validation', mensagem);
    // Erro 5xx nunca mostra o texto do servidor: pode conter detalhe técnico.
    if (status >= 500) return new AppError('server');
    return new AppError('unknown', mensagem);
  }

  return new AppError('unknown');
}
