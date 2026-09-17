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

/**
 * Nunca deixa a falha de permissão virar uma promise rejeitada sem tratamento
 * — é chamada de forma "fire-and-forget" no boot do app, e não ter push é uma
 * degradação aceitável, não um motivo para travar a navegação.
 */
export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  try {
    const atual = await Notifications.getPermissionsAsync();
    if (atual.status === 'granted') return true;

    const solicitada = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return solicitada.status === 'granted';
  } catch {
    return false;
  }
}

export type NotificacaoDeepLinkData = {
  demandaId?: string;
};
