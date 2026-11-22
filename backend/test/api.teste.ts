import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, test } from 'node:test';

import { criarApp } from '../src/app.ts';
import { pool } from '../src/db.ts';
import { migrar } from '../src/migracoes.ts';
import { popular } from '../src/seed.ts';

// Roda no banco de testes (TEST_DATABASE_URL): o esquema é recriado do zero.
let base = '';
let fecharServidor: () => void;

before(async () => {
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await migrar();
  await popular();
  const servidor = criarApp().listen(0);
  await new Promise((pronto) => servidor.once('listening', pronto));
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
  fecharServidor = () => servidor.close();
});

after(async () => {
  fecharServidor();
  await pool.end();
});

async function api(caminho: string, opcoes: { metodo?: string; token?: string; corpo?: unknown } = {}) {
  const resposta = await fetch(base + caminho, {
    method: opcoes.metodo ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.token ? { Authorization: `Bearer ${opcoes.token}` } : {}),
    },
    body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
  });
  const texto = await resposta.text();
  return { status: resposta.status, corpo: texto ? JSON.parse(texto) : null };
}

async function entrar(email = 'cidadao@agora.dev', senha = '123456'): Promise<string> {
  const { corpo } = await api('/auth/login', { metodo: 'POST', corpo: { email, senha } });
  return corpo.tokens.accessToken;
}

const NOVA_DEMANDA = {
  categoria: 'buracos_via',
  assunto: 'Buraco na Rua Nova',
  descricao: 'Buraco grande perto da escola, perigoso para quem passa de bicicleta.',
  localizacao: { endereco: 'Rua Nova, 10 - Centro', cep: '27700-000' },
  fotos: [],
};

describe('autenticação', () => {
  test('login com credenciais corretas devolve usuário e tokens', async () => {
    const { status, corpo } = await api('/auth/login', {
      metodo: 'POST',
      corpo: { email: 'cidadao@agora.dev', senha: '123456' },
    });
    assert.equal(status, 200);
    assert.equal(corpo.user.nome, 'Maria da Silva');
    assert.deepEqual(corpo.user.permissions, ['demandas:criar', 'demandas:visualizar_proprias']);
    assert.ok(corpo.tokens.accessToken);
  });

  test('senha errada responde 401 com mensagem em português', async () => {
    const { status, corpo } = await api('/auth/login', {
      metodo: 'POST',
      corpo: { email: 'cidadao@agora.dev', senha: 'errada' },
    });
    assert.equal(status, 401);
    assert.equal(corpo.mensagem, 'E-mail ou senha inválidos.');
  });

  test('cadastro cria conta e recusa e-mail repetido', async () => {
    const dados = { nome: 'Carlos Lima', email: 'carlos@exemplo.com', senha: 'segredo1' };
    const criado = await api('/auth/register', { metodo: 'POST', corpo: dados });
    assert.equal(criado.status, 201);
    assert.equal(criado.corpo.user.role, 'cidadao');

    const repetido = await api('/auth/register', {
      metodo: 'POST',
      corpo: { ...dados, email: 'CARLOS@exemplo.com' },
    });
    assert.equal(repetido.status, 422);
    assert.equal(repetido.corpo.mensagem, 'Já existe uma conta cadastrada com este e-mail.');
  });

  test('rotas protegidas exigem token', async () => {
    assert.equal((await api('/auth/me')).status, 401);
    assert.equal((await api('/demandas/minhas', { token: 'token-falso' })).status, 401);
  });

  test('altera a senha só com a senha atual correta', async () => {
    const token = await entrar('gestor@agora.dev');
    const errada = await api('/auth/alterar-senha', {
      metodo: 'POST',
      token,
      corpo: { senhaAtual: 'nao-e-essa', novaSenha: 'nova-senha' },
    });
    assert.equal(errada.status, 422);
    const certa = await api('/auth/alterar-senha', {
      metodo: 'POST',
      token,
      corpo: { senhaAtual: '123456', novaSenha: 'nova-senha' },
    });
    assert.equal(certa.status, 204);
    assert.ok(await entrar('gestor@agora.dev', 'nova-senha'));
  });
});

describe('demandas', () => {
  test('cria demanda com protocolo sequencial, histórico e notificação', async () => {
    const token = await entrar();
    const criada = await api('/demandas', { metodo: 'POST', token, corpo: NOVA_DEMANDA });
    assert.equal(criada.status, 201);
    assert.match(criada.corpo.protocolo, /^AG-\d{4}-000124$/);
    assert.equal(criada.corpo.status, 'recebida');

    const detalhe = await api(`/demandas/${criada.corpo.id}`, { token });
    assert.equal(detalhe.corpo.localizacao.cep, '27700-000');
    assert.equal(detalhe.corpo.historico.length, 1);

    const notificacoes = await api('/notificacoes', { token });
    assert.equal(notificacoes.corpo[0].demandaId, criada.corpo.id);
  });

  test('valida o corpo com as mesmas mensagens do app', async () => {
    const token = await entrar();
    const { status, corpo } = await api('/demandas', {
      metodo: 'POST',
      token,
      corpo: { ...NOVA_DEMANDA, descricao: 'curta' },
    });
    assert.equal(status, 422);
    assert.equal(corpo.mensagem, 'Descreva a ocorrência com pelo menos 20 caracteres.');
  });

  test('um usuário não vê a demanda de outro (404)', async () => {
    const maria = await entrar();
    const [primeira] = (await api('/demandas/minhas', { token: maria })).corpo;
    const joao = await entrar('colaborador@agora.dev');
    assert.equal((await api(`/demandas/${primeira.id}`, { token: joao })).status, 404);
    assert.equal((await api('/demandas/nao-e-uuid', { token: joao })).status, 404);
  });

  test('avalia só demanda concluída e uma única vez', async () => {
    const token = await entrar();
    const lista = (await api('/demandas/minhas', { token })).corpo as { id: string; status: string }[];
    const concluida = lista.find((d) => d.status === 'concluida')!;
    const aberta = lista.find((d) => d.status !== 'concluida')!;

    const naoPode = await api(`/demandas/${aberta.id}/avaliacao`, { metodo: 'POST', token, corpo: { nota: 5 } });
    assert.equal(naoPode.status, 422);

    const ok = await api(`/demandas/${concluida.id}/avaliacao`, {
      metodo: 'POST',
      token,
      corpo: { nota: 4, comentario: 'Bom atendimento' },
    });
    assert.equal(ok.status, 201);
    assert.equal(ok.corpo.nota, 4);

    const denovo = await api(`/demandas/${concluida.id}/avaliacao`, { metodo: 'POST', token, corpo: { nota: 1 } });
    assert.equal(denovo.corpo.mensagem, 'Esta demanda já foi avaliada.');

    const detalhe = await api(`/demandas/${concluida.id}`, { token });
    assert.equal(detalhe.corpo.avaliacao.comentario, 'Bom atendimento');
  });
});

describe('notificações', () => {
  test('marca uma e depois todas como lidas', async () => {
    const token = await entrar();
    const antes = (await api('/notificacoes', { token })).corpo as { id: string; lida: boolean }[];
    const naoLida = antes.find((n) => !n.lida)!;

    assert.equal((await api(`/notificacoes/${naoLida.id}/lida`, { metodo: 'POST', token })).status, 204);
    assert.equal((await api('/notificacoes/lidas', { metodo: 'POST', token })).status, 204);

    const depois = (await api('/notificacoes', { token })).corpo as { lida: boolean }[];
    assert.ok(depois.every((n) => n.lida));
  });
});
