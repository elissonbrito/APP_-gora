import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoriaSelect } from '@/components/forms/categoria-select';
import { LocationField } from '@/components/forms/location-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import { useCriarDemanda } from '@/features/demandas/hooks';
import { novaDemandaSchema, type NovaDemandaFormValues } from '@/schemas/demanda';
import { AppError } from '@/services/api/errors';

export default function NovaDemandaScreen() {
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NovaDemandaFormValues>({
    resolver: zodResolver(novaDemandaSchema),
    defaultValues: {
      categoria: undefined,
      assunto: '',
      descricao: '',
      localizacao: { endereco: '' },
    },
  });
  const criarDemanda = useCriarDemanda();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const demanda = await criarDemanda.mutateAsync(values);
      setProtocolo(demanda.protocolo);
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'Não foi possível enviar sua solicitação.';
      setError('root', { message });
    }
  });

  if (protocolo) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Nova demanda' }} />
        <SafeAreaView style={styles.confirmationSafeArea}>
          <ThemedText type="subtitle">Solicitação registrada</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Você pode acompanhar o andamento pelo protocolo:
          </ThemedText>
          <ThemedText type="title" style={styles.protocolo}>
            {protocolo}
          </ThemedText>
          <Button label="Voltar para a Home" onPress={() => router.replace('/')} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Nova demanda' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ThemedText type="default" themeColor="textSecondary">
            Conte o que está acontecendo e onde.
          </ThemedText>

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
                value={field.value}
                onChange={field.onChange}
                errorMessage={errors.localizacao?.endereco?.message}
              />
            )}
          />

          {errors.root?.message ? (
            <ThemedText type="small" themeColor="danger">
              {errors.root.message}
            </ThemedText>
          ) : null}

          <Button label="Enviar solicitação" onPress={onSubmit} loading={criarDemanda.isPending} />
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
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
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
  protocolo: {
    marginVertical: Spacing.three,
  },
});
