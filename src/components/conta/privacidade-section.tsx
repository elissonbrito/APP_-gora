import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ListItem } from '@/components/ui/list-item';
import { Spacing } from '@/constants/theme';
import { useExportarMeusDados } from '@/features/conta/hooks';
import { AppError } from '@/services/api/errors';

/**
 * "Privacidade e dados" no Perfil: documentos legais e os direitos do titular
 * (LGPD, art. 18) — baixar os dados e excluir a conta.
 */
export function PrivacidadeSection() {
  const exportar = useExportarMeusDados();
  const [aviso, setAviso] = useState<string | null>(null);

  async function handleBaixarDados() {
    setAviso(null);
    try {
      const dados = await exportar.mutateAsync();
      const json = JSON.stringify(dados, null, 2);
      try {
        await Share.share({ title: 'Meus dados no ÁGORA', message: json });
      } catch {
        // Sem folha de compartilhamento (ex.: alguns navegadores): copia.
        await Clipboard.setStringAsync(json);
        setAviso('Seus dados foram copiados. Cole em um arquivo para guardar.');
      }
    } catch (error) {
      setAviso(
        error instanceof AppError ? error.message : 'Não foi possível gerar o arquivo agora.',
      );
    }
  }

  return (
    <View style={styles.section}>
      <ThemedText type="smallBold">Privacidade e dados</ThemedText>
      <ListItem
        title="Termos de Uso"
        subtitle="Regras de uso do ÁGORA"
        trailing="›"
        onPress={() => router.push('/termos-de-uso')}
      />
      <ListItem
        title="Política de Privacidade"
        subtitle="Como tratamos seus dados (LGPD)"
        trailing="›"
        onPress={() => router.push('/politica-de-privacidade')}
      />
      <ListItem
        title={exportar.isPending ? 'Gerando arquivo…' : 'Baixar meus dados'}
        subtitle="Cadastro, demandas e notificações em JSON"
        trailing="↓"
        onPress={exportar.isPending ? undefined : handleBaixarDados}
      />
      <ListItem
        title="Excluir minha conta"
        subtitle="Apaga seus dados de forma definitiva"
        trailing="›"
        onPress={() => router.push('/perfil/excluir-conta')}
      />
      {aviso ? (
        <ThemedText type="small" themeColor="textSecondary">
          {aviso}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
});
