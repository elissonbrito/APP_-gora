import { pool } from '../db.ts';
import { migrar } from '../migracoes.ts';

const novas = await migrar();
console.log(novas.length ? `Migrações aplicadas: ${novas.join(', ')}` : 'Banco já está atualizado.');
await pool.end();
