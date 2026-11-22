import { Stack } from 'expo-router';

import { DocumentoLegalView } from '@/components/legal/documento-legal';
import { politicaDePrivacidade } from '@/content/legal';

/** Fora dos grupos protegidos: abre tanto no cadastro quanto logado. */
export default function PrivacidadeScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: politicaDePrivacidade.titulo }} />
      <DocumentoLegalView documento={politicaDePrivacidade} />
    </>
  );
}
