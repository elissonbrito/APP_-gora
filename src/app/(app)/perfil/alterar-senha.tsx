import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import { useAlterarSenha } from '@/features/auth/hooks';
import { alterarSenhaSchema, type AlterarSenhaFormValues } from '@/schemas/auth';
import { AppError } from '@/services/api/errors';

export default function AlterarSenhaScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AlterarSenhaFormValues>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: { senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' },
  });
  const alterarSenha = useAlterarSenha();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await alterarSenha.mutateAsync(values);
      router.back();
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'Não foi possível alterar sua senha.';
      setError('root', { message });
    }
  });

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Alterar senha' }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Controller
            control={control}
            name="senhaAtual"
            render={({ field }) => (
              <Input
                label="Senha atual"
                secureTextEntry
                errorMessage={errors.senhaAtual?.message}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="novaSenha"
            render={({ field }) => (
              <Input
                label="Nova senha"
                secureTextEntry
                errorMessage={errors.novaSenha?.message}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmarNovaSenha"
            render={({ field }) => (
              <Input
                label="Confirmar nova senha"
                secureTextEntry
                errorMessage={errors.confirmarNovaSenha?.message}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          {errors.root?.message ? (
            <ThemedText type="small" themeColor="danger">
              {errors.root.message}
            </ThemedText>
          ) : null}

          <Button label="Salvar nova senha" onPress={onSubmit} loading={alterarSenha.isPending} />
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
    gap: Spacing.three,
  },
});
