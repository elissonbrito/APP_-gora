/**
 * Ponto de desacoplamento entre a camada de API (que não deve conhecer o
 * Zustand) e o estado de sessão (stores/auth-store.ts). A store se registra
 * aqui em sua inicialização; o client/interceptors só enxergam esta interface.
 */
type SessionHandlers = {
  getAccessToken: () => string | null;
  onSessionExpired: () => void;
};

let handlers: SessionHandlers = {
  getAccessToken: () => null,
  onSessionExpired: () => {},
};

export function registerSessionHandlers(next: SessionHandlers): void {
  handlers = next;
}

export function getAccessToken(): string | null {
  return handlers.getAccessToken();
}

export function notifySessionExpired(): void {
  handlers.onSessionExpired();
}
