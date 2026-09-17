export type UserRole = 'cidadao' | 'colaborador' | 'gestor' | 'administrador';

/**
 * Permissões finas usadas para adaptar a UI (RBAC). A lista é provisória —
 * refletir exatamente as permissões que a API do ÁGORA vier a retornar.
 */
export type Permission =
  | 'demandas:criar'
  | 'demandas:visualizar_proprias'
  | 'demandas:visualizar_atribuidas'
  | 'demandas:atualizar_status'
  | 'indicadores:visualizar'
  | 'usuarios:gerenciar'
  | 'setores:gerenciar'
  | 'configuracoes:gerenciar';

export type User = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: UserRole;
  permissions: Permission[];
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginCredentials = {
  email: string;
  senha: string;
};

export type RegisterPayload = {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
};

export type AuthSession = {
  user: User;
  tokens: AuthTokens;
};

export type AtualizarPerfilPayload = {
  nome: string;
  telefone?: string;
};

export type AlterarSenhaPayload = {
  senhaAtual: string;
  novaSenha: string;
};
