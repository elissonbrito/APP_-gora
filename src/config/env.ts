import Constants from 'expo-constants';

export type ApiMode = 'mock' | 'http';

type AppConfigExtra = {
  apiUrl?: string;
  apiMode?: ApiMode;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppConfigExtra;

// Só variáveis com prefixo EXPO_PUBLIC_ chegam ao app, e precisam ser lidas
// assim, por extenso, para o Expo embuti-las no código (Aula 9).
const modoDoEnv = process.env.EXPO_PUBLIC_API_MODE as ApiMode | undefined;
const urlDoEnv = process.env.EXPO_PUBLIC_API_URL;

/**
 * apiMode controla se os serviços em `services/*` respondem com o mock
 * (`services/api/mock`) ou chamam o backend (pasta `backend/`) via HTTP.
 * Ordem de prioridade: arquivo .env.local → app.json (extra) → mock.
 * No celular, a URL precisa ser o IP do computador na rede, não localhost.
 */
export const env = {
  apiMode: modoDoEnv ?? extra.apiMode ?? 'mock',
  apiUrl: urlDoEnv ?? extra.apiUrl ?? 'http://localhost:3333',
} as const;
