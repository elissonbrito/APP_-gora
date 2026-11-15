import { storage } from './storage';

type Entrada<T> = { dados: T; salvoEm: number };

export const CINCO_MINUTOS = 5 * 60 * 1000;

/**
 * Cache com validade (TTL) persistido no aparelho:
 * - cache ainda válido → devolve na hora, sem ir à rede;
 * - vencido ou ausente → busca na API e grava o resultado;
 * - API falhou mas existe cache antigo → devolve o antigo (modo offline);
 * - API falhou e não há cache → repassa o erro para a tela mostrar.
 */
export async function comCache<T>(
  chave: string,
  buscar: () => Promise<T>,
  ttlMs: number = CINCO_MINUTOS,
): Promise<T> {
  const chaveCache = `cache:${chave}`;
  const guardado = await storage.get<Entrada<T> | null>(chaveCache, null);

  if (guardado && Date.now() - guardado.salvoEm < ttlMs) {
    return guardado.dados;
  }

  try {
    const dados = await buscar();
    await storage.set<Entrada<T>>(chaveCache, { dados, salvoEm: Date.now() });
    return dados;
  } catch (error) {
    if (guardado) return guardado.dados;
    throw error;
  }
}
