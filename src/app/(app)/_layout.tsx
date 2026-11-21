import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OfflineBanner } from '@/components/feedback/offline-banner';

/**
 * Stack das telas de quem está logado: as abas e as telas empilhadas sobre
 * elas (detalhes, rascunhos, localidades, ajuda). O aviso de offline fica por
 * cima de todas.
 */
export default function AppLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <OfflineBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
