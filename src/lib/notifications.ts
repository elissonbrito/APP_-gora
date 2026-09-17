import * as Notifications from 'expo-notifications';

/**
 * Notificações locais funcionam no Expo Go. Push remoto (`expo-notifications`)
 * exige development build no Android desde o SDK 53 e é recomendado também
 * no iOS para produção — por isso aqui só preparamos permissão + navegação ao
 * toque; o envio real de push (registro de token, backend) fica para quando
 * a API do ÁGORA existir e o projeto migrar para development build/EAS.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.status === 'granted') return true;

  const solicitada = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return solicitada.status === 'granted';
}

export type NotificacaoDeepLinkData = {
  demandaId?: string;
};
