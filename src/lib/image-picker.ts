import * as ImagePicker from 'expo-image-picker';

import { AppError } from '@/services/api/errors';

export const MAX_FOTOS = 5;

/**
 * Retorna URIs locais das fotos escolhidas na galeria do aparelho. Como não
 * existe ainda um serviço de upload (MinIO) acessível a este projeto, essas
 * URIs só existem localmente — não são enviadas a lugar nenhum. Quando o
 * backend existir, aqui é o ponto de troca: subir cada URI e devolver a URL
 * definitiva antes de enviar o payload da demanda.
 */
export async function selecionarFotos(jaSelecionadas: number): Promise<string[]> {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissao.granted) {
    throw new AppError('forbidden', 'Permita o acesso às fotos para anexar imagens.');
  }

  const restante = MAX_FOTOS - jaSelecionadas;
  if (restante <= 0) {
    throw new AppError('validation', `Você pode anexar no máximo ${MAX_FOTOS} fotos.`);
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: restante,
    quality: 0.6,
  });

  if (resultado.canceled) return [];
  return resultado.assets.map((asset) => asset.uri);
}
