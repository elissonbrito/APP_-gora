import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScroll } from '@/components/layout/keyboard-aware-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useRequestPasswordReset } from '@/features/auth/hooks';
import { recuperarSenhaSchema, type RecuperarSenhaFormValues } from '@/schemas/auth';

export default function RecuperarSenhaScreen() {
  const [enviado, setEnviado] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarSenhaFormValues>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: { email: '' },
  });
  const requestPasswordReset = useRequestPasswordReset();

  const onSubmit = handleSubmit(async (values) => {
    await requestPasswordReset.mutateAsync(values.email);
    setEnviado(true);
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Recuperar senha
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              Informe seu e-mail para receber as instruções.
            </ThemedText>
          </ThemedView>

          {enviado ? (
            <ThemedText type="default">
              Se este e-mail estiver cadastrado, você receberá as instruções em instantes.
            </ThemedText>
          ) : (
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

              <Button
                label="Enviar instruções"
                onPress={onSubmit}
                loading={requestPasswordReset.isPending}
              />
            </ThemedView>
          )}

          <Link href="/login" style={styles.footerLink}>
            <ThemedText type="default" themeColor="primary">
              Voltar para o login
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
