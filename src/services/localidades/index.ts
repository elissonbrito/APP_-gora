import { toAppError } from '@/services/api/errors';
import { createPublicClient } from '@/services/api/public-client';
import type { Estado, Municipio } from '@/types/localidade';

/** API pública de Localidades do IBGE — https://servicodados.ibge.gov.br/api/docs/localidades */
export const ibgeClient = createPublicClient('https://servicodados.ibge.gov.br/api/v1/localidades');

type IbgeEstado = { id: number; sigla: string; nome: string; regiao: { nome: string } };
type IbgeMunicipio = { id: number; nome: string };

export async function listarEstados(): Promise<Estado[]> {
  try {
    const { data } = await ibgeClient.get<IbgeEstado[]>('/estados', {
      params: { orderBy: 'nome' },
    });
    return data.map((e) => ({ id: e.id, sigla: e.sigla, nome: e.nome, regiao: e.regiao.nome }));
  } catch (error) {
    throw toAppError(error);
  }
}

export async function listarMunicipios(uf: string): Promise<Municipio[]> {
  try {
    const { data } = await ibgeClient.get<IbgeMunicipio[]>(
      `/estados/${encodeURIComponent(uf)}/municipios`,
      { params: { orderBy: 'nome' } },
    );
    return data.map((m) => ({ id: m.id, nome: m.nome, uf }));
  } catch (error) {
    throw toAppError(error);
  }
}

/** Remove acentos e caixa: "São João" → "sao joao". */
function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Filtro local da busca — a API do IBGE não filtra por trecho do nome. */
export function filtrarPorNome<T extends { nome: string }>(lista: T[], termo: string): T[] {
  const busca = semAcento(termo);
  if (!busca) return lista;
  return lista.filter((item) => semAcento(item.nome).includes(busca));
}
