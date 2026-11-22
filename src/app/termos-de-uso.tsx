import { Stack } from 'expo-router';

import { DocumentoLegalView } from '@/components/legal/documento-legal';
import { termosDeUso } from '@/content/legal';

/** Fora dos grupos protegidos: abre tanto no cadastro quanto logado. */
export default function TermosScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: termosDeUso.titulo }} />
      <DocumentoLegalView documento={termosDeUso} />
    </>
  );
}
