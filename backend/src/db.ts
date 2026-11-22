import pg from 'pg';

import { config } from './config.ts';

/** Pool de conexões com o PostgreSQL, compartilhado por toda a API. */
export const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 10 });

/** Executa uma consulta parametrizada ($1, $2…) — nunca concatene texto do usuário no SQL. */
export async function consultar<T extends pg.QueryResultRow>(
  sql: string,
  parametros: unknown[] = [],
): Promise<T[]> {
  const resultado = await pool.query<T>(sql, parametros);
  return resultado.rows;
}

/** Executa várias operações numa transação: ou todas são gravadas, ou nenhuma. */
export async function emTransacao<T>(trabalho: (cliente: pg.PoolClient) => Promise<T>): Promise<T> {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await trabalho(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (erro) {
    await cliente.query('ROLLBACK');
    throw erro;
  } finally {
    cliente.release();
  }
}
