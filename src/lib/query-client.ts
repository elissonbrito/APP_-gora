import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      // Tenta sempre uma vez, mesmo offline: o mock e o cache local (comCache)
      // funcionam sem rede, e sem cache a tela mostra o erro com "Tentar
      // novamente" em vez de ficar carregando para sempre.
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

// No celular, informa ao React Query quando o aparelho fica offline/online:
// as novas tentativas esperam a rede e as consultas são refeitas quando a
// conexão volta. Na web o React Query já usa os eventos online/offline.
if (Platform.OS !== 'web') {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((estado) => {
      setOnline(estado.isConnected !== false);
    }),
  );
}
