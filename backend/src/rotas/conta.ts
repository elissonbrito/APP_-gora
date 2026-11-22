import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';

import { exigirLogin, usuarioLogado } from '../auth/middleware.ts';
import { consultar } from '../db.ts';
import { ErroHttp } from '../erros.ts';

/**
 * Direitos do titular dos dados (LGPD, art. 18), exercidos pelo próprio app:
 * - GET  /conta/dados → acesso e portabilidade: todos os dados em JSON;
 * - DELETE /conta      → eliminação: apaga a conta e tudo ligado a ela.
 */
export const rotasConta = Router();
rotasConta.use(exigirLogin);

rotasConta.get('/dados', async (_req, res) => {
  const id = usuarioLogado(res);
  const [usuario] = await consultar(
    `SELECT nome, email, telefone, papel, criado_em, termos_versao, termos_aceitos_em
       FROM usuarios WHERE id = $1`,
    [id],
  );
  if (!usuario) throw new ErroHttp(401, 'Sua sessão expirou. Faça login novamente.');

  const demandas = await consultar(
    `SELECT d.protocolo, d.assunto, d.descricao, d.categoria, d.status, d.endereco, d.cep,
            d.latitude, d.longitude, d.setor_responsavel, d.fotos, d.criada_em, d.atualizada_em,
            COALESCE((SELECT json_agg(json_build_object('status', h.status, 'mensagem', h.mensagem, 'data', h.data)
                        ORDER BY h.data) FROM demanda_historico h WHERE h.demanda_id = d.id), '[]') AS historico,
            (SELECT json_build_object('nota', a.nota, 'comentario', a.comentario, 'criada_em', a.criada_em)
               FROM avaliacoes a WHERE a.demanda_id = d.id) AS avaliacao
       FROM demandas d WHERE d.usuario_id = $1 ORDER BY d.criada_em`,
    [id],
  );
  const notificacoes = await consultar(
    `SELECT tipo, titulo, corpo, lida, criada_em FROM notificacoes
      WHERE usuario_id = $1 ORDER BY criada_em`,
    [id],
  );

  res.json({ geradoEm: new Date(), usuario, demandas, notificacoes });
});

const exclusaoSchema = z.object({ senha: z.string().min(1, 'Informe sua senha para confirmar.') });

rotasConta.delete('/', async (req, res) => {
  const { senha } = exclusaoSchema.parse(req.body);
  const id = usuarioLogado(res);
  const [linha] = await consultar<{ senha_hash: string }>(
    'SELECT senha_hash FROM usuarios WHERE id = $1',
    [id],
  );
  // Confirmação com a senha: um celular desbloqueado nas mãos de outra pessoa
  // não basta para apagar a conta.
  if (!linha || !(await bcrypt.compare(senha, linha.senha_hash))) {
    throw new ErroHttp(422, 'Senha incorreta.');
  }
  // ON DELETE CASCADE apaga demandas, histórico, avaliações e notificações.
  await consultar('DELETE FROM usuarios WHERE id = $1', [id]);
  console.warn('[seguranca] conta excluída a pedido do titular');
  res.status(204).end();
});
