/** Configuração lida das variáveis de ambiente (arquivo .env, carregado pelo Node). */
function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável de ambiente ${nome} não definida. Veja backend/.env.example.`);
  }
  return valor;
}

const emTeste = process.env.NODE_TEST_CONTEXT !== undefined || process.env.NODE_ENV === 'test';

export const config = {
  porta: Number(process.env.PORT ?? 3333),
  databaseUrl: emTeste
    ? obrigatoria('TEST_DATABASE_URL')
    : obrigatoria('DATABASE_URL'),
  jwtSecret: obrigatoria('JWT_SECRET'),
  /**
   * Origens web autorizadas no CORS (o app no celular não envia Origin e não
   * é afetado). Lista separada por vírgula, ex.: http://localhost:8081
   */
  origensWeb: (process.env.CORS_ORIGINS ?? 'http://localhost:8081')
    .split(',')
    .map((origem) => origem.trim())
    .filter(Boolean),
  /** Validade do token de acesso. Não há renovação automática no app. */
  jwtExpiracao: '7d',
} as const;
