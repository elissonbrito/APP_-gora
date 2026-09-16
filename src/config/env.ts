import Constants from 'expo-constants';

export type ApiMode = 'mock' | 'http';

type AppConfigExtra = {
  apiUrl?: string;
  apiMode?: ApiMode;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppConfigExtra;

/**
 * apiMode controla se os serviços em `services/*` respondem com dados mockados
 * (`services/api/mock`) ou fazem chamadas HTTP reais via `services/api/client`.
 * Hoje não existe uma API do ÁGORA acessível para este projeto, então o padrão
 * é 'mock'. Quando o backend real estiver disponível, defina `extra.apiMode`
 * como 'http' e `extra.apiUrl` em app.json/app.config, sem alterar os serviços.
 */
export const env = {
  apiMode: extra.apiMode ?? 'mock',
  apiUrl: extra.apiUrl ?? 'http://localhost:3000',
} as const;
