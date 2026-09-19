import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MAX_FOTOS, selecionarFotos } from '@/lib/image-picker';
import { AppError } from '@/services/api/errors';

export type PhotoPickerProps = {
  value: string[];
  onChange: (fotos: string[]) => void;
  errorMessage?: string;
};

const THUMB_SIZE = 84;

export function PhotoPicker({ value, onChange, errorMessage }: PhotoPickerProps) {
  const theme = useTheme();
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const atingiuLimite = value.length >= MAX_FOTOS;

  async function handleAdicionar() {
    setCarregando(true);
    setAviso(null);
    try {
      const novasFotos = await selecionarFotos(value.length);
      if (novasFotos.length > 0) {
        onChange([...value, ...novasFotos]);
      }
    } catch (error) {
      setAviso(error instanceof AppError ? error.message : 'Não foi possível abrir a galeria.');
    } finally {
      setCarregando(false);
    }
  }

  function handleRemover(uri: string) {
    onChange(value.filter((item) => item !== uri));
  }

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Fotos (opcional)</ThemedText>
      <View style={styles.grid}>
        {value.map((uri) => (
          <View key={uri} style={styles.thumbWrapper}>
            <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
            <Pressable
              onPress={() => handleRemover(uri)}
              accessibilityRole="button"
              accessibilityLabel="Remover foto"
              hitSlop={8}
              style={[styles.removeButton, { backgroundColor: theme.danger }]}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                size={12}
                tintColor={theme.onPrimary}
              />
            </Pressable>
          </View>
        ))}

        {!atingiuLimite ? (
          <Pressable
            onPress={handleAdicionar}
            disabled={carregando}
            accessibilityRole="button"
            accessibilityLabel="Adicionar foto"
            style={[
              styles.addButton,
              { borderColor: theme.border, backgroundColor: theme.backgroundElement },
            ]}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={20}
              tintColor={theme.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {value.length}/{MAX_FOTOS} fotos
      </ThemedText>

      {errorMessage ? (
        <ThemedText type="small" themeColor="danger">
          {errorMessage}
        </ThemedText>
      ) : null}
      {aviso ? (
        <ThemedText type="small" themeColor="danger">
          {aviso}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.medium,
  },
  removeButton: {
    position: 'absolute',
    top: -Spacing.one,
    right: -Spacing.one,
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
