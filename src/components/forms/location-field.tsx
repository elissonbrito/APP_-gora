import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import { obterLocalizacaoAtual } from '@/lib/location';
import { AppError } from '@/services/api/errors';
import type { DemandaLocalizacao } from '@/types/demanda';

export type LocationFieldProps = {
  value: DemandaLocalizacao;
  onChange: (value: DemandaLocalizacao) => void;
  errorMessage?: string;
};

export function LocationField({ value, onChange, errorMessage }: LocationFieldProps) {
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function handleUsarLocalizacaoAtual() {
    setLoading(true);
    setAviso(null);
    try {
      const atual = await obterLocalizacaoAtual();
      onChange({ endereco: atual.endereco, latitude: atual.latitude, longitude: atual.longitude });
    } catch (error) {
      setAviso(
        error instanceof AppError ? error.message : 'Não foi possível obter sua localização.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Input
        label="Endereço da ocorrência"
        placeholder="Rua, número, bairro"
        errorMessage={errorMessage}
        value={value.endereco}
        onChangeText={(endereco) => onChange({ ...value, endereco })}
      />

      <Button
        label={loading ? 'Obtendo localização...' : 'Usar minha localização atual'}
        variant="secondary"
        loading={loading}
        onPress={handleUsarLocalizacaoAtual}
      />

      {value.latitude != null && value.longitude != null ? (
        <ThemedText type="small" themeColor="textSecondary">
          Coordenadas capturadas: {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
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
});
