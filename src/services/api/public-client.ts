import { create } from 'axios';

/**
 * Cria um cliente HTTP para APIs públicas de terceiros (ViaCEP, IBGE...).
 * Diferente do `apiClient`, não recebe os interceptors de sessão: essas APIs
 * não conhecem o ÁGORA e nunca devem receber o token do cidadão.
 */
export function createPublicClient(baseURL: string) {
  return create({
    baseURL,
    timeout: 10000,
    headers: { Accept: 'application/json' },
  });
}
