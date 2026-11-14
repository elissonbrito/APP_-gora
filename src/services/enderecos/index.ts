import { AppError, toAppError } from '@/services/api/errors';
import { createPublicClient } from '@/services/api/public-client';
import type { Endereco } from '@/types/endereco';

/** API pública ViaCEP — https://viacep.com.br */
export const viaCepClient = createPublicClient('https://viacep.com.br/ws');

/** Formato bruto devolvido pelo ViaCEP. CEP inexistente responde 200 com `erro`. */
type ViaCepResposta = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
};

/** Mantém só os dígitos: "25.600-000" → "25600000". */
export function normalizarCep(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, 8);
}

/** Máscara de exibição: "25600000" → "25600-000". */
export function formatarCep(valor: string): string {
  const digitos = normalizarCep(valor);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

export async function buscarEnderecoPorCep(cep: string): Promise<Endereco> {
  const digitos = normalizarCep(cep);
  if (digitos.length !== 8) {
    throw new AppError('validation', 'O CEP deve ter 8 dígitos.');
  }

  let data: ViaCepResposta;
  try {
    ({ data } = await viaCepClient.get<ViaCepResposta>(`/${digitos}/json/`));
  } catch (error) {
    throw toAppError(error);
  }

  if (data.erro) {
    throw new AppError('not_found', 'CEP não encontrado. Confira os números digitados.');
  }

  return {
    cep: formatarCep(data.cep ?? digitos),
    logradouro: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    uf: data.uf ?? '',
  };
}
