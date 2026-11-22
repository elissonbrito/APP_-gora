/** Permissões por papel (RBAC). O app usa esta lista para adaptar a interface. */
const PERMISSOES: Record<string, string[]> = {
  cidadao: ['demandas:criar', 'demandas:visualizar_proprias'],
  colaborador: ['demandas:visualizar_atribuidas', 'demandas:atualizar_status'],
  gestor: ['indicadores:visualizar', 'demandas:visualizar_atribuidas'],
  administrador: ['usuarios:gerenciar', 'setores:gerenciar', 'configuracoes:gerenciar'],
};

export type LinhaUsuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  papel: string;
};

/** Converte a linha do banco no formato `User` do app (src/types/auth.ts). */
export function paraUsuarioApi(linha: LinhaUsuario) {
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    ...(linha.telefone ? { telefone: linha.telefone } : {}),
    role: linha.papel,
    permissions: PERMISSOES[linha.papel] ?? [],
  };
}
