import { Router } from 'express';
import { z } from 'zod';

import { exigirLogin, usuarioLogado } from '../auth/middleware.ts';
import { consultar, emTransacao } from '../db.ts';
import { ErroHttp, naoEncontrado } from '../erros.ts';

const CATEGORIAS = [
  'iluminacao_publica',
  'buracos_via',
  'coleta_lixo',
  'poda_arvore',
  'saneamento',
  'outros',
] as const;

/** Mesmas regras do formulário do app (src/schemas/demanda.ts). */
const novaDemandaSchema = z.object({
  categoria: z.enum(CATEGORIAS, { error: 'Selecione uma categoria.' }),
  assunto: z.string().trim().min(5, 'Informe um assunto com pelo menos 5 caracteres.'),
  descricao: z.string().trim().min(20, 'Descreva a ocorrência com pelo menos 20 caracteres.'),
  localizacao: z.object({
    endereco: z.string().trim().min(5, 'Informe o endereço da ocorrência.'),
    cep: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  fotos: z.array(z.string()).max(5, 'Você pode anexar no máximo 5 fotos.').default([]),
});

const avaliacaoSchema = z.object({
  nota: z.number().int().min(1, 'Escolha uma nota de 1 a 5.').max(5, 'Escolha uma nota de 1 a 5.'),
  comentario: z
    .string()
    .trim()
    .max(500, 'O comentário pode ter no máximo 500 caracteres.')
    .optional()
    .transform((valor) => valor || null),
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEMANDA_NAO_ENCONTRADA = 'Não encontramos esta demanda.';

type LinhaDemanda = {
  id: string;
  protocolo: string;
  assunto: string;
  categoria: string;
  status: string;
  criada_em: Date;
  atualizada_em: Date;
  descricao: string;
  endereco: string;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
  setor_responsavel: string | null;
  fotos: string[];
};

function paraResumo(d: LinhaDemanda) {
  return {
    id: d.id,
    protocolo: d.protocolo,
    assunto: d.assunto,
    categoria: d.categoria,
    status: d.status,
    criadaEm: d.criada_em,
    atualizadaEm: d.atualizada_em,
  };
}

function paraAvaliacao(a: { id: string; demanda_id: string; nota: number; comentario: string | null; criada_em: Date }) {
  return {
    id: a.id,
    demandaId: a.demanda_id,
    nota: a.nota,
    ...(a.comentario ? { comentario: a.comentario } : {}),
    criadaEm: a.criada_em,
  };
}

/** Busca a demanda garantindo que pertence ao usuário (senão, 404). */
async function demandaDoUsuario(id: string, usuarioId: string): Promise<LinhaDemanda> {
  if (!UUID.test(id)) throw naoEncontrado(DEMANDA_NAO_ENCONTRADA);
  const [demanda] = await consultar<LinhaDemanda>(
    'SELECT * FROM demandas WHERE id = $1 AND usuario_id = $2',
    [id, usuarioId],
  );
  if (!demanda) throw naoEncontrado(DEMANDA_NAO_ENCONTRADA);
  return demanda;
}

export const rotasDemandas = Router();
rotasDemandas.use(exigirLogin);

rotasDemandas.get('/minhas', async (_req, res) => {
  const linhas = await consultar<LinhaDemanda>(
    'SELECT * FROM demandas WHERE usuario_id = $1 ORDER BY atualizada_em DESC',
    [usuarioLogado(res)],
  );
  res.json(linhas.map(paraResumo));
});

rotasDemandas.post('/', async (req, res) => {
  const dados = novaDemandaSchema.parse(req.body);
  const usuarioId = usuarioLogado(res);

  const demanda = await emTransacao(async (db) => {
    const { rows } = await db.query<LinhaDemanda>(
      `INSERT INTO demandas (protocolo, usuario_id, assunto, descricao, categoria, endereco,
         cep, latitude, longitude, fotos)
       VALUES ('AG-' || extract(year FROM now())::int || '-' || lpad(nextval('protocolo_seq')::text, 6, '0'),
         $1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [usuarioId, dados.assunto, dados.descricao, dados.categoria, dados.localizacao.endereco,
        dados.localizacao.cep ?? null, dados.localizacao.latitude ?? null,
        dados.localizacao.longitude ?? null, dados.fotos],
    );
    const nova = rows[0];
    await db.query(
      `INSERT INTO demanda_historico (demanda_id, status, mensagem, data)
       VALUES ($1, 'recebida', 'Solicitação recebida pelo ÁGORA.', $2)`,
      [nova.id, nova.criada_em],
    );
    await db.query(
      `INSERT INTO notificacoes (usuario_id, demanda_id, tipo, titulo, corpo)
       VALUES ($1, $2, 'atualizacao_status', 'Recebemos sua solicitação', $3)`,
      [usuarioId, nova.id, `O protocolo ${nova.protocolo} foi registrado e será analisado.`],
    );
    return nova;
  });

  res.status(201).json(paraResumo(demanda));
});

rotasDemandas.get('/:id', async (req, res) => {
  const demanda = await demandaDoUsuario(req.params.id, usuarioLogado(res));
  const historico = await consultar<{ id: string; status: string; mensagem: string | null; data: Date }>(
    'SELECT id, status, mensagem, data FROM demanda_historico WHERE demanda_id = $1 ORDER BY data',
    [demanda.id],
  );
  const [avaliacao] = await consultar<Parameters<typeof paraAvaliacao>[0]>(
    'SELECT * FROM avaliacoes WHERE demanda_id = $1',
    [demanda.id],
  );

  res.json({
    ...paraResumo(demanda),
    descricao: demanda.descricao,
    localizacao: {
      endereco: demanda.endereco,
      ...(demanda.cep ? { cep: demanda.cep } : {}),
      ...(demanda.latitude != null ? { latitude: demanda.latitude } : {}),
      ...(demanda.longitude != null ? { longitude: demanda.longitude } : {}),
    },
    ...(demanda.setor_responsavel ? { setorResponsavel: demanda.setor_responsavel } : {}),
    fotos: demanda.fotos,
    historico: historico.map((e) => ({
      id: e.id,
      status: e.status,
      data: e.data,
      ...(e.mensagem ? { mensagem: e.mensagem } : {}),
    })),
    ...(avaliacao ? { avaliacao: paraAvaliacao(avaliacao) } : {}),
  });
});

rotasDemandas.post('/:id/avaliacao', async (req, res) => {
  const dados = avaliacaoSchema.parse(req.body);
  const demanda = await demandaDoUsuario(req.params.id, usuarioLogado(res));
  if (demanda.status !== 'concluida') {
    throw new ErroHttp(422, 'Só é possível avaliar demandas concluídas.');
  }
  try {
    const [avaliacao] = await consultar<Parameters<typeof paraAvaliacao>[0]>(
      'INSERT INTO avaliacoes (demanda_id, nota, comentario) VALUES ($1, $2, $3) RETURNING *',
      [demanda.id, dados.nota, dados.comentario],
    );
    res.status(201).json(paraAvaliacao(avaliacao));
  } catch (erro) {
    if ((erro as { code?: string }).code === '23505') {
      throw new ErroHttp(422, 'Esta demanda já foi avaliada.');
    }
    throw erro;
  }
});
