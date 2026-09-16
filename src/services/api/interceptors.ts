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
      if (appError.kind === 'auth') {
        notifySessionExpired();
      }
      return Promise.reject(appError);
    },
  );
}
