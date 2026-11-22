import { pool } from '../db.ts';
import { migrar } from '../migracoes.ts';
import { popular } from '../seed.ts';

await migrar();
const populou = await popular();
console.log(populou ? 'Dados de exemplo criados (senha dos usuários: 123456).' : 'O banco já tinha dados; nada foi alterado.');
await pool.end();
