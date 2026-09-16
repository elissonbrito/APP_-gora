import { Stack } from 'expo-router';

/**
 * Stack que hospeda as tabs do cidadão e, futuramente, as telas empilhadas
 * sobre elas (nova demanda, detalhe da demanda, detalhe do protocolo).
 */
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
