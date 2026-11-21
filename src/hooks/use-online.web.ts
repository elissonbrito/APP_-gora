import { useSyncExternalStore } from 'react';

/**
 * Versão web do useOnline. No navegador o NetInfo escuta só
 * navigator.connection ('change'), que não dispara quando a rede cai; os
 * eventos confiáveis são 'online'/'offline' da janela.
 */
function assinar(avisar: () => void) {
  window.addEventListener('online', avisar);
  window.addEventListener('offline', avisar);
  return () => {
    window.removeEventListener('online', avisar);
    window.removeEventListener('offline', avisar);
  };
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    assinar,
    () => navigator.onLine,
    () => true,
  );
}
