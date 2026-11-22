import bcrypt from 'bcryptjs';

import { emTransacao } from './db.ts';

type Evento = { status: string; data: string; mensagem?: string };
type DemandaSeed = {
  protocolo: string;
  assunto: string;
  descricao: string;
  categoria: string;
  status: string;
  endereco: string;
  setor: string;
  criadaEm: string;
  atualizadaEm: string;
  historico: Evento[];
};

const USUARIOS = [
  { nome: 'Maria da Silva', email: 'cidadao@agora.dev', telefone: '(22) 99999-0000', papel: 'cidadao' },
  { nome: 'João Souza', email: 'colaborador@agora.dev', telefone: null, papel: 'colaborador' },
  { nome: 'Ana Pereira', email: 'gestor@agora.dev', telefone: null, papel: 'gestor' },
];
const SENHA_PADRAO = '123456';

const DEMANDAS_DA_MARIA: DemandaSeed[] = [
  {
    protocolo: 'AG-2026-000123',
    assunto: 'Poste sem iluminação na Rua das Flores',
    descricao:
      'O poste em frente ao número 120 está apagado há mais de uma semana, deixando a rua escura à noite.',
    categoria: 'iluminacao_publica',
    status: 'em_andamento',
    endereco: 'Rua das Flores, 120 - Centro',
    setor: 'Secretaria de Serviços Públicos',
    criadaEm: '2026-08-20T13:00:00Z',
    atualizadaEm: '2026-09-10T09:30:00Z',
    historico: [
      { status: 'recebida', data: '2026-08-20T13:00:00Z', mensagem: 'Solicitação recebida pelo ÁGORA.' },
      { status: 'em_analise', data: '2026-08-22T10:00:00Z', mensagem: 'Encaminhada para a Secretaria de Serviços Públicos.' },
      { status: 'em_andamento', data: '2026-09-10T09:30:00Z', mensagem: 'Equipe técnica agendada para reparo.' },
    ],
  },
  {
    protocolo: 'AG-2026-000098',
    assunto: 'Buraco na Av. Central altura do número 450',
    descricao: 'Buraco grande na pista, próximo ao ponto de ônibus, oferecendo risco a motociclistas.',
    categoria: 'buracos_via',
    status: 'em_analise',
    endereco: 'Av. Central, 450',
    setor: 'Secretaria de Obras',
    criadaEm: '2026-08-05T11:00:00Z',
    atualizadaEm: '2026-08-22T15:45:00Z',
    historico: [
      { status: 'recebida', data: '2026-08-05T11:00:00Z', mensagem: 'Solicitação recebida pelo ÁGORA.' },
      { status: 'em_analise', data: '2026-08-22T15:45:00Z', mensagem: 'Em avaliação pela Secretaria de Obras.' },
    ],
  },
  {
    protocolo: 'AG-2026-000041',
    assunto: 'Coleta de lixo atrasada no bairro Centro',
    descricao: 'A coleta não passou na rua há dois dias, gerando acúmulo de lixo na calçada.',
    categoria: 'coleta_lixo',
    status: 'concluida',
    endereco: 'Rua Sete de Setembro, 88 - Centro',
    setor: 'Secretaria de Meio Ambiente',
    criadaEm: '2026-06-01T10:00:00Z',
    atualizadaEm: '2026-06-10T17:20:00Z',
    historico: [
      { status: 'recebida', data: '2026-06-01T10:00:00Z', mensagem: 'Solicitação recebida pelo ÁGORA.' },
      { status: 'em_analise', data: '2026-06-03T09:00:00Z' },
      { status: 'em_andamento', data: '2026-06-05T08:00:00Z', mensagem: 'Rota de coleta ajustada.' },
      { status: 'concluida', data: '2026-06-10T17:20:00Z', mensagem: 'Coleta normalizada.' },
    ],
  },
];

const NOTIFICACOES_DA_MARIA = [
  {
    protocolo: 'AG-2026-000123',
    tipo: 'atualizacao_status',
    titulo: 'Sua solicitação foi atualizada',
    corpo: 'O protocolo AG-2026-000123 mudou para "Em andamento".',
    lida: false,
    criadaEm: '2026-09-10T09:30:00Z',
  },
  {
    protocolo: 'AG-2026-000098',
    tipo: 'resposta_setor',
    titulo: 'Nova resposta da Secretaria de Obras',
    corpo: 'A Secretaria de Obras respondeu ao protocolo AG-2026-000098.',
    lida: false,
    criadaEm: '2026-08-22T15:45:00Z',
  },
  {
    protocolo: 'AG-2026-000041',
    tipo: 'conclusao',
    titulo: 'Solicitação concluída',
    corpo: 'Seu protocolo AG-2026-000041 foi concluído.',
    lida: true,
    criadaEm: '2026-06-10T17:20:00Z',
  },
];

/**
 * Popula o banco com os usuários de teste e as demandas de exemplo (os mesmos
 * dados do modo mock do app). Só roda se ainda não houver usuários.
 */
export async function popular(): Promise<boolean> {
  return emTransacao(async (db) => {
    const { rows } = await db.query<{ total: string }>('SELECT count(*) AS total FROM usuarios');
    if (Number(rows[0].total) > 0) return false;

    const hash = await bcrypt.hash(SENHA_PADRAO, 10);
    const ids = new Map<string, string>();
    for (const u of USUARIOS) {
      const r = await db.query<{ id: string }>(
        `INSERT INTO usuarios (nome, email, telefone, senha_hash, papel)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [u.nome, u.email, u.telefone, hash, u.papel],
      );
      ids.set(u.email, r.rows[0].id);
    }
    const maria = ids.get('cidadao@agora.dev');

    const demandaPorProtocolo = new Map<string, string>();
    for (const d of DEMANDAS_DA_MARIA) {
      const r = await db.query<{ id: string }>(
        `INSERT INTO demandas (protocolo, usuario_id, assunto, descricao, categoria, status,
           endereco, setor_responsavel, criada_em, atualizada_em)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [d.protocolo, maria, d.assunto, d.descricao, d.categoria, d.status, d.endereco, d.setor,
          d.criadaEm, d.atualizadaEm],
      );
      demandaPorProtocolo.set(d.protocolo, r.rows[0].id);
      for (const e of d.historico) {
        await db.query(
          'INSERT INTO demanda_historico (demanda_id, status, mensagem, data) VALUES ($1, $2, $3, $4)',
          [r.rows[0].id, e.status, e.mensagem ?? null, e.data],
        );
      }
    }

    for (const n of NOTIFICACOES_DA_MARIA) {
      await db.query(
        `INSERT INTO notificacoes (usuario_id, demanda_id, tipo, titulo, corpo, lida, criada_em)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [maria, demandaPorProtocolo.get(n.protocolo), n.tipo, n.titulo, n.corpo, n.lida, n.criadaEm],
      );
    }

    // Os protocolos novos continuam a partir do maior protocolo de exemplo.
    await db.query("SELECT setval('protocolo_seq', 123)");
    return true;
  });
}
