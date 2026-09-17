import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScroll } from '@/components/layout/keyboard-aware-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useRegister } from '@/features/auth/hooks';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth';
import { AppError } from '@/services/api/errors';

export default function CadastroScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: '', email: '', telefone: '', senha: '', confirmarSenha: '' },
  });
  const register = useRegister();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await register.mutateAsync(values);
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'Não foi possível concluir seu cadastro.';
      setError('root', { message });
    }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Criar conta
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              Leva menos de um minuto
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <Controller
              control={control}
              name="nome"
              render={({ field }) => (
                <Input
                  label="Nome completo"
                  placeholder="Seu nome"
                  autoComplete="name"
                  errorMessage={errors.nome?.message}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  label="E-mail"
                  placeholder="seuemail@exemplo.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  errorMessage={errors.email?.message}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <Input
                  label="Telefone (opcional)"
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  errorMessage={errors.telefone?.message}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="senha"
              render={({ field }) => (
                <Input
                  label="Senha"
                  placeholder="Crie uma senha"
                  secureTextEntry
                  errorMessage={errors.senha?.message}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmarSenha"
              render={({ field }) => (
                <Input
                  label="Confirmar senha"
                  placeholder="Repita a senha"
                  secureTextEntry
                  errorMessage={errors.confirmarSenha?.message}
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

            <Button label="Criar conta" onPress={onSubmit} loading={register.isPending} />
          </ThemedView>

          <Link href="/login" style={styles.footerLink}>
            <ThemedText type="default">
              Já tem conta?{' '}
              <ThemedText type="default" themeColor="primary">
                Entrar
              </ThemedText>
            </ThemedText>
          </Link>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.five,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    textAlign: 'left',
  },
  form: {
    gap: Spacing.three,
  },
  footerLink: {
    alignSelf: 'center',
  },
});
