import * as SQLite from 'expo-sqlite';

/**
 * Banco SQLite local do ÁGORA. Abre uma única conexão e aplica as migrações
 * pendentes, controladas pelo PRAGMA user_version (ver docs do expo-sqlite).
 */
const VERSAO_ATUAL = 1;

let conexao: Promise<SQLite.SQLiteDatabase> | null = null;

async function migrar(db: SQLite.SQLiteDatabase) {
  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ATUAL) return;

  if (versao < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS rascunhos (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        dados TEXT NOT NULL,
        atualizado_em TEXT NOT NULL
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_ATUAL}`);
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!conexao) {
    conexao = SQLite.openDatabaseAsync('agora.db').then(async (db) => {
      await migrar(db);
      return db;
    });
    // Se abrir falhar, permite tentar de novo na próxima chamada.
    conexao.catch(() => {
      conexao = null;
    });
  }
  return conexao;
}
