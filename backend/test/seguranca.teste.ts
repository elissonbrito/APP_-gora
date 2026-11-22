import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, test } from 'node:test';

import { criarApp } from '../src/app.ts';
import { pool } from '../src/db.ts';
import { migrar } from '../src/migracoes.ts';
import { popular } from '../src/seed.ts';

// Repete, de forma automática, os ataques da revisão de segurança.
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

async function api(
  caminho: string,
  opcoes: {
    metodo?: string;
    token?: string;
    corpo?: unknown;
    cabecalhos?: Record<string, string>;
  } = {},
) {
  const resposta = await fetch(base + caminho, {
    method: opcoes.metodo ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.token ? { Authorization: `Bearer ${opcoes.token}` } : {}),
      ...opcoes.cabecalhos,
    },
    body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
  });
  const texto = await resposta.text();
  return {
    status: resposta.status,
    cabecalhos: resposta.headers,
    corpo: texto ? JSON.parse(texto) : null,
  };
}

const entrar = async (email: string, senha: string) =>
  (await api('/auth/login', { metodo: 'POST', corpo: { email, senha } })).corpo?.tokens
    ?.accessToken as string;

describe('proteções de autenticação', () => {
  test('bloqueia com 429 após 5 senhas erradas na mesma conta', async () => {
    const tentar = () =>
      api('/auth/login', { metodo: 'POST', corpo: { email: 'gestor@agora.dev', senha: 'errada' } });
    for (let i = 0; i < 5; i++) assert.equal((await tentar()).status, 401);
    const bloqueada = await tentar();
    assert.equal(bloqueada.status, 429);
    assert.ok(Number(bloqueada.cabecalhos.get('retry-after')) > 0);
  });

  test('login com e-mail inexistente também passa pelo bcrypt (sem atalho de tempo)', async () => {
    const inicio = performance.now();
    await api('/auth/login', {
      metodo: 'POST',
      corpo: { email: 'ninguem@x.com', senha: 'Qualquer1' },
    });
    assert.ok(
      performance.now() - inicio > 20,
      'resposta rápida demais: pode revelar que o e-mail não existe',
    );
  });

  test('recusa token com "alg": "none"', async () => {
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const falso = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: 'x', tipo: 'acesso' })}.`;
    assert.equal((await api('/auth/me', { token: falso })).status, 401);
  });

  test('cadastro exige aceite dos termos e senha forte, e ignora pedido de papel', async () => {
    const base = { nome: 'Teste Seguro', email: 'seguro@exemplo.com', senha: 'Forte2026x' };

    const semAceite = await api('/auth/register', { metodo: 'POST', corpo: base });
    assert.equal(semAceite.status, 422);
    assert.match(semAceite.corpo.mensagem, /Termos de Uso/);

    for (const senha of ['123456', 'somenteletras', '12345678']) {
      const fraca = await api('/auth/register', {
        metodo: 'POST',
        corpo: { ...base, senha, aceitouTermos: true },
      });
      assert.equal(fraca.status, 422, `senha "${senha}" deveria ser recusada`);
    }

    const criado = await api('/auth/register', {
      metodo: 'POST',
      corpo: { ...base, aceitouTermos: true, papel: 'administrador', role: 'administrador' },
    });
    assert.equal(criado.status, 201);
    assert.equal(criado.corpo.user.role, 'cidadao');
  });
});

describe('configuração HTTP', () => {
  test('envia cabeçalhos de segurança e não se identifica como Express', async () => {
    const { cabecalhos } = await api('/health');
    assert.equal(cabecalhos.get('x-content-type-options'), 'nosniff');
    assert.equal(cabecalhos.get('x-frame-options'), 'DENY');
    assert.equal(cabecalhos.get('cache-control'), 'no-store');
    assert.equal(cabecalhos.get('x-powered-by'), null);
  });

  test('CORS não autoriza um site qualquer', async () => {
    const { cabecalhos } = await api('/health', {
      cabecalhos: { Origin: 'https://site-malicioso.com' },
    });
    assert.equal(cabecalhos.get('access-control-allow-origin'), null);
  });

  test('corpo grande demais responde 413 sem detalhe técnico', async () => {
    const resposta = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@a.com', senha: 'x'.repeat(500_000) }),
    });
    assert.equal(resposta.status, 413);
    assert.deepEqual(await resposta.json(), { mensagem: 'Os dados enviados são grandes demais.' });
  });
});

describe('direitos do titular (LGPD)', () => {
  test('exporta só os próprios dados', async () => {
    const token = await entrar('cidadao@agora.dev', '123456');
    const { status, corpo } = await api('/conta/dados', { token });
    assert.equal(status, 200);
    assert.equal(corpo.usuario.email, 'cidadao@agora.dev');
    assert.equal(corpo.usuario.senha_hash, undefined);
    assert.equal(corpo.demandas.length, 3);
    assert.ok(corpo.demandas[0].historico.length > 0);

    const outro = await entrar('colaborador@agora.dev', '123456');
    assert.equal((await api('/conta/dados', { token: outro })).corpo.demandas.length, 0);
  });

  test('exclui a conta só com a senha correta e apaga os dados', async () => {
    const dados = {
      nome: 'Pessoa Temporária',
      email: 'temporaria@exemplo.com',
      senha: 'Temporaria1',
      aceitouTermos: true,
    };
    // Instância nova da API: os testes acima já usaram o limite de cadastros.
    const novo = criarApp().listen(0);
    await new Promise((pronto) => novo.once('listening', pronto));
    const resposta = await fetch(
      `http://127.0.0.1:${(novo.address() as AddressInfo).port}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      },
    );
    novo.close();
    const corpo = await resposta.json();
    const token = corpo.tokens.accessToken;
    await api('/demandas', {
      metodo: 'POST',
      token,
      corpo: {
        categoria: 'outros',
        assunto: 'Demanda temporária',
        descricao: 'Demanda criada só para testar a exclusão da conta.',
        localizacao: { endereco: 'Rua Teste, 1' },
        fotos: [],
      },
    });

    const errada = await api('/conta', { metodo: 'DELETE', token, corpo: { senha: 'outra' } });
    assert.equal(errada.status, 422);

    assert.equal(
      (await api('/conta', { metodo: 'DELETE', token, corpo: { senha: dados.senha } })).status,
      204,
    );
    assert.equal((await api('/auth/login', { metodo: 'POST', corpo: dados })).status, 401);
    const { rows } = await pool.query(
      "SELECT count(*)::int AS total FROM demandas WHERE assunto = 'Demanda temporária'",
    );
    assert.equal(rows[0].total, 0);
  });
});
