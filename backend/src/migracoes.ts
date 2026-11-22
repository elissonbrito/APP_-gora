import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { emTransacao, pool } from './db.ts';

const PASTA = path.join(import.meta.dirname, 'migrations');

/**
 * Aplica, em ordem, os arquivos .sql de src/migrations ainda não aplicados.
 * Cada migração roda numa transação e fica registrada em schema_migrations.
 */
export async function migrar(): Promise<string[]> {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    nome text PRIMARY KEY,
    aplicada_em timestamptz NOT NULL DEFAULT now()
  )`);
  const { rows } = await pool.query<{ nome: string }>('SELECT nome FROM schema_migrations');
  const aplicadas = new Set(rows.map((linha) => linha.nome));

  const arquivos = (await readdir(PASTA)).filter((nome) => nome.endsWith('.sql')).sort();
  const novas: string[] = [];
  for (const nome of arquivos) {
    if (aplicadas.has(nome)) continue;
    const sql = await readFile(path.join(PASTA, nome), 'utf8');
    await emTransacao(async (cliente) => {
      await cliente.query(sql);
      await cliente.query('INSERT INTO schema_migrations (nome) VALUES ($1)', [nome]);
    });
    novas.push(nome);
  }
  return novas;
}
