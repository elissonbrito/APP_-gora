import axios from 'axios';

import { env } from '@/config/env';

import { attachInterceptors } from './interceptors';

/**
 * Instância única do Axios para chamadas HTTP reais (env.apiMode === 'http').
 * Nenhuma tela ou hook deve importar Axios diretamente — sempre passar por
 * services/<dominio> ou pelos hooks de use-case.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
});

attachInterceptors(apiClient);
