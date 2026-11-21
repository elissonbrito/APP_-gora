import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * true enquanto o aparelho tem conexão. Começa como true para não exibir o
 * aviso de offline antes da primeira leitura do NetInfo.
 * Atenção: "conectado" não garante que a API responde — os erros de rede
 * continuam sendo tratados em cada tela.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const parar = NetInfo.addEventListener((estado) => {
      setOnline(estado.isConnected !== false);
    });
    return parar;
  }, []);

  return online;
}
