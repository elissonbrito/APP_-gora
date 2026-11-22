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

/** Porta em que o backend (pasta backend/) escuta por padrão. */
const PORTA_DA_API = 3333;

/**
 * Em desenvolvimento, o Expo sabe o endereço do computador que está servindo
 * o app (hostUri, ex.: "192.168.1.100:8081") — é por ele que o celular baixa
 * o código. Como a API roda no mesmo computador, basta trocar a porta. Assim,
 * mudar de rede Wi-Fi não exige editar o .env.local.
 */
export function urlDaApiPeloExpo(hostUri: string | undefined): string | undefined {
  const host = hostUri?.split(':')[0];
  if (!host) return undefined;
  return `http://${host}:${PORTA_DA_API}`;
}

/**
 * apiMode controla se os serviços em `services/*` respondem com o mock
 * (`services/api/mock`) ou chamam o backend (pasta `backend/`) via HTTP.
 * URL da API, em ordem de prioridade: EXPO_PUBLIC_API_URL (.env.local) →
 * app.json (extra) → IP do computador detectado pelo Expo (só em
 * desenvolvimento) → localhost. No celular, localhost é o próprio celular.
 */
export const env = {
  apiMode: modoDoEnv ?? extra.apiMode ?? 'mock',
  apiUrl:
    urlDoEnv ??
    extra.apiUrl ??
    (__DEV__ ? urlDaApiPeloExpo(Constants.expoConfig?.hostUri) : undefined) ??
    `http://localhost:${PORTA_DA_API}`,
} as const;
