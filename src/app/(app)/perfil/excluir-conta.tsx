import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScroll } from '@/components/layout/keyboard-aware-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useExcluirConta } from '@/features/conta/hooks';
import { AppError } from '@/services/api/errors';

const O_QUE_SERA_APAGADO = [
  'Seus dados de cadastro (nome, e-mail e telefone)',
  'Todas as suas demandas, com histórico e avaliações',
  'Suas notificações',
  'Rascunhos e dados guardados neste aparelho',
];

/** Eliminação dos dados a pedido do titular (LGPD, art. 18, VI). */
export default function ExcluirContaScreen() {
  const excluir = useExcluirConta();
  const [senha, setSenha] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleExcluir() {
    setErro(null);
    if (!senha) {
      setErro('Informe sua senha para confirmar.');
      return;
    }
    // Dois toques: o primeiro só pede a confirmação final.
    if (!confirmando) {
      setConfirmando(true);
      return;
    }
    try {
      // Ao concluir, o logout leva ao login e limpa o aparelho.
      await excluir.mutateAsync(senha);
    } catch (error) {
      setConfirmando(false);
      setErro(error instanceof AppError ? error.message : 'Não foi possível excluir a conta.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Excluir minha conta' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAwareScroll contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Esta ação é definitiva</ThemedText>
          <Card>
            <ThemedText type="smallBold">Serão apagados:</ThemedText>
            <View style={styles.lista}>
              {O_QUE_SERA_APAGADO.map((item) => (
                <ThemedText key={item} type="default" themeColor="textSecondary">
                  • {item}
                </ThemedText>
              ))}
            </View>
          </Card>
          <ThemedText type="small" themeColor="textSecondary">
            Se quiser guardar uma cópia, use antes “Baixar meus dados” no Perfil.
          </ThemedText>

          <Input
            label="Sua senha"
            secureTextEntry
            autoComplete="current-password"
            value={senha}
            onChangeText={(valor) => {
              setSenha(valor);
              setConfirmando(false);
            }}
            errorMessage={erro ?? undefined}
          />

          <Button
            label={confirmando ? 'Toque de novo para excluir de vez' : 'Excluir minha conta'}
            variant="destructive"
            loading={excluir.isPending}
            onPress={handleExcluir}
          />
        </KeyboardAwareScroll>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  lista: {
    gap: Spacing.one,
  },
});
