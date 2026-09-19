// MOCK CONTRACT — ver services/api/mock/auth.mock.ts. Dados fictícios até que
// a API real do ÁGORA esteja disponível para este projeto.
import { AppError } from '@/services/api/errors';
import type { Avaliacao, NovaAvaliacaoPayload } from '@/types/avaliacao';
import type { DemandaDetalhe, DemandaResumo, NovaDemandaPayload } from '@/types/demanda';

import { mockDelay } from './network';

const mockDemandasPorUsuario: Record<string, DemandaDetalhe[]> = {
  usr_cidadao_1: [
    {
      id: 'dem_1',
      protocolo: 'AG-2026-000123',
      assunto: 'Poste sem iluminação na Rua das Flores',
      descricao:
        'O poste em frente ao número 120 está apagado há mais de uma semana, deixando a rua escura à noite.',
      categoria: 'iluminacao_publica',
      status: 'em_andamento',
      criadaEm: '2026-08-20T13:00:00.000Z',
      atualizadaEm: '2026-09-10T09:30:00.000Z',
      localizacao: { endereco: 'Rua das Flores, 120 - Centro' },
      setorResponsavel: 'Secretaria de Serviços Públicos',
      fotos: [],
      historico: [
        {
          id: 'dem_1_ev_1',
          status: 'recebida',
          data: '2026-08-20T13:00:00.000Z',
          mensagem: 'Solicitação recebida pelo ÁGORA.',
        },
        {
          id: 'dem_1_ev_2',
          status: 'em_analise',
          data: '2026-08-22T10:00:00.000Z',
          mensagem: 'Encaminhada para a Secretaria de Serviços Públicos.',
        },
        {
          id: 'dem_1_ev_3',
          status: 'em_andamento',
          data: '2026-09-10T09:30:00.000Z',
          mensagem: 'Equipe técnica agendada para reparo.',
        },
      ],
    },
    {
      id: 'dem_2',
      protocolo: 'AG-2026-000098',
      assunto: 'Buraco na Av. Central altura do número 450',
      descricao: 'Buraco grande na pista, próximo ao ponto de ônibus, oferecendo risco a motociclistas.',
      categoria: 'buracos_via',
      status: 'em_analise',
      criadaEm: '2026-08-05T11:00:00.000Z',
      atualizadaEm: '2026-08-22T15:45:00.000Z',
      localizacao: { endereco: 'Av. Central, 450' },
      setorResponsavel: 'Secretaria de Obras',
      fotos: [],
      historico: [
        {
          id: 'dem_2_ev_1',
          status: 'recebida',
          data: '2026-08-05T11:00:00.000Z',
          mensagem: 'Solicitação recebida pelo ÁGORA.',
        },
        {
          id: 'dem_2_ev_2',
          status: 'em_analise',
          data: '2026-08-22T15:45:00.000Z',
          mensagem: 'Em avaliação pela Secretaria de Obras.',
        },
      ],
    },
    {
      id: 'dem_3',
      protocolo: 'AG-2026-000041',
      assunto: 'Coleta de lixo atrasada no bairro Centro',
      descricao: 'A coleta não passou na rua há dois dias, gerando acúmulo de lixo na calçada.',
      categoria: 'coleta_lixo',
      status: 'concluida',
      criadaEm: '2026-06-01T10:00:00.000Z',
      atualizadaEm: '2026-06-10T17:20:00.000Z',
      localizacao: { endereco: 'Rua Sete de Setembro, 88 - Centro' },
      setorResponsavel: 'Secretaria de Meio Ambiente',
      fotos: [],
      historico: [
        {
          id: 'dem_3_ev_1',
          status: 'recebida',
          data: '2026-06-01T10:00:00.000Z',
          mensagem: 'Solicitação recebida pelo ÁGORA.',
        },
        {
          id: 'dem_3_ev_2',
          status: 'em_analise',
          data: '2026-06-03T09:00:00.000Z',
        },
        {
          id: 'dem_3_ev_3',
          status: 'em_andamento',
          data: '2026-06-05T08:00:00.000Z',
          mensagem: 'Rota de coleta ajustada.',
        },
        {
          id: 'dem_3_ev_4',
          status: 'concluida',
          data: '2026-06-10T17:20:00.000Z',
          mensagem: 'Coleta normalizada.',
        },
      ],
    },
  ],
};

function toResumo(demanda: DemandaDetalhe): DemandaResumo {
  const {
    descricao: _descricao,
    localizacao: _localizacao,
    setorResponsavel: _setor,
    historico: _historico,
    avaliacao: _avaliacao,
    fotos: _fotos,
    ...resumo
  } = demanda;
  return resumo;
}

export async function mockListarMinhasDemandas(userId: string): Promise<DemandaResumo[]> {
  const demandas = mockDemandasPorUsuario[userId] ?? [];
  return mockDelay(demandas.map(toResumo));
}

export async function mockObterDemanda(id: string): Promise<DemandaDetalhe> {
  const demanda = Object.values(mockDemandasPorUsuario)
    .flat()
    .find((item) => item.id === id);
  if (!demanda) {
    throw new AppError('not_found', 'Não encontramos esta demanda.');
  }
  return mockDelay(demanda);
}

function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const sequencial = Math.floor(Math.random() * 999_999) + 1;
  return `AG-${ano}-${String(sequencial).padStart(6, '0')}`;
}

export async function mockCriarDemanda(
  userId: string,
  payload: NovaDemandaPayload,
): Promise<DemandaResumo> {
  const agora = new Date().toISOString();
  const novaDemanda: DemandaDetalhe = {
    id: `dem_${Date.now()}`,
    protocolo: gerarProtocolo(),
    assunto: payload.assunto,
    categoria: payload.categoria,
    status: 'recebida',
    criadaEm: agora,
    atualizadaEm: agora,
    descricao: payload.descricao,
    localizacao: payload.localizacao,
    fotos: payload.fotos,
    historico: [
      {
        id: `dem_${Date.now()}_ev_1`,
        status: 'recebida',
        data: agora,
        mensagem: 'Solicitação recebida pelo ÁGORA.',
      },
    ],
  };
  mockDemandasPorUsuario[userId] = [novaDemanda, ...(mockDemandasPorUsuario[userId] ?? [])];
  return mockDelay(toResumo(novaDemanda), 900);
}

export async function mockAvaliarDemanda(
  demandaId: string,
  payload: NovaAvaliacaoPayload,
): Promise<Avaliacao> {
  const demanda = Object.values(mockDemandasPorUsuario)
    .flat()
    .find((item) => item.id === demandaId);
  if (!demanda) {
    throw new AppError('not_found', 'Não encontramos esta demanda.');
  }
  if (demanda.status !== 'concluida') {
    throw new AppError('validation', 'Só é possível avaliar demandas concluídas.');
  }
  if (demanda.avaliacao) {
    throw new AppError('validation', 'Esta demanda já foi avaliada.');
  }

  const avaliacao: Avaliacao = {
    id: `av_${Date.now()}`,
    demandaId,
    nota: payload.nota,
    comentario: payload.comentario,
    criadaEm: new Date().toISOString(),
  };
  demanda.avaliacao = avaliacao;
  return mockDelay(avaliacao, 500);
}
