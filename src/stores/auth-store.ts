import { create } from 'zustand';

import { secureStorage } from '@/lib/secure-storage';
import * as authService from '@/services/auth';
import { registerSessionHandlers } from '@/services/api/session';
import type { AuthTokens, LoginCredentials, RegisterPayload, User } from '@/types/auth';

const SESSION_STORAGE_KEY = 'agora.session';

type StoredSession = {
  tokens: AuthTokens;
};

export type AuthStatus = 'checking' | 'signed-out' | 'signed-in';

type AuthState = {
  status: AuthStatus;
  user: User | null;
  tokens: AuthTokens | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  user: null,
  tokens: null,

  async login(credentials) {
    const { user, tokens } = await authService.login(credentials);
    await secureStorage.setItem<StoredSession>(SESSION_STORAGE_KEY, { tokens });
    set({ user, tokens, status: 'signed-in' });
  },

  async register(payload) {
    const { user, tokens } = await authService.register(payload);
    await secureStorage.setItem<StoredSession>(SESSION_STORAGE_KEY, { tokens });
    set({ user, tokens, status: 'signed-in' });
  },

  async logout() {
    try {
      await secureStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Segue mesmo se o Secure Store falhar — o estado em memória precisa
      // ser limpo de qualquer forma, senão o usuário fica com a sessão
      // "presa" mesmo tocando em Sair.
    }
    set({ user: null, tokens: null, status: 'signed-out' });
  },

  async restoreSession() {
    const stored = await secureStorage.getItem<StoredSession>(SESSION_STORAGE_KEY);
    if (!stored) {
      set({ status: 'signed-out' });
      return;
    }
    try {
      const user = await authService.fetchProfile(stored.tokens.accessToken);
      set({ user, tokens: stored.tokens, status: 'signed-in' });
    } catch {
      await secureStorage.removeItem(SESSION_STORAGE_KEY);
      set({ user: null, tokens: null, status: 'signed-out' });
    }
  },

  setUser(user) {
    set({ user });
  },
}));

// Ponte entre a camada de API (que não conhece Zustand) e a store de sessão.
registerSessionHandlers({
  getAccessToken: () => useAuthStore.getState().tokens?.accessToken ?? null,
  onSessionExpired: () => {
    useAuthStore.getState().logout();
  },
});
