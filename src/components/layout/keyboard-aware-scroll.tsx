import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';

/**
 * Evita que o teclado cubra campos/botões em formulários. Sem isso, telas com
 * vários inputs (ex. cadastro) podem esconder o botão de enviar atrás do
 * teclado em aparelhos menores.
 */
export function KeyboardAwareScroll({ children, ...scrollViewProps }: ScrollViewProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" {...scrollViewProps}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
