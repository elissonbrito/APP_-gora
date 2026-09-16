import * as Location from 'expo-location';

import { AppError } from '@/services/api/errors';

export type CoordenadaAtual = {
  latitude: number;
  longitude: number;
  endereco: string;
};

function formatarEndereco(resultado: Location.LocationGeocodedAddress | undefined): string {
  if (!resultado) return '';
  return [resultado.street, resultado.streetNumber, resultado.district, resultado.city]
    .filter(Boolean)
    .join(', ');
}

/**
 * Pede permissão de localização em primeiro plano (não precisa de development
 * build — funciona no Expo Go) e retorna coordenadas + um endereço aproximado
 * via geocodificação reversa, para pré-preencher o formulário de nova demanda.
 */
export async function obterLocalizacaoAtual(): Promise<CoordenadaAtual> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new AppError(
      'forbidden',
      'Permita o acesso à localização para usar sua posição atual.',
    );
  }

  const posicao = await Location.getCurrentPositionAsync({});
  const [resultado] = await Location.reverseGeocodeAsync({
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
  });

  return {
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
    endereco: formatarEndereco(resultado),
  };
}
