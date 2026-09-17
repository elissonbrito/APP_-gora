import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScroll } from '@/components/layout/keyboard-aware-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAtualizarPerfil } from '@/features/auth/hooks';
import { atualizarPerfilSchema, type AtualizarPerfilFormValues } from '@/schemas/auth';
import { AppError } from '@/services/api/errors';
import { useAuthStore } from '@/stores/auth-store';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useTheme } from '@/hooks/use-theme';

export default function PerfilScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const notificacoesAtivadas = usePreferencesStore((state) => state.notificacoesAtivadas);
  const setNotificacoesAtivadas = usePreferencesStore((state) => state.setNotificacoesAtivadas);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<AtualizarPerfilFormValues>({
    resolver: zodResolver(atualizarPerfilSchema),
    defaultValues: { nome: user?.nome ?? '', telefone: user?.telefone ?? '' },
  });
  const atualizarPerfil = useAtualizarPerfil();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await atualizarPerfil.mutateAsync(values);
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'Não foi possível salvar suas informações.';
      setError('root', { message });
    }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Perfil
          </ThemedText>

          <Card>
            <ThemedText type="small" themeColor="textSecondary">
              E-mail
            </ThemedText>
            <ThemedText type="default">{user?.email}</ThemedText>
          </Card>

          <View style={styles.form}>
            <ThemedText type="smallBold">Meus dados</ThemedText>

            <Controller
              control={control}
              name="nome"
              render={({ field }) => (
                <Input
                  label="Nome completo"
                  errorMessage={errors.nome?.message}
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
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  errorMessage={errors.telefone?.message}
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

            {atualizarPerfil.isSuccess && !isDirty ? (
              <ThemedText type="small" themeColor="success">
                Dados salvos com sucesso.
              </ThemedText>
            ) : null}

            <Button
              label="Salvar alterações"
              onPress={onSubmit}
              loading={atualizarPerfil.isPending}
              disabled={!isDirty}
            />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Notificações</ThemedText>
            <Card style={styles.preferenceRow}>
              <ThemedText type="default" style={styles.preferenceLabel}>
                Receber notificações
              </ThemedText>
              <Switch
                value={notificacoesAtivadas}
                onValueChange={setNotificacoesAtivadas}
                trackColor={{ true: theme.primary }}
              />
            </Card>
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Segurança</ThemedText>
            <Link href="/perfil/alterar-senha" asChild>
              <Button label="Alterar senha" variant="secondary" />
            </Link>
          </View>

          <Button label="Sair da conta" variant="ghost" onPress={() => logout()} />
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
  form: {
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceLabel: {
    flexShrink: 1,
  },
});
