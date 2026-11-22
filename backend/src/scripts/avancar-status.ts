/**
 * Simula a prefeitura atendendo uma demanda: avança para o próximo status,
 * registra o evento na linha do tempo e notifica o cidadão.
 *
 * Uso: npm run status -- AG-2026-000124 "Equipe enviada ao local."
 */
import { emTransacao, pool } from '../db.ts';

const PROXIMO: Record<string, string> = {
  recebida: 'em_analise',
  em_analise: 'em_andamento',
  em_andamento: 'concluida',
};
const ROTULO: Record<string, string> = {
  em_analise: 'Em análise',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

const [protocolo, mensagem] = process.argv.slice(2);
if (!protocolo) {
  console.error('Informe o protocolo. Ex.: npm run status -- AG-2026-000124 "Mensagem opcional"');
  process.exit(1);
}

try {
  const resultado = await emTransacao(async (db) => {
    const { rows } = await db.query<{ id: string; usuario_id: string; status: string }>(
      'SELECT id, usuario_id, status FROM demandas WHERE protocolo = $1 FOR UPDATE',
      [protocolo.toUpperCase()],
    );
    const demanda = rows[0];
    if (!demanda) return `Protocolo ${protocolo} não encontrado.`;
    const novo = PROXIMO[demanda.status];
    if (!novo) return `O protocolo ${protocolo} já está concluído.`;

    await db.query('UPDATE demandas SET status = $2, atualizada_em = now() WHERE id = $1', [
      demanda.id,
      novo,
    ]);
    await db.query(
      'INSERT INTO demanda_historico (demanda_id, status, mensagem) VALUES ($1, $2, $3)',
      [demanda.id, novo, mensagem ?? null],
    );
    const concluida = novo === 'concluida';
    await db.query(
      `INSERT INTO notificacoes (usuario_id, demanda_id, tipo, titulo, corpo)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        demanda.usuario_id,
        demanda.id,
        concluida ? 'conclusao' : 'atualizacao_status',
        concluida ? 'Solicitação concluída' : 'Sua solicitação foi atualizada',
        concluida
          ? `Seu protocolo ${protocolo.toUpperCase()} foi concluído. Conte como foi o atendimento!`
          : `O protocolo ${protocolo.toUpperCase()} mudou para "${ROTULO[novo]}".`,
      ],
    );
    return `${protocolo.toUpperCase()}: ${ROTULO[novo]} (cidadão notificado).`;
  });
  console.log(resultado);
} finally {
  await pool.end();
}
