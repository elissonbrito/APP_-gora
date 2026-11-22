import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AceiteTermosProps = {
  value: boolean;
  onChange: (aceitou: boolean) => void;
  errorMessage?: string;
};

/**
 * Caixa de seleção do aceite dos Termos de Uso e da Política de Privacidade
 * (LGPD: consentimento livre, informado e inequívoco — nunca vem marcada).
 */
export function AceiteTermos({ value, onChange, errorMessage }: AceiteTermosProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <Pressable
          onPress={() => onChange(!value)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: value }}
          accessibilityLabel="Li e aceito os Termos de Uso e a Política de Privacidade"
          hitSlop={8}
          style={[
            styles.caixa,
            {
              borderColor: errorMessage ? theme.danger : value ? theme.primary : theme.border,
              backgroundColor: value ? theme.primary : theme.backgroundElement,
            },
          ]}>
          {value ? (
            <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
              ✓
            </ThemedText>
          ) : null}
        </Pressable>
        <ThemedText type="small" style={styles.texto}>
          Li e aceito os{' '}
          <Link href="/termos-de-uso">
            <ThemedText type="smallBold" themeColor="primary">
              Termos de Uso
            </ThemedText>
          </Link>{' '}
          e a{' '}
          <Link href="/politica-de-privacidade">
            <ThemedText type="smallBold" themeColor="primary">
              Política de Privacidade
            </ThemedText>
          </Link>
          .
        </ThemedText>
      </View>
      {errorMessage ? (
        <ThemedText type="small" themeColor="danger">
          {errorMessage}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  caixa: {
    width: 24,
    height: 24,
    borderRadius: Radius.small - 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.half,
  },
  texto: {
    flex: 1,
  },
});
