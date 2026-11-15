import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FaqItem } from '@/components/cards/faq-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ListItem } from '@/components/ui/list-item';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const PERGUNTAS = [
  {
    pergunta: 'Como registro uma demanda?',
    resposta:
      'Toque em “Nova” na barra de baixo, escolha a categoria, descreva o problema e informe onde ele está — digitando o CEP, usando o GPS ou escrevendo o endereço. Fotos ajudam a equipe a entender a situação.',
  },
  {
    pergunta: 'O que é o protocolo?',
    resposta:
      'É o número único da sua demanda, gerado no envio. Com ele você acompanha o andamento e pode compartilhar a solicitação com vizinhos ou com a prefeitura.',
  },
  {
    pergunta: 'O que significa cada status?',
    resposta:
      'Recebida: chegou ao ÁGORA. Em análise: está sendo avaliada pelo setor responsável. Em andamento: o serviço foi iniciado. Concluída: o atendimento terminou e você já pode avaliá-lo.',
  },
  {
    pergunta: 'Fiquei sem internet no meio do formulário. Perco tudo?',
    resposta:
      'Não. Toque em “Salvar rascunho”: ele fica guardado no próprio celular e aparece em “Meus rascunhos”, na tela Nova, para você terminar depois.',
  },
  {
    pergunta: 'Para que serve escolher minha cidade?',
    resposta:
      'A lista de municípios vem do IBGE. Com a sua cidade definida no Perfil, o ÁGORA sabe de onde você participa.',
  },
  {
    pergunta: 'Meus dados estão seguros?',
    resposta:
      'Sua sessão fica no cofre criptografado do aparelho (Keychain no iPhone, Keystore no Android). Preferências e rascunhos ficam só no seu celular e são usados apenas para o funcionamento do app.',
  },
];

export default function AjudaScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Ajuda' }} />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Perguntas frequentes</ThemedText>
          <View style={styles.lista}>
            {PERGUNTAS.map((item) => (
              <FaqItem key={item.pergunta} pergunta={item.pergunta} resposta={item.resposta} />
            ))}
          </View>

          <ThemedText type="smallBold">Mais informações</ThemedText>
          <ListItem
            title="Sobre o ÁGORA"
            subtitle="Versão, dados públicos e privacidade"
            trailing="›"
            onPress={() => router.push('/ajuda/sobre')}
          />
        </ScrollView>
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
    gap: Spacing.two,
  },
});
