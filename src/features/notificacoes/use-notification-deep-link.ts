import { useEffect } from 'react';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

import type { NotificacaoDeepLinkData } from '@/lib/notifications';

/**
 * Ao tocar em uma notificação, abre diretamente a demanda relacionada — item
 * 15 da especificação ("ao tocar, abrir diretamente o protocolo").
 */
export function useNotificationDeepLink() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificacaoDeepLinkData;
      if (data.demandaId) {
        router.push({ pathname: '/demandas/[id]', params: { id: data.demandaId } });
      }
    });

    return () => subscription.remove();
  }, []);
}
