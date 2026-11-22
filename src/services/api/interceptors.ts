import type { AxiosInstance } from 'axios';

import { toAppError } from './errors';
import { getAccessToken, notifySessionExpired } from './session';

export function attachInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const appError = toAppError(error);
      // Só encerra a sessão se havia uma: um 401 no login (senha errada) não
      // é "sessão expirada".
      if (appError.kind === 'auth' && getAccessToken()) {
        notifySessionExpired();
      }
      return Promise.reject(appError);
    },
  );
}
