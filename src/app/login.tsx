import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema, type LoginFormValues } from '@/schemas/auth';
import { AppError } from '@/services/api/errors';

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });
  const login = useLogin();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'Não foi possível entrar. Tente novamente.';
      setError('root', { message });
    }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            ÁGORA
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
            Entre para acompanhar suas solicitações
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
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
            name="senha"
            render={({ field }) => (
              <Input
                label="Senha"
                placeholder="Sua senha"
                secureTextEntry
                autoComplete="password"
                errorMessage={errors.senha?.message}
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

          <Button label="Entrar" onPress={onSubmit} loading={login.isPending} />

          <Link href="/recuperar-senha">
            <ThemedText type="link" themeColor="primary">
              Esqueci minha senha
            </ThemedText>
          </Link>
        </ThemedView>

        <Link href="/cadastro" style={styles.footerLink}>
          <ThemedText type="default">
            Não tem conta?{' '}
            <ThemedText type="default" themeColor="primary">
              Cadastre-se
            </ThemedText>
          </ThemedText>
        </Link>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
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
  subtitle: {},
  form: {
    gap: Spacing.three,
  },
  footerLink: {
    alignSelf: 'center',
  },
});
