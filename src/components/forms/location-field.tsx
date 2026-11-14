import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import { useEnderecoPorCep } from '@/features/enderecos/hooks';
import { useTheme } from '@/hooks/use-theme';
import { obterLocalizacaoAtual } from '@/lib/location';
import { AppError } from '@/services/api/errors';
import { formatarCep, normalizarCep } from '@/services/enderecos';
import type { Endereco } from '@/types/endereco';
import type { DemandaLocalizacao } from '@/types/demanda';

export type LocationFieldProps = {
  value: DemandaLocalizacao;
  onChange: (value: DemandaLocalizacao) => void;
  errorMessage?: string;
};

/** "Praça da Sé, Sé, São Paulo - SP" — o cidadão completa com o número. */
function montarEndereco(endereco: Endereco): string {
  const partes = [endereco.logradouro, endereco.bairro].filter(Boolean);
  const cidade = endereco.uf ? `${endereco.cidade} - ${endereco.uf}` : endereco.cidade;
  return [...partes, cidade].filter(Boolean).join(', ');
}

export function LocationField({ value, onChange, errorMessage }: LocationFieldProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cep, setCep] = useState(value.cep ?? '');

  const consultaCep = useEnderecoPorCep(cep);
  const enderecoDoCep = consultaCep.data;

  // Preenche o endereço uma única vez por CEP encontrado. Se o cidadão editar o
  // texto depois (para incluir o número), a edição dele é mantida.
  useEffect(() => {
    if (enderecoDoCep && value.cep !== enderecoDoCep.cep) {
      onChange({ endereco: montarEndereco(enderecoDoCep), cep: enderecoDoCep.cep });
    }
  }, [enderecoDoCep, value.cep, onChange]);

  async function handleUsarLocalizacaoAtual() {
    setLoading(true);
    setAviso(null);
    try {
      const atual = await obterLocalizacaoAtual();
      setCep('');
      onChange({ endereco: atual.endereco, latitude: atual.latitude, longitude: atual.longitude });
    } catch (error) {
      setAviso(
        error instanceof AppError ? error.message : 'Não foi possível obter sua localização.',
      );
    } finally {
      setLoading(false);
    }
  }

  const cepCompleto = normalizarCep(cep).length === 8;

  return (
    <View style={styles.container}>
      <View style={styles.cepRow}>
        <View style={styles.cepInput}>
          <Input
            label="CEP (opcional)"
            placeholder="00000-000"
            keyboardType="number-pad"
            maxLength={9}
            value={formatarCep(cep)}
            onChangeText={setCep}
            errorMessage={
              cepCompleto && consultaCep.error instanceof AppError
                ? consultaCep.error.message
                : undefined
            }
            helperText="Preenche o endereço automaticamente"
          />
        </View>
        {consultaCep.isFetching ? (
          <ActivityIndicator
            color={theme.primary}
            style={styles.cepLoading}
            accessibilityLabel="Buscando endereço pelo CEP"
          />
        ) : null}
      </View>

      <Input
        label="Endereço da ocorrência"
        placeholder="Rua, número, bairro"
        errorMessage={errorMessage}
        value={value.endereco}
        onChangeText={(endereco) => onChange({ ...value, endereco })}
        helperText={value.cep ? 'Confira o endereço e inclua o número.' : undefined}
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
  cepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cepInput: {
    flex: 1,
  },
  cepLoading: {
    marginTop: Spacing.three,
  },
});
