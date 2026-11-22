import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, type DefaultValues } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoriaSelect } from '@/components/forms/categoria-select';
import { LocationField } from '@/components/forms/location-field';
import { PhotoPicker } from '@/components/forms/photo-picker';
import { KeyboardAwareScroll } from '@/components/layout/keyboard-aware-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListItem } from '@/components/ui/list-item';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCriarDemanda } from '@/features/demandas/hooks';
import { useRascunhoEmEdicao } from '@/features/rascunhos/em-edicao-store';
import {
  useExcluirRascunho,
  useRascunho,
  useRascunhos,
  useSalvarRascunho,
} from '@/features/rascunhos/hooks';
import { novaDemandaSchema, type NovaDemandaFormValues } from '@/schemas/demanda';
import { AppError } from '@/services/api/errors';

const VALORES_INICIAIS: DefaultValues<NovaDemandaFormValues> = {
  categoria: undefined,
  assunto: '',
  descricao: '',
  localizacao: { endereco: '' },
  fotos: [],
};

export default function NovaDemandaScreen() {
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<NovaDemandaFormValues>({
    resolver: zodResolver(novaDemandaSchema),
    defaultValues: VALORES_INICIAIS,
  });
  const criarDemanda = useCriarDemanda();

  // Rascunho escolhido em Rascunhos → "Continuar editando".
  const idAberto = useRascunhoEmEdicao((state) => state.id) ?? undefined;
  const abertura = useRascunhoEmEdicao((state) => state.abertura);
  const limparRascunhoEmEdicao = useRascunhoEmEdicao((state) => state.limpar);
  const { data: rascunhoAberto } = useRascunho(idAberto);
  const { data: rascunhos } = useRascunhos();
  const salvarRascunho = useSalvarRascunho();
  const excluirRascunho = useExcluirRascunho();
  // Id gravado ao tocar em "Salvar rascunho"; vale só para o rascunho de origem.
  const [salvo, setSalvo] = useState<{ origem?: number; id: number } | null>(null);
  const idRascunho = salvo && salvo.origem === idAberto ? salvo.id : idAberto;
  const [avisoRascunho, setAvisoRascunho] = useState<string | null>(null);

  // Preenche o formulário uma única vez a cada "Continuar editando".
  const aberturaCarregada = useRef(0);
  useEffect(() => {
    if (
      rascunhoAberto &&
      rascunhoAberto.id === idAberto &&
      aberturaCarregada.current !== abertura
    ) {
      aberturaCarregada.current = abertura;
      const { dados } = rascunhoAberto;
      reset({
        ...VALORES_INICIAIS,
        ...dados,
        localizacao: { ...VALORES_INICIAIS.localizacao, ...dados.localizacao },
      });
    }
  }, [rascunhoAberto, idAberto, abertura, reset]);

  async function handleSalvarRascunho() {
    setAvisoRascunho(null);
    try {
      const id = await salvarRascunho.mutateAsync({ dados: getValues(), id: idRascunho });
      setSalvo({ origem: idAberto, id });
      setAvisoRascunho('Rascunho salvo neste aparelho.');
    } catch {
      setAvisoRascunho('Não foi possível salvar o rascunho.');
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const demanda = await criarDemanda.mutateAsync(values);
      if (idRascunho != null) {
        // Enviado: o rascunho não é mais necessário.
        excluirRascunho.mutate(idRascunho);
        limparRascunhoEmEdicao();
      }
      setProtocolo(demanda.protocolo);
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'Não foi possível enviar sua solicitação.';
      setError('root', { message });
    }
  });

  function handleNovaSolicitacao() {
    setProtocolo(null);
    setSalvo(null);
    setAvisoRascunho(null);
    limparRascunhoEmEdicao();
    reset(VALORES_INICIAIS);
  }

  if (protocolo) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.confirmationSafeArea}>
          <ThemedText type="subtitle">Solicitação registrada</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Você pode acompanhar o andamento pelo protocolo:
          </ThemedText>
          <ThemedText type="title" style={styles.protocolo} numberOfLines={1} selectable>
            {protocolo}
          </ThemedText>
          <Button
            label="Registrar outra solicitação"
            variant="secondary"
            onPress={handleNovaSolicitacao}
          />
          <Button label="Ir para a Home" onPress={() => router.replace('/')} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Nova demanda
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Conte o que está acontecendo e onde.
          </ThemedText>

          {rascunhos?.length ? (
            <ListItem
              title="Meus rascunhos"
              subtitle={
                idRascunho != null ? 'Você está editando um rascunho' : 'Continue de onde parou'
              }
              trailing={String(rascunhos.length)}
              onPress={() => router.push('/rascunhos')}
            />
          ) : null}

          <Controller
            control={control}
            name="categoria"
            render={({ field }) => (
              <CategoriaSelect
                value={field.value}
                onChange={field.onChange}
                errorMessage={errors.categoria?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="assunto"
            render={({ field }) => (
              <Input
                label="Assunto"
                placeholder="Resuma em poucas palavras"
                errorMessage={errors.assunto?.message}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="descricao"
            render={({ field }) => (
              <Input
                label="Descrição"
                placeholder="Descreva com detalhes o que está acontecendo"
                multiline
                numberOfLines={5}
                style={styles.textarea}
                errorMessage={errors.descricao?.message}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="localizacao"
            render={({ field }) => (
              <LocationField
                key={`${idAberto ?? 'novo'}-${abertura}`}
                value={field.value}
                onChange={field.onChange}
                errorMessage={errors.localizacao?.endereco?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="fotos"
            render={({ field }) => (
              <PhotoPicker
                value={field.value}
                onChange={field.onChange}
                errorMessage={errors.fotos?.message}
              />
            )}
          />

          {errors.root?.message ? (
            <ThemedText type="small" themeColor="danger">
              {errors.root.message}
            </ThemedText>
          ) : null}

          <View style={styles.actions}>
            <Button
              label="Enviar solicitação"
              onPress={() => onSubmit()}
              loading={criarDemanda.isPending}
            />
            <Button
              label="Salvar rascunho"
              variant="secondary"
              onPress={handleSalvarRascunho}
              loading={salvarRascunho.isPending}
            />
            {avisoRascunho ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.aviso}>
                {avisoRascunho}
              </ThemedText>
            ) : null}
          </View>
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
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.four,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'left',
  },
  textarea: {
    minHeight: 120,
    paddingTop: Spacing.two,
    textAlignVertical: 'top',
  },
  confirmationSafeArea: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.two,
    justifyContent: 'center',
  },
  actions: {
    gap: Spacing.two,
  },
  aviso: {
    textAlign: 'center',
  },
  // Protocolo numa linha só: é o número que o cidadão anota e compartilha.
  protocolo: {
    marginVertical: Spacing.three,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
});
