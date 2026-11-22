import { Router } from 'express';

import { exigirLogin, usuarioLogado } from '../auth/middleware.ts';
import { consultar } from '../db.ts';
import { naoEncontrado } from '../erros.ts';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type LinhaNotificacao = {
  id: string;
  tipo: string;
  titulo: string;
  corpo: string;
  lida: boolean;
  criada_em: Date;
  demanda_id: string | null;
};

export const rotasNotificacoes = Router();
rotasNotificacoes.use(exigirLogin);

rotasNotificacoes.get('/', async (_req, res) => {
  const linhas = await consultar<LinhaNotificacao>(
    `SELECT id, tipo, titulo, corpo, lida, criada_em, demanda_id
       FROM notificacoes WHERE usuario_id = $1 ORDER BY criada_em DESC`,
    [usuarioLogado(res)],
  );
  res.json(
    linhas.map((n) => ({
      id: n.id,
      tipo: n.tipo,
      titulo: n.titulo,
      corpo: n.corpo,
      lida: n.lida,
      criadaEm: n.criada_em,
      ...(n.demanda_id ? { demandaId: n.demanda_id } : {}),
    })),
  );
});

// Precisa vir antes de "/:id/lida" para "lidas" não ser lido como um id.
rotasNotificacoes.post('/lidas', async (_req, res) => {
  await consultar('UPDATE notificacoes SET lida = true WHERE usuario_id = $1 AND NOT lida', [
    usuarioLogado(res),
  ]);
  res.status(204).end();
});

rotasNotificacoes.post('/:id/lida', async (req, res) => {
  const { id } = req.params;
  if (!UUID.test(id)) throw naoEncontrado('Notificação não encontrada.');
  const linhas = await consultar(
    'UPDATE notificacoes SET lida = true WHERE id = $1 AND usuario_id = $2 RETURNING id',
    [id, usuarioLogado(res)],
  );
  if (linhas.length === 0) throw naoEncontrado('Notificação não encontrada.');
  res.status(204).end();
});
