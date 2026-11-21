/** Remove acentos, caixa e espaços extras: "  Ação Pública " → "acao publica". */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * true se o termo aparece em algum dos campos, ignorando acentos, caixa,
 * espaços e traços — assim "ag2026000123" e "2026-000123" encontram o
 * protocolo "AG-2026-000123".
 */
export function correspondeBusca(termo: string, campos: string[]): boolean {
  const busca = normalizarTexto(termo).replace(/[-\s]/g, '');
  if (!busca) return true;
  return campos.some((campo) => normalizarTexto(campo).replace(/[-\s]/g, '').includes(busca));
}
